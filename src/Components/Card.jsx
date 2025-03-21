import React, { useState, useEffect, useRef, memo } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { Handle, Position, useReactFlow } from 'reactflow';

// Creating a custom equality function to control when the component should re-render
const areEqual = (prevProps, nextProps) => {
  // function to Only re-render if these specific props change
  const dataChanged = 
    prevProps.data.label !== nextProps.data.label ||
    prevProps.data.icon !== nextProps.data.icon ||
    prevProps.data.isStartNode !== nextProps.data.isStartNode ||
    prevProps.data.displayMessage !== nextProps.data.displayMessage || 
    JSON.stringify(prevProps.data.stats) !== JSON.stringify(nextProps.data.stats);
  
  const idChanged = prevProps.id !== nextProps.id;
  
  // Return true if props are equal (meaning DON'T re-render)
  return !dataChanged && !idChanged;
};

const CustomNode = ({ id, data }) => {
  const [isActive, setIsActive] = useState(false);
  const [isTargetHovered, setIsTargetHovered] = useState(false);
  const [isSourceHovered, setIsSourceHovered] = useState(false);
  const [isSource1Hovered, setIsSource1Hovered] = useState(false);

  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const nodeRef = useRef(null);
  const reactFlowHook = useReactFlow(); // Move this to top level

  // Check if this is the start node
  const isStartNode = data.isStartNode || false;

  const handleIconClick = (e) => {
    e.stopPropagation();
    // Calling the openSidebar function from props
    data.onOpenSidebar(id, data);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    data.onDelete(id);
    setShowDeleteButton(false);
  };

  const handleClick = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    setIsActive(false);
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // to only show delete button if not a start node
    if (!isStartNode) {
      setShowDeleteButton(true);
    }
  };

  const handleHandle2Click = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const sourceNode = reactFlowHook.getNode(id);
    
    // Create first new node
    const node1 = {
      id: `node1_${Date.now()}`,
      type: 'iconCard',
      position: {
        x: sourceNode.position.x + 300,
        y: sourceNode.position.y + 100
      },
      data: {
        label: 'Interactive_Node 1',
        icon: '',
        stats: {
          sent: 0,
          delivered: 0,
          subscribers: 0,
          errors: 0
        },
        message: '',
        displayMessage: '',
        onDelete: data.onDelete,
        onOpenSidebar: data.onOpenSidebar,
        isStartNode: false
      }
    };

    // Create second new node
    const node2 = {
      id: `node2_${Date.now()}`,
      type: 'iconCard',
      position: {
        x: node1.position.x + 300,
        y: node1.position.y + 100
      },
      data: {
        label: 'Interactive_Node 2',
        icon: '',
        stats: {
          sent: 0,
          delivered: 0,
          subscribers: 0,
          errors: 0
        },
        message: '',
        displayMessage: '',
        onDelete: data.onDelete,
        onOpenSidebar: data.onOpenSidebar,
        isStartNode: false
      }
    };

    const edge1 = {
      id: `edge1_${Date.now()}`,
      source: id,
      target: node1.id,
      sourceHandle: 'handle-2',
      type: 'default',
      animated: false,
      style: { stroke: '#000000', strokeWidth: 2 },
      markerEnd: {
        type: 'arrowclosed',
        width: 20,
        height: 20,
        color: '#000000',
      },
    };

    const edge2 = {
      id: `edge2_${Date.now()}`,
      source: node1.id,
      target: node2.id,
      type: 'default',
      animated: false,
      style: { stroke: '#000000', strokeWidth: 2 },
      markerEnd: {
        type: 'arrowclosed',
        width: 20,
        height: 20,
        color: '#000000',
      },
    };

    // Use setNodes and setEdges from reactFlowHook
    reactFlowHook.setNodes((nds) => [...nds, node1, node2]);
    reactFlowHook.setEdges((eds) => [...eds, edge1, edge2]);
  };

  // Handle both left and right clicks outside the card
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // using useref to hide the delete button when clicking outside node
      if (nodeRef.current && !nodeRef.current.contains(event.target) && showDeleteButton) {
        setShowDeleteButton(false);
      }
    };

    // Add event listeners for both mousedown and contextmenu 
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('contextmenu', handleOutsideClick);

    // Clean up event listeners
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('contextmenu', handleOutsideClick);
    };
  }, [showDeleteButton]);

  // console.log(`CustomNode rendering: ${id} - ${data.label}`);

  return (
    <div
      ref={nodeRef}
      onFocus={handleClick}
      onBlur={handleBlur}
      tabIndex={0}
      onContextMenu={handleRightClick}
    >
      {/* Target handle */}
      {!isStartNode && (
        <Handle
          type="target"
          position={Position.Left}
          style={{
            height: '15px',
            width: '15px',
            backgroundColor: isTargetHovered ? 'black' : 'white',
            border: '2px solid #718190',
            zIndex: 10,
            top: '78%',
            left: '-7px'
          }}
          onMouseEnter={() => setIsTargetHovered(true)}
          onMouseLeave={() => setIsTargetHovered(false)}
        />
      )}

      <Card
        className="mb-3"
        style={{
          width: '17rem',
          boxShadow: isActive ? '0 2px 20px 2px #4ea9ff' : '0 2px 15px 2px #718190',
          borderColor: isActive ? '#4ea9ff' : '#718190',
          position: 'relative',
          cursor: 'all-scroll',
          borderRadius: '20px'
        }}
      >
        <div className='p-2'>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <Icon icon={data.icon} height={data.iconSize?.height || 20}
                width={data.iconSize?.width || 20} className="me-2" />
              <h5 className="mb-0">{data.label}</h5>
            </div>
            {/* Only show delete button if NOT a start node and if showDeleteButton is true */}
            {showDeleteButton && !isStartNode && (
              <Button
                onClick={handleDelete}
                className="p-0 d-flex justify-content-center align-items-center position-absolute"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  border: '2px solid #4ea9ff',
                  background: 'white',
                  color: '#4ea9ff',
                  position: 'absolute',
                  right: '-15px',
                  top: '-15px',
                  boxShadow: '0 2px 20px 2px #4ea9ff',
                  zIndex: 999
                }}
              >
                <Icon icon="mdi:close" width={14} height={14} />
              </Button>
            )}
          </div>

          <div className='justify-content-around row'>
            <div className='col' style={{ fontSize: '10px' }}>
              <div className='d-flex'>
                <Icon className='mt-1' icon='tabler:send' color='blue'></Icon>
                <p className='mb-0'>Sent</p>
              </div>
              <p className='text-center'>{data.stats.sent}</p>
            </div>

            <div className='col' style={{ fontSize: '10px' }}>
              <div className='d-flex'>
                <Icon className='mt-1' icon='material-symbols:mail-rounded' color='green'></Icon>
                <p className='mb-0'>Delivered</p>
              </div>
              <p className='mb-0 text-center'>{data.stats.delivered}</p>
            </div>

            <div className='col' style={{ fontSize: '10px' }}>
              <div className='d-flex'>
                <Icon className='mt-1' icon='iconamoon:profile-fill' color='orange'></Icon>
                <p className='mb-0'>Subscribers</p>
              </div>
              <p className='text-center'>{data.stats.subscribers}</p>
            </div>

            <div className='col' style={{ fontSize: '10px' }}>
              <div className='d-flex'>
                <Icon className='mt-1' icon='fa6-solid:bugs' color='red'></Icon>
                <p className='mb-0'>Errors</p>
              </div>
              <p className='text-center'>{data.stats.errors}</p>
            </div>
          </div>

          {data.displayMessage ? (
            <div 
              className="px-3 pb-3 text-center" 
              style={{
                fontSize: '12px',
                wordBreak: 'break-word',
                maxHeight: '60px',
                overflow: 'auto',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                margin: '8px',
                padding: '8px'
              }}
            >
              {data.displayMessage}
            </div>
          ) : (
            <>
              <div className='text-center mb-5 position-relative'>
                <Icon
                  icon='mdi:interaction-tap'
                  height={54}
                  width={54}
                  style={{ cursor: 'pointer' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 220,
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIconClick(e);
                  }}
                />
              </div>
              <div className='position-absolute'
                style={{
                  fontSize: '10px',
                  top: '164px',
                  left: '152px'
                }}>
                <p>Compose next message</p>
              </div>

              {data.label.toLowerCase() === 'interactive' &&(
                <div>
                  <div className='position-absolute'
                  style={{
                    fontSize: '10px',
                    top: '143px',
                    right: '14px'
                  }}>
                  <p>List Messages</p>
                </div>
                <div className='position-absolute'
                style={{
                  fontSize: '10px',
                  top: '122px',
                  right: '14px'
                }}>
                <p>Buttons</p>
              </div>
              <div className='position-absolute'
                style={{
                  fontSize: '10px',
                  top: '101px',
                  right: '14px'
                }}>
                <p>Next</p>
              </div>
                </div>
              
              
              )}
              
              {!isStartNode && (
          <div className='position-absolute'
            style={{
              fontSize: '10px',
              top: '164px',
              left: '14px'
            }}><p>Message</p>
          </div>
        )}
            </>
          )}
        </div>

       
      </Card>

      {/* Only render 4 source handles if it's an interactive node */}
      {data.label.toLowerCase() === 'interactive' ? (
        <>
          {/* First handle */}
          <Handle
            type="source"
            position={Position.Right}
            id="handle-1"
            style={{
              height: '15px',
              width: '15px',
              backgroundColor: isSourceHovered ? 'black' : 'white',
              border: '2px solid #718190',
              top: '48%',
              right: '-7px'
            }}
            onMouseEnter={() => setIsSourceHovered(true)}
            onMouseLeave={() => setIsSourceHovered(false)}
          />
          {/* Second handle */}
          <Handle
            type="source"
            position={Position.Right}
            id="handle-2"
            style={{
              height: '15px',
              width: '15px',
              backgroundColor: isSourceHovered ? 'black' : 'white',
              border: '2px solid #718190',
              top: '58%',
              right: '-7px',
              cursor: 'pointer'  // Add cursor pointer
            }}
            onMouseEnter={() => setIsSourceHovered(true)}
            onMouseLeave={() => setIsSourceHovered(false)}
            onClick={handleHandle2Click}  // Add click handler
          />
          {/* Third handle */}
          <Handle
            type="source"
            position={Position.Right}
            id="handle-3"
            style={{
              height: '15px',
              width: '15px',
              backgroundColor: isSourceHovered ? 'black' : 'white',
              border: '2px solid #718190',
              top: '68%',
              right: '-7px'
            }}
            onMouseEnter={() => setIsSourceHovered(true)}
            onMouseLeave={() => setIsSourceHovered(false)}
          />
          {/* Fourth handle */}
          <Handle
            type="source"
            position={Position.Right}
            id="handle-4"
            style={{
              height: '15px',
              width: '15px',
              backgroundColor: isSourceHovered ? 'black' : 'white',
              border: '2px solid #718190',
              top: '78%',
              right: '-7px'
            }}
            onMouseEnter={() => setIsSourceHovered(true)}
            onMouseLeave={() => setIsSourceHovered(false)}
          />
        </>
      ) : (
        /* Default single source handle for non-interactive nodes */
        <Handle
          type="source"
          position={Position.Right}
          style={{
            height: '15px',
            width: '15px',
            backgroundColor: isSourceHovered ? 'black' : 'white',
            border: '2px solid #718190',
            top: '78%',
            right: '-7px'
          }}
          onMouseEnter={() => setIsSourceHovered(true)}
          onMouseLeave={() => setIsSourceHovered(false)}
        />
      )}
    </div>
  );
};

// Export the memoized version of the component
export default memo(CustomNode, areEqual);
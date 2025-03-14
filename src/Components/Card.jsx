import React, { useState, useEffect, useRef } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { Handle, Position, useReactFlow } from 'reactflow';

const CustomNode = ({ id, data }) => {
  const [isActive, setIsActive] = useState(false);
  const [isTargetHovered, setIsTargetHovered] = useState(false);
  const [isSourceHovered, setIsSourceHovered] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const nodeRef = useRef(null);
  const reactFlowInstance = useReactFlow();

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

  // Handle both left and right clicks outside the card
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // using useref to hide the delete button when clicking outside node
      if (nodeRef.current && !nodeRef.current.contains(event.target) && showDeleteButton) {
        setShowDeleteButton(false);
      }
    };

    // Add event listeners for both mousedown (left click) and contextmenu (right click)
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('contextmenu', handleOutsideClick);

    // Clean up event listeners
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('contextmenu', handleOutsideClick);
    };
  }, [showDeleteButton]);

  return (
    <div
      ref={nodeRef}
      onFocus={handleClick}
      onBlur={handleBlur}
      tabIndex={0}
      onContextMenu={handleRightClick}
    >
      {/* conditionally rendering traget handle for start-node */}
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
            top: '75%'
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
          cursor: 'all-scroll'
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
          <div className='text-center mb-5'>
            <Icon
              icon='mdi:interaction-tap'
              height={54}
              width={54}
              style={{ cursor: 'pointer' }}
              onClick={handleIconClick}
            />
          </div>
        </div>

        <div className='position-absolute'
          style={{
            fontSize: '10px',
            top: '158px',
            left: '152px'
          }}><p>Compose next message</p></div>

        {!isStartNode && (
          <div className='position-absolute'
            style={{
              fontSize: '10px',
              top: '158px',
              left: '14px'
            }}><p>Message</p></div>
        )}
      </Card>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          height: '15px',
          width: '15px',
          backgroundColor: isSourceHovered ? 'black' : 'white',
          border: '2px solid #718190',
          top: '75%'
        }}
        onMouseEnter={() => setIsSourceHovered(true)}
        onMouseLeave={() => setIsSourceHovered(false)}
      />
    </div>
  );
};

export default CustomNode;
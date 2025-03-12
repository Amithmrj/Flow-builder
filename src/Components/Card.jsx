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
    setShowDeleteButton(true);
  };

  // Handle both left and right clicks outside the card
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // If clicking outside the node and delete button is visible, hide it
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

      <Card
        className="mb-3"
        style={{
          width: '17rem',
          boxShadow: isActive ? '0 2px 20px 2px #4ea9ff' : '0 2px 15px 2px #718190',
          borderColor: isActive ? '#4ea9ff' : '#718190',
          position: 'relative'
        }}
      >
        <div className='p-2'>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <Icon icon={data.icon} width={20} height={20} className="me-2" />
              <h5 className="mb-0">{data.label}</h5>
            </div>
            {showDeleteButton && (
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
                <Icon className='mt-1' icon='tabler:send' color='blue'></Icon>
                <p className='mb-0'>Delivered</p>
              </div>
              <p className='mb-0 text-center'>{data.stats.delivered}</p>
            </div>

            <div className='col' style={{ fontSize: '10px' }}>
              <div className='d-flex'>
                <Icon className='mt-1' icon='tabler:send' color='blue'></Icon>
                <p className='mb-0'>Subscribers</p>
              </div>
              <p className='text-center'>{data.stats.subscribers}</p>
            </div>

            <div className='col' style={{ fontSize: '10px' }}>
              <div className='d-flex'>
                <Icon className='mt-1' icon='tabler:send' color='blue'></Icon>
                <p className='mb-0'>Errors</p>
              </div>
              <p className='text-center'>{data.stats.errors}</p>
            </div>
          </div>
          <div className='text-center mb-2'>
            <Icon
              icon='mdi:interaction-tap'
              height={54}
              width={54}
              style={{ cursor: 'pointer' }}
              onClick={handleIconClick}
            />
          </div>
        </div>
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
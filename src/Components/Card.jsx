import React, { useState, useEffect, useRef } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';

const IconCard = ({ icon, title, onClose, id }) => {
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [isCardActive, setIsCardActive] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const cardRef = useRef(null);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('cardId', id);
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    e.dataTransfer.setData('offset', JSON.stringify({ x: offsetX, y: offsetY }));
  };

  const handleContextMenu = (e) => {
    e.preventDefault();  
    setShowCloseButton(true);
    setIsCardActive(true); 
  };

  const handleCardClick = () => {
    setIsCardActive(true);
  };

  const handleIconClick = (e) => {
    e.stopPropagation(); // Prevent card activation
    setShowSidebar(true);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
  };

  //hide close button logic
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setShowCloseButton(false);
        setIsCardActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <Card
        ref={cardRef}
        className="mb-3"
        style={{
          width: '17rem',
          cursor: 'move',
          boxShadow: isCardActive ? '0 2px 20px 2px #4ea9ff' : '0 2px 15px 2px #718190'
        }}
        draggable
        onDragStart={handleDragStart}
        onContextMenu={handleContextMenu}
        onClick={handleCardClick}
      >
        <div className='p-2'>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <Icon icon={icon} width={20} height={20} className="me-2" />
              <h5 className="mb-0">{title}</h5>
            </div>
            {showCloseButton && (
              <Button
                onClick={onClose}
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
                  boxShadow: '0 2px 20px 2px #4ea9ff'
                }}
              >
                <Icon icon="mdi:close" width={14} height={14} />
              </Button>
            )}
          </div>
          
          <div className=' justify-content-around row'>
            <div className=' col' style={{ fontSize: '10px' }}>
              <div className='d-flex'>
                <Icon className='mt-1' icon='tabler:send' color='blue'></Icon>
                <p className='mb-0 ' >Sent</p>
              </div>
                <p className='text-center'>0</p>
            </div>

            <div className=' col' style={{ fontSize: '10px' }}>
              <div className='d-flex'>
                <Icon className='mt-1' icon='tabler:send' color='blue'></Icon>
                <p className='mb-0' >Delivered</p>
              </div>
                <p className=' mb-0 text-center'>0</p>
            </div>

            <div className=' col' style={{ fontSize: '10px' }}>
              <div className='d-flex'>
                <Icon className='mt-1' icon='tabler:send' color='blue'></Icon>
                <p className='mb-0' >Subscribers</p>
              </div>
                <p className='text-center'>0</p>
            </div>

            <div className=' col' style={{ fontSize: '10px' }}>
              <div className='d-flex'>
                <Icon className='mt-1' icon='tabler:send' color='blue'></Icon>
                <p className='mb-0' >Errors</p>
              </div>
                <p className='text-center'>0</p>
            </div>
          </div>
          <div className='text-center mb-4'>
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

      {/* Sidebaar */}
      {showSidebar && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '300px',
            height: '100%',
            backgroundColor: 'white',
            boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
            padding: '20px',
            transition: 'all 0.3s ease-in-out',
            overflowY: 'auto'
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">{title} Details</h4>
            <Button
              variant="success"
              className="d-flex justify-content-center align-items-center"
              style={{ 
                width: '32px', 
                height: '32px',
                borderRadius: '50%'
              }}
              onClick={handleCloseSidebar}
            >
              X
            </Button>
          </div>
          
          <div className="sidebar-content">
            <div className="mb-3">
              
              <div className="d-flex justify-content-between mb-2">
                <span>Sent:</span>
                <span>0</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivered:</span>
                <span>0</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Subscribers:</span>
                <span>0</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Errors:</span>
                <span>0</span>
              </div>
            </div>
            
            <hr />
          </div>
        </div>
      )}
      
      {/* sidebar closing */}
      {showSidebar && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 999
          }}
          onClick={handleCloseSidebar}
        />
      )}
    </>
  );
};

export default IconCard;
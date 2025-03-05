import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const DraggableIcon = ({ icon, title }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('title', title);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`d-flex flex-column align-items-center justify-content-center p-2 rounded cursor-move ${
        isDragging ? 'border border-primary' : 'hover-bg-light'
      }`}
      style={{ cursor: 'move' }}
    >
      <div className="border p-2 rounded-circle">
        <Icon icon={icon} width={26} height={26} />
      </div>
    </div>
  );
};

export default DraggableIcon;
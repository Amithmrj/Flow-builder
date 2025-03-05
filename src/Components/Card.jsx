import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';

const IconCard = ({ icon, title, onClose }) => {
  return (
    <Card className="mb-3" style={{ width: '17rem' }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <Icon icon={icon} width={20} height={20} className="me-2" />
            <Card.Title className="mb-0">{title}</Card.Title>
          </div>
          <Button variant="link" onClick={onClose} className="text-decoration-none p-0">
            <Icon icon="mdi:close" width={18} height={18} />
          </Button>
        </div>
        <Card.Text>
          This is a {title.toLowerCase()} card 
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default IconCard;
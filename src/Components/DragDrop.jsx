import React, { useState, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import IconCard from './Card';
import DraggableIcon from './DraggableIcon';
import { Icon } from '@iconify/react';

const DragDrop = () => {
  const [cards, setCards] = useState([]);
  const dropDivRef = useRef(null);

  const icons = [
    { icon: 'icon-park:text-message', title: 'text',id:1 },
    { icon: 'fluent-color:image-32', title: 'Image',id:2 },
    { icon: 'fluent-color:mic-28', title: 'Audio',id:3 },
    { icon: 'fluent-color:video-32', title: 'Video',id:4 },
    { icon: 'flat-color-icons:file', title: 'File',id:5 },
    { icon: 'fluent-color:location-ripple-16', title: 'Location',id:6 },
    { icon: 'logos:whatsapp-icon', title: 'WhatsApp',id:7 },
    { icon: 'carbon:touch-1-filled', title: 'Interactive',id:8 },
    { icon: 'ph:greater-than-or-equal-bold', title: 'Conditional',id:9 },
    { icon: 'logos:sequelize', title: 'Sequence',id:10 },
    { icon: 'flat-color-icons:multiple-inputs', title: 'User input flow',id:11 },
    { icon: 'catppuccin:folder-templates', title: 'Template meessage' }
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const title = e.dataTransfer.getData('title');
    const DraggedIcon = icons.find((icon) => icon.title === title);
    console.log(DraggedIcon);
    
    if (DraggedIcon) {
      const dropDivDetail = dropDivRef.current.getBoundingClientRect();
      const x = e.clientX - dropDivDetail.left;
      const y = e.clientY - dropDivDetail.top;

      setCards([
        ...cards,
        {
        //   id: Date.now(),    
          ...DraggedIcon,
          position: { x, y },
        },
      ]);
    }
  };
  console.log(cards);
  

  const handleCloseCard = (cardId) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  return (
    <div className="d-flex flex-column vh-100">
      <div className="bg-white shadow-sm">
        <Container>
          <Row className="py-2">
            <Col className="d-flex justify-content-start  align-items-center gap-1">
              {icons.map((iconObj) => (
                <DraggableIcon key={iconObj.title} icon={iconObj.icon} title={iconObj.title} />
              ))}
              <Button variant="success" className="ms-auto">
              Start
            </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <div
        ref={dropDivRef}
        className="flex-grow-1 bg-light position-relative"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="position-absolute"
            style={{
              left: card.position.x - 144,
              top: card.position.y - 20,
            }}
          >
            <IconCard icon={card.icon} title={card.title} onClose={() => handleCloseCard(card.id)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DragDrop;
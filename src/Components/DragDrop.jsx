import React, { useState, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import IconCard from './Card';
import DraggableIcon from './DraggableIcon';

const DragDrop = () => {
  const [cards, setCards] = useState([]);
  // const [draggingCard, setDraggingCard] = useState(null);
  const dropDivRef = useRef(null);

  const icons = [
    { icon: 'icon-park:text-message', title: 'text' },
    { icon: 'fluent-color:image-32', title: 'Image' },
    { icon: 'fluent-color:mic-28', title: 'Audio' },
    { icon: 'fluent-color:video-32', title: 'Video' },
    { icon: 'flat-color-icons:file', title: 'File' },
    { icon: 'fluent-color:location-ripple-16', title: 'Location' },
    { icon: 'logos:whatsapp-icon', title: 'WhatsApp' },
    { icon: 'carbon:touch-1-filled', title: 'Interactive' },
    { icon: 'ph:greater-than-or-equal-bold', title: 'Conditional' },
    { icon: 'logos:sequelize', title: 'Sequence' },
    { icon: 'flat-color-icons:multiple-inputs', title: 'User input flow' },
    { icon: 'catppuccin:folder-templates', title: 'Template meessage' }
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropDivDetail = dropDivRef.current.getBoundingClientRect();
    const x = e.clientX - dropDivDetail.left;
    const y = e.clientY - dropDivDetail.top;
    // console.log('valuex is', x, 'valuey is', y);
    

    // data for rearranging cars after the placement 
    const cardId = e.dataTransfer.getData('cardId');
    const title = e.dataTransfer.getData('title');

    if (cardId) {
      const offsetData = JSON.parse(e.dataTransfer.getData('offset'));   //adding new position details to setCards
      setCards(cards.map(card => {
        if (card.id.toString() === cardId) {
          return {
            ...card,
            position: {
              x: x - offsetData.x,
              y: y - offsetData.y
            }
          };
        }
        return card;
      }));
    }
    else if (title) {
      const DraggedIcon = icons.find((icon) => icon.title === title);         //adding new icon detail to setCards
      if (DraggedIcon) {
        setCards([
          ...cards,
          {
            id: Date.now(),
            ...DraggedIcon,
            position: { x: x - 144, y: y - 20 },
          },
        ]);
      }
    }
  };

  // console.log(cards);
  

  const handleCloseCard = (cardId) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  return (
    <div className="d-flex flex-column vh-100">
      <div className="bg-white shadow-sm">
        <Container>
          <Row className="py-2">
            <Col className="d-flex justify-content-start align-items-center">
              {icons.map((iconObj) => (
                <DraggableIcon key={iconObj.title} icon={iconObj.icon} title={iconObj.title} />
              ))}
              <Button variant="success" className="ms-auto">
                Save
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
              left: card.position.x,
              top: card.position.y,
              // opacity: draggingCard === card.id ? 0.5 : 1,
            }}
          >
            <IconCard
              icon={card.icon}
              title={card.title}
              id={card.id}
              onClose={() => handleCloseCard(card.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DragDrop;
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

// Text Message Node Sidebar
const TextMessageSidebar = ({ data, onUpdate }) => {
  const [messageText, setMessageText] = useState(data.message || '');

  const handleSave = () => {
    onUpdate({ 
      message: messageText,
      displayMessage: messageText,
      label: data.label // Preserve the existing label
    });
  };

  return (
    <div className="sidebar-content">
      <Form.Group className="mb-3">
        <Form.Label>Message Text</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
      </Form.Group>
      <button 
        className='btn btn-success'
        onClick={handleSave}
      >
        Save Node
      </button>
    </div>
  );
};

// Combined Media Node Sidebar
const MediaSidebar = ({ data, onUpdate, type }) => {
  const [preview, setPreview] = useState(data[`${type}Url`] || null);
  const [delay, setDelay] = useState(data.delay || 0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith(`${type}/`)) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
        onUpdate({ [`${type}Url`]: event.target.result, delay });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelayChange = (e) => {
    const newDelay = parseInt(e.target.value);
    setDelay(newDelay);
    onUpdate({ delay: newDelay, [`${type}Url`]: preview });
  };

  const renderPreview = () => {
    if (!preview) return (
      <div>
        <p className="mb-0">Drop File here or click to upload</p>
        <small className="text-muted">
          Supported formats: {type === 'image' ? 'JPG, PNG, GIF' : 'MP4, WebM'}
        </small>
      </div>
    );

    return type === 'image' ? (
      <img
        src={preview}
        alt="Preview"
        style={{
          maxWidth: '100%',
          maxHeight: '150px',
          objectFit: 'contain'
        }}
      />
    ) : (
      <video
        src={preview}
        controls
        style={{
          maxWidth: '100%',
          maxHeight: '180px',
          objectFit: 'contain'
        }}
      />
    );
  };

  return (
    <div className="sidebar-content">
      <Form.Group className="mb-3">
        <Form.Label>Upload {type.charAt(0).toUpperCase() + type.slice(1)}</Form.Label>
        <div
          className={`${type}-upload-box d-flex align-items-center justify-content-center`}
          style={{
            border: '2px dashed #dee2e6',
            height: type === 'video' ? '200px' : '150px',
            borderRadius: '4px',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa',
            cursor: 'pointer',
            marginBottom: '15px'
          }}
          onClick={() => document.getElementById(`${type}Input`).click()}
        >
          {renderPreview()}
          <input
            id={`${type}Input`}
            type="file"
            accept={`${type}/*`}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className="delay-control mt-3">
          <Form.Label>Delay: {delay} seconds</Form.Label>
          <Form.Range
            value={delay}
            onChange={handleDelayChange}
            min={0}
            max={60}
            step={1}
            className="custom-range"
          />
          <small className="text-muted d-flex justify-content-between">
            <span>0s</span>
            <span>60s</span>
          </small>
        </div>
      </Form.Group>
      <button className='btn btn-success'>Save node</button>
    </div>
  );
};

// Audio Node Sidebar
const AudioSidebar = ({ data, onUpdate }) => {
  return (
    <div className="sidebar-content">
      <Form.Group className="mb-3">
        <Form.Label>Audio URL</Form.Label>
        <Form.Control
          type="text"
          defaultValue={data.audioUrl}
          onChange={(e) => onUpdate({ audioUrl: e.target.value })}
        />
      </Form.Group>
      <button className='btn btn-success'>Save node</button>
    </div>
  );
};

// Conditional Node Sidebar
const ConditionalSidebar = ({ data, onUpdate }) => {
  return (
    <div className="sidebar-content">
      <Form.Group className="mb-3">
        <Form.Label>Condition Type</Form.Label>
        <Form.Select
          defaultValue={data.conditionType}
          onChange={(e) => onUpdate({ conditionType: e.target.value })}
        >
          <option value="equals">Equals</option>
          <option value="contains">Contains</option>
          <option value="regex">Regex Match</option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Value to Match</Form.Label>
        <Form.Control
          type="text"
          defaultValue={data.matchValue}
          onChange={(e) => onUpdate({ matchValue: e.target.value })}
        />
      </Form.Group>
      <button className='btn btn-success'>Save node</button>
    </div>
  );
};

const locationSidebar = ({ data, onUpdate }) => {
  const [delay, setDelay] = useState(data.delay || 0);

  const handleDelayChange = (e) => {
    const newDelay = parseInt(e.target.value);
    setDelay(newDelay);
    onUpdate({ delay: newDelay });
  };

  return (
    <div className="sidebar-content">
      <Form.Group className="mb-3">
        <Form.Label>Please provide body text</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          defaultValue={data.message}
          onChange={(e) => onUpdate({ message: e.target.value })}
        />


        <div className="delay-control mt-3">
          <Form.Label>Delay in reply: {delay} seconds</Form.Label>
          <Form.Range
            value={delay}
            onChange={handleDelayChange}
            min={0}
            max={60}
            step={1}
            className="custom-range"
          />
          <small className="text-muted d-flex justify-content-between">
            <span>0s</span>
            <span>60s</span>
          </small>
        </div>
      </Form.Group>
      <button className='btn btn-success'>Save node</button>
    </div>
  );
};

const WhatsappSidebar = ({ data, onUpdate }) => {
  const [delay, setDelay] = useState(data.delay || 0);

  const handleDelayChange = (e) => {
    const newDelay = parseInt(e.target.value);
    setDelay(newDelay);
    onUpdate({ delay: newDelay });
  };
  return (
    <div className="sidebar-content">
      <Form.Group className="mb-3">
        <Form.Label>Choose a Flow</Form.Label>
        <Form.Select
          defaultValue={data.conditionType}
          onChange={(e) => onUpdate({ conditionType: e.target.value })}
        >
          <option value="equals">SLTFLOW</option>
          <option value="contains">DHDHDH</option>
          <option value="regex">SGKSRB</option>
        </Form.Select>
        <Form.Label className='mt-2'>Message Header</Form.Label>
        <Form.Control
          type="text"
          defaultValue={data.matchValue}
          onChange={(e) => onUpdate({ matchValue: e.target.value })}
        />
        <Form.Label className='mt-2'>Message Body</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          defaultValue={data.message}
          onChange={(e) => onUpdate({ message: e.target.value })}
        />
        <Form.Label className='mt-2'>Message Footer</Form.Label>
        <Form.Control
          type="text"
          defaultValue={data.matchValue}
          onChange={(e) => onUpdate({ matchValue: e.target.value })}
        />
        <Form.Label className='mt-2'>Footer Button Text</Form.Label>
        <Form.Control
          type="text"
          defaultValue={data.matchValue}
          onChange={(e) => onUpdate({ matchValue: e.target.value })}
        />
        <div className="delay-control mt-3">
          <Form.Label>Delay in reply: {delay} seconds</Form.Label>
          <Form.Range
            value={delay}
            onChange={handleDelayChange}
            min={0}
            max={60}
            step={1}
            className="custom-range"
          />
          <small className="text-muted d-flex justify-content-between">
            <span>0s</span>
            <span>60s</span>
          </small>
        </div>
      </Form.Group>
      <button className='btn btn-success'>Save node</button>
    </div>
  );
};


// Map node types to their respective sidebars
export const sidebarComponents = {
  'text': TextMessageSidebar,
  'image': (props) => <MediaSidebar {...props} type="image" />,
  'audio': AudioSidebar,
  'video': (props) => <MediaSidebar {...props} type="video" />,
  'file': TextMessageSidebar,
  'location': locationSidebar,
  'whatsapp': WhatsappSidebar,
  'interactive': TextMessageSidebar,
  'conditional': ConditionalSidebar,
  'sequence': TextMessageSidebar,
  'user input flow': TextMessageSidebar,
  'template meessage': TextMessageSidebar,
  'Start Bot Flow': TextMessageSidebar
};
import React, { useState, useRef, useCallback } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import DraggableIcon from './DraggableIcon';
import CustomNode from './Card';
import { Icon } from '@iconify/react';

// Registering the custom node type
const nodeTypes = {
  iconCard: CustomNode
};
const proOptions = { hideAttribution: true };

const DragDrop = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarData, setSidebarData] = useState(null);
  const [sidebarNodeId, setSidebarNodeId] = useState(null);

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
    { icon: 'devicon:stackoverflow', title: 'User input flow' },
    { icon: 'catppuccin:folder-templates', title: 'Template meessage' }
  ];

  // Function to open sidebar from node
  const handleOpenSidebar = (nodeId, nodeData) => {
    setSidebarNodeId(nodeId);
    setSidebarData(nodeData);
    setShowSidebar(true);
  };

  // Function to close sidebar
  const handleCloseSidebar = () => {
    setShowSidebar(false);
    setSidebarData(null);
    setSidebarNodeId(null);
  };


  const handleDeleteNode = (nodeId) => {
    // To allow deletion of the start node
    if (nodeId === 'start-node') return;

    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    setEdges((edges) => edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    ));

    // To Close sidebar if the deleted node has the sidebar open
    if (nodeId === sidebarNodeId) {
      handleCloseSidebar();
    }
  };

  // Create a default start node
  const initialNodes = [
    {
      id: 'start-node',
      type: 'iconCard',
      position: { x: 80, y: 50 },
      data: {
        label: 'Start Bot Flow',
        icon: 'tabler:walk',
        iconSize: { height: 24, width: 24 },
        stats: {
          sent: 0,
          delivered: 0,
          subscribers: 0,
          errors: 0
        },
        onDelete: handleDeleteNode,
        onOpenSidebar: handleOpenSidebar,
        isStartNode: true // start node identifier
      }
    }
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);


  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({
      ...params,
      animated: false,
      style: { stroke: '#000000', strokeWidth: 2 },
      markerEnd: {
        type: 'arrowclosed',
        width: 20,
        height: 20,
        color: '#000000',
      },
    }, eds)),
    [setEdges]
  );

  const isValidConnection = (connection) => {
    // Prevent connections where source and target are the same node

    if (connection.source === connection.target) {
      return false;
    }

    // To Check if source already has an outgoing connection
    const sourceHasOutgoingConnection = edges.some(
      (edge) => edge.source === connection.source
    );

    return !sourceHasOutgoingConnection;
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const title = event.dataTransfer.getData('title');

      if (!title || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const iconData = icons.find((iconObj) => iconObj.title === title);

      if (iconData) {
        const newNode = {
          id: `node_${Date.now()}`,
          type: 'iconCard',
          position,
          data: {
            label: title,
            icon: iconData.icon,
            stats: {
              sent: 0,
              delivered: 0,
              subscribers: 0,
              errors: 0
            },
            onDelete: handleDeleteNode,
            onOpenSidebar: handleOpenSidebar,
            isStartNode: false
          },
        };

        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance, setNodes, icons, setEdges, sidebarNodeId]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.id);
  }, []);

  const saveFlow = () => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();

      console.log("Flow saved:", flow);
      alert("Flow saved successfully!");
    }
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
              <Button variant="success" className="ms-auto" onClick={saveFlow}>
                Save
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="flex-grow-1 position-relative" ref={reactFlowWrapper}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            proOptions={proOptions}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            isValidConnection={isValidConnection}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={{
              style: { stroke: '#000000', strokeWidth: 2 },
              animated: false,
              markerEnd: {
                type: 'arrowclosed',
                width: 20,
                height: 20,
                color: '#000000',
              }
            }}
          >
            <MiniMap />
          </ReactFlow>
        </ReactFlowProvider>

        {/* Render the sidebar*/}
        {showSidebar && sidebarData && (
          <>
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '300px',
                height: '100%',
                backgroundColor: 'white',
                boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.2)',
                zIndex: 1000,
                padding: '20px',
                overflowY: 'auto'
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">{sidebarData.label} Details</h4>
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
                    <span>{sidebarData.stats.sent}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Delivered:</span>
                    <span>{sidebarData.stats.delivered}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subscribers:</span>
                    <span>{sidebarData.stats.subscribers}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Errors:</span>
                    <span>{sidebarData.stats.errors}</span>
                  </div>
                </div>

                <hr />

                <div className="mb-3">
                  <h5>Configuration</h5>
                  <div className="mb-2">
                    <label className="form-label">Node Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={sidebarData.label}
                      readOnly
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Type</label>
                    <input
                      type="text"
                      className="form-control"
                      value={sidebarData.label}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar backdrop */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 999,
                backgroundColor: 'rgba(0, 0, 0, 0.1)'
              }}
              onClick={handleCloseSidebar}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DragDrop;
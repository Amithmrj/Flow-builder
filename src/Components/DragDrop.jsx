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
import { sidebarComponents } from './NodeSideBar';

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
  const [flowName, setFlowName] = useState("My Flow");

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
  const [savedFlows, setSavedFlows] = useState([]);


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
console.log(edges);

  const isValidConnection = (connection) => {
    // Prevent connections where source and target are the same node
    if (connection.source === connection.target) {
      return false;
    }
  
    // Get the source node
    const sourceNode = nodes.find(node => node.id === connection.source);
    
    // If it's an interactive node, allow connections from handle-2
    if (sourceNode?.data.label.toLowerCase() === 'interactive' && connection.sourceHandle === 'handle-2') {
      return true;
    }
    
    // For other handles and non-interactive nodes, maintain single connection rule
    const handleHasConnection = edges.some(
      edge => edge.source === connection.source && edge.sourceHandle === connection.sourceHandle
    );
    return !handleHasConnection;
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
            label: iconData.title,
            icon: iconData.icon,
            stats: {
              sent: 0,
              delivered: 0,
              subscribers: 0,
              errors: 0
            },
            message: '', 
            displayMessage: '',
            onDelete: handleDeleteNode,
            onOpenSidebar: handleOpenSidebar,
            isStartNode: false
          },
        };

        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance, setNodes, icons]
  );

  const onNodeClick = useCallback((event, node) => { // not used anywhere
    setSelectedNode(node.id);
  }, []);

  const saveFlow = () => {
    if (reactFlowInstance) {
      // Prompt for flow name
      const name = prompt("Enter a name for your flow:", flowName);
      if (!name) return; // Cancel if no name provided
  
      const flow = reactFlowInstance.toObject();
      const flowData = {
        id: `flow_${Date.now()}`,
        name: name, // Use the custom name here
        createdAt: new Date().toISOString(),
        nodes: flow.nodes.map(node => ({
          id: node.id,
          type: node.type,
          position: node.position,
          label: node.data.label,
          data: {
            icon: node.data.icon,
            message: node.data.message || '',
            displayMessage: node.data.displayMessage || '',
            stats: node.data.stats,
            isStartNode: node.data.isStartNode || false
          }
        })),
        edges: flow.edges,
        viewport: flow.viewport
      };
  
      // Update flowName state for next time
      setFlowName(name);
  
      // Rest of your existing save logic
      try {
        const existingFlows = JSON.parse(localStorage.getItem('savedFlows')) || [];
        const updatedFlows = [...existingFlows, flowData];
        localStorage.setItem('savedFlows', JSON.stringify(updatedFlows));
        setSavedFlows(prev => [...prev, flowData]);
        console.log("Flow saved:", flowData);
        console.log("All saved flows:", updatedFlows);
        alert(`Flow "${name}" saved successfully!`);
      } catch (error) {
        console.error("Error saving flow to localStorage:", error);
        alert("Error saving flow!");
      }
    }
  };

  const handleSidebarUpdate = (nodeId, updates) => {
    setNodes(nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            ...updates
          }
        };
      }
      return node;
    }));
  };

  const renderSidebar = () => {
    if (!showSidebar || !sidebarData) return null;

    const SidebarComponent = sidebarComponents[sidebarData.label] || 
                            sidebarComponents[sidebarData.label.toLowerCase()];

    return (
      <>
        <div className="sidebar" style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '400px',
          height: '100vh',
          backgroundColor: 'white',
          boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          padding: '20px',
          overflowY: 'auto'
        }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">Configure {sidebarData.label}</h4>
            <Button className='rounded-circle'
              variant="success"
              onClick={handleCloseSidebar}
            >
              X
            </Button>
          </div>

          {/* Stats Section */}
          <div className="stats-section mb-4">
          </div>

          {/* Dynamic Sidebar Content */}
          {SidebarComponent ? (
            <SidebarComponent 
              data={sidebarData} 
              onUpdate={(updates) => handleSidebarUpdate(sidebarNodeId, updates)}
            />
          ) : (
            <div>No configuration available for this node type: {sidebarData.label}</div>
          )}
        </div>

        
        <div
          className="sidebar-backdrop"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            zIndex: 999
          }}
          onClick={handleCloseSidebar}
        />
      </>
    );
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
                Save flow
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

        {renderSidebar()}
      </div>
    </div>
  );
};

export default DragDrop;
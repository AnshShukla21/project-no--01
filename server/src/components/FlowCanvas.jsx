import React, { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";

import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "sensor-1",
    type: "default",
    position: { x: 80, y: 180 },
    data: {
      label: "🌡️ Turbine Sensor",
    },
  },
  {
    id: "filter-1",
    type: "default",
    position: { x: 380, y: 180 },
    data: {
      label: "📊 Moving Average Filter",
    },
  },
  {
    id: "alert-1",
    type: "default",
    position: { x: 720, y: 180 },
    data: {
      label: "🚨 SMS Alert",
    },
  },
];

const initialEdges = [
  {
    id: "edge-1",
    source: "sensor-1",
    target: "filter-1",
    animated: true,
  },
  {
    id: "edge-2",
    source: "filter-1",
    target: "alert-1",
    animated: true,
  },
];

function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [message, setMessage] = useState("");

  const onConnect = useCallback(
    (params) => {
      setEdges((currentEdges) =>
        addEdge(
          {
            ...params,
            animated: true,
          },
          currentEdges
        )
      );
    },
    [setEdges]
  );

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
    setMessage("Canvas cleared");
  };

  const resetCanvas = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setMessage("Demo rule restored");
  };

  const saveGraph = () => {
    const graph = {
      nodes,
      edges,
    };

    console.log("NexusFlow Graph:", graph);

    localStorage.setItem(
      "nexusflow-graph",
      JSON.stringify(graph)
    );

    setMessage("Graph saved successfully");
  };

  const runRule = () => {
    if (nodes.length === 0) {
      setMessage("Add some nodes first");
      return;
    }

    setMessage("Rule execution started...");
  };

  return (
    <div className="nexus-container">

      <div className="topbar">
        <div>
          <h2>NexusFlow Rule Builder</h2>
          <p>Visual IoT Telemetry & Rule Engine</p>
        </div>

        <div className="actions">
          <button onClick={resetCanvas}>
            Reset
          </button>

          <button onClick={clearCanvas}>
            Clear
          </button>

          <button onClick={saveGraph}>
            Save Graph
          </button>

          <button className="run-button" onClick={runRule}>
            ▶ Run Rule
          </button>
        </div>
      </div>

      <div className="status">
        {message || "Connect your nodes to create an automation rule"}
      </div>

      <div className="canvas-wrapper">

        <aside className="sidebar">
          <h3>Node Library</h3>

          <div className="node-category">
            <span>DATA SOURCES</span>

            <div className="library-node sensor">
              🌡️ Turbine Sensor
            </div>

            <div className="library-node sensor">
              💨 Pressure Sensor
            </div>
          </div>

          <div className="node-category">
            <span>MATH OPERATIONS</span>

            <div className="library-node math">
              📊 Moving Average
            </div>

            <div className="library-node math">
              ➕ Threshold Check
            </div>
          </div>

          <div className="node-category">
            <span>ACTION TRIGGERS</span>

            <div className="library-node action">
              🚨 SMS Alert
            </div>

            <div className="library-node action">
              🔔 Notification
            </div>
          </div>
        </aside>

        <div className="flow-area">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>

      </div>
    </div>
  );
}

export default FlowCanvas;
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  useState,
  useEffect,
  useCallback,
} from "react";

import axios from "axios";
import { io } from "socket.io-client";
import "./App.css";

import SensorNode from "./components/nodes/SensorNode";
import FilterNode from "./components/nodes/FilterNode";
import AlertNode from "./components/nodes/AlertNode";

import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
} from "reactflow";

import "reactflow/dist/style.css";


const nodeTypes = {
  sensor: SensorNode,
  filter: FilterNode,
  alert: AlertNode,
};


function App() {

  // =========================
  // BASIC STATES
  // =========================

  const [apiMessage, setApiMessage] = useState("");

  const [activeTab, setActiveTab] = useState("Dashboard");

  const [telemetry, setTelemetry] = useState([]);
const [isSocketConnected, setIsSocketConnected] = useState(false);

  // Selected node ID
  const [selectedNode, setSelectedNode] = useState(null);


  // =========================
  // FLOW NODES
  // =========================

  const [flowNodes, setFlowNodes] = useState([
    {
      id: "1",
      type: "sensor",
      position: {
        x: 50,
        y: 100,
      },
      data: {
        label: "Sensor Node",
      },
    },

    {
      id: "2",
      type: "filter",
      position: {
        x: 300,
        y: 100,
      },
      data: {
        label: "Filter Node",
      },
    },

    {
      id: "3",
      type: "alert",
      position: {
        x: 550,
        y: 100,
      },
      data: {
        label: "Alert Node",
      },
    },
  ]);


  // =========================
  // FLOW EDGES
  // =========================

  const [flowEdges, setFlowEdges] = useState([
    {
      id: "e1-2",
      source: "1",
      target: "2",
    },

    {
      id: "e2-3",
      source: "2",
      target: "3",
    },
  ]);


  // =========================
  // ADD SENSOR NODE
  // =========================

  const addSensorNode = () => {

    const newNode = {
      id: Date.now().toString(),

      type: "sensor",

      position: {
        x: Math.random() * 400,
        y: Math.random() * 300,
      },

      data: {
        label: "New Sensor",
      },
    };

    setFlowNodes((nds) => [
      ...nds,
      newNode,
    ]);
  };


  // =========================
  // REMOVE LAST SENSOR NODE
  // =========================

  const removeSensorNode = () => {

    setFlowNodes((nds) => {

      if (nds.length <= 1) {

        alert("At least one node must remain.");

        return nds;
      }

      const lastNode =
        nds[nds.length - 1];


      // Remove connected edges
      setFlowEdges((eds) =>
        eds.filter(
          (edge) =>
            edge.source !== lastNode.id &&
            edge.target !== lastNode.id
        )
      );


      return nds.slice(0, -1);
    });
  };


  // =========================
  // DELETE SELECTED NODE
  // =========================

  const deleteSelectedNode = () => {

    if (!selectedNode) {

      alert("Please select a node first.");

      return;
    }


    // Remove node
    setFlowNodes((nds) =>
      nds.filter(
        (node) =>
          node.id !== selectedNode
      )
    );


    // Remove connected edges
    setFlowEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== selectedNode &&
          edge.target !== selectedNode
      )
    );


    // Clear selection
    setSelectedNode(null);


    alert("Node deleted successfully!");
  };


  // =========================
  // SAVE RULE AS JSON
  // =========================

  const saveRuleAsJSON = () => {

    const rule = {

      name: "NexusFlow Rule",

      version: "1.0",

      createdAt:
        new Date().toISOString(),

      nodes: flowNodes,

      edges: flowEdges,
    };


    // Save inside browser LocalStorage

    localStorage.setItem(
      "savedRule",
      JSON.stringify(rule)
    );


    // Convert rule to JSON

    const jsonData =
      JSON.stringify(
        rule,
        null,
        2
      );


    // Create JSON file

    const blob = new Blob(
      [jsonData],
      {
        type: "application/json",
      }
    );


    const url =
      URL.createObjectURL(blob);


    // Create download link

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "nexusflow-rule.json";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);


    alert(
      "Rule saved successfully!"
    );
  };


  // =========================
  // REACT FLOW - NODE CHANGES
  // =========================

  const onNodesChange =
    useCallback(
      (changes) => {

        setFlowNodes((nds) =>
          applyNodeChanges(
            changes,
            nds
          )
        );

      },
      []
    );


  // =========================
  // REACT FLOW - EDGE CHANGES
  // =========================

  const onEdgesChange =
    useCallback(
      (changes) => {

        setFlowEdges((eds) =>
          applyEdgeChanges(
            changes,
            eds
          )
        );

      },
      []
    );


  // =========================
  // CONNECT NODES
  // =========================

  const onConnect =
    useCallback(
      (params) => {

        setFlowEdges((eds) =>
          addEdge(
            params,
            eds
          )
        );

      },
      []
    );


  // =========================
  // DRAG OVER
  // =========================

  const onDragOver =
    useCallback(
      (event) => {

        event.preventDefault();

        event.dataTransfer.dropEffect =
          "move";

      },
      []
    );


  // =========================
  // DROP NODE
  // =========================

  const onDrop =
    useCallback(
      (event) => {

        event.preventDefault();


        const type =
          event.dataTransfer.getData(
            "application/reactflow"
          );


        if (!type) {
          return;
        }


        const newNode = {

          id:
            `${type}-${Date.now()}`,

          type: type,

          position: {

            x:
              event.clientX - 250,

            y:
              event.clientY - 100,

          },

          data: {

            label:
              `${type.toUpperCase()} Node`,

          },
        };


        setFlowNodes((nds) => [
          ...nds,
          newNode,
        ]);

      },
      []
    );


 // =========================
// REAL-TIME SOCKET TELEMETRY
// =========================

useEffect(() => {

  const socket = io("http://localhost:5000");

  socket.on("connect", () => {

    console.log("Socket Connected:", socket.id);

    setIsSocketConnected(true);

  });

  socket.on("telemetry", (data) => {

    console.log("Live Telemetry:", data);

    setTelemetry((prev) => {

      const newData = [
        ...prev,
        {
          temperature: Number(data.temperature),
          pressure: Number(data.pressure),
          rpm: Number(data.rpm),
          timestamp: data.timestamp,
        },
      ];

      // Sirf last 20 readings rakhenge
      return newData.slice(-20);

    });

  });

  socket.on("disconnect", () => {

    console.log("Socket Disconnected");

    setIsSocketConnected(false);

  });

  return () => {

    socket.disconnect();

  };

}, []);

  // =========================
  // TEST API
  // =========================

  useEffect(() => {

  axios
    .get("http://localhost:5000/api/telemetry")

    .then((res) => {

      setTelemetry(res.data);

    })

    .catch((err) => {

      console.log(err);

    });

}, []);

  // =========================
  // DASHBOARD NODES
  // =========================

  const nodes = [

    {
      name: "Turbine Sensor",
      type: "Data Source",
      status: "Active",
    },

    {
      name: "Moving Average",
      type: "Math Operation",
      status: "Ready",
    },

    {
      name: "Temperature Alert",
      type: "Action Trigger",
      status: "Ready",
    },

  ];


  // =========================
  // RETURN
  // =========================

  return (

    <div className="app">


      {/* =========================
          TOP BAR
      ========================= */}

      <header className="topbar">

        <div>

          <h1>
            NexusFlow
          </h1>

          <p>
            Visual IoT Telemetry & Rule Engine
          </p>

        </div>


        <div className="connection">

          <span className="dot"></span>

          Backend Connected

        </div>

      </header>



      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar">

        {[
          "Dashboard",
          "Rule Builder",
          "Telemetry",
          "Alerts",
        ].map((tab) => (

          <button
            key={tab}

            className={
              activeTab === tab
                ? "active"
                : ""
            }

            onClick={() =>
              setActiveTab(tab)
            }
          >

            {tab}

          </button>

        ))}

      </nav>



      {/* =========================
          MAIN
      ========================= */}

      <main className="container">


        {/* ==================================================
            DASHBOARD
        ================================================== */}

        {activeTab === "Dashboard" && (

          <>

            <section className="hero">

              <div>

                <h2>
                  IoT Rule Engine Dashboard
                </h2>

                <p>
                  Monitor telemetry, create visual rules and process sensor
                  data in real time.
                </p>

                <p>
                  <b>
                    Backend Message:
                  </b>{" "}

                  {apiMessage}

                </p>

              </div>


              <div className="live">
                ● LIVE
              </div>

            </section>



            {/* STATS */}

            <section className="stats">

              <div className="card">

                <span>
                  Telemetry Points
                </span>

                <strong>
                  12,480
                </strong>

                <small>
                  Live incoming data
                </small>

              </div>


              <div className="card">

                <span>
                  Active Rules
                </span>

                <strong>
                  08
                </strong>

                <small>
                  Rules currently running
                </small>

              </div>


              <div className="card">

                <span>
                  Alerts Today
                </span>

                <strong>
                  24
                </strong>

                <small>
                  Triggered alerts
                </small>

              </div>


              <div className="card">

                <span>
                  Processing Rate
                </span>

                <strong>
                  1,250/s
                </strong>

                <small>
                  Rows / events per second
                </small>

              </div>

            </section>



            {/* VISUAL RULE PIPELINE */}

            <section className="panel">

              <div className="panel-title">

                <div>

                  <h3>
                    Visual Rule Pipeline
                  </h3>

                  <p>
                    Sensor → Processing → Action
                  </p>

                </div>


                <button
                  className="primary"

                  onClick={() =>
                    setActiveTab(
                      "Rule Builder"
                    )
                  }
                >

                  + Create Rule

                </button>

              </div>


              <div className="pipeline">

                {nodes.map(
                  (node, index) => (

                    <div
                      className="pipeline-item"
                      key={node.name}
                    >

                      <div className="node">

                        <div className="node-icon">

                          {
                            index === 0
                              ? "S"
                              : index === 1
                              ? "M"
                              : "A"
                          }

                        </div>


                        <div>

                          <h4>
                            {node.name}
                          </h4>

                          <p>
                            {node.type}
                          </p>

                          <span className="status">
                            {node.status}
                          </span>

                        </div>

                      </div>


                      {index <
                        nodes.length - 1 && (

                        <div className="arrow">
                          →
                        </div>

                      )}

                    </div>

                  )
                )}

              </div>

            </section>



            {/* BOTTOM GRID */}

            <section className="bottom-grid">


              <div className="panel">

                <h3>
                  Live Telemetry
                </h3>


                <div className="telemetry-row">

                  <span>
                    Temperature
                  </span>
                      <strong>
  {telemetry.length > 0
    ? telemetry[telemetry.length - 1].temperature
    : "--"} °C
</strong>

                  <span className="warning">
                    High
                  </span>

                </div>


                <div className="telemetry-row">

                  <span>
                    Pressure
                  </span>
            <strong>
  {telemetry.length > 0
    ? telemetry[telemetry.length - 1].pressure
    : "--"} PSI
</strong>

                  <span className="normal">
                    Normal
                  </span>

                </div>


                <div className="telemetry-row">

                  <span>
                    RPM
                  </span>

                  <strong>
  {telemetry.length > 0
    ? telemetry[telemetry.length - 1].rpm
    : "--"}
</strong>

                  <span className="normal">
                    Normal
                  </span>

                </div>

              </div>



              <div className="panel">

                <h3>
                  Recent Alerts
                </h3>


                <div className="alert">

                  <span className="alert-icon">
                    !
                  </span>

                  <div>

                    <strong>
                      High Temperature
                    </strong>

                    <p>
                      Turbine temperature crossed 80 °C
                    </p>

                  </div>

                </div>


                <div className="alert">

                  <span className="alert-icon">
                    !
                  </span>

                  <div>

                    <strong>
                      Rule Triggered
                    </strong>

                    <p>
                      Moving average exceeded threshold
                    </p>

                  </div>

                </div>

              </div>

            </section>

          </>

        )}



        {/* ==================================================
            RULE BUILDER
        ================================================== */}

        {activeTab === "Rule Builder" && (

          <section className="panel page-panel">

            <h2>
              Visual Rule Builder
            </h2>

            <p className="muted">

              Build your IoT logic using Data Sources,
              Math Operations and Action Triggers.

            </p>



            {/* REACT FLOW AREA */}

            <div
              style={{
                height: "500px",
                border: "1px solid #333",
                position: "relative",
                zIndex: 1,
              }}
            >


              {/* NODE SIDEBAR */}

              <div className="node-sidebar">


                {/* SENSOR */}

                <div
                  draggable

                  onDragStart={(event) => {

                    event.dataTransfer.setData(
                      "application/reactflow",
                      "sensor"
                    );

                  }}

                  className="drag-node"
                >

                  📡 Sensor Node

                </div>



                {/* FILTER */}

                <div
                  draggable

                  onDragStart={(event) => {

                    event.dataTransfer.setData(
                      "application/reactflow",
                      "filter"
                    );

                  }}

                  className="drag-node"
                >

                  ⚙️ Filter Node

                </div>



                {/* ALERT */}

                <div
                  draggable

                  onDragStart={(event) => {

                    event.dataTransfer.setData(
                      "application/reactflow",
                      "alert"
                    );

                  }}

                  className="drag-node"
                >

                  🚨 Alert Node

                </div>

              </div>



              {/* =========================
                  REACT FLOW
              ========================= */}

              <ReactFlow

                nodes={flowNodes}

                edges={flowEdges}

                nodeTypes={nodeTypes}

                onNodesChange={
                  onNodesChange
                }

                onEdgesChange={
                  onEdgesChange
                }

                onConnect={
                  onConnect
                }

                onDrop={
                  onDrop
                }

                onDragOver={
                  onDragOver
                }


                // SELECT NODE

                onNodeClick={(
                  event,
                  node
                ) => {

                  setSelectedNode(
                    node.id
                  );

                }}


                fitView

              >

                <Background />

                <Controls />

              </ReactFlow>


            </div>



            {/* =========================
                BUTTONS
            ========================= */}

            <div className="rule-buttons">


              {/* ADD */}

              <button
                className="primary"

                onClick={
                  addSensorNode
                }
              >

                + Add Sensor Node

              </button>



              {/* REMOVE */}

              <button
                className="primary"

                onClick={
                  removeSensorNode
                }
              >

                - Remove Sensor Node

              </button>



              {/* DELETE */}

              <button
                className="primary"

                onClick={
                  deleteSelectedNode
                }
              >

                🗑️ Delete Selected Node

              </button>



              {/* SAVE */}

              <button
                className="primary"

                onClick={
                  saveRuleAsJSON
                }
              >

                💾 Save Rule

              </button>



              {/* BACK */}

              <button
                className="primary"

                onClick={() =>
                  setActiveTab(
                    "Dashboard"
                  )
                }
              >

                ← Back to Dashboard

              </button>


            </div>

          </section>

        )}



        {/* ==================================================
            TELEMETRY
        ================================================== */}

        {activeTab === "Telemetry" && (

          <section className="panel page-panel">

            <h2>
              Live Telemetry
            </h2>

            <p className="muted">

              Real-time machine telemetry will appear here.

            </p>


            <div className="telemetry-large">

              <div>

                <span>
                  Temperature
                </span>

            <strong>
  {telemetry.length > 0
    ? telemetry[telemetry.length - 1].temperature
    : "--"} °C
</strong>
              </div>
              

 <div style={{ width: "100%", height: "300px" }}>
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={telemetry}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timestamp" />
      <YAxis />
      <Tooltip />

      <Line
        type="monotone"
        dataKey="temperature"
        stroke="#ff4d4d"
        strokeWidth={3}
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
  </ResponsiveContainer>
</div>

              <div>

                <span>
                  Pressure
                </span>

             <strong>
  {telemetry.length > 0
    ? telemetry[telemetry.length - 1].pressure
    : "--"} PSI
</strong>

              </div>


              <div>

                <span>
                  RPM
                </span>

                <strong>
  {telemetry.length > 0
    ? telemetry[telemetry.length - 1].rpm
    : "--"}
</strong>

              </div>


              <div>

                <span>
                  Events/sec
                </span>

                <strong>
                  1,250
                </strong>

              </div>

            </div>

          </section>

        )}



        {/* ==================================================
            ALERTS
        ================================================== */}

        {activeTab === "Alerts" && (

          <section className="panel page-panel">

            <h2>
              Alerts & Notifications
            </h2>



            <div className="alert full">

              <span className="alert-icon">
                !
              </span>

              <div>

                <strong>
                  High Temperature Alert
                </strong>

                <p>

                  Turbine Sensor temperature is above the configured
                  threshold.

                </p>

              </div>

            </div>



            <div className="alert full">

              <span className="alert-icon">
                !
              </span>

              <div>

                <strong>
                  Rule Execution Completed
                </strong>

                <p>

                  The temperature rule has successfully executed.

                </p>

              </div>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}


export default App;
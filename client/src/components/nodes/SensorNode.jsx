import { Handle, Position } from "reactflow";

export default function SensorNode() {
  return (
    <div style={{ padding: 10, border: "2px solid blue", borderRadius: 10 }}>
      🌡️ Sensor
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
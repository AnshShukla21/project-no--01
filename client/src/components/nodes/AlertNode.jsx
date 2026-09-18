import { Handle, Position } from "reactflow";

export default function AlertNode() {
  return (
    <div style={{ padding: 10, border: "2px solid red", borderRadius: 10 }}>
      🚨 Alert
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
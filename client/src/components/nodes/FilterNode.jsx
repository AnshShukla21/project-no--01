import { Handle, Position } from "reactflow";

export default function FilterNode() {
  return (
    <div style={{ padding: 10, border: "2px solid orange", borderRadius: 10 }}>
      🔄 Filter
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
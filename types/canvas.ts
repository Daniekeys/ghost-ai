import type { Node, Edge } from "@xyflow/react";

export interface NodeColorPair {
  background: string;
  text: string;
}

export const NODE_COLORS: NodeColorPair[] = [
  { background: "#1F1F1F", text: "#EDEDED" },
  { background: "#10233D", text: "#52A8FF" },
  { background: "#2E1938", text: "#BF7AF0" },
  { background: "#331B00", text: "#FF990A" },
  { background: "#3C1618", text: "#FF6166" },
  { background: "#3A1726", text: "#F75F8F" },
  { background: "#0F2E18", text: "#62C073" },
  { background: "#062822", text: "#0AC7B4" },
];

export const DEFAULT_NODE_COLOR = NODE_COLORS[0];

export interface CanvasNodeData extends Record<string, unknown> {
  label: string;
  color?: string;
  textColor?: string;
  shape?: string;
  width?: number;
  height?: number;
}

export interface CanvasEdgeData extends Record<string, unknown> {
  label?: string;
}

export type CanvasNode = Node<CanvasNodeData, "canvasNode">;
export type CanvasEdge = Edge<CanvasEdgeData, "canvasEdge">;

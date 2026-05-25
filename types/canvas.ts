import type { Node, Edge } from "@xyflow/react";

export interface CanvasNodeData extends Record<string, unknown> {
  label: string;
  color?: string;
  shape?: string;
  width?: number;
  height?: number;
}

export interface CanvasEdgeData extends Record<string, unknown> {}

export type CanvasNode = Node<CanvasNodeData, "canvasNode">;
export type CanvasEdge = Edge<CanvasEdgeData, "canvasEdge">;

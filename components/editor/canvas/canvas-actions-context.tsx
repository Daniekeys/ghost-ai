"use client";

import { createContext, useContext } from "react";
import type { OnEdgesChange, OnNodesChange } from "@xyflow/react";
import type { CanvasEdge, CanvasNode } from "@/types/canvas";

interface CanvasActionsContextValue {
  onNodesChange: OnNodesChange<CanvasNode>;
  onEdgesChange: OnEdgesChange<CanvasEdge>;
}

export const CanvasActionsContext =
  createContext<CanvasActionsContextValue | null>(null);

export function useCanvasActions(): CanvasActionsContextValue {
  const ctx = useContext(CanvasActionsContext);
  if (!ctx) throw new Error("useCanvasActions must be used inside CanvasFlow");
  return ctx;
}

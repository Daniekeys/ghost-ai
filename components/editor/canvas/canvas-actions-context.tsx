"use client";

import { createContext, useContext } from "react";
import type { OnNodesChange } from "@xyflow/react";
import type { CanvasNode } from "@/types/canvas";

interface CanvasActionsContextValue {
  onNodesChange: OnNodesChange<CanvasNode>;
}

export const CanvasActionsContext =
  createContext<CanvasActionsContextValue | null>(null);

export function useCanvasActions(): CanvasActionsContextValue {
  const ctx = useContext(CanvasActionsContext);
  if (!ctx) throw new Error("useCanvasActions must be used inside CanvasFlow");
  return ctx;
}

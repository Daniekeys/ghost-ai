"use client";

import { useEffect } from "react";
import type { ReactFlowInstance } from "@xyflow/react";
import type { CanvasEdge, CanvasNode } from "@/types/canvas";

interface UseKeyboardShortcutsOptions {
  flow: ReactFlowInstance<CanvasNode, CanvasEdge>;
  undo: () => void;
  redo: () => void;
  onDelete: (params: { nodes: CanvasNode[]; edges: CanvasEdge[] }) => void;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    target.isContentEditable ||
    Boolean(target.closest("[contenteditable='true']"))
  );
}

export function useKeyboardShortcuts({
  flow,
  undo,
  redo,
  onDelete,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return;

      const key = event.key.toLowerCase();
      const hasCommandModifier = event.metaKey || event.ctrlKey;

      if (hasCommandModifier && key === "z") {
        event.preventDefault();
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      if (hasCommandModifier && key === "y") {
        event.preventDefault();
        redo();
        return;
      }

      if (event.altKey || event.metaKey || event.ctrlKey) return;

      if (event.key === "Delete") {
        const selectedNodes = flow.getNodes().filter((n) => n.selected);
        const selectedEdges = flow.getEdges().filter((e) => e.selected);
        if (selectedNodes.length > 0 || selectedEdges.length > 0) {
          event.preventDefault();
          onDelete({ nodes: selectedNodes, edges: selectedEdges });
        }
        return;
      }

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        void flow.zoomIn({ duration: 160 });
        return;
      }

      if (event.key === "-") {
        event.preventDefault();
        void flow.zoomOut({ duration: 160 });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flow, onDelete, redo, undo]);
}

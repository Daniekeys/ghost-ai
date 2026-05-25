"use client";

import { Panel } from "@xyflow/react";
import type { ReactFlowInstance } from "@xyflow/react";
import { Maximize2, Redo2, Undo2, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CanvasEdge, CanvasNode } from "@/types/canvas";

interface CanvasControlBarProps {
  flow: ReactFlowInstance<CanvasNode, CanvasEdge>;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

interface ControlButtonProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ControlButton({
  label,
  disabled = false,
  onClick,
  children,
}: ControlButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex size-9 items-center justify-center rounded-full text-copy-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
        "hover:bg-subtle hover:text-copy-primary",
        disabled && "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-copy-muted",
      )}
    >
      {children}
    </button>
  );
}

export function CanvasControlBar({
  flow,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: CanvasControlBarProps) {
  return (
    <Panel position="bottom-left" style={{ marginBottom: "1.5rem" }}>
      <div className="nodrag nopan nowheel flex items-center gap-1 rounded-full border border-surface-border bg-elevated px-2 py-1.5 shadow-lg">
        <div className="flex items-center gap-0.5">
          <ControlButton
            label="Zoom out"
            onClick={() => void flow.zoomOut({ duration: 160 })}
          >
            <ZoomOut className="size-4" />
          </ControlButton>
          <ControlButton
            label="Fit view"
            onClick={() => void flow.fitView({ duration: 180 })}
          >
            <Maximize2 className="size-4" />
          </ControlButton>
          <ControlButton
            label="Zoom in"
            onClick={() => void flow.zoomIn({ duration: 160 })}
          >
            <ZoomIn className="size-4" />
          </ControlButton>
        </div>
        <div className="h-6 w-px bg-surface-border" />
        <div className="flex items-center gap-0.5">
          <ControlButton label="Undo" disabled={!canUndo} onClick={onUndo}>
            <Undo2 className="size-4" />
          </ControlButton>
          <ControlButton label="Redo" disabled={!canRedo} onClick={onRedo}>
            <Redo2 className="size-4" />
          </ControlButton>
        </div>
      </div>
    </Panel>
  );
}

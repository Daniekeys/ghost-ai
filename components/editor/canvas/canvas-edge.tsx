"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
} from "@xyflow/react";
import type { EdgeProps, EdgeReplaceChange } from "@xyflow/react";
import { cn } from "@/lib/utils";
import type { CanvasEdge } from "@/types/canvas";
import { useCanvasActions } from "./canvas-actions-context";

function EdgeLabelInput({
  value,
  onChange,
  onCommit,
  onCancel,
}: {
  value: string;
  onChange: (value: string) => void;
  onCommit: () => void;
  onCancel: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  return (
    <input
      ref={inputRef}
      value={value}
      size={Math.max(value.length, 2)}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onCommit}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onCancel();
        } else if (event.key === "Enter") {
          event.preventDefault();
          onCommit();
        }
      }}
      onPointerDown={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
      className="nodrag nopan nowheel h-7 rounded-xl border border-surface-border bg-elevated px-2 text-center text-xs text-copy-primary shadow-lg outline-none transition-[width,border-color] focus:border-brand"
      style={{ minWidth: 32 }}
    />
  );
}

export function CanvasEdgeComponent({
  id,
  data,
  selected,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}: EdgeProps<CanvasEdge>) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const { getEdge } = useReactFlow();
  const { onEdgesChange } = useCanvasActions();

  const label = typeof data?.label === "string" ? data.label : "";
  const isActive = selected || isHovered || isEditing;
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
    offset: 24,
  });

  const commitEdit = useCallback(() => {
    setIsEditing(false);
    const current = getEdge(id) as CanvasEdge | undefined;
    if (!current) return;

    const change: EdgeReplaceChange<CanvasEdge> = {
      type: "replace",
      id,
      item: {
        ...current,
        data: {
          ...current.data,
          label: editValue.trim(),
        },
      },
    };

    onEdgesChange([change]);
  }, [editValue, getEdge, id, onEdgesChange]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditValue(label);
  }, [label]);

  const startEditing = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      setEditValue(label);
      setIsEditing(true);
    },
    [label],
  );

  return (
    <g
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={startEditing}
    >
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        interactionWidth={28}
        style={{
          stroke: "var(--text-primary)",
          strokeWidth: 1.75,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          opacity: isActive ? 0.95 : 0.5,
          transition: "opacity 120ms ease, stroke-width 120ms ease",
        }}
      />
      <EdgeLabelRenderer>
        {(isEditing || label) && (
          <div
            className="nodrag nopan nowheel absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
            onPointerDown={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
            onDoubleClick={startEditing}
          >
            {isEditing ? (
              <EdgeLabelInput
                value={editValue}
                onChange={setEditValue}
                onCommit={commitEdit}
                onCancel={cancelEdit}
              />
            ) : (
              <button
                type="button"
                className={cn(
                  "rounded-xl border border-surface-border bg-elevated px-2 py-1 text-xs text-copy-secondary shadow-sm transition-colors",
                  isActive && "border-brand text-copy-primary",
                )}
                onClick={(event) => event.stopPropagation()}
                onDoubleClick={startEditing}
              >
                {label}
              </button>
            )}
          </div>
        )}
      </EdgeLabelRenderer>
    </g>
  );
}

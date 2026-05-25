"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Handle, Position, NodeResizer, useReactFlow } from "@xyflow/react";
import type { NodeProps, NodeReplaceChange } from "@xyflow/react";
import { cn } from "@/lib/utils";
import type { CanvasNode } from "@/types/canvas";
import { useCanvasActions } from "./canvas-actions-context";

const FILL = "var(--bg-elevated)";
const STROKE_DEFAULT = "var(--border-default)";
const STROKE_SELECTED = "var(--accent-primary)";

const MIN_WIDTH = 60;
const MIN_HEIGHT = 40;

const RESIZER_HANDLE_STYLE: React.CSSProperties = {
  width: 8,
  height: 8,
  background: "var(--bg-elevated)",
  border: "1.5px solid var(--accent-primary)",
  borderRadius: 2,
};

const RESIZER_LINE_STYLE: React.CSSProperties = {
  borderColor: "var(--accent-primary)",
  borderWidth: 1,
  opacity: 0.5,
};

function Handles() {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </>
  );
}

function DiamondSvg({ w, h, stroke }: { w: number; h: number; stroke: string }) {
  const cx = w / 2;
  const cy = h / 2;
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polygon
        points={`${cx},1 ${w - 1},${cy} ${cx},${h - 1} 1,${cy}`}
        fill={FILL}
        stroke={stroke}
        strokeWidth="1.5"
      />
    </svg>
  );
}

function HexagonSvg({ w, h, stroke }: { w: number; h: number; stroke: string }) {
  const pad = 1;
  const iw = w - pad * 2;
  const ih = h - pad * 2;
  const points = [
    [pad + iw / 4, pad],
    [pad + (iw * 3) / 4, pad],
    [pad + iw, pad + ih / 2],
    [pad + (iw * 3) / 4, pad + ih],
    [pad + iw / 4, pad + ih],
    [pad, pad + ih / 2],
  ]
    .map(([x, y]) => `${x},${y}`)
    .join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polygon points={points} fill={FILL} stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

function CylinderSvg({ w, h, stroke }: { w: number; h: number; stroke: string }) {
  const rx = (w - 2) / 2;
  const ry = Math.max(10, h * 0.15);
  const cx = w / 2;
  const topY = ry + 1;
  const botY = h - ry - 1;
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <path
        d={`M 1,${topY} L 1,${botY} A ${rx},${ry} 0 0 0 ${w - 1},${botY} L ${w - 1},${topY}`}
        fill={FILL}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <ellipse
        cx={cx}
        cy={topY}
        rx={rx - 0.75}
        ry={ry}
        fill={FILL}
        stroke={stroke}
        strokeWidth="1.5"
      />
    </svg>
  );
}

function EditingTextarea({
  nodeId,
  value,
  height,
  onChange,
  onCommit,
  onCancel,
  textareaRef,
}: {
  nodeId: string;
  value: string;
  height: number;
  onChange: (v: string) => void;
  onCommit: () => void;
  onCancel: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const paddingTop = Math.max(4, Math.floor((height - 22) / 2));

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onCommit}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onCancel();
        } else if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onCommit();
        }
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className="nodrag nopan nowheel"
      style={{
        position: "absolute",
        inset: 0,
        paddingTop,
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 4,
        resize: "none",
        background: "transparent",
        border: "none",
        outline: "none",
        color: "var(--text-copy-primary)",
        fontSize: "0.875rem",
        textAlign: "center",
        overflow: "hidden",
        zIndex: 10,
        // prevent the textarea from being transparent to clicks that would deselect
        pointerEvents: "all",
      }}
      rows={1}
      data-node-id={nodeId}
    />
  );
}

export function CanvasNodeComponent({
  id,
  data,
  selected,
  width: nodeWidth,
  height: nodeHeight,
}: NodeProps<CanvasNode>) {
  const width = nodeWidth ?? data.width ?? 160;
  const height = nodeHeight ?? data.height ?? 80;
  const shape = data.shape ?? "rectangle";
  const stroke = selected ? STROKE_SELECTED : STROKE_DEFAULT;

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.label);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { onNodesChange } = useCanvasActions();
  const { getNode } = useReactFlow();

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setEditValue(data.label);
      setIsEditing(true);
    },
    [data.label],
  );

  const commitEdit = useCallback(() => {
    setIsEditing(false);
    const current = getNode(id) as CanvasNode | undefined;
    if (!current) return;
    const change: NodeReplaceChange<CanvasNode> = {
      type: "replace",
      id,
      item: { ...current, data: { ...current.data, label: editValue } },
    };
    onNodesChange([change]);
  }, [id, editValue, getNode, onNodesChange]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditValue(data.label);
  }, [data.label]);

  const editingProps = {
    nodeId: id,
    value: editValue,
    height,
    onChange: setEditValue,
    onCommit: commitEdit,
    onCancel: cancelEdit,
    textareaRef,
  };

  if (shape === "rectangle" || shape === "pill" || shape === "circle") {
    return (
      <div
        className={cn(
          "flex items-center justify-center border bg-elevated text-sm px-3 py-2 select-none",
          shape === "rectangle" ? "rounded-xl" : "rounded-full",
          selected ? "border-brand" : "border-surface-border",
        )}
        style={{ width, height, position: "relative" }}
      >
        <NodeResizer
          isVisible={selected}
          minWidth={MIN_WIDTH}
          minHeight={MIN_HEIGHT}
          handleStyle={RESIZER_HANDLE_STYLE}
          lineStyle={RESIZER_LINE_STYLE}
        />
        <Handles />
        <span
          className={cn(
            "text-sm select-none",
            isEditing && "invisible",
            data.label ? "text-copy-primary" : "text-copy-faint italic",
          )}
          onDoubleClick={handleDoubleClick}
        >
          {data.label || "Label"}
        </span>
        {isEditing && <EditingTextarea {...editingProps} />}
      </div>
    );
  }

  return (
    <div style={{ width, height, position: "relative" }}>
      <NodeResizer
        isVisible={selected}
        minWidth={MIN_WIDTH}
        minHeight={MIN_HEIGHT}
        handleStyle={RESIZER_HANDLE_STYLE}
        lineStyle={RESIZER_LINE_STYLE}
      />
      <Handles />
      {shape === "diamond" && <DiamondSvg w={width} h={height} stroke={stroke} />}
      {shape === "hexagon" && <HexagonSvg w={width} h={height} stroke={stroke} />}
      {shape === "cylinder" && <CylinderSvg w={width} h={height} stroke={stroke} />}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <span
          className={cn(
            "text-sm select-none",
            isEditing && "invisible",
            data.label ? "text-copy-primary" : "text-copy-faint italic",
          )}
          style={{ pointerEvents: "auto" }}
          onDoubleClick={handleDoubleClick}
        >
          {data.label || "Label"}
        </span>
      </div>
      {isEditing && <EditingTextarea {...editingProps} />}
    </div>
  );
}

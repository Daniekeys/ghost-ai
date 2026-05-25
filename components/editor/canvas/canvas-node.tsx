"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Handle,
  Position,
  NodeResizer,
  NodeToolbar,
  useReactFlow,
} from "@xyflow/react";
import type { NodeProps, NodeReplaceChange } from "@xyflow/react";
import { cn } from "@/lib/utils";
import {
  DEFAULT_NODE_COLOR,
  NODE_COLORS,
  type CanvasNode,
  type NodeColorPair,
} from "@/types/canvas";
import { useCanvasActions } from "./canvas-actions-context";

const STROKE_DEFAULT = "var(--border-subtle)";
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

const HANDLE_STYLE: React.CSSProperties = {
  width: 8,
  height: 8,
  background: "var(--text-primary)",
  border: "1.5px solid var(--bg-base)",
};

function Handles() {
  const handles = [
    { id: "top", position: Position.Top },
    { id: "right", position: Position.Right },
    { id: "bottom", position: Position.Bottom },
    { id: "left", position: Position.Left },
  ];

  return (
    <>
      {handles.map((handle) => (
        <Handle
          key={handle.id}
          id={handle.id}
          type="source"
          position={handle.position}
          className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          style={HANDLE_STYLE}
        />
      ))}
    </>
  );
}

function DiamondSvg({
  w,
  h,
  fill,
  stroke,
}: {
  w: number;
  h: number;
  fill: string;
  stroke: string;
}) {
  const cx = w / 2;
  const cy = h / 2;
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polygon
        points={`${cx},1 ${w - 1},${cy} ${cx},${h - 1} 1,${cy}`}
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
    </svg>
  );
}

function HexagonSvg({
  w,
  h,
  fill,
  stroke,
}: {
  w: number;
  h: number;
  fill: string;
  stroke: string;
}) {
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
      <polygon points={points} fill={fill} stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

function CylinderSvg({
  w,
  h,
  fill,
  stroke,
}: {
  w: number;
  h: number;
  fill: string;
  stroke: string;
}) {
  const rx = (w - 2) / 2;
  const ry = Math.max(10, h * 0.15);
  const cx = w / 2;
  const topY = ry + 1;
  const botY = h - ry - 1;
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <path
        d={`M 1,${topY} L 1,${botY} A ${rx},${ry} 0 0 0 ${w - 1},${botY} L ${w - 1},${topY}`}
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <ellipse
        cx={cx}
        cy={topY}
        rx={rx - 0.75}
        ry={ry}
        fill={fill}
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
  textColor,
  onChange,
  onCommit,
  onCancel,
  textareaRef,
}: {
  nodeId: string;
  value: string;
  height: number;
  textColor: string;
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
        color: textColor,
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

function ColorToolbar({
  selectedColor,
  selectedTextColor,
  onSelect,
}: {
  selectedColor: string;
  selectedTextColor: string;
  onSelect: (pair: NodeColorPair) => void;
}) {
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  return (
    <NodeToolbar
      isVisible
      position={Position.Top}
      offset={12}
      className="nodrag nopan nowheel"
    >
      <div
        className="flex items-center gap-1 rounded-full border border-surface-border bg-elevated px-2 py-1.5 shadow-lg"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {NODE_COLORS.map((pair) => {
          const isActive =
            selectedColor === pair.background && selectedTextColor === pair.text;
          const isHovered = hoveredColor === pair.background;

          return (
            <button
              key={`${pair.background}-${pair.text}`}
              type="button"
              aria-label={`Set node color ${pair.background}`}
              title={`Set node color ${pair.background}`}
              className="flex size-6 items-center justify-center rounded-full border transition-[box-shadow,transform,border-color] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              style={{
                background: pair.background,
                borderColor: isActive ? pair.text : "var(--border-subtle)",
                boxShadow: isActive
                  ? `0 0 0 2px ${pair.text}`
                  : isHovered
                    ? `0 0 0 3px ${pair.text}40`
                    : "none",
              }}
              onMouseEnter={() => setHoveredColor(pair.background)}
              onMouseLeave={() => setHoveredColor(null)}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(pair);
              }}
            >
              <span
                className="block size-2 rounded-full"
                style={{ background: pair.text }}
              />
            </button>
          );
        })}
      </div>
    </NodeToolbar>
  );
}

export function CanvasNodeComponent({
  id,
  data,
  selected,
  width: nodeWidth,
  height: nodeHeight,
}: NodeProps<CanvasNode>) {
  const [resizePreview, setResizePreview] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const width = resizePreview?.width ?? data.width ?? nodeWidth ?? 160;
  const height = resizePreview?.height ?? data.height ?? nodeHeight ?? 80;
  const shape = data.shape ?? "rectangle";
  const stroke = selected ? STROKE_SELECTED : STROKE_DEFAULT;
  const fill = data.color ?? DEFAULT_NODE_COLOR.background;
  const textColor = data.textColor ?? DEFAULT_NODE_COLOR.text;

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

  const selectColor = useCallback(
    (pair: NodeColorPair) => {
      const current = getNode(id) as CanvasNode | undefined;
      if (!current) return;
      const change: NodeReplaceChange<CanvasNode> = {
        type: "replace",
        id,
        item: {
          ...current,
          data: {
            ...current.data,
            color: pair.background,
            textColor: pair.text,
          },
        },
      };
      onNodesChange([change]);
    },
    [id, getNode, onNodesChange],
  );

  const handleResize = useCallback(
    (_: unknown, params: { width: number; height: number }) => {
      setResizePreview({ width: params.width, height: params.height });
    },
    [],
  );

  const handleResizeEnd = useCallback(
    (_: unknown, params: { width: number; height: number }) => {
      setResizePreview(null);
      const current = getNode(id) as CanvasNode | undefined;
      if (!current) return;

      const change: NodeReplaceChange<CanvasNode> = {
        type: "replace",
        id,
        item: {
          ...current,
          width: params.width,
          height: params.height,
          data: {
            ...current.data,
            width: params.width,
            height: params.height,
          },
        },
      };
      onNodesChange([change]);
    },
    [id, getNode, onNodesChange],
  );

  const editingProps = {
    nodeId: id,
    value: editValue,
    height,
    textColor,
    onChange: setEditValue,
    onCommit: commitEdit,
    onCancel: cancelEdit,
    textareaRef,
  };

  if (shape === "rectangle" || shape === "pill" || shape === "circle") {
    return (
      <div
        className={cn(
          "group flex items-center justify-center border text-sm px-3 py-2 select-none",
          shape === "rectangle" ? "rounded-xl" : "rounded-full",
          selected ? "border-brand" : "border-surface-border",
        )}
        style={{
          width,
          height,
          position: "relative",
          background: fill,
          borderColor: selected ? "var(--accent-primary)" : "var(--border-subtle)",
        }}
      >
        {selected && (
          <ColorToolbar
            selectedColor={fill}
            selectedTextColor={textColor}
            onSelect={selectColor}
          />
        )}
        <NodeResizer
          isVisible={selected}
          minWidth={MIN_WIDTH}
          minHeight={MIN_HEIGHT}
          handleStyle={RESIZER_HANDLE_STYLE}
          lineStyle={RESIZER_LINE_STYLE}
          onResize={handleResize}
          onResizeEnd={handleResizeEnd}
        />
        <Handles />
        <span
          className={cn(
            "text-sm select-none",
            isEditing && "invisible",
            !data.label && "italic",
          )}
          style={{
            color: textColor,
            opacity: data.label ? 1 : 0.72,
          }}
          onDoubleClick={handleDoubleClick}
        >
          {data.label || "Label"}
        </span>
        {isEditing && <EditingTextarea {...editingProps} />}
      </div>
    );
  }

  return (
    <div className="group" style={{ width, height, position: "relative" }}>
      {selected && (
        <ColorToolbar
          selectedColor={fill}
          selectedTextColor={textColor}
          onSelect={selectColor}
        />
      )}
      <NodeResizer
        isVisible={selected}
        minWidth={MIN_WIDTH}
        minHeight={MIN_HEIGHT}
        handleStyle={RESIZER_HANDLE_STYLE}
        lineStyle={RESIZER_LINE_STYLE}
        onResize={handleResize}
        onResizeEnd={handleResizeEnd}
      />
      <Handles />
      {shape === "diamond" && (
        <DiamondSvg w={width} h={height} fill={fill} stroke={stroke} />
      )}
      {shape === "hexagon" && (
        <HexagonSvg w={width} h={height} fill={fill} stroke={stroke} />
      )}
      {shape === "cylinder" && (
        <CylinderSvg w={width} h={height} fill={fill} stroke={stroke} />
      )}
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
            !data.label && "italic",
          )}
          style={{
            pointerEvents: "auto",
            color: textColor,
            opacity: data.label ? 1 : 0.72,
          }}
          onDoubleClick={handleDoubleClick}
        >
          {data.label || "Label"}
        </span>
      </div>
      {isEditing && <EditingTextarea {...editingProps} />}
    </div>
  );
}

"use client";

import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import type { CanvasNode } from "@/types/canvas";

const FILL = "var(--bg-elevated)";
const STROKE_DEFAULT = "var(--border-default)";
const STROKE_SELECTED = "var(--accent-primary)";

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

function NodeLabel({ label }: { label: string }) {
  return (
    <span
      className={cn(
        "text-sm select-none",
        label ? "text-copy-primary" : "text-copy-faint italic",
      )}
    >
      {label || ""}
    </span>
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

export function CanvasNodeComponent({ data, selected }: NodeProps<CanvasNode>) {
  const width = data.width ?? 160;
  const height = data.height ?? 80;
  const shape = data.shape ?? "rectangle";
  const stroke = selected ? STROKE_SELECTED : STROKE_DEFAULT;

  if (shape === "rectangle" || shape === "pill" || shape === "circle") {
    return (
      <div
        className={cn(
          "flex items-center justify-center border bg-elevated text-sm px-3 py-2 select-none",
          shape === "rectangle" ? "rounded-xl" : "rounded-full",
          selected ? "border-brand" : "border-surface-border",
        )}
        style={{ width, height }}
      >
        <Handles />
        <NodeLabel label={data.label} />
      </div>
    );
  }

  return (
    <div style={{ width, height, position: "relative" }}>
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
        <NodeLabel label={data.label} />
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Panel } from "@xyflow/react";
import {
  RectangleHorizontal,
  Diamond,
  Circle,
  Pill,
  Cylinder,
  Hexagon,
} from "lucide-react";
import type { LucideProps } from "lucide-react";

export interface ShapeDragPayload {
  shape: string;
  width: number;
  height: number;
}

interface ShapeConfig {
  shape: string;
  label: string;
  icon: React.ComponentType<LucideProps>;
  width: number;
  height: number;
}

const SHAPES: ShapeConfig[] = [
  { shape: "rectangle", label: "Rectangle", icon: RectangleHorizontal, width: 160, height: 80 },
  { shape: "diamond",   label: "Diamond",   icon: Diamond,             width: 140, height: 120 },
  { shape: "circle",    label: "Circle",    icon: Circle,              width: 80,  height: 80 },
  { shape: "pill",      label: "Pill",      icon: Pill,                width: 160, height: 64 },
  { shape: "cylinder",  label: "Cylinder",  icon: Cylinder,            width: 100, height: 100 },
  { shape: "hexagon",   label: "Hexagon",   icon: Hexagon,             width: 120, height: 120 },
];

const FILL = "var(--bg-elevated)";
const STROKE = "var(--accent-primary)";

function GhostShape({ shape, width: w, height: h }: { shape: string; width: number; height: number }) {
  if (shape === "rectangle") {
    return (
      <div
        style={{
          width: w,
          height: h,
          background: FILL,
          border: `1.5px solid ${STROKE}`,
          borderRadius: 12,
        }}
      />
    );
  }
  if (shape === "pill") {
    return (
      <div
        style={{
          width: w,
          height: h,
          background: FILL,
          border: `1.5px solid ${STROKE}`,
          borderRadius: 9999,
        }}
      />
    );
  }
  if (shape === "circle") {
    return (
      <div
        style={{
          width: w,
          height: h,
          background: FILL,
          border: `1.5px solid ${STROKE}`,
          borderRadius: "50%",
        }}
      />
    );
  }
  if (shape === "diamond") {
    const cx = w / 2;
    const cy = h / 2;
    return (
      <svg width={w} height={h}>
        <polygon
          points={`${cx},1 ${w - 1},${cy} ${cx},${h - 1} 1,${cy}`}
          fill={FILL}
          stroke={STROKE}
          strokeWidth="1.5"
        />
      </svg>
    );
  }
  if (shape === "hexagon") {
    const pad = 1, iw = w - 2, ih = h - 2;
    const pts = [
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
      <svg width={w} height={h}>
        <polygon points={pts} fill={FILL} stroke={STROKE} strokeWidth="1.5" />
      </svg>
    );
  }
  if (shape === "cylinder") {
    const rx = (w - 2) / 2;
    const ry = Math.max(10, h * 0.15);
    const cx = w / 2;
    const topY = ry + 1;
    const botY = h - ry - 1;
    return (
      <svg width={w} height={h}>
        <path
          d={`M 1,${topY} L 1,${botY} A ${rx},${ry} 0 0 0 ${w - 1},${botY} L ${w - 1},${topY}`}
          fill={FILL}
          stroke={STROKE}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <ellipse
          cx={cx}
          cy={topY}
          rx={rx - 0.75}
          ry={ry}
          fill={FILL}
          stroke={STROKE}
          strokeWidth="1.5"
        />
      </svg>
    );
  }
  return null;
}

interface DraggingShape {
  shape: string;
  width: number;
  height: number;
}

export function ShapePanel() {
  const [dragging, setDragging] = useState<DraggingShape | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!dragging) return;

    function onDragOver(e: DragEvent) {
      setCursor({ x: e.clientX, y: e.clientY });
    }
    function onEnd() {
      setDragging(null);
    }

    document.addEventListener("dragover", onDragOver);
    document.addEventListener("dragend", onEnd);
    document.addEventListener("drop", onEnd);
    return () => {
      document.removeEventListener("dragover", onDragOver);
      document.removeEventListener("dragend", onEnd);
      document.removeEventListener("drop", onEnd);
    };
  }, [dragging]);

  function handleDragStart(event: React.DragEvent, config: ShapeConfig) {
    const payload: ShapeDragPayload = {
      shape: config.shape,
      width: config.width,
      height: config.height,
    };
    event.dataTransfer.setData(
      "application/ghost-shape",
      JSON.stringify(payload),
    );
    event.dataTransfer.effectAllowed = "copy";

    // Suppress browser's native ghost so our custom preview is the only visual
    const emptyImg = new Image();
    emptyImg.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    event.dataTransfer.setDragImage(emptyImg, 0, 0);

    setCursor({ x: event.clientX, y: event.clientY });
    setDragging({ shape: config.shape, width: config.width, height: config.height });
  }

  return (
    <>
      <Panel position="bottom-center" style={{ marginBottom: "1.5rem" }}>
        <div className="flex items-center gap-0.5 rounded-full bg-elevated border border-surface-border shadow-lg px-2 py-1.5">
          {SHAPES.map((config) => {
            const Icon = config.icon;
            return (
              <button
                key={config.shape}
                title={config.label}
                aria-label={config.label}
                draggable
                onDragStart={(e) => handleDragStart(e, config)}
                className="size-9 flex items-center justify-center rounded-full hover:bg-subtle text-copy-muted hover:text-copy-primary transition-colors cursor-grab active:cursor-grabbing"
              >
                <Icon className="size-4" />
              </button>
            );
          })}
        </div>
      </Panel>
      {dragging &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            style={{
              position: "fixed",
              left: cursor.x - dragging.width / 2,
              top: cursor.y - dragging.height / 2,
              pointerEvents: "none",
              opacity: 0.75,
              zIndex: 9999,
            }}
          >
            <GhostShape
              shape={dragging.shape}
              width={dragging.width}
              height={dragging.height}
            />
          </div>,
          document.body,
        )}
    </>
  );
}

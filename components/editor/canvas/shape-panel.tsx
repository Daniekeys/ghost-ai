"use client";

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

export function ShapePanel() {
  function handleDragStart(
    event: React.DragEvent,
    config: ShapeConfig,
  ) {
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
  }

  return (
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
  );
}

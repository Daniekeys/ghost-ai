"use client";

import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import type { CanvasNode } from "@/types/canvas";

export function CanvasNodeComponent({
  data,
  selected,
}: NodeProps<CanvasNode>) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl border bg-elevated text-sm px-3 py-2 select-none",
        selected ? "border-brand" : "border-surface-border",
      )}
      style={{
        width: data.width ? `${data.width}px` : undefined,
        height: data.height ? `${data.height}px` : undefined,
        minWidth: 80,
        minHeight: 40,
      }}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <span className={data.label ? "text-copy-primary" : "text-copy-faint italic"}>
        {data.label || ""}
      </span>
    </div>
  );
}

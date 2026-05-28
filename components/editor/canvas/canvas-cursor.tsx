"use client";

import { useOther } from "@liveblocks/react/suspense";
import { Loader2 } from "lucide-react";

interface CanvasCursorProps {
  userId: string;
  connectionId: number;
}

export function CanvasCursor({ connectionId }: CanvasCursorProps) {
  const other = useOther(connectionId, (o) => ({
    info: o.info,
    thinking: o.presence.thinking,
  }));

  if (!other) return null;

  const color = other.info?.color ?? "#6366f1";
  const name = other.info?.name ?? "Anonymous";

  return (
    <div className="relative pointer-events-none select-none">
      <svg
        width="16"
        height="18"
        viewBox="0 0 16 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        <path
          d="M1 1L1 14L4.5 10.5L7 16.5L9 15.5L6.5 9.5L11 9.5L1 1Z"
          fill={color}
          stroke="white"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <div
        className="absolute top-4 left-3 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold text-white whitespace-nowrap leading-tight"
        style={{ backgroundColor: color }}
      >
        {other.thinking && (
          <Loader2 className="size-2.5 animate-spin shrink-0" />
        )}
        <span>{name}</span>
      </div>
    </div>
  );
}

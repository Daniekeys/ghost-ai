"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CANVAS_TEMPLATES, type CanvasTemplate } from "./starter-templates";
import type { CanvasNode } from "@/types/canvas";
import { Download } from "lucide-react";

interface StarterTemplatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (template: CanvasTemplate) => void;
}

interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

const PREVIEW_WIDTH = 360;
const PREVIEW_HEIGHT = 180;
const PREVIEW_PADDING = 22;

function getNodeWidth(node: CanvasNode): number {
  return node.data.width ?? node.width ?? node.initialWidth ?? 160;
}

function getNodeHeight(node: CanvasNode): number {
  return node.data.height ?? node.height ?? node.initialHeight ?? 80;
}

function getBounds(nodes: CanvasNode[]): Bounds {
  if (nodes.length === 0) {
    return { minX: 0, minY: 0, maxX: PREVIEW_WIDTH, maxY: PREVIEW_HEIGHT };
  }

  return nodes.reduce<Bounds>(
    (bounds, node) => {
      const width = getNodeWidth(node);
      const height = getNodeHeight(node);
      return {
        minX: Math.min(bounds.minX, node.position.x),
        minY: Math.min(bounds.minY, node.position.y),
        maxX: Math.max(bounds.maxX, node.position.x + width),
        maxY: Math.max(bounds.maxY, node.position.y + height),
      };
    },
    {
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY,
    },
  );
}

function createProjector(nodes: CanvasNode[]) {
  const bounds = getBounds(nodes);
  const sourceWidth = Math.max(1, bounds.maxX - bounds.minX);
  const sourceHeight = Math.max(1, bounds.maxY - bounds.minY);
  const scale = Math.min(
    (PREVIEW_WIDTH - PREVIEW_PADDING * 2) / sourceWidth,
    (PREVIEW_HEIGHT - PREVIEW_PADDING * 2) / sourceHeight,
  );
  const offsetX = (PREVIEW_WIDTH - sourceWidth * scale) / 2;
  const offsetY = (PREVIEW_HEIGHT - sourceHeight * scale) / 2;

  return (x: number, y: number) => ({
    x: (x - bounds.minX) * scale + offsetX,
    y: (y - bounds.minY) * scale + offsetY,
  });
}

function nodeCenter(node: CanvasNode, project: ReturnType<typeof createProjector>) {
  return project(
    node.position.x + getNodeWidth(node) / 2,
    node.position.y + getNodeHeight(node) / 2,
  );
}

function PreviewNode({
  node,
  project,
}: {
  node: CanvasNode;
  project: ReturnType<typeof createProjector>;
}) {
  const position = project(node.position.x, node.position.y);
  const width = getNodeWidth(node);
  const height = getNodeHeight(node);
  const projectedSize = project(node.position.x + width, node.position.y + height);
  const w = projectedSize.x - position.x;
  const h = projectedSize.y - position.y;
  const shape = node.data.shape ?? "rectangle";
  const fill = node.data.color ?? "var(--bg-elevated)";
  const stroke = node.data.textColor ?? "var(--text-primary)";

  if (shape === "diamond") {
    const cx = position.x + w / 2;
    const cy = position.y + h / 2;
    return (
      <polygon
        points={`${cx},${position.y} ${position.x + w},${cy} ${cx},${position.y + h} ${position.x},${cy}`}
        fill={fill}
        stroke={stroke}
        strokeWidth="2"
      />
    );
  }

  if (shape === "hexagon") {
    const points = [
      [position.x + w * 0.25, position.y],
      [position.x + w * 0.75, position.y],
      [position.x + w, position.y + h * 0.5],
      [position.x + w * 0.75, position.y + h],
      [position.x + w * 0.25, position.y + h],
      [position.x, position.y + h * 0.5],
    ]
      .map(([x, y]) => `${x},${y}`)
      .join(" ");
    return <polygon points={points} fill={fill} stroke={stroke} strokeWidth="2" />;
  }

  if (shape === "cylinder") {
    const rx = w / 2;
    const ry = Math.max(4, h * 0.16);
    const cx = position.x + rx;
    const topY = position.y + ry;
    const bottomY = position.y + h - ry;
    return (
      <g>
        <path
          d={`M ${position.x},${topY} L ${position.x},${bottomY} A ${rx},${ry} 0 0 0 ${position.x + w},${bottomY} L ${position.x + w},${topY}`}
          fill={fill}
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <ellipse
          cx={cx}
          cy={topY}
          rx={rx}
          ry={ry}
          fill={fill}
          stroke={stroke}
          strokeWidth="2"
        />
      </g>
    );
  }

  return (
    <rect
      x={position.x}
      y={position.y}
      width={w}
      height={h}
      rx={shape === "circle" ? Math.min(w, h) / 2 : shape === "pill" ? h / 2 : 8}
      fill={fill}
      stroke={stroke}
      strokeWidth="2"
    />
  );
}

function TemplatePreview({ template }: { template: CanvasTemplate }) {
  const project = createProjector(template.nodes);
  const nodesById = new Map(template.nodes.map((node) => [node.id, node]));

  return (
    <svg
      viewBox={`0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}`}
      role="img"
      aria-label={`${template.name} preview`}
      className="aspect-[2/1] w-full rounded-t-2xl border-b border-surface-border bg-base"
    >
      {template.edges.map((edge) => {
        const source = nodesById.get(edge.source);
        const target = nodesById.get(edge.target);
        if (!source || !target) return null;
        const start = nodeCenter(source, project);
        const end = nodeCenter(target, project);

        return (
          <line
            key={edge.id}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="var(--text-primary)"
            strokeWidth="1.75"
            strokeLinecap="round"
            opacity="0.55"
          />
        );
      })}
      {template.nodes.map((node) => (
        <PreviewNode key={node.id} node={node} project={project} />
      ))}
    </svg>
  );
}

export function StarterTemplatesModal({
  open,
  onOpenChange,
  onImport,
}: StarterTemplatesModalProps) {
  function handleImport(template: CanvasTemplate) {
    onImport(template);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(760px,calc(100vh-2rem))] w-[min(1120px,calc(100vw-2rem))] lg:min-w-190 max-w-none gap-5 rounded-3xl border border-surface-border bg-surface p-5">
        <DialogHeader>
          <DialogTitle className="text-copy-primary">Import Template</DialogTitle>
          <DialogDescription className="text-copy-muted">
            Choose a starter template to pre-populate your canvas. Existing nodes
            and edges will be replaced.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-140">
          <div className="grid gap-4 pr-3 lg:grid-cols-3 grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))]">
            {CANVAS_TEMPLATES.map((template) => (
              <article
                key={template.id}
                className="flex min-h-90 overflow-hidden rounded-2xl border border-surface-border bg-elevated"
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <TemplatePreview template={template} />
                  <div className="flex flex-1 flex-col p-3">
                    <h3 className="text-sm font-semibold text-copy-primary">
                      {template.name}
                    </h3>
                    <p className="mt-1 flex-1 text-xs leading-relaxed text-copy-muted">
                      {template.description}
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="mt-4 w-full border-surface-border bg-transparent text-copy-primary hover:bg-subtle"
                      onClick={() => handleImport(template)}
                    >
                      <Download className="size-3.5" />
                      Import
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

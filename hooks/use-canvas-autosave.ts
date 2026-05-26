"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { CanvasNode, CanvasEdge } from "@/types/canvas";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseCanvasAutosaveOptions {
  projectId: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  debounceMs?: number;
}

interface UseCanvasAutosaveResult {
  saveStatus: SaveStatus;
  triggerSave: () => void;
}

export function useCanvasAutosave({
  projectId,
  nodes,
  edges,
  debounceMs = 2000,
}: UseCanvasAutosaveOptions): UseCanvasAutosaveResult {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { edgesRef.current = edges; }, [edges]);

  const save = useCallback(
    async (currentNodes: CanvasNode[], currentEdges: CanvasEdge[]) => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      setSaveStatus("saving");
      try {
        const res = await fetch(`/api/projects/${projectId}/canvas`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nodes: currentNodes, edges: currentEdges }),
        });
        if (!res.ok) throw new Error("Save failed");
        setSaveStatus("saved");
        resetTimerRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
        resetTimerRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
      }
    },
    [projectId],
  );

  const triggerSave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    save(nodesRef.current, edgesRef.current);
  }, [save]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      save(nodes, edges);
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [nodes, edges, save, debounceMs]);

  return { saveStatus, triggerSave };
}

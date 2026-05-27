"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  ConnectionMode,
  MarkerType,
  addEdge,
  useReactFlow,
  type Connection,
  type EdgeTypes,
  type NodeTypes,
} from "@xyflow/react";
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow";
import { useUpdateMyPresence, useEventListener } from "@liveblocks/react";
import {
  useCanRedo,
  useCanUndo,
  useRedo,
  useUndo,
} from "@liveblocks/react/suspense";
import { Panel } from "@xyflow/react";
import { Bot, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";
import { CanvasNodeComponent } from "./canvas-node";
import { CanvasEdgeComponent } from "./canvas-edge";
import { CanvasControlBar } from "./canvas-control-bar";
import { ShapePanel, type ShapeDragPayload } from "./shape-panel";
import { CanvasActionsContext } from "./canvas-actions-context";
import { StarterTemplatesModal } from "../starter-templates-modal";
import { useWorkspace } from "../workspace-provider";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useCanvasAutosave } from "@/hooks/use-canvas-autosave";
import {
  DEFAULT_NODE_COLOR,
  type CanvasNode,
  type CanvasEdge,
} from "@/types/canvas";
import type { CanvasTemplate } from "../starter-templates";

const nodeTypes: NodeTypes = {
  canvasNode: CanvasNodeComponent,
};

const edgeTypes: EdgeTypes = {
  canvasEdge: CanvasEdgeComponent,
};

const defaultEdgeOptions = {
  type: "canvasEdge",
  data: { label: "" },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "var(--text-primary)",
    width: 16,
    height: 16,
  },
  interactionWidth: 28,
} satisfies Partial<CanvasEdge>;

let nodeCounter = 0;

function generateNodeId(shape: string): string {
  return `${shape}-${Date.now()}-${++nodeCounter}`;
}

function CanvasFlowInner() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });

  const flow = useReactFlow<CanvasNode, CanvasEdge>();
  const { screenToFlowPosition } = flow;
  const updateMyPresence = useUpdateMyPresence();
  const {
    projectId,
    isStarterTemplatesOpen,
    setStarterTemplatesOpen,
    setSaveStatus,
    setTriggerSave,
    setAiStatus,
  } = useWorkspace();

  const hasLoadedRef = useRef(false);
  const statusClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [canvasAiMessage, setCanvasAiMessage] = useState<{
    message: string;
    type: "thinking" | "complete" | "error";
  } | null>(null);

  useEventListener(({ event }) => {
    if (statusClearRef.current) clearTimeout(statusClearRef.current);

    if (event.type === "AI_STATUS") {
      const status = { message: event.message, type: "thinking" as const, runId: event.runId };
      setAiStatus(status);
      setCanvasAiMessage({ message: event.message, type: "thinking" });
    } else if (event.type === "AI_COMPLETE") {
      const status = { message: event.message, type: "complete" as const, runId: event.runId };
      setAiStatus(status);
      setCanvasAiMessage({ message: event.message, type: "complete" });
      statusClearRef.current = setTimeout(() => {
        setAiStatus(null);
        setCanvasAiMessage(null);
      }, 6000);
    } else if (event.type === "AI_ERROR") {
      const status = { message: event.message, type: "error" as const, runId: event.runId };
      setAiStatus(status);
      setCanvasAiMessage({ message: event.message, type: "error" });
      statusClearRef.current = setTimeout(() => {
        setAiStatus(null);
        setCanvasAiMessage(null);
      }, 8000);
    }
  });

  useEffect(() => {
    if (hasLoadedRef.current || !projectId) return;
    if (nodes.length > 0 || edges.length > 0) {
      hasLoadedRef.current = true;
      return;
    }
    hasLoadedRef.current = true;

    fetch(`/api/projects/${projectId}/canvas`)
      .then((res) => res.json())
      .then((data: { nodes?: CanvasNode[]; edges?: CanvasEdge[] }) => {
        const savedNodes = data.nodes ?? [];
        const savedEdges = data.edges ?? [];
        if (savedNodes.length === 0 && savedEdges.length === 0) return;
        onNodesChange(
          savedNodes.map((node) => ({ type: "add" as const, item: node })),
        );
        onEdgesChange(
          savedEdges.map((edge) => ({ type: "add" as const, item: edge })),
        );
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            flow.fitView({ duration: 240, padding: 0.2 });
          });
        });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { saveStatus, triggerSave } = useCanvasAutosave(projectId, {
    nodes,
    edges,
  });

  useEffect(() => {
    setSaveStatus(saveStatus);
  }, [saveStatus, setSaveStatus]);

  useEffect(() => {
    setTriggerSave(triggerSave);
    return () => setTriggerSave(null);
  }, [triggerSave, setTriggerSave]);
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const handleUndo = useCallback(() => {
    if (canUndo) undo();
  }, [canUndo, undo]);

  const handleRedo = useCallback(() => {
    if (canRedo) redo();
  }, [canRedo, redo]);

  useKeyboardShortcuts({
    flow,
    undo: handleUndo,
    redo: handleRedo,
    onDelete,
  });

  const handleConnect = useCallback(
    (connection: Connection) => {
      const [newEdge] = addEdge<CanvasEdge>(
        {
          ...connection,
          type: "canvasEdge",
          data: { label: "" },
          markerEnd: defaultEdgeOptions.markerEnd,
          interactionWidth: defaultEdgeOptions.interactionWidth,
        },
        [],
      );

      if (!newEdge) return;
      onEdgesChange([{ type: "add", item: newEdge }]);
    },
    [onEdgesChange],
  );

  const importTemplate = useCallback(
    (template: CanvasTemplate) => {
      onDelete({ nodes, edges });
      onNodesChange(
        template.nodes.map((node) => ({
          type: "add",
          item: {
            ...node,
            position: { ...node.position },
            data: { ...node.data },
          },
        })),
      );
      onEdgesChange(
        template.edges.map((edge) => ({
          type: "add",
          item: {
            ...edge,
            data: { ...edge.data },
          },
        })),
      );

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          flow.fitView({ duration: 240, padding: 0.2 });
        });
      });
    },
    [edges, flow, nodes, onDelete, onEdgesChange, onNodesChange],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      updateMyPresence({ cursor: position });
    },
    [screenToFlowPosition, updateMyPresence],
  );

  const handleMouseLeave = useCallback(() => {
    updateMyPresence({ cursor: null });
  }, [updateMyPresence]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData("application/ghost-shape");
      if (!raw) return;

      const payload: ShapeDragPayload = JSON.parse(raw);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: CanvasNode = {
        id: generateNodeId(payload.shape),
        type: "canvasNode",
        initialWidth: payload.width,
        initialHeight: payload.height,
        position: {
          x: position.x - payload.width / 2,
          y: position.y - payload.height / 2,
        },
        data: {
          label: "",
          color: DEFAULT_NODE_COLOR.background,
          textColor: DEFAULT_NODE_COLOR.text,
          shape: payload.shape,
          width: payload.width,
          height: payload.height,
        },
      };

      onNodesChange([{ type: "add", item: newNode }]);
    },
    [screenToFlowPosition, onNodesChange],
  );

  const actionsValue = useMemo(
    () => ({ onNodesChange, onEdgesChange }),
    [onNodesChange, onEdgesChange],
  );

  return (
    <CanvasActionsContext.Provider value={actionsValue}>
      <div
        className="w-full h-full"
        onDragOver={onDragOver}
        onDrop={onDrop}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          onDelete={onDelete}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionMode={ConnectionMode.Loose}
        >
          <Background variant={BackgroundVariant.Dots} />
          <Cursors />
          {canvasAiMessage && (
            <Panel position="top-center">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-elevated border border-surface-border shadow-lg text-sm">
                {canvasAiMessage.type === "thinking" && (
                  <Loader2 className="size-3.5 text-ai-text animate-spin shrink-0" />
                )}
                {canvasAiMessage.type === "complete" && (
                  <CheckCircle className="size-3.5 text-success shrink-0" />
                )}
                {canvasAiMessage.type === "error" && (
                  <AlertCircle className="size-3.5 text-error shrink-0" />
                )}
                <Bot className="size-3.5 text-ai-text shrink-0" />
                <span className="text-copy-secondary">{canvasAiMessage.message}</span>
              </div>
            </Panel>
          )}
          <CanvasControlBar
            flow={flow}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={handleUndo}
            onRedo={handleRedo}
          />
          <ShapePanel />
        </ReactFlow>
        <StarterTemplatesModal
          open={isStarterTemplatesOpen}
          onOpenChange={setStarterTemplatesOpen}
          onImport={importTemplate}
        />
      </div>
    </CanvasActionsContext.Provider>
  );
}

export function CanvasFlow() {
  return (
    <ReactFlowProvider>
      <CanvasFlowInner />
    </ReactFlowProvider>
  );
}

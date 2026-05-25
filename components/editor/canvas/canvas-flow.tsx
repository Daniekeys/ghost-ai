"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
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
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";
import { CanvasNodeComponent } from "./canvas-node";
import { CanvasEdgeComponent } from "./canvas-edge";
import { ShapePanel, type ShapeDragPayload } from "./shape-panel";
import { CanvasActionsContext } from "./canvas-actions-context";
import {
  DEFAULT_NODE_COLOR,
  type CanvasNode,
  type CanvasEdge,
} from "@/types/canvas";

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

  const { screenToFlowPosition } = useReactFlow();

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
          fitView
        >
          <Background variant={BackgroundVariant.Dots} />
          <MiniMap />
          <Cursors />
          <ShapePanel />
        </ReactFlow>
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

import { MarkerType } from "@xyflow/react";
import {
  DEFAULT_NODE_COLOR,
  NODE_COLORS,
  type CanvasEdge,
  type CanvasNode,
  type NodeColorPair,
} from "@/types/canvas";

export interface CanvasTemplate {
  id: string;
  name: string;
  description: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

interface TemplateNodeInput {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape?: string;
  color?: NodeColorPair;
}

function templateNode({
  id,
  label,
  x,
  y,
  width,
  height,
  shape = "rectangle",
  color = DEFAULT_NODE_COLOR,
}: TemplateNodeInput): CanvasNode {
  return {
    id,
    type: "canvasNode",
    initialWidth: width,
    initialHeight: height,
    position: { x, y },
    data: {
      label,
      shape,
      width,
      height,
      color: color.background,
      textColor: color.text,
    },
  };
}

function templateEdge(
  id: string,
  source: string,
  target: string,
  label = "",
): CanvasEdge {
  return {
    id,
    source,
    target,
    type: "canvasEdge",
    data: { label },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "var(--text-primary)",
      width: 16,
      height: 16,
    },
    interactionWidth: 28,
  };
}

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  {
    id: "microservices-commerce",
    name: "Microservices Commerce",
    description:
      "API Gateway routes traffic to isolated services, each backed by a dedicated database and connected via a shared message bus.",
    nodes: [
      templateNode({
        id: "micro-client",
        label: "Web / Mobile Client",
        x: 0,
        y: 110,
        width: 210,
        height: 84,
        shape: "hexagon",
        color: NODE_COLORS[1],
      }),
      templateNode({
        id: "micro-gateway",
        label: "API Gateway",
        x: 290,
        y: 115,
        width: 190,
        height: 74,
        shape: "pill",
        color: NODE_COLORS[7],
      }),
      templateNode({
        id: "micro-auth",
        label: "Auth Service",
        x: 580,
        y: 0,
        width: 190,
        height: 74,
        shape: "pill",
        color: NODE_COLORS[2],
      }),
      templateNode({
        id: "micro-order",
        label: "Order Service",
        x: 580,
        y: 115,
        width: 190,
        height: 74,
        shape: "pill",
        color: NODE_COLORS[3],
      }),
      templateNode({
        id: "micro-inventory",
        label: "Inventory Service",
        x: 580,
        y: 230,
        width: 190,
        height: 74,
        shape: "pill",
        color: NODE_COLORS[6],
      }),
      templateNode({
        id: "micro-bus",
        label: "Event Bus",
        x: 880,
        y: 115,
        width: 170,
        height: 74,
        shape: "diamond",
        color: NODE_COLORS[5],
      }),
      templateNode({
        id: "micro-db",
        label: "Service Databases",
        x: 1130,
        y: 115,
        width: 170,
        height: 110,
        shape: "cylinder",
        color: NODE_COLORS[4],
      }),
    ],
    edges: [
      templateEdge("micro-e1", "micro-client", "micro-gateway", "HTTPS"),
      templateEdge("micro-e2", "micro-gateway", "micro-auth"),
      templateEdge("micro-e3", "micro-gateway", "micro-order"),
      templateEdge("micro-e4", "micro-gateway", "micro-inventory"),
      templateEdge("micro-e5", "micro-order", "micro-bus", "publishes"),
      templateEdge("micro-e6", "micro-inventory", "micro-bus", "subscribes"),
      templateEdge("micro-e7", "micro-auth", "micro-db"),
      templateEdge("micro-e8", "micro-order", "micro-db"),
      templateEdge("micro-e9", "micro-inventory", "micro-db"),
    ],
  },
  {
    id: "ci-cd-pipeline",
    name: "CI/CD Pipeline",
    description:
      "End-to-end delivery from source commit through build, test, containerization, and staged deployment to production.",
    nodes: [
      templateNode({
        id: "cicd-repo",
        label: "Git Repository",
        x: 0,
        y: 90,
        width: 190,
        height: 76,
        shape: "hexagon",
        color: NODE_COLORS[1],
      }),
      templateNode({
        id: "cicd-build",
        label: "Build Job",
        x: 270,
        y: 90,
        width: 170,
        height: 76,
        shape: "rectangle",
        color: NODE_COLORS[7],
      }),
      templateNode({
        id: "cicd-tests",
        label: "Test Suite",
        x: 520,
        y: 90,
        width: 170,
        height: 76,
        shape: "diamond",
        color: NODE_COLORS[2],
      }),
      templateNode({
        id: "cicd-registry",
        label: "Image Registry",
        x: 770,
        y: 0,
        width: 160,
        height: 112,
        shape: "cylinder",
        color: NODE_COLORS[3],
      }),
      templateNode({
        id: "cicd-deploy",
        label: "Deploy Workflow",
        x: 770,
        y: 170,
        width: 190,
        height: 76,
        shape: "pill",
        color: NODE_COLORS[6],
      }),
      templateNode({
        id: "cicd-prod",
        label: "Production Cluster",
        x: 1060,
        y: 170,
        width: 210,
        height: 86,
        shape: "hexagon",
        color: NODE_COLORS[5],
      }),
      templateNode({
        id: "cicd-observe",
        label: "Monitoring",
        x: 1060,
        y: 20,
        width: 170,
        height: 76,
        shape: "circle",
        color: NODE_COLORS[4],
      }),
    ],
    edges: [
      templateEdge("cicd-e1", "cicd-repo", "cicd-build", "push"),
      templateEdge("cicd-e2", "cicd-build", "cicd-tests"),
      templateEdge("cicd-e3", "cicd-tests", "cicd-registry", "pass"),
      templateEdge("cicd-e4", "cicd-tests", "cicd-deploy", "release"),
      templateEdge("cicd-e5", "cicd-registry", "cicd-deploy", "image"),
      templateEdge("cicd-e6", "cicd-deploy", "cicd-prod"),
      templateEdge("cicd-e7", "cicd-prod", "cicd-observe", "metrics"),
    ],
  },
  {
    id: "event-driven-system",
    name: "Event-Driven System",
    description:
      "Producers publish events to a central bus. Independent consumers handle notifications, analytics, projections, and error queues.",
    nodes: [
      templateNode({
        id: "event-api",
        label: "Public API",
        x: 0,
        y: 120,
        width: 180,
        height: 76,
        shape: "pill",
        color: NODE_COLORS[7],
      }),
      templateNode({
        id: "event-ingest",
        label: "Ingestion Service",
        x: 270,
        y: 120,
        width: 200,
        height: 76,
        shape: "rectangle",
        color: NODE_COLORS[1],
      }),
      templateNode({
        id: "event-stream",
        label: "Event Stream",
        x: 570,
        y: 120,
        width: 180,
        height: 86,
        shape: "diamond",
        color: NODE_COLORS[5],
      }),
      templateNode({
        id: "event-worker",
        label: "Worker Pool",
        x: 850,
        y: 0,
        width: 180,
        height: 76,
        shape: "pill",
        color: NODE_COLORS[2],
      }),
      templateNode({
        id: "event-projection",
        label: "Read Model",
        x: 850,
        y: 130,
        width: 160,
        height: 112,
        shape: "cylinder",
        color: NODE_COLORS[6],
      }),
      templateNode({
        id: "event-notify",
        label: "Notification Service",
        x: 850,
        y: 290,
        width: 210,
        height: 76,
        shape: "rectangle",
        color: NODE_COLORS[3],
      }),
      templateNode({
        id: "event-users",
        label: "Users / Systems",
        x: 1150,
        y: 290,
        width: 190,
        height: 82,
        shape: "hexagon",
        color: NODE_COLORS[4],
      }),
    ],
    edges: [
      templateEdge("event-e1", "event-api", "event-ingest", "commands"),
      templateEdge("event-e2", "event-ingest", "event-stream", "events"),
      templateEdge("event-e3", "event-stream", "event-worker", "consume"),
      templateEdge("event-e4", "event-stream", "event-projection", "project"),
      templateEdge("event-e5", "event-stream", "event-notify", "trigger"),
      templateEdge("event-e6", "event-notify", "event-users", "deliver"),
    ],
  },
];

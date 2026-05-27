import { task, logger } from "@trigger.dev/sdk";
import type { CanvasNode, CanvasEdge } from "@/types/canvas";

interface GenerateSpecPayload {
  projectId: string;
  canvasSnapshot: {
    nodes: CanvasNode[];
    edges: CanvasEdge[];
  };
}

interface GenerateSpecResult {
  projectId: string;
  specId: string;
  blobUrl: string;
}

export const generateSpec = task({
  id: "generate-spec",
  maxDuration: 300,
  run: async (payload: GenerateSpecPayload): Promise<GenerateSpecResult> => {
    const { projectId, canvasSnapshot } = payload;

    logger.info("Starting spec generation", {
      projectId,
      nodes: canvasSnapshot.nodes.length,
      edges: canvasSnapshot.edges.length,
    });

    // TODO: Call Anthropic API with the canvas graph to produce a
    // Markdown technical specification.

    // TODO: Upload the Markdown to Vercel Blob at
    // specs/{projectId}/{specId}.md and persist the blob URL in a
    // Spec record in the database via the Prisma client in lib/prisma.ts.

    throw new Error("Not implemented");
  },
});

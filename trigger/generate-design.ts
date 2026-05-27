import { task, logger } from "@trigger.dev/sdk";
import type { CanvasNode, CanvasEdge } from "@/types/canvas";

interface GenerateDesignPayload {
  projectId: string;
  prompt: string;
  canvasSnapshot: {
    nodes: CanvasNode[];
    edges: CanvasEdge[];
  };
}

interface GenerateDesignResult {
  projectId: string;
  nodesAdded: number;
  edgesAdded: number;
}

export const generateDesign = task({
  id: "generate-design",
  maxDuration: 300,
  run: async (
    payload: GenerateDesignPayload
  ): Promise<GenerateDesignResult> => {
    const { projectId, prompt, canvasSnapshot } = payload;

    logger.info("Starting design generation", {
      projectId,
      prompt,
      existingNodes: canvasSnapshot.nodes.length,
      existingEdges: canvasSnapshot.edges.length,
    });

    // TODO: Call Anthropic API with the prompt and current canvas snapshot
    // to generate structured node and edge additions.

    // TODO: Write the generated nodes and edges into the Liveblocks room
    // via the Liveblocks Node client in lib/liveblocks.ts.

    return { projectId, nodesAdded: 0, edgesAdded: 0 };
  },
});

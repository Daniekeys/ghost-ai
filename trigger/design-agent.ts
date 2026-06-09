import { task, logger } from "@trigger.dev/sdk";
import { z } from "zod";
import { LiveObject, LiveMap, Liveblocks, type LsonObject } from "@liveblocks/node";
import { getLiveblocksClient } from "@/lib/liveblocks";
import { NODE_COLORS } from "@/types/canvas";

const SHAPES = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon",
] as const;

const SHAPE_DEFAULT_SIZES: Record<string, { width: number; height: number }> = {
  rectangle: { width: 160, height: 80 },
  diamond: { width: 140, height: 120 },
  circle: { width: 80, height: 80 },
  pill: { width: 160, height: 64 },
  cylinder: { width: 100, height: 100 },
  hexagon: { width: 120, height: 120 },
};

const designSchema = z.object({
  nodes: z.array(
    z.object({
      id: z
        .string()
        .describe(
          "Short kebab-case node ID, e.g. 'api-gateway', 'user-service'",
        ),
      label: z.string().describe("Short display label (1-3 words)"),
      shape: z
        .enum(SHAPES)
        .describe(
          "rectangle=general/API, pill=service, cylinder=database, hexagon=external, diamond=gateway, circle=event",
        ),
      x: z.number().describe("X position in the canvas (0-1200)"),
      y: z.number().describe("Y position in the canvas (0-800)"),
      colorIndex: z
        .number()
        .min(0)
        .max(7)
        .describe(
          "Color palette index: 0=neutral, 1=blue/API, 2=purple/AI, 3=orange/queue, 4=red/critical, 5=pink/frontend, 6=green/database, 7=teal/external",
        ),
    }),
  ),
  edges: z.array(
    z.object({
      id: z.string().describe("Unique edge ID"),
      source: z.string().describe("Source node ID"),
      target: z.string().describe("Target node ID"),
      label: z
        .string()
        .optional()
        .describe("Short connection label (optional)"),
    }),
  ),
});

const AI_USER_ID = "ai-ghost";
const AI_COLOR = "#6457f9";

const SYSTEM_PROMPT = `You are Ghost AI, an expert system architect. Generate a clear, well-organized system architecture diagram from the user's description.

Layout rules:
- Space nodes with at least 200px between centers
- Use a left-to-right or top-to-bottom flow that makes the data path obvious
- Keep the full diagram within a 1400x900 canvas area
- Generate 4-12 nodes for a readable diagram

Shape guide:
- rectangle: general components, APIs, controllers
- pill: named services, processes, microservices
- cylinder: databases, caches, storage
- hexagon: external systems, third parties, boundaries
- diamond: load balancers, API gateways, routers
- circle: events, triggers, user-facing endpoints

Color guide (colorIndex):
- 0 neutral: general-purpose nodes
- 1 blue: API gateways, load balancers, ingress
- 2 purple: AI/ML services
- 3 orange: message queues, async workers
- 4 red: auth, security, rate limiters
- 5 pink: frontends, clients, user-facing layers
- 6 green: databases, storage, caches
- 7 teal: external services, third-party integrations

Output valid node IDs (kebab-case, no spaces). Only reference node IDs that exist in your nodes array for edges.`;

export const designAgent = task({
  id: "design-agent",
  maxDuration: 300,
  run: async (
    payload: { prompt: string; roomId: string; userId: string },
    { ctx },
  ) => {
    const { prompt, roomId, userId } = payload;
    const runId = ctx.run.id;
    const liveblocks = getLiveblocksClient();

    logger.info("Design agent started", { prompt, roomId, userId });

    // Set AI presence as thinking
    await setAiPresence(liveblocks, roomId, true).catch((err) =>
      logger.warn("Could not set AI presence", { error: String(err) }),
    );

    // Broadcast start status to all room clients
    await broadcastStatus(liveblocks, roomId, runId, "AI_STATUS", "Ghost AI is analyzing your request…");

    try {
      const orResponse = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer":
              process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            "X-Title": "Design Agent",
          },
          body: JSON.stringify({
            model: "google/gemini-2.0-flash",
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content:
                  SYSTEM_PROMPT +
                  '\n\nRespond with valid JSON only, using exactly this structure:\n{"nodes":[{"id":"string","label":"string","shape":"string","x":0,"y":0,"colorIndex":0}],"edges":[{"id":"string","source":"string","target":"string","label":"string"}]}',
              },
              {
                role: "user",
                content: `Design a system architecture for: ${prompt}`,
              },
            ],
          }),
        },
      );

      if (!orResponse.ok) {
        const errText = await orResponse.text();
        throw new Error(
          `OpenRouter API error ${orResponse.status}: ${errText}`,
        );
      }

      const orData = await orResponse.json();
      const rawContent = orData.choices?.[0]?.message?.content;
      if (!rawContent) {
        throw new Error("OpenRouter returned an empty response");
      }

      const design = designSchema.parse(JSON.parse(rawContent));

      logger.info("Design generated", {
        nodeCount: design.nodes.length,
        edgeCount: design.edges.length,
      });

      await broadcastStatus(liveblocks, roomId, runId, "AI_STATUS", "Applying design to canvas…");

      // Write nodes and edges directly into Liveblocks Storage
      await liveblocks.mutateStorage(roomId, ({ root }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rootAny = root as any;

        let flow = rootAny.get("flow") as
          | LiveObject<{
              nodes: LiveMap<string, LiveObject<LsonObject>>;
              edges: LiveMap<string, LiveObject<LsonObject>>;
            }>
          | undefined;

        if (!flow) {
          flow = new LiveObject({
            nodes: new LiveMap<string, LiveObject<LsonObject>>(),
            edges: new LiveMap<string, LiveObject<LsonObject>>(),
          });
          rootAny.set("flow", flow);
        }

        const nodesMap = flow.get("nodes");
        const edgesMap = flow.get("edges");

        if (!nodesMap || !edgesMap) return;

        // Clear existing canvas content
        for (const key of [...nodesMap.keys()]) {
          nodesMap.delete(key);
        }
        for (const key of [...edgesMap.keys()]) {
          edgesMap.delete(key);
        }

        // Insert AI-generated nodes
        for (const n of design.nodes) {
          const colorPair = NODE_COLORS[n.colorIndex] ?? NODE_COLORS[0];
          const size =
            SHAPE_DEFAULT_SIZES[n.shape] ?? { width: 160, height: 80 };

          nodesMap.set(
            n.id,
            new LiveObject({
              id: n.id,
              type: "canvasNode",
              position: { x: n.x, y: n.y },
              initialWidth: size.width,
              initialHeight: size.height,
              data: {
                label: n.label,
                shape: n.shape,
                color: colorPair.background,
                textColor: colorPair.text,
                width: size.width,
                height: size.height,
              },
            } as LsonObject),
          );
        }

        // Insert AI-generated edges
        for (const e of design.edges) {
          // Skip edges referencing nodes that don't exist in the design
          const sourceExists = design.nodes.some((n) => n.id === e.source);
          const targetExists = design.nodes.some((n) => n.id === e.target);
          if (!sourceExists || !targetExists) continue;

          edgesMap.set(
            e.id,
            new LiveObject({
              id: e.id,
              type: "canvasEdge",
              source: e.source,
              target: e.target,
              data: { label: e.label ?? "" },
              markerEnd: {
                type: "arrowclosed",
                color: "var(--text-primary)",
                width: 16,
                height: 16,
              },
              interactionWidth: 28,
            } as LsonObject),
          );
        }
      });

      logger.info("Canvas updated via mutateStorage", {
        nodes: design.nodes.length,
        edges: design.edges.length,
        userId,
      });

      await broadcastStatus(liveblocks, roomId, runId, "AI_COMPLETE", "Design complete. The canvas has been updated.");

      return {
        nodeCount: design.nodes.length,
        edgeCount: design.edges.length,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      logger.error("Design agent failed", { error: message });

      await broadcastStatus(liveblocks, roomId, runId, "AI_ERROR", "Ghost AI encountered an error. Please try again.").catch(
        () => {},
      );

      throw error;
    } finally {
      // Set presence with short TTL so it expires quickly
      await setAiPresence(liveblocks, roomId, false).catch(() => {});
    }
  },
});

async function setAiPresence(
  liveblocks: Liveblocks,
  roomId: string,
  thinking: boolean,
): Promise<void> {
  await liveblocks.setPresence(roomId, {
    userId: AI_USER_ID,
    data: { cursor: null, thinking },
    userInfo: { name: "Ghost AI", avatar: "", color: AI_COLOR },
    ttl: thinking ? 300 : 5,
  });
}

async function broadcastStatus(
  liveblocks: Liveblocks,
  roomId: string,
  runId: string,
  type: "AI_STATUS" | "AI_COMPLETE" | "AI_ERROR",
  message: string,
): Promise<void> {
  await liveblocks.broadcastEvent(roomId, { type, message, runId });
}

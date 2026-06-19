import {
  LiveMap,
  LiveObject,
  ensureLiveblocksRoom,
  external_exports,
  getLiveblocksClient
} from "../../../chunk-XL44DV7L.mjs";
import {
  logger,
  task
} from "../../../chunk-MSEQBWFO.mjs";
import "../../../chunk-5A54AS5L.mjs";
import {
  __name,
  init_esm
} from "../../../chunk-4DNCWKMJ.mjs";

// trigger/design-agent.ts
init_esm();

// lib/model-providers.ts
init_esm();
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");
var PROVIDER_REGISTRY = {
  gemini: {
    name: "gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    apiKeyEnv: "GEMINI_API_KEY",
    model: "gemini-2.5-flash",
    responseFormat: "json_schema"
  },
  groq: {
    name: "groq",
    baseUrl: "https://api.groq.com/openai/v1",
    apiKeyEnv: "GROQ_API_KEY",
    model: "llama-3.3-70b-versatile",
    responseFormat: "json_object"
  },
  "openrouter:openai/gpt-oss-120b:free": {
    name: "openrouter:openai/gpt-oss-120b:free",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: "OPENROUTER_API_KEY",
    model: "openai/gpt-oss-120b:free",
    responseFormat: "none"
  },
  "openrouter:qwen/qwen3-coder:free": {
    name: "openrouter:qwen/qwen3-coder:free",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: "OPENROUTER_API_KEY",
    model: "qwen/qwen3-coder:free",
    responseFormat: "none"
  },
  "openrouter:qwen/qwen3-next-80b-a3b-instruct:free": {
    name: "openrouter:qwen/qwen3-next-80b-a3b-instruct:free",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: "OPENROUTER_API_KEY",
    model: "qwen/qwen3-next-80b-a3b-instruct:free",
    responseFormat: "none"
  },
  "openrouter:openrouter/free": {
    name: "openrouter:openrouter/free",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: "OPENROUTER_API_KEY",
    model: "openrouter/free",
    responseFormat: "none"
  }
};
var DEFAULT_PROVIDER_CHAIN_NAMES = [
  "gemini",
  "groq",
  "openrouter:openai/gpt-oss-120b:free",
  "openrouter:qwen/qwen3-coder:free",
  "openrouter:qwen/qwen3-next-80b-a3b-instruct:free",
  "openrouter:openrouter/free"
];
var PROVIDER_CHAIN = (() => {
  const override = process.env.MODEL_PROVIDER_CHAIN;
  const names = override ? override.split(",").map((s) => s.trim()).filter(Boolean) : [...DEFAULT_PROVIDER_CHAIN_NAMES];
  const resolved = names.map((n) => PROVIDER_REGISTRY[n]).filter((p) => Boolean(p));
  if (resolved.length > 0) return resolved;
  return DEFAULT_PROVIDER_CHAIN_NAMES.map((n) => PROVIDER_REGISTRY[n]);
})();
var BACKOFF_DELAYS_MS = [2e3, 5e3, 1e4];
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
__name(sleep, "sleep");
function stripJsonFences(text) {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenceMatch ? fenceMatch[1].trim() : trimmed;
}
__name(stripJsonFences, "stripJsonFences");
function extractBalancedJson(text) {
  const start = text.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "{") {
      depth += 1;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}
__name(extractBalancedJson, "extractBalancedJson");
async function callProvider(provider, apiKey, messages, jsonSchema) {
  const body = {
    model: provider.model,
    messages
  };
  if (provider.responseFormat === "json_schema" && jsonSchema) {
    body.response_format = {
      type: "json_schema",
      json_schema: { name: jsonSchema.name, schema: jsonSchema.schema, strict: true }
    };
  } else if (provider.responseFormat === "json_object") {
    body.response_format = { type: "json_object" };
  }
  let lastError;
  for (let attempt = 0; attempt <= BACKOFF_DELAYS_MS.length; attempt++) {
    try {
      const res = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        return await res.json();
      }
      const text = await res.text().catch(() => "");
      const retryable = res.status === 429 || res.status >= 500;
      if (retryable && attempt < BACKOFF_DELAYS_MS.length) {
        await sleep(BACKOFF_DELAYS_MS[attempt]);
        continue;
      }
      throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
    } catch (err) {
      lastError = err;
      const isHttpError = err instanceof Error && err.message.startsWith("HTTP ");
      if (!isHttpError && attempt < BACKOFF_DELAYS_MS.length) {
        await sleep(BACKOFF_DELAYS_MS[attempt]);
        continue;
      }
      throw err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
__name(callProvider, "callProvider");
async function generateJson({
  systemPrompt,
  userPrompt,
  jsonSchema,
  validate,
  onAttempt,
  onFallback,
  maxTotalAttempts = 6
}) {
  let totalAttempts = 0;
  let lastError = "no providers were available";
  for (let providerIndex = 0; providerIndex < PROVIDER_CHAIN.length; providerIndex++) {
    const provider = PROVIDER_CHAIN[providerIndex];
    const apiKey = process.env[provider.apiKeyEnv];
    if (!apiKey) {
      onAttempt?.({
        provider: provider.name,
        model: provider.model,
        status: "error",
        error: `missing ${provider.apiKeyEnv}`
      });
      continue;
    }
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];
    let providerFailed = false;
    for (let retry = 0; retry < 2; retry++) {
      if (totalAttempts >= maxTotalAttempts) {
        throw new Error(
          `Exceeded maximum of ${maxTotalAttempts} completion attempts across all providers. Last error: ${lastError}`
        );
      }
      totalAttempts += 1;
      let response;
      try {
        response = await callProvider(provider, apiKey, messages, jsonSchema);
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        onAttempt?.({
          provider: provider.name,
          model: provider.model,
          status: "error",
          error: lastError
        });
        providerFailed = true;
        break;
      }
      const choice = response.choices?.[0];
      const content = choice?.message?.content ?? "";
      const finishReason = choice?.finish_reason ?? "unknown";
      onAttempt?.({
        provider: provider.name,
        model: provider.model,
        status: "ok",
        finishReason,
        contentPreview: content.slice(0, 300)
      });
      const stripped = stripJsonFences(content);
      const jsonText = extractBalancedJson(stripped) ?? stripped;
      let parsed;
      try {
        parsed = JSON.parse(jsonText);
      } catch (err) {
        lastError = `JSON parse error: ${err instanceof Error ? err.message : String(err)}`;
        if (retry === 0) {
          messages.push({ role: "assistant", content });
          messages.push({
            role: "user",
            content: `Your previous response was not valid JSON (${lastError}). Respond again with ONLY the corrected JSON object, no markdown fences and no extra text.`
          });
          continue;
        }
        providerFailed = true;
        break;
      }
      const validation = validate(parsed);
      if (validation.success) return validation.data;
      lastError = validation.error;
      if (retry === 0) {
        messages.push({ role: "assistant", content });
        messages.push({
          role: "user",
          content: `Your JSON did not match the required schema: ${lastError}. Respond again with ONLY the corrected JSON object, no markdown fences and no extra text.`
        });
        continue;
      }
      providerFailed = true;
    }
    if (providerFailed && providerIndex < PROVIDER_CHAIN.length - 1) {
      onFallback?.({
        from: provider.name,
        to: PROVIDER_CHAIN[providerIndex + 1].name,
        reason: lastError
      });
    }
  }
  throw new Error(`All providers in the chain failed. Last error: ${lastError}`);
}
__name(generateJson, "generateJson");

// types/canvas.ts
init_esm();
var NODE_COLORS = [
  { background: "#1F1F1F", text: "#EDEDED" },
  { background: "#10233D", text: "#52A8FF" },
  { background: "#2E1938", text: "#BF7AF0" },
  { background: "#331B00", text: "#FF990A" },
  { background: "#3C1618", text: "#FF6166" },
  { background: "#3A1726", text: "#F75F8F" },
  { background: "#0F2E18", text: "#62C073" },
  { background: "#062822", text: "#0AC7B4" }
];
var DEFAULT_NODE_COLOR = NODE_COLORS[0];

// trigger/design-agent.ts
var SHAPES = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon"
];
var SHAPE_DEFAULT_SIZES = {
  rectangle: { width: 160, height: 80 },
  diamond: { width: 140, height: 120 },
  circle: { width: 80, height: 80 },
  pill: { width: 160, height: 64 },
  cylinder: { width: 100, height: 100 },
  hexagon: { width: 120, height: 120 }
};
var designSchema = external_exports.object({
  nodes: external_exports.array(
    external_exports.object({
      id: external_exports.string(),
      label: external_exports.string(),
      shape: external_exports.enum(SHAPES),
      x: external_exports.number(),
      y: external_exports.number(),
      colorIndex: external_exports.number().min(0).max(7)
    })
  ),
  edges: external_exports.array(
    external_exports.object({
      id: external_exports.string(),
      source: external_exports.string(),
      target: external_exports.string(),
      label: external_exports.string().optional()
    })
  )
});
var WRITE_DESIGN_PARAMS = {
  type: "object",
  properties: {
    nodes: {
      type: "array",
      description: "System architecture component nodes",
      items: {
        type: "object",
        properties: {
          id: { type: "string", description: "Short kebab-case ID, e.g. 'api-gateway'" },
          label: { type: "string", description: "Short display label (1-3 words)" },
          shape: {
            type: "string",
            enum: ["rectangle", "diamond", "circle", "pill", "cylinder", "hexagon"],
            description: "rectangle=general/API, pill=service, cylinder=database, hexagon=external, diamond=gateway, circle=event"
          },
          x: { type: "number", description: "X position on canvas (0-1200)" },
          y: { type: "number", description: "Y position on canvas (0-800)" },
          colorIndex: {
            type: "integer",
            minimum: 0,
            maximum: 7,
            description: "0=neutral, 1=blue/API, 2=purple/AI, 3=orange/queue, 4=red/critical, 5=pink/frontend, 6=green/database, 7=teal/external"
          }
        },
        required: ["id", "label", "shape", "x", "y", "colorIndex"]
      }
    },
    edges: {
      type: "array",
      description: "Connections between nodes",
      items: {
        type: "object",
        properties: {
          id: { type: "string", description: "Unique edge ID" },
          source: { type: "string", description: "Source node ID" },
          target: { type: "string", description: "Target node ID" },
          label: { type: "string", description: "Short connection label (optional)" }
        },
        required: ["id", "source", "target"]
      }
    }
  },
  required: ["nodes", "edges"]
};
var AI_USER_ID = "ai-ghost";
var AI_COLOR = "#6457f9";
var SYSTEM_PROMPT = `You are Ghost AI, an expert system architect. Generate a clear, well-organized system architecture diagram from the user's description.

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

Output valid node IDs (kebab-case, no spaces). Only reference node IDs that exist in your nodes array for edges.

Respond with ONLY a single JSON object matching this JSON Schema, with no markdown code fences and no extra commentary:

${JSON.stringify(WRITE_DESIGN_PARAMS, null, 2)}`;
function validateDesign(data) {
  const result = designSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return { success: false, error: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") };
}
__name(validateDesign, "validateDesign");
var designAgent = task({
  id: "design-agent",
  maxDuration: 300,
  run: /* @__PURE__ */ __name(async (payload, { ctx }) => {
    logger.info("PAYLOAD RECEIVED", { payload });
    logger.info("ENV CHECK", {
      hasLiveblocksSecret: !!process.env.LIVEBLOCKS_SECRET_KEY,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasGroqKey: !!process.env.GROQ_API_KEY,
      hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
      hasModelProviderChainOverride: !!process.env.MODEL_PROVIDER_CHAIN
    });
    const { prompt, roomId, userId } = payload;
    const runId = ctx.run.id;
    const liveblocks = getLiveblocksClient();
    logger.info("Design agent started", { prompt, roomId, userId });
    await ensureLiveblocksRoom(roomId).catch(
      (err) => logger.warn("Could not ensure Liveblocks room", { roomId, error: String(err) })
    );
    await setAiPresence(liveblocks, roomId, true);
    await broadcastStatus(liveblocks, roomId, runId, "AI_STATUS", "Ghost AI is analyzing your request…");
    try {
      const design = await generateJson({
        systemPrompt: SYSTEM_PROMPT,
        userPrompt: `Design a system architecture for: ${prompt}`,
        jsonSchema: { name: "system_design", schema: WRITE_DESIGN_PARAMS },
        validate: validateDesign,
        onAttempt: /* @__PURE__ */ __name((log) => {
          logger.info("Model provider attempt", log);
        }, "onAttempt"),
        onFallback: /* @__PURE__ */ __name((info) => {
          logger.warn("Falling back to next model provider", info);
          broadcastStatus(liveblocks, roomId, runId, "AI_STATUS", "Ghost AI is switching to a backup model…");
        }, "onFallback")
      });
      logger.info("Applying design to canvas", {
        nodeCount: design.nodes.length,
        edgeCount: design.edges.length
      });
      await broadcastStatus(liveblocks, roomId, runId, "AI_STATUS", "Applying design to canvas…");
      await applyDesign(liveblocks, roomId, design);
      logger.info("Canvas updated via mutateStorage", {
        nodeCount: design.nodes.length,
        edgeCount: design.edges.length,
        userId
      });
      await broadcastStatus(liveblocks, roomId, runId, "AI_COMPLETE", "Design complete. The canvas has been updated.");
      return { nodeCount: design.nodes.length, edgeCount: design.edges.length };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      logger.error("Design agent failed", { error: message });
      logger.error("Design agent failed - stack", {
        stack: error instanceof Error ? error.stack : error
      });
      await broadcastStatus(liveblocks, roomId, runId, "AI_ERROR", "Ghost AI encountered an error. Please try again.");
      throw error;
    } finally {
      await setAiPresence(liveblocks, roomId, false);
    }
  }, "run")
});
async function applyDesign(liveblocks, roomId, design) {
  await liveblocks.mutateStorage(roomId, ({ root }) => {
    const rootAny = root;
    let flow = rootAny.get("flow");
    if (!flow) {
      flow = new LiveObject({
        nodes: new LiveMap(),
        edges: new LiveMap()
      });
      rootAny.set("flow", flow);
    }
    const nodesMap = flow.get("nodes");
    const edgesMap = flow.get("edges");
    if (!nodesMap || !edgesMap) return;
    for (const key of [...nodesMap.keys()]) nodesMap.delete(key);
    for (const key of [...edgesMap.keys()]) edgesMap.delete(key);
    for (const n of design.nodes) {
      const colorPair = NODE_COLORS[n.colorIndex] ?? NODE_COLORS[0];
      const size = SHAPE_DEFAULT_SIZES[n.shape] ?? { width: 160, height: 80 };
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
            height: size.height
          }
        })
      );
    }
    for (const e of design.edges) {
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
            height: 16
          },
          interactionWidth: 28
        })
      );
    }
  });
}
__name(applyDesign, "applyDesign");
async function setAiPresence(liveblocks, roomId, thinking) {
  try {
    await liveblocks.setPresence(roomId, {
      userId: AI_USER_ID,
      data: { cursor: null, thinking },
      userInfo: { name: "Ghost AI", avatar: "", color: AI_COLOR },
      ttl: thinking ? 300 : 5
    });
  } catch (err) {
    logger.warn("Could not set AI presence", { roomId, error: String(err) });
  }
}
__name(setAiPresence, "setAiPresence");
async function broadcastStatus(liveblocks, roomId, runId, type, message) {
  try {
    await liveblocks.broadcastEvent(roomId, { type, message, runId });
  } catch (err) {
    logger.warn("Could not broadcast status", { roomId, type, error: String(err) });
  }
}
__name(broadcastStatus, "broadcastStatus");
export {
  designAgent
};
//# sourceMappingURL=design-agent.mjs.map

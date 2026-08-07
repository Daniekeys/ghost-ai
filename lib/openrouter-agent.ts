import { OpenRouter } from "@openrouter/sdk";
import type {
  ChatMessages,
  ChatFunctionToolFunction,
  ChatToolCall,
} from "@openrouter/sdk/models";
import { HTTPClientError, OpenRouterError } from "@openrouter/sdk/models/errors";
import { logger } from "@trigger.dev/sdk";
import EventEmitter from "eventemitter3";

/**
 * Free, tool-calling-capable OpenRouter models, in fallback priority order.
 * Override at runtime with the comma-separated OPENROUTER_MODEL_CHAIN env var.
 */
export const DEFAULT_MODEL_CHAIN: readonly string[] = [
  "openai/gpt-oss-120b:free",
  "qwen/qwen3-coder:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "openrouter/free",
];

export const MODEL_CHAIN: string[] = (() => {
  const override = process.env.OPENROUTER_MODEL_CHAIN;
  if (!override) return [...DEFAULT_MODEL_CHAIN];
  const parsed = override
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return parsed.length > 0 ? parsed : [...DEFAULT_MODEL_CHAIN];
})();

/** Hard cap on total LLM completion calls across all models for one send(). */
const MAX_TOTAL_ATTEMPTS = 6;
/** How many text-only (no tool call) responses to tolerate from one model before falling back. */
const MAX_NO_TOOL_ATTEMPTS_PER_MODEL = 2;
/** How many tool-execution failures (e.g. schema validation) to retry on the same model before falling back. */
const MAX_TOOL_ERROR_RETRIES_PER_MODEL = 1;

export type AgentTool = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  execute: (args: unknown) => Promise<unknown>;
};

type AgentEventMap = {
  "message:user": [msg: { role: "user"; content: string }];
  "message:assistant": [msg: { role: "assistant"; content: string }];
  "stream:delta": [delta: string];
  "stream:end": [];
  "tool:call": [call: { id: string; name: string; args: unknown }];
  "tool:result": [result: { id: string; name: string; result: string }];
  "thinking:start": [];
  "thinking:end": [];
  "model:fallback": [info: { fromModel: string; toModel: string; reason: string }];
};

type AccumulatedToolCall = { id: string; name: string; argsJson: string };

type CompletionResult = {
  content: string;
  toolCalls: AccumulatedToolCall[];
};

/** Strips ```json ... ``` / ``` ... ``` fences that free models often wrap JSON in. */
function stripJsonFences(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenceMatch ? fenceMatch[1].trim() : trimmed;
}

/** Determines whether an error from the OpenRouter SDK should trigger a model fallback. */
function classifyError(err: unknown): { retryable: boolean; reason: string } {
  if (err instanceof OpenRouterError) {
    const status = err.statusCode;
    const retryable = status === 429 || status === 402 || status === 408 || status >= 500;
    return { retryable, reason: `HTTP ${status}: ${err.message}` };
  }
  if (err instanceof HTTPClientError) {
    // Network-level errors (timeouts, connection failures, etc.)
    return { retryable: true, reason: `${err.name}: ${err.message}` };
  }
  return { retryable: true, reason: err instanceof Error ? err.message : String(err) };
}

export class Agent extends EventEmitter<AgentEventMap> {
  private client: OpenRouter;
  private models: string[];
  private modelIndex = 0;
  private instructions: string;
  private history: ChatMessages[];
  private tools = new Map<string, AgentTool>();
  private httpReferer: string;
  private appTitle: string;

  constructor({
    model,
    models,
    instructions,
    appTitle = "Canvarch",
  }: {
    /** A single model to use (legacy). Ignored if `models` is provided. */
    model?: string;
    /** Ordered fallback chain of models. Defaults to MODEL_CHAIN. */
    models?: string[];
    instructions: string;
    appTitle?: string;
  }) {
    super();
    this.client = new OpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY ?? "",
    });
    this.models = models && models.length > 0 ? models : model ? [model] : [...MODEL_CHAIN];
    this.instructions = instructions;
    this.history = [];
    this.httpReferer = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    this.appTitle = appTitle;
  }

  get currentModel(): string {
    return this.models[this.modelIndex];
  }

  addTool(tool: AgentTool): this {
    this.tools.set(tool.name, tool);
    return this;
  }

  setInstructions(instructions: string): this {
    this.instructions = instructions;
    return this;
  }

  clearHistory(): this {
    this.history = [];
    return this;
  }

  /** Switches to the next model in the chain. Throws if there is none left. */
  private advanceModel(reason: string): void {
    if (this.modelIndex >= this.models.length - 1) {
      throw new Error(`All models in the fallback chain failed. Last reason: ${reason}`);
    }
    const fromModel = this.currentModel;
    this.modelIndex += 1;
    const toModel = this.currentModel;
    logger.warn("Falling back to next OpenRouter model", { fromModel, toModel, reason });
    this.emit("model:fallback", { fromModel, toModel, reason });
  }

  private hasNextModel(): boolean {
    return this.modelIndex < this.models.length - 1;
  }

  /** Issues one streaming completion request against the current model. */
  private async requestCompletion(
    toolDefs: ChatFunctionToolFunction[] | undefined,
  ): Promise<CompletionResult> {
    this.emit("thinking:start");

    const stream = await this.client.chat.send({
      httpReferer: this.httpReferer,
      appTitle: this.appTitle,
      chatRequest: {
        model: this.currentModel,
        // Native OpenRouter fallback: try the remaining models in the chain
        // for this request before we even need to apply our own retry loop.
        // OpenRouter caps this array at 3 entries.
        models: this.models.slice(this.modelIndex, this.modelIndex + 3),
        messages: [
          { role: "system", content: this.instructions },
          ...this.history,
        ],
        ...(toolDefs ? { tools: toolDefs } : {}),
        stream: true,
      },
    });

    let content = "";
    let sawChunk = false;
    const accumCalls: Record<number, AccumulatedToolCall> = {};

    for await (const chunk of stream) {
      sawChunk = true;

      if (chunk.error) {
        throw new Error(`Provider error (${chunk.error.code}): ${chunk.error.message}`);
      }

      const delta = chunk.choices[0]?.delta;

      if (delta?.content) {
        content += delta.content;
        this.emit("stream:delta", delta.content);
      }

      if (delta?.toolCalls) {
        for (const tc of delta.toolCalls) {
          if (!accumCalls[tc.index]) {
            accumCalls[tc.index] = {
              id: tc.id ?? "",
              name: tc.function?.name ?? "",
              argsJson: "",
            };
          }
          if (tc.id) accumCalls[tc.index].id = tc.id;
          if (tc.function?.name) accumCalls[tc.index].name = tc.function.name;
          accumCalls[tc.index].argsJson += tc.function?.arguments ?? "";
        }
      }
    }

    this.emit("stream:end");
    this.emit("thinking:end");

    if (!sawChunk) {
      throw new Error("Empty response: no completion chunks received");
    }

    return { content, toolCalls: Object.values(accumCalls) };
  }

  /**
   * If a model replies with the design as raw JSON text instead of calling the
   * single registered tool, try to recover by parsing it as that tool's arguments.
   */
  private tryRecoverToolCallFromText(content: string): AccumulatedToolCall | null {
    if (this.tools.size !== 1) return null;

    const candidate = stripJsonFences(content);
    if (!candidate.startsWith("{") && !candidate.startsWith("[")) return null;

    try {
      JSON.parse(candidate);
    } catch {
      return null;
    }

    const [tool] = this.tools.values();
    return { id: `recovered-${Date.now()}`, name: tool.name, argsJson: candidate };
  }

  /** Executes a single tool call and appends its result to history. Returns whether it errored. */
  private async runToolCall(tc: AccumulatedToolCall): Promise<boolean> {
    let args: unknown = {};
    try {
      args = JSON.parse(tc.argsJson);
    } catch {
      // leave as empty object on parse failure
    }

    this.emit("tool:call", { id: tc.id, name: tc.name, args });

    const tool = this.tools.get(tc.name);
    let result: string;
    let errored = false;
    if (tool) {
      try {
        const output = await tool.execute(args);
        result = typeof output === "string" ? output : JSON.stringify(output);
      } catch (err) {
        errored = true;
        result = `Error executing tool: ${String(err)}`;
      }
    } else {
      errored = true;
      result = `Error: unknown tool "${tc.name}"`;
    }

    this.emit("tool:result", { id: tc.id, name: tc.name, result });
    this.history.push({ role: "tool", content: result, toolCallId: tc.id });
    return errored;
  }

  async send(userMessage: string): Promise<string> {
    this.history.push({ role: "user", content: userMessage });
    this.emit("message:user", { role: "user", content: userMessage });

    const toolDefs: ChatFunctionToolFunction[] | undefined =
      this.tools.size > 0
        ? [...this.tools.values()].map((t) => ({
            type: "function" as const,
            function: {
              name: t.name,
              description: t.description,
              parameters: t.parameters as { [k: string]: unknown },
            },
          }))
        : undefined;

    let totalAttempts = 0;
    let noToolAttempts = 0;
    let toolErrorRetries = 0;

    for (;;) {
      if (totalAttempts >= MAX_TOTAL_ATTEMPTS) {
        throw new Error(
          `Exceeded maximum of ${MAX_TOTAL_ATTEMPTS} completion attempts across all fallback models`,
        );
      }
      totalAttempts += 1;

      let response: CompletionResult;
      try {
        response = await this.requestCompletion(toolDefs);
      } catch (err) {
        const { retryable, reason } = classifyError(err);
        if (retryable && this.hasNextModel()) {
          this.advanceModel(reason);
          noToolAttempts = 0;
          toolErrorRetries = 0;
          continue;
        }
        throw err instanceof Error ? err : new Error(reason);
      }

      const { content, toolCalls } = response;

      if (toolCalls.length === 0) {
        if (toolDefs && toolDefs.length > 0) {
          // The model replied with text when a tool call was expected. Try to
          // recover JSON it may have returned directly, before giving up.
          const recovered = this.tryRecoverToolCallFromText(content);
          if (recovered) {
            this.history.push({
              role: "assistant",
              content: null,
              toolCalls: [
                {
                  id: recovered.id,
                  type: "function" as const,
                  function: { name: recovered.name, arguments: recovered.argsJson },
                },
              ],
            });

            const errored = await this.runToolCall(recovered);
            if (errored) {
              toolErrorRetries += 1;
              if (toolErrorRetries > MAX_TOOL_ERROR_RETRIES_PER_MODEL && this.hasNextModel()) {
                this.advanceModel("tool execution failed after retry");
                toolErrorRetries = 0;
              }
            } else {
              toolErrorRetries = 0;
            }
            noToolAttempts = 0;
            continue;
          }

          noToolAttempts += 1;
          if (noToolAttempts < MAX_NO_TOOL_ATTEMPTS_PER_MODEL) {
            this.history.push({
              role: "assistant",
              content,
            });
            this.history.push({
              role: "user",
              content:
                "Please respond by calling the required tool with your result, not with plain text.",
            });
            continue;
          }

          if (this.hasNextModel()) {
            this.advanceModel("model did not call the required tool after retries");
            noToolAttempts = 0;
            toolErrorRetries = 0;
            continue;
          }

          throw new Error("Model failed to call the required tool after all fallback attempts");
        }

        // No tools registered (or none expected) — final assistant response.
        this.history.push({ role: "assistant", content });
        this.emit("message:assistant", { role: "assistant", content });
        if (this.modelIndex > 0) {
          logger.info("Completion succeeded after model fallback", {
            model: this.currentModel,
            totalAttempts,
          });
        }
        return content;
      }

      // Add assistant message with tool calls to history
      const assistantToolCalls: ChatToolCall[] = toolCalls.map((tc) => ({
        id: tc.id,
        type: "function" as const,
        function: { name: tc.name, arguments: tc.argsJson },
      }));

      this.history.push({
        role: "assistant",
        content: content || null,
        toolCalls: assistantToolCalls,
      });

      let anyErrored = false;
      for (const tc of toolCalls) {
        const errored = await this.runToolCall(tc);
        anyErrored = anyErrored || errored;
      }

      if (anyErrored) {
        toolErrorRetries += 1;
        if (toolErrorRetries > MAX_TOOL_ERROR_RETRIES_PER_MODEL && this.hasNextModel()) {
          this.advanceModel("tool execution failed after retry");
          toolErrorRetries = 0;
        }
      } else {
        toolErrorRetries = 0;
        noToolAttempts = 0;
      }
      // Loop back to get the model's response after tool results
    }
  }
}

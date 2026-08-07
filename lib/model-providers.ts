import dns from "node:dns";

// Some providers (notably Gemini's OpenAI-compatible endpoint) resolve to
// IPv6 addresses that aren't reachable from every runtime. Prefer IPv4.
dns.setDefaultResultOrder("ipv4first");

export type ResponseFormatMode = "json_schema" | "json_object" | "none";

export type ProviderConfig = {
  /** Unique identifier, used in MODEL_PROVIDER_CHAIN overrides and logs. */
  name: string;
  /** OpenAI-compatible base URL, e.g. "https://api.groq.com/openai/v1". */
  baseUrl: string;
  /** Env var that holds the API key for this provider. */
  apiKeyEnv: string;
  /** Model id to request. */
  model: string;
  /** How to ask the provider for structured JSON output. */
  responseFormat: ResponseFormatMode;
};

/**
 * All known providers, keyed by the identifier used in chain configuration.
 * Every provider speaks the OpenAI-compatible /chat/completions format, so a
 * single request function can serve all of them.
 */
const PROVIDER_REGISTRY: Record<string, ProviderConfig> = {
  openai: {
    name: "openai",
    baseUrl: "https://api.openai.com/v1",
    apiKeyEnv: "OPENAI_API_KEY",
    model: "gpt-5.6-luna",
    responseFormat: "json_schema",
  },
  gemini: {
    name: "gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    apiKeyEnv: "GEMINI_API_KEY",
    model: "gemini-2.5-flash",
    responseFormat: "json_schema",
  },
  groq: {
    name: "groq",
    baseUrl: "https://api.groq.com/openai/v1",
    apiKeyEnv: "GROQ_API_KEY",
    model: "llama-3.3-70b-versatile",
    responseFormat: "json_object",
  },
  "openrouter:openai/gpt-oss-120b:free": {
    name: "openrouter:openai/gpt-oss-120b:free",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: "OPENROUTER_API_KEY",
    model: "openai/gpt-oss-120b:free",
    responseFormat: "none",
  },
  "openrouter:qwen/qwen3-coder:free": {
    name: "openrouter:qwen/qwen3-coder:free",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: "OPENROUTER_API_KEY",
    model: "qwen/qwen3-coder:free",
    responseFormat: "none",
  },
  "openrouter:qwen/qwen3-next-80b-a3b-instruct:free": {
    name: "openrouter:qwen/qwen3-next-80b-a3b-instruct:free",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: "OPENROUTER_API_KEY",
    model: "qwen/qwen3-next-80b-a3b-instruct:free",
    responseFormat: "none",
  },
  "openrouter:openrouter/free": {
    name: "openrouter:openrouter/free",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: "OPENROUTER_API_KEY",
    model: "openrouter/free",
    responseFormat: "none",
  },
};

/** Default fallback order: OpenAI -> free-tier Gemini -> free-tier Groq -> OpenRouter free models. */
export const DEFAULT_PROVIDER_CHAIN_NAMES: readonly string[] = [
  "openai",
  "gemini",
  "groq",
  "openrouter:openai/gpt-oss-120b:free",
  "openrouter:qwen/qwen3-coder:free",
  "openrouter:qwen/qwen3-next-80b-a3b-instruct:free",
  "openrouter:openrouter/free",
];

/**
 * The active provider chain, in fallback priority order. Override at runtime
 * with the comma-separated MODEL_PROVIDER_CHAIN env var, e.g.
 * "gemini,groq,openrouter:openai/gpt-oss-120b:free".
 */
export const PROVIDER_CHAIN: ProviderConfig[] = (() => {
  const override = process.env.MODEL_PROVIDER_CHAIN;
  const names = override
    ? override.split(",").map((s) => s.trim()).filter(Boolean)
    : [...DEFAULT_PROVIDER_CHAIN_NAMES];

  const resolved = names
    .map((n) => PROVIDER_REGISTRY[n])
    .filter((p): p is ProviderConfig => Boolean(p));

  if (resolved.length > 0) return resolved;

  // Override produced nothing usable — fall back to the default chain.
  return DEFAULT_PROVIDER_CHAIN_NAMES.map((n) => PROVIDER_REGISTRY[n]);
})();

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChatCompletionResponse = {
  choices?: Array<{
    message?: { content?: string | null };
    finish_reason?: string;
  }>;
};

const BACKOFF_DELAYS_MS = [2000, 5000, 10000];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Strips ```json ... ``` / ``` ... ``` fences that free models often wrap JSON in. */
export function stripJsonFences(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenceMatch ? fenceMatch[1].trim() : trimmed;
}

/** Extracts the first balanced {...} object from a string, ignoring braces inside strings. */
export function extractBalancedJson(text: string): string | null {
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

/**
 * Issues a single /chat/completions request against `provider`, retrying on
 * 429/5xx/network errors with 2s/5s/10s backoff.
 */
export async function callProvider(
  provider: ProviderConfig,
  apiKey: string,
  messages: ChatMessage[],
  jsonSchema?: { name: string; schema: object },
): Promise<ChatCompletionResponse> {
  const body: Record<string, unknown> = {
    model: provider.model,
    messages,
  };

  // Only force a JSON response format when the caller actually wants JSON
  // (i.e. passed a schema). Plain-text callers (generateText) must not have
  // providers like Groq coerced into emitting a JSON object instead of prose.
  if (jsonSchema) {
    if (provider.responseFormat === "json_schema") {
      body.response_format = {
        type: "json_schema",
        json_schema: { name: jsonSchema.name, schema: jsonSchema.schema, strict: true },
      };
    } else if (provider.responseFormat === "json_object") {
      body.response_format = { type: "json_object" };
    }
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= BACKOFF_DELAYS_MS.length; attempt++) {
    try {
      const res = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        return (await res.json()) as ChatCompletionResponse;
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

export type ValidationResult<T> = { success: true; data: T } | { success: false; error: string };

export type GenerateJsonAttemptLog = {
  provider: string;
  model: string;
  status: "ok" | "error";
  finishReason?: string;
  contentPreview?: string;
  error?: string;
};

/**
 * Walks the provider chain, asking each for a raw JSON response matching
 * `jsonSchema`. Pipeline per attempt: strip code fences -> extract first
 * balanced {...} -> JSON.parse -> `validate`. On failure, retries the same
 * provider once with the error appended to the conversation, then moves on
 * to the next provider. Capped at MAX_TOTAL_ATTEMPTS across the whole chain.
 */
export async function generateJson<T>({
  systemPrompt,
  userPrompt,
  jsonSchema,
  validate,
  onAttempt,
  onFallback,
  maxTotalAttempts = 6,
}: {
  systemPrompt: string;
  userPrompt: string;
  jsonSchema: { name: string; schema: object };
  validate: (data: unknown) => ValidationResult<T>;
  onAttempt?: (log: GenerateJsonAttemptLog) => void;
  onFallback?: (info: { from: string; to: string; reason: string }) => void;
  maxTotalAttempts?: number;
}): Promise<T> {
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
        error: `missing ${provider.apiKeyEnv}`,
      });
      continue;
    }

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    let providerFailed = false;

    // Initial attempt + one retry with the validation error appended.
    for (let retry = 0; retry < 2; retry++) {
      if (totalAttempts >= maxTotalAttempts) {
        throw new Error(
          `Exceeded maximum of ${maxTotalAttempts} completion attempts across all providers. Last error: ${lastError}`,
        );
      }
      totalAttempts += 1;

      let response: ChatCompletionResponse;
      try {
        response = await callProvider(provider, apiKey, messages, jsonSchema);
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        onAttempt?.({
          provider: provider.name,
          model: provider.model,
          status: "error",
          error: lastError,
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
        contentPreview: content.slice(0, 300),
      });

      const stripped = stripJsonFences(content);
      const jsonText = extractBalancedJson(stripped) ?? stripped;

      let parsed: unknown;
      try {
        parsed = JSON.parse(jsonText);
      } catch (err) {
        lastError = `JSON parse error: ${err instanceof Error ? err.message : String(err)}`;
        if (retry === 0) {
          messages.push({ role: "assistant", content });
          messages.push({
            role: "user",
            content: `Your previous response was not valid JSON (${lastError}). Respond again with ONLY the corrected JSON object, no markdown fences and no extra text.`,
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
          content: `Your JSON did not match the required schema: ${lastError}. Respond again with ONLY the corrected JSON object, no markdown fences and no extra text.`,
        });
        continue;
      }
      providerFailed = true;
    }

    if (providerFailed && providerIndex < PROVIDER_CHAIN.length - 1) {
      onFallback?.({
        from: provider.name,
        to: PROVIDER_CHAIN[providerIndex + 1].name,
        reason: lastError,
      });
    }
  }

  throw new Error(`All providers in the chain failed. Last error: ${lastError}`);
}

export type GenerateTextAttemptLog = {
  provider: string;
  model: string;
  status: "ok" | "error";
  finishReason?: string;
  contentPreview?: string;
  error?: string;
};

/**
 * Walks the provider chain, asking each for a plain-text completion (no JSON
 * schema coercion). Falls back to the next provider on error or empty
 * content. Used for free-form prose output, e.g. Markdown spec generation.
 */
export async function generateText({
  systemPrompt,
  userPrompt,
  onAttempt,
  onFallback,
  maxTotalAttempts = 6,
}: {
  systemPrompt: string;
  userPrompt: string;
  onAttempt?: (log: GenerateTextAttemptLog) => void;
  onFallback?: (info: { from: string; to: string; reason: string }) => void;
  maxTotalAttempts?: number;
}): Promise<string> {
  let totalAttempts = 0;
  let lastError = "no providers were available";

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  for (let providerIndex = 0; providerIndex < PROVIDER_CHAIN.length; providerIndex++) {
    const provider = PROVIDER_CHAIN[providerIndex];
    const apiKey = process.env[provider.apiKeyEnv];

    if (!apiKey) {
      onAttempt?.({
        provider: provider.name,
        model: provider.model,
        status: "error",
        error: `missing ${provider.apiKeyEnv}`,
      });
      continue;
    }

    if (totalAttempts >= maxTotalAttempts) {
      throw new Error(
        `Exceeded maximum of ${maxTotalAttempts} completion attempts across all providers. Last error: ${lastError}`,
      );
    }
    totalAttempts += 1;

    let response: ChatCompletionResponse;
    try {
      response = await callProvider(provider, apiKey, messages);
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      onAttempt?.({
        provider: provider.name,
        model: provider.model,
        status: "error",
        error: lastError,
      });
      if (providerIndex < PROVIDER_CHAIN.length - 1) {
        onFallback?.({ from: provider.name, to: PROVIDER_CHAIN[providerIndex + 1].name, reason: lastError });
      }
      continue;
    }

    const choice = response.choices?.[0];
    const content = (choice?.message?.content ?? "").trim();
    const finishReason = choice?.finish_reason ?? "unknown";

    onAttempt?.({
      provider: provider.name,
      model: provider.model,
      status: content ? "ok" : "error",
      finishReason,
      contentPreview: content.slice(0, 300),
    });

    if (content) return content;

    lastError = "empty response content";
    if (providerIndex < PROVIDER_CHAIN.length - 1) {
      onFallback?.({ from: provider.name, to: PROVIDER_CHAIN[providerIndex + 1].name, reason: lastError });
    }
  }

  throw new Error(`All providers in the chain failed. Last error: ${lastError}`);
}

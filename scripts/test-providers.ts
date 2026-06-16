import "dotenv/config";
import { PROVIDER_CHAIN, callProvider, type ChatMessage } from "@/lib/model-providers";

const HELLO_MESSAGES: ChatMessage[] = [
  { role: "system", content: "You are a helpful assistant. Reply in one short sentence." },
  { role: "user", content: "Say hello and name the model you are." },
];

const JSON_SCHEMA = {
  name: "ping",
  schema: {
    type: "object",
    properties: {
      ok: { type: "boolean" },
      message: { type: "string" },
    },
    required: ["ok", "message"],
  },
} as const;

const JSON_MESSAGES: ChatMessage[] = [
  {
    role: "system",
    content:
      "Respond with ONLY a JSON object matching this schema, no markdown fences: " +
      JSON.stringify(JSON_SCHEMA.schema),
  },
  { role: "user", content: 'Set ok to true and message to "pong".' },
];

async function main() {
  console.log(`Testing ${PROVIDER_CHAIN.length} provider(s) in chain order:\n`);

  let anyPassed = false;

  for (const provider of PROVIDER_CHAIN) {
    console.log(`=== ${provider.name} (model: ${provider.model}) ===`);

    const apiKey = process.env[provider.apiKeyEnv];
    if (!apiKey) {
      console.log(`  SKIPPED: missing env var ${provider.apiKeyEnv}\n`);
      continue;
    }

    // Hello request
    try {
      const res = await callProvider(provider, apiKey, HELLO_MESSAGES);
      const content = res.choices?.[0]?.message?.content ?? "";
      const finishReason = res.choices?.[0]?.finish_reason ?? "unknown";
      console.log(`  hello: OK (finish_reason=${finishReason})`);
      console.log(`    -> ${content.slice(0, 200).replace(/\n/g, " ")}`);
    } catch (err) {
      console.log(`  hello: FAILED - ${err instanceof Error ? err.message : String(err)}`);
    }

    // JSON output request
    try {
      const res = await callProvider(provider, apiKey, JSON_MESSAGES, JSON_SCHEMA);
      const content = res.choices?.[0]?.message?.content ?? "";
      const finishReason = res.choices?.[0]?.finish_reason ?? "unknown";
      console.log(`  json:  OK (finish_reason=${finishReason})`);
      console.log(`    -> ${content.slice(0, 200).replace(/\n/g, " ")}`);
      anyPassed = true;
    } catch (err) {
      console.log(`  json:  FAILED - ${err instanceof Error ? err.message : String(err)}`);
    }

    console.log("");
  }

  if (!anyPassed) {
    console.log("No provider succeeded. Check API keys and network access.");
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

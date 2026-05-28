import { schemaTask, logger, metadata } from "@trigger.dev/sdk";
import { z } from "zod";
import { randomUUID } from "crypto";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const nodeSchema = z.object({
  id: z.string(),
  position: z.object({ x: z.number(), y: z.number() }).optional(),
  data: z
    .object({
      label: z.string(),
      shape: z.string().optional(),
      color: z.string().optional(),
      textColor: z.string().optional(),
    })
    .optional(),
});

const edgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  data: z
    .object({
      label: z.string().optional(),
    })
    .optional(),
});

const payloadSchema = z.object({
  projectId: z.string().min(1),
  roomId: z.string().min(1),
  chatHistory: z.array(chatMessageSchema).default([]),
  nodes: z.array(nodeSchema).default([]),
  edges: z.array(edgeSchema).default([]),
});

const SPEC_SYSTEM_PROMPT = `You are Ghost AI, an expert software architect and technical writer. Generate a comprehensive Markdown technical specification based on the provided system architecture diagram and conversation context.

Structure the document with these sections:
# <Project Name> — Technical Specification

## Executive Summary
## System Architecture Overview
## Component Descriptions
## Data Flow & Integration Points
## Technical Requirements & Constraints
## Implementation Recommendations

Rules:
- Use clear, professional technical language
- Use Markdown headers, bullet points, and tables where appropriate
- Base the spec strictly on the provided diagram and conversation
- Each component section should describe purpose, responsibilities, and interfaces
- Each data flow entry should reference the component labels from the diagram`;

export const generateSpec = schemaTask({
  id: "generate-spec",
  schema: payloadSchema,
  maxDuration: 300,
  retry: {
    maxAttempts: 3,
    factor: 2,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
    randomize: true,
  },
  run: async (payload) => {
    const { projectId, roomId, chatHistory, nodes, edges } = payload;

    logger.info("Spec generation started", {
      projectId,
      roomId,
      nodeCount: nodes.length,
      edgeCount: edges.length,
      chatMessages: chatHistory.length,
    });

    metadata.set("status", "generating");
    metadata.set("progress", 0);

    const nodesText =
      nodes.length > 0
        ? nodes
            .map((n) => `- ${n.data?.label ?? n.id} (${n.data?.shape ?? "component"}, id: ${n.id})`)
            .join("\n")
        : "No components defined yet.";

    const edgesText =
      edges.length > 0
        ? edges
            .map((e) => {
              const sourceLabel = nodes.find((n) => n.id === e.source)?.data?.label ?? e.source;
              const targetLabel = nodes.find((n) => n.id === e.target)?.data?.label ?? e.target;
              const connectionLabel = e.data?.label ? ` [${e.data.label}]` : "";
              return `- ${sourceLabel} → ${targetLabel}${connectionLabel}`;
            })
            .join("\n")
        : "No connections defined yet.";

    const chatContext =
      chatHistory.length > 0
        ? chatHistory
            .map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.content}`)
            .join("\n\n")
        : "No prior conversation.";

    const userPrompt = `Generate a technical specification for this system architecture.

## Components
${nodesText}

## Connections
${edgesText}

## Design Conversation Context
${chatContext}`;

    metadata.set("progress", 25);

    logger.info("Calling OpenRouter for spec generation");

    const orResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "Spec Generator",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          { role: "system", content: SPEC_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!orResponse.ok) {
      const errText = await orResponse.text();
      throw new Error(`OpenRouter API error ${orResponse.status}: ${errText}`);
    }

    const orData = await orResponse.json();
    const specContent: string | undefined = orData.choices?.[0]?.message?.content;

    if (!specContent) {
      throw new Error("OpenRouter returned an empty response");
    }

    metadata.set("progress", 75);
    metadata.set("status", "persisting");

    const specId = randomUUID();
    const blob = await put(
      `specs/${projectId}/${specId}.md`,
      specContent,
      {
        access: "private",
        contentType: "text/markdown",
        addRandomSuffix: false,
      },
    );

    await prisma.projectSpec.create({
      data: { id: specId, projectId, filePath: blob.url },
    });

    metadata.set("progress", 100);
    metadata.set("status", "complete");

    logger.info("Spec generation complete", {
      projectId,
      specId,
      specLength: specContent.length,
    });

    return { spec: specContent, specId };
  },
});

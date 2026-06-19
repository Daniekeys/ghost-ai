import { schemaTask, logger, metadata } from "@trigger.dev/sdk";
import { z } from "zod";
import { randomUUID } from "crypto";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { generateText } from "@/lib/model-providers";
import { getLiveblocksClient } from "@/lib/liveblocks";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const payloadSchema = z.object({
  projectId: z.string().min(1),
  roomId: z.string().min(1),
  chatHistory: z.array(chatMessageSchema).default([]),
});

type CanvasNode = {
  id: string;
  position?: { x: number; y: number };
  data?: { label: string; shape?: string; color?: string; textColor?: string };
};

type CanvasEdge = {
  id: string;
  source: string;
  target: string;
  data?: { label?: string };
};

type LiveblocksStorageJson = {
  flow?: {
    nodes?: Record<string, CanvasNode>;
    edges?: Record<string, CanvasEdge>;
  };
  aiChat?: Array<{
    id?: string;
    role: "user" | "assistant";
    content: string;
    source?: "architect" | "chat";
  }>;
};

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
    const { projectId, roomId, chatHistory } = payload;

    logger.info("Spec generation started", { projectId, roomId });

    metadata.set("status", "fetching-canvas");
    metadata.set("progress", 0);

    // Read canvas state directly from Liveblocks storage — always authoritative,
    // never stale unlike the Vercel Blob which only updates on autosave.
    const liveblocks = getLiveblocksClient();
    let nodes: CanvasNode[] = [];
    let edges: CanvasEdge[] = [];
    let architectChat: typeof chatHistory = chatHistory;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const storage = await liveblocks.getStorageDocument(roomId, "json") as any as LiveblocksStorageJson;

      nodes = storage.flow?.nodes ? Object.values(storage.flow.nodes) : [];
      edges = storage.flow?.edges ? Object.values(storage.flow.edges) : [];

      // Prefer chat messages read from storage so the task is self-contained.
      // Fall back to the payload's chatHistory if aiChat is absent or empty.
      if (storage.aiChat && storage.aiChat.length > 0) {
        architectChat = storage.aiChat
          .filter((m) => !m.source || m.source === "architect")
          .map((m) => ({ role: m.role, content: m.content }));
        if (architectChat.length === 0) {
          architectChat = chatHistory;
        }
      }

      logger.info("Canvas data loaded from Liveblocks", {
        nodeCount: nodes.length,
        edgeCount: edges.length,
        chatMessages: architectChat.length,
      });
    } catch (err) {
      logger.warn("Could not read Liveblocks storage, proceeding with empty canvas", {
        error: String(err),
      });
    }

    if (nodes.length === 0) {
      logger.warn("No canvas nodes found — spec will be generated from chat context only");
    }

    metadata.set("status", "generating");
    metadata.set("progress", 25);

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
      architectChat.length > 0
        ? architectChat
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

    logger.info("Calling model provider chain for spec generation", {
      nodeCount: nodes.length,
      edgeCount: edges.length,
    });

    const specContent = await generateText({
      systemPrompt: SPEC_SYSTEM_PROMPT,
      userPrompt,
      onAttempt: (log) => logger.info("Model provider attempt", log),
      onFallback: (info) => logger.warn("Falling back to next model provider", info),
    });

    metadata.set("progress", 75);
    metadata.set("status", "persisting");

    const projectExists = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });

    if (!projectExists) {
      throw new Error(
        `Project ${projectId} not found in database. Verify DATABASE_URL is correctly set in the Trigger.dev environment variables dashboard.`,
      );
    }

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

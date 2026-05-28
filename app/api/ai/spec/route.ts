import { auth as clerkAuth } from "@clerk/nextjs/server";
import { tasks } from "@trigger.dev/sdk";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkProjectAccess } from "@/lib/project-access";

const bodySchema = z.object({
  roomId: z.string().min(1),
  chatHistory: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .optional()
    .default([]),
  nodes: z.array(z.unknown()).optional().default([]),
  edges: z.array(z.unknown()).optional().default([]),
});

export async function POST(request: Request) {
  const { userId } = await clerkAuth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    const raw = await request.json();
    body = bodySchema.parse(raw);
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const { roomId, chatHistory, nodes, edges } = body;

  const access = await checkProjectAccess(roomId, userId, null);
  if (!access) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handle = await tasks.trigger("generate-spec", {
    projectId: access.project.id,
    roomId,
    chatHistory,
    nodes,
    edges,
  });

  await prisma.taskRun.create({
    data: { runId: handle.id, projectId: access.project.id, userId },
  });

  return Response.json({ runId: handle.id }, { status: 201 });
}

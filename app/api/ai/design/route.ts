import { auth as clerkAuth } from "@clerk/nextjs/server";
import { tasks, auth as triggerAuth } from "@trigger.dev/sdk";
import type { designAgent } from "@/trigger/design-agent";
import { prisma } from "@/lib/prisma";
import { checkProjectAccess } from "@/lib/project-access";

export async function POST(request: Request) {
  const { userId } = await clerkAuth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let prompt: string;
  let roomId: string;
  let projectId: string;
  try {
    const body = await request.json();
    prompt = body.prompt;
    roomId = body.roomId;
    projectId = body.projectId;
    if (!prompt || !roomId || !projectId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const access = await checkProjectAccess(projectId, userId, null);
  if (!access) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const handle = await tasks.trigger<typeof designAgent>("design-agent", {
    prompt,
    roomId,
    userId,
  });

  await prisma.taskRun.create({
    data: { runId: handle.id, projectId, userId },
  });

  const publicToken = await triggerAuth.createPublicToken({
    scopes: { read: { runs: [handle.id] } },
    expirationTime: "2h",
  });

  return Response.json({ runId: handle.id, publicToken }, { status: 201 });
}

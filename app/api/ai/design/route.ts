import { auth as clerkAuth } from "@clerk/nextjs/server";
import { tasks, auth as triggerAuth } from "@trigger.dev/sdk";
import { z } from "zod";
import type { designAgent } from "@/trigger/design-agent";
import { prisma } from "@/lib/prisma";
import { checkProjectAccess } from "@/lib/project-access";
import { grantLiveblocksRoomAccess } from "@/lib/liveblocks";

const DesignRequestSchema = z.object({
  prompt: z.string().trim().min(1),
  projectId: z.string().trim().min(1),
});

export async function POST(request: Request) {
  const { userId } = await clerkAuth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: z.infer<typeof DesignRequestSchema>;
  try {
    body = DesignRequestSchema.parse(await request.json());
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const { prompt, projectId } = body;
  const roomId = projectId;

  const access = await checkProjectAccess(projectId, userId, null);
  if (!access) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await grantLiveblocksRoomAccess(roomId, userId);
  } catch (error) {
    console.error("[API/design] Liveblocks room preparation failed:", error);
    return Response.json(
      { error: "Could not prepare the collaborative room" },
      { status: 503 },
    );
  }

  let handle: Awaited<ReturnType<typeof tasks.trigger<typeof designAgent>>>;
  try {
    const triggerPayload = { prompt, roomId, userId };
    handle = await tasks.trigger<typeof designAgent>("design-agent", triggerPayload);
  } catch (error) {
    console.error("[API/design] trigger failed:", error);
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return Response.json({ error: message }, { status: 500 });
  }

  await prisma.taskRun.create({
    data: { runId: handle.id, projectId, userId },
  });

  const publicToken = await triggerAuth.createPublicToken({
    scopes: { read: { runs: [handle.id] } },
    expirationTime: "2h",
  });

  return Response.json({ runId: handle.id, publicToken }, { status: 201 });
}

import { auth as clerkAuth } from "@clerk/nextjs/server";
import { auth as triggerAuth } from "@trigger.dev/sdk";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { userId } = await clerkAuth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let runId: string;
  try {
    const body = await request.json();
    runId = body.runId;
    if (!runId) {
      return Response.json({ error: "Missing runId" }, { status: 400 });
    }
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const taskRun = await prisma.taskRun.findFirst({
    where: { runId, userId },
  });

  if (!taskRun) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const publicToken = await triggerAuth.createPublicToken({
    scopes: {
      read: {
        runs: [runId],
      },
    },
    expirationTime: "1h",
  });

  return Response.json({ token: publicToken });
}

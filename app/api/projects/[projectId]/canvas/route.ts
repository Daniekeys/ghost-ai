import { put, get } from "@vercel/blob";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { checkProjectAccess, getCurrentIdentity } from "@/lib/project-access";
import type { NextRequest } from "next/server";

type Ctx = { params: Promise<{ projectId: string }> };

export async function GET(_request: NextRequest, { params }: Ctx) {
  const { userId, userEmail } = await getCurrentIdentity();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const access = await checkProjectAccess(projectId, userId, userEmail);
  if (!access) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!access.project.canvasBlobUrl) {
    return Response.json({ nodes: [], edges: [] });
  }

  const result = await get(access.project.canvasBlobUrl, { access: "private" });
  if (!result || result.statusCode !== 200) {
    return Response.json({ nodes: [], edges: [] });
  }

  const canvas = await new Response(result.stream).json();
  return Response.json(canvas);
}

export async function PUT(request: NextRequest, { params }: Ctx) {
  const { userId, userEmail } = await getCurrentIdentity();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const access = await checkProjectAccess(projectId, userId, userEmail);
  if (!access) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let canvasData;
  try {
    canvasData = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const blob = await put(
    `canvas/${projectId}.json`,
    JSON.stringify(canvasData),
    {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    },
  );

  await prisma.project.update({
    where: { id: projectId },
    data: { canvasBlobUrl: blob.url },
  });

  return Response.json({ url: blob.url });
}

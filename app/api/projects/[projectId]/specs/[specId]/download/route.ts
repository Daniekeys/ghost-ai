import { get } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { checkProjectAccess, getCurrentIdentity } from "@/lib/project-access";
import type { NextRequest } from "next/server";

type Ctx = { params: Promise<{ projectId: string; specId: string }> };

export async function GET(_request: NextRequest, { params }: Ctx) {
  const { userId, userEmail } = await getCurrentIdentity();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, specId } = await params;

  const access = await checkProjectAccess(projectId, userId, userEmail);
  if (!access) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const spec = await prisma.projectSpec.findFirst({
    where: { id: specId, projectId },
  });

  if (!spec) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const result = await get(spec.filePath, { access: "private" });
  if (!result || result.statusCode !== 200) {
    return Response.json({ error: "File not found" }, { status: 404 });
  }

  const content = await new Response(result.stream).text();

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="spec-${specId}.md"`,
    },
  });
}

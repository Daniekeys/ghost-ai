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

  const specs = await prisma.projectSpec.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    select: { id: true, createdAt: true },
  });

  return Response.json({ specs });
}

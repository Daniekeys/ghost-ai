import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export interface ProjectAccessResult {
  project: { id: string; name: string; ownerId: string; canvasBlobUrl: string | null };
  isOwner: boolean;
}

export async function getCurrentIdentity(): Promise<{
  userId: string | null;
  userEmail: string | null;
}> {
  const { userId } = await auth();

  if (!userId) {
    return { userId: null, userEmail: null };
  }

  let userEmail: string | null = null;

  try {
    const user = await currentUser();
    userEmail = user?.primaryEmailAddress?.emailAddress ?? null;
  } catch (err) {
    console.error("[ProjectAccess] currentUser() failed:", err);
  }

  return {
    userId,
    userEmail,
  };
}

export async function checkProjectAccess(
  projectId: string,
  userId: string,
  userEmail: string | null,
): Promise<ProjectAccessResult | null> {
  const project = await prisma?.project?.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, ownerId: true, canvasBlobUrl: true },
  });

  if (!project) return null;
  if (project.ownerId === userId) return { project, isOwner: true };

  if (!userEmail) return null;

  const collaborator = await prisma.projectCollaborator.findFirst({
    where: { projectId: project.id, collaboratorEmail: userEmail },
  });

  return collaborator ? { project, isOwner: false } : null;
}

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export interface ProjectAccessResult {
  project: { id: string; name: string; ownerId: string };
  isOwner: boolean;
}

export async function getCurrentIdentity(): Promise<{
  userId: string | null;
  userEmail: string | null;
}> {
  const user = await currentUser();
  return {
    userId: user?.id ?? null,
    userEmail: user?.primaryEmailAddress?.emailAddress ?? null,
  };
}

export async function checkProjectAccess(
  projectId: string,
  userId: string,
  userEmail: string | null,
): Promise<ProjectAccessResult | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, name: true, ownerId: true },
  });

  if (!project) return null;
  if (project.ownerId === userId) return { project, isOwner: true };

  if (!userEmail) return null;

  const collaborator = await prisma.projectCollaborator.findFirst({
    where: { projectId: project.id, collaboratorEmail: userEmail },
  });

  return collaborator ? { project, isOwner: false } : null;
}

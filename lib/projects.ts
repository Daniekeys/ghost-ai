import { prisma } from './prisma'

export interface Project {
  id: string
  name: string
  isOwned: boolean
}

export async function getOwnedProjects(userId: string): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true },
  })
  return rows.map((p) => ({ ...p, isOwned: true }))
}

export async function getSharedProjects(userEmail: string): Promise<Project[]> {
  const rows = await prisma.projectCollaborator.findMany({
    where: { collaboratorEmail: userEmail },
    include: { project: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return rows.map((r) => ({ id: r.project.id, name: r.project.name, isOwned: false }))
}

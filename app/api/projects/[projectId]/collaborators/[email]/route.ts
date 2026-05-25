import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'

type Ctx = { params: Promise<{ projectId: string; email: string }> }

export async function DELETE(_request: NextRequest, { params }: Ctx) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId, email: encodedEmail } = await params
  const email = decodeURIComponent(encodedEmail).toLowerCase()

  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) return Response.json({ error: 'Not found' }, { status: 404 })
  if (project.ownerId !== userId) return Response.json({ error: 'Forbidden' }, { status: 403 })

  const deleted = await prisma.projectCollaborator.deleteMany({
    where: { projectId, collaboratorEmail: email },
  })

  if (deleted.count === 0) {
    return Response.json({ error: 'Collaborator not found' }, { status: 404 })
  }

  return new Response(null, { status: 204 })
}

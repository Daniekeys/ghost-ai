import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'

type Ctx = { params: Promise<{ projectId: string }> }

export async function GET(_request: NextRequest, { params }: Ctx) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { collaborators: { orderBy: { createdAt: 'asc' } } },
  })
  if (!project) return Response.json({ error: 'Not found' }, { status: 404 })

  const isOwner = project.ownerId === userId
  if (!isOwner) {
    const user = await currentUser()
    const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
    const isCollaborator = project.collaborators.some(
      (c) => c.collaboratorEmail.toLowerCase() === email
    )
    if (!isCollaborator) return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  const emails = project.collaborators.map((c) => c.collaboratorEmail)
  type ClerkEntry = { email: string; name: string | null; imageUrl: string | null }
  let clerkEntries: ClerkEntry[] = []

  if (emails.length > 0) {
    const client = await clerkClient()
    const res = await client.users.getUserList({ emailAddress: emails })
    const users = res.data
    clerkEntries = emails.map((email) => {
      const user = users.find((u) =>
        u.emailAddresses.some((e) => e.emailAddress === email)
      )
      if (!user) return { email, name: null, imageUrl: null }
      const name =
        [user.firstName, user.lastName].filter(Boolean).join(' ') ||
        user.username ||
        null
      return { email, name, imageUrl: user.imageUrl ?? null }
    })
  }

  const collaborators = project.collaborators.map((c) => {
    const clerk = clerkEntries.find((e) => e.email === c.collaboratorEmail)
    return {
      email: c.collaboratorEmail,
      name: clerk?.name ?? null,
      imageUrl: clerk?.imageUrl ?? null,
    }
  })

  return Response.json({ collaborators, isOwner })
}

export async function POST(request: NextRequest, { params }: Ctx) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectId } = await params

  const project = await prisma.project.findUnique({ where: { id: projectId } })
  if (!project) return Response.json({ error: 'Not found' }, { status: 404 })
  if (project.ownerId !== userId) return Response.json({ error: 'Forbidden' }, { status: 403 })

  let email: string
  try {
    const body = await request.json() as { email?: unknown }
    email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  } catch {
    email = ''
  }

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Valid email is required' }, { status: 400 })
  }

  const user = await currentUser()
  const ownerEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase()
  if (email === ownerEmail) {
    return Response.json({ error: 'Cannot invite yourself' }, { status: 400 })
  }

  try {
    await prisma.projectCollaborator.create({
      data: { projectId, collaboratorEmail: email },
    })
  } catch (err: unknown) {
    if (
      err &&
      typeof err === 'object' &&
      'code' in err &&
      (err as { code: string }).code === 'P2002'
    ) {
      return Response.json({ error: 'Already a collaborator' }, { status: 409 })
    }
    throw err
  }

  return Response.json({ email }, { status: 201 })
}

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
  })

  return Response.json(projects)
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let name = 'Untitled Project'
  try {
    const body = await request.json()
    if (typeof body?.name === 'string' && body.name.trim().length > 0) {
      name = body.name.trim()
    }
  } catch {
    // empty or invalid body — use default name
  }

  const project = await prisma.project.create({
    data: { ownerId: userId, name },
  })

  return Response.json(project, { status: 201 })
}

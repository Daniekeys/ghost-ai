import { auth, currentUser } from '@clerk/nextjs/server'
import { EditorShell } from "@/components/editor/editor-shell"
import { getOwnedProjects, getSharedProjects } from "@/lib/projects"

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // auth() reads from middleware headers — no API call, always safe
  const { userId: authUserId } = await auth()
  const userId = authUserId ?? undefined
  let userEmail: string | undefined

  try {
    const user = await currentUser()
    userEmail = user?.primaryEmailAddress?.emailAddress
  } catch (err) {
    console.error('[EditorLayout] currentUser() failed:', err)
  }

  const [ownedProjects, sharedProjects] = await Promise.all([
    userId ? getOwnedProjects(userId) : Promise.resolve([]),
    userEmail ? getSharedProjects(userEmail) : Promise.resolve([]),
  ])

  return (
    <EditorShell ownedProjects={ownedProjects} sharedProjects={sharedProjects}>
      {children}
    </EditorShell>
  )
}

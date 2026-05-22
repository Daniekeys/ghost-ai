import { currentUser } from '@clerk/nextjs/server'
import { EditorShell } from "@/components/editor/editor-shell"
import { getOwnedProjects, getSharedProjects } from "@/lib/projects"

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()
  const userId = user?.id
  const userEmail = user?.primaryEmailAddress?.emailAddress

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

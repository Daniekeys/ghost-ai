"use client"

import { createContext, useContext } from "react"
import type { Project } from "@/lib/projects"

interface ProjectDialogsContextValue {
  projects: Project[]
  openCreateDialog: () => void
  openRenameDialog: (project: Project) => void
  openDeleteDialog: (project: Project) => void
}

const ProjectDialogsContext = createContext<ProjectDialogsContextValue | null>(null)

export function ProjectDialogsProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: ProjectDialogsContextValue
}) {
  return (
    <ProjectDialogsContext.Provider value={value}>
      {children}
    </ProjectDialogsContext.Provider>
  )
}

export function useProjectDialogsContext() {
  const ctx = useContext(ProjectDialogsContext)
  if (!ctx) throw new Error("useProjectDialogsContext must be used within ProjectDialogsProvider")
  return ctx
}

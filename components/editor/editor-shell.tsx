"use client"

import { useState } from "react"
import { EditorNavbar } from "./editor-navbar"
import { ProjectSidebar } from "./project-sidebar"
import { ProjectDialogsProvider } from "./project-dialogs-provider"
import { CreateProjectDialog } from "./dialogs/create-project-dialog"
import { RenameProjectDialog } from "./dialogs/rename-project-dialog"
import { DeleteProjectDialog } from "./dialogs/delete-project-dialog"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { Project } from "@/lib/projects"

interface EditorShellProps {
  children: React.ReactNode
  ownedProjects: Project[]
  sharedProjects: Project[]
}

export function EditorShell({ children, ownedProjects, sharedProjects }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const {
    activeDialog,
    selectedProject,
    formName,
    formSlug,
    setFormName,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialogs,
    handleCreate,
    handleRename,
    handleDelete,
  } = useProjectActions()

  const projects: Project[] = [
    ...ownedProjects,
    ...sharedProjects,
  ]

  return (
    <ProjectDialogsProvider
      value={{ projects, openCreateDialog, openRenameDialog, openDeleteDialog }}
    >
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <main className="pt-14 min-h-[calc(100vh-3.5rem)] bg-base">
        {children}
      </main>

      <CreateProjectDialog
        open={activeDialog === "create"}
        name={formName}
        slug={formSlug}
        onNameChange={setFormName}
        onConfirm={handleCreate}
        onClose={closeDialogs}
      />

      <RenameProjectDialog
        open={activeDialog === "rename"}
        project={selectedProject}
        name={formName}
        onNameChange={setFormName}
        onConfirm={handleRename}
        onClose={closeDialogs}
      />

      <DeleteProjectDialog
        open={activeDialog === "delete"}
        project={selectedProject}
        onConfirm={handleDelete}
        onClose={closeDialogs}
      />
    </ProjectDialogsProvider>
  )
}

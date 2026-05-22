"use client"

import { useState } from "react"
import { EditorNavbar } from "./editor-navbar"
import { ProjectSidebar } from "./project-sidebar"
import { ProjectDialogsProvider } from "./project-dialogs-provider"
import { CreateProjectDialog } from "./dialogs/create-project-dialog"
import { RenameProjectDialog } from "./dialogs/rename-project-dialog"
import { DeleteProjectDialog } from "./dialogs/delete-project-dialog"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"

interface EditorShellProps {
  children: React.ReactNode
}

export function EditorShell({ children }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const {
    projects,
    activeDialog,
    selectedProject,
    formName,
    formSlug,
    isLoading,
    setFormName,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialogs,
    handleCreate,
    handleRename,
    handleDelete,
  } = useProjectDialogs()

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

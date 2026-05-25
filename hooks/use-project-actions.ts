"use client"

import { useState, useCallback, useTransition } from "react"
import { useRouter, useParams } from "next/navigation"
import type { Project } from "@/lib/projects"

type DialogType = "create" | "rename" | "delete" | null

export interface UseProjectActionsReturn {
  activeDialog: DialogType
  selectedProject: Project | null
  formName: string
  formSlug: string
  isPending: boolean
  setFormName: (name: string) => void
  openCreateDialog: () => void
  openRenameDialog: (project: Project) => void
  openDeleteDialog: (project: Project) => void
  closeDialogs: () => void
  handleCreate: () => void
  handleRename: () => void
  handleDelete: () => void
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function useProjectActions(): UseProjectActionsReturn {
  const router = useRouter()
  const params = useParams()
  const [isPending, startTransition] = useTransition()

  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [formName, setFormName] = useState("")

  const openCreateDialog = useCallback(() => {
    setFormName("")
    setSelectedProject(null)
    setActiveDialog("create")
  }, [])

  const openRenameDialog = useCallback((project: Project) => {
    setFormName(project.name)
    setSelectedProject(project)
    setActiveDialog("rename")
  }, [])

  const openDeleteDialog = useCallback((project: Project) => {
    setSelectedProject(project)
    setActiveDialog("delete")
  }, [])

  const closeDialogs = useCallback(() => {
    setActiveDialog(null)
    setSelectedProject(null)
    setFormName("")
  }, [])

  const handleCreate = useCallback(() => {
    if (!formName.trim()) return
    startTransition(async () => {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName.trim() }),
      })
      if (!res.ok) return
      const project = await res.json() as { id: string }
      closeDialogs()
      router.push(`/editor/${project.id}`)
    })
  }, [formName, closeDialogs, router, startTransition])

  const handleRename = useCallback(() => {
    if (!formName.trim() || !selectedProject) return
    startTransition(async () => {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName.trim() }),
      })
      if (!res.ok) return
      closeDialogs()
      router.refresh()
    })
  }, [formName, selectedProject, closeDialogs, router, startTransition])

  const handleDelete = useCallback(() => {
    if (!selectedProject) return
    startTransition(async () => {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      })
      if (!res.ok) return
      const activeProjectId = (params as Record<string, string>)?.roomId
      closeDialogs()
      if (activeProjectId === selectedProject.id) {
        router.push("/editor")
      } else {
        router.refresh()
      }
    })
  }, [selectedProject, closeDialogs, router, params, startTransition])

  return {
    activeDialog,
    selectedProject,
    formName,
    formSlug: toSlug(formName),
    isPending,
    setFormName,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialogs,
    handleCreate,
    handleRename,
    handleDelete,
  }
}

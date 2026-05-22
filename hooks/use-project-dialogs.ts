"use client"

import { useState, useCallback } from "react"

export interface Project {
  id: string
  name: string
  slug: string
  isOwned: boolean
}

type DialogType = "create" | "rename" | "delete" | null

export interface UseProjectDialogsReturn {
  projects: Project[]
  activeDialog: DialogType
  selectedProject: Project | null
  formName: string
  formSlug: string
  isLoading: boolean
  setFormName: (name: string) => void
  openCreateDialog: () => void
  openRenameDialog: (project: Project) => void
  openDeleteDialog: (project: Project) => void
  closeDialogs: () => void
  handleCreate: () => void
  handleRename: () => void
  handleDelete: () => void
}

const MOCK_PROJECTS: Project[] = [
  { id: "1", name: "E-Commerce Platform", slug: "e-commerce-platform", isOwned: true },
  { id: "2", name: "Auth Service", slug: "auth-service", isOwned: true },
  { id: "3", name: "Partner API", slug: "partner-api", isOwned: false },
]

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function useProjectDialogs(): UseProjectDialogsReturn {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS)
  const [activeDialog, setActiveDialog] = useState<DialogType>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [formName, setFormName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
    setIsLoading(true)
    const newProject: Project = {
      id: Date.now().toString(),
      name: formName.trim(),
      slug: toSlug(formName),
      isOwned: true,
    }
    setProjects((prev) => [...prev, newProject])
    setIsLoading(false)
    closeDialogs()
  }, [formName, closeDialogs])

  const handleRename = useCallback(() => {
    if (!formName.trim() || !selectedProject) return
    setIsLoading(true)
    setProjects((prev) =>
      prev.map((p) =>
        p.id === selectedProject.id
          ? { ...p, name: formName.trim(), slug: toSlug(formName) }
          : p
      )
    )
    setIsLoading(false)
    closeDialogs()
  }, [formName, selectedProject, closeDialogs])

  const handleDelete = useCallback(() => {
    if (!selectedProject) return
    setIsLoading(true)
    setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id))
    setIsLoading(false)
    closeDialogs()
  }, [selectedProject, closeDialogs])

  return {
    projects,
    activeDialog,
    selectedProject,
    formName,
    formSlug: toSlug(formName),
    isLoading,
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

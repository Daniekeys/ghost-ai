"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { SaveStatus } from '@/hooks/use-canvas-autosave'

interface WorkspaceContextValue {
  projectName: string | null
  setProjectName: (name: string | null) => void
  projectId: string | null
  setProjectId: (id: string | null) => void
  isOwner: boolean
  setIsOwner: (v: boolean) => void
  isAiSidebarOpen: boolean
  toggleAiSidebar: () => void
  isWorkspaceMode: boolean
  setIsWorkspaceMode: (v: boolean) => void
  isWorkspaceSidebarOpen: boolean
  toggleWorkspaceSidebar: () => void
  isShareDialogOpen: boolean
  openShareDialog: () => void
  closeShareDialog: () => void
  isStarterTemplatesOpen: boolean
  openStarterTemplates: () => void
  setStarterTemplatesOpen: (open: boolean) => void
  saveStatus: SaveStatus
  setSaveStatus: (s: SaveStatus) => void
  triggerSave: (() => void) | null
  setTriggerSave: (fn: (() => void) | null) => void
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [projectName, setProjectName] = useState<string | null>(null)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false)
  const [isWorkspaceMode, setIsWorkspaceMode] = useState(false)
  const [isWorkspaceSidebarOpen, setIsWorkspaceSidebarOpen] = useState(true)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [isStarterTemplatesOpen, setIsStarterTemplatesOpen] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [triggerSaveFn, setTriggerSaveFnState] = useState<{ fn: () => void } | null>(null)

  const setTriggerSave = useCallback((fn: (() => void) | null) => {
    setTriggerSaveFnState(fn ? { fn } : null)
  }, [])

  return (
    <WorkspaceContext.Provider
      value={{
        projectName,
        setProjectName,
        projectId,
        setProjectId,
        isOwner,
        setIsOwner,
        isAiSidebarOpen,
        toggleAiSidebar: () => setIsAiSidebarOpen((prev) => !prev),
        isWorkspaceMode,
        setIsWorkspaceMode,
        isWorkspaceSidebarOpen,
        toggleWorkspaceSidebar: () => setIsWorkspaceSidebarOpen((prev) => !prev),
        isShareDialogOpen,
        openShareDialog: () => setIsShareDialogOpen(true),
        closeShareDialog: () => setIsShareDialogOpen(false),
        isStarterTemplatesOpen,
        openStarterTemplates: () => setIsStarterTemplatesOpen(true),
        setStarterTemplatesOpen: setIsStarterTemplatesOpen,
        saveStatus,
        setSaveStatus,
        triggerSave: triggerSaveFn?.fn ?? null,
        setTriggerSave,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace(): WorkspaceContextValue {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider')
  return ctx
}

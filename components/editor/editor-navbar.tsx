"use client"

import { Bot, LayoutTemplate, PanelLeftClose, PanelLeftOpen, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { useWorkspace } from "./workspace-provider"

interface EditorNavbarProps {
  isSidebarOpen: boolean
  onToggleSidebar: () => void
}

export function EditorNavbar({ isSidebarOpen, onToggleSidebar }: EditorNavbarProps) {
  const {
    projectName,
    toggleAiSidebar,
    isAiSidebarOpen,
    isWorkspaceMode,
    isWorkspaceSidebarOpen,
    toggleWorkspaceSidebar,
    openShareDialog,
    openStarterTemplates,
  } = useWorkspace()

  const sidebarOpen = isWorkspaceMode ? isWorkspaceSidebarOpen : isSidebarOpen
  const handleToggleSidebar = isWorkspaceMode ? toggleWorkspaceSidebar : onToggleSidebar

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-3 bg-surface border-b border-surface-border">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleSidebar}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="size-5" />
          ) : (
            <PanelLeftOpen className="size-5" />
          )}
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {projectName && (
          <div className="flex flex-col items-center leading-tight">
            <span className="text-sm font-semibold text-copy-primary truncate max-w-xs">
              {projectName}
            </span>
            {isWorkspaceMode && (
              <span className="text-[11px] text-copy-muted">Workspace</span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 pr-1">
        {projectName && (
          <>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Open starter templates"
              onClick={openStarterTemplates}
            >
              <LayoutTemplate className="size-4" />
              Templates
            </Button>
            <Button variant="ghost" size="sm" aria-label="Share project" onClick={openShareDialog}>
              <Share2 className="size-4" />
              Share
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAiSidebar}
              aria-label="Toggle AI sidebar"
              className={cn(
                "gap-1.5",
                isAiSidebarOpen
                  ? "bg-ai text-white hover:bg-ai/90"
                  : "hover:bg-subtle"
              )}
            >
              <Bot className="size-4" />
              AI
            </Button>
          </>
        )}
        <UserButton />
      </div>
    </header>
  )
}

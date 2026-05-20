"use client"

import { X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed top-14 left-0 bottom-0 z-40 w-72 flex flex-col",
        "bg-elevated border-r border-surface-border",
        "transition-transform duration-300 ease-in-out",
        !isOpen && "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border shrink-0">
        <span className="text-sm font-semibold text-copy-primary">Projects</span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X />
        </Button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden p-3">
        <Tabs defaultValue="my-projects" className="flex-1 flex flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="my-projects" className="flex-1">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-1">
              Shared
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="my-projects"
            className="flex-1 flex items-center justify-center"
          >
            <p className="text-sm text-copy-muted">No projects yet.</p>
          </TabsContent>

          <TabsContent
            value="shared"
            className="flex-1 flex items-center justify-center"
          >
            <p className="text-sm text-copy-muted">No shared projects.</p>
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-3 border-t border-surface-border shrink-0">
        <Button className="w-full">
          <Plus />
          New Project
        </Button>
      </div>
    </aside>
  )
}

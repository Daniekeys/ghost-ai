"use client";

import { X, Plus, Pencil, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProjectDialogsContext } from "./project-dialogs-provider";
import type { Project } from "@/lib/projects";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function ProjectItem({ project }: { project: Project }) {
  const { openRenameDialog, openDeleteDialog } = useProjectDialogsContext();
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === `/editor/${project.id}`;

  function navigate() {
    router.push(`/editor/${project.id}`);
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer",
        isActive ? "bg-accent-dim text-brand" : "hover:bg-subtle",
      )}
      onClick={navigate}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate();
        }
      }}
    >
      <span
        className={cn(
          "flex-1 text-sm min-w-0 truncate",
          isActive ? "text-brand font-medium" : "text-copy-secondary",
        )}
      >
        {project.name}
      </span>

      {project.isOwned && (
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              openRenameDialog(project);
            }}
            aria-label={`Rename ${project.name}`}
          >
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              openDeleteDialog(project);
            }}
            aria-label={`Delete ${project.name}`}
            className="text-error hover:text-error"
          >
            <Trash2 />
          </Button>
        </div>
      )}
    </div>
  );
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  const { projects, openCreateDialog } = useProjectDialogsContext();

  const ownedProjects = projects.filter((p) => p.isOwned);
  const sharedProjects = projects.filter((p) => !p.isOwned);

  return (
    <aside
      aria-hidden={!isOpen}
      inert={!isOpen ? true : undefined}
      className={cn(
        "fixed top-14 left-0 bottom-0 z-40 w-96 flex flex-col",
        "bg-elevated border-r border-surface-border",
        "transition-transform duration-300 ease-in-out",
        !isOpen && "-translate-x-full pointer-events-none",
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border shrink-0">
        <span className="text-sm font-semibold text-copy-primary">
          Projects
        </span>
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
            className="flex-1 mt-2 overflow-hidden"
          >
            {ownedProjects.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-copy-muted">No projects yet.</p>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="space-y-0.5">
                  {ownedProjects.map((project) => (
                    <ProjectItem key={project.id} project={project} />
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="shared" className="flex-1 mt-2 overflow-hidden">
            {sharedProjects.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-copy-muted">No shared projects.</p>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="space-y-0.5">
                  {sharedProjects.map((project) => (
                    <ProjectItem key={project.id} project={project} />
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-3 border-t border-surface-border shrink-0">
        <Button className="w-full" onClick={openCreateDialog}>
          <Plus />
          New Project
        </Button>
      </div>
    </aside>
  );
}

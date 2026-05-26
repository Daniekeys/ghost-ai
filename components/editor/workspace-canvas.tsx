"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { CanvasRoom } from "./canvas/canvas-room";
import { useWorkspace } from "./workspace-provider";
import { useProjectDialogsContext } from "./project-dialogs-provider";
import { ShareDialog } from "./dialogs/share-dialog";
import { AiSidebar } from "./ai-sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/projects";

interface WorkspaceCanvasProps {
  projectName: string;
  projectId: string;
  isOwner: boolean;
}

export function WorkspaceCanvas({
  projectName,
  projectId,
  isOwner,
}: WorkspaceCanvasProps) {
  const {
    setProjectName,
    setProjectId,
    setIsOwner,
    setIsWorkspaceMode,
    isAiSidebarOpen,
    toggleAiSidebar,
    isWorkspaceSidebarOpen,
    toggleWorkspaceSidebar,
    isShareDialogOpen,
    closeShareDialog,
  } = useWorkspace();
  const { projects, openCreateDialog, openRenameDialog, openDeleteDialog } =
    useProjectDialogsContext();
  const pathname = usePathname();

  useEffect(() => {
    setProjectName(projectName);
    setProjectId(projectId);
    setIsOwner(isOwner);
    setIsWorkspaceMode(true);
    return () => {
      setProjectName(null);
      setProjectId(null);
      setIsOwner(false);
      setIsWorkspaceMode(false);
    };
  }, [
    projectName,
    projectId,
    isOwner,
    setProjectName,
    setProjectId,
    setIsOwner,
    setIsWorkspaceMode,
  ]);

  const ownedProjects = projects.filter((p) => p.isOwned);
  const sharedProjects = projects.filter((p) => !p.isOwned);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Left sidebar — inline panel, always visible when open */}
      {isWorkspaceSidebarOpen && (
        <aside className="w-72 shrink-0 flex flex-col bg-elevated border-r border-surface-border">
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border shrink-0">
            <span className="text-sm font-semibold text-copy-primary">
              Projects
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleWorkspaceSidebar}
              aria-label="Close sidebar"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden p-3">
            <Tabs defaultValue="my-projects" className="flex-1 flex flex-col">
              <TabsList className="w-full">
                <TabsTrigger value="my-projects" className="flex-1 text-sm">
                  My Projects
                </TabsTrigger>
                <TabsTrigger value="shared" className="flex-1 text-sm">
                  Shared
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="my-projects"
                className="flex-1 mt-2 overflow-hidden"
              >
                {ownedProjects.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-xs text-copy-muted">No projects yet.</p>
                  </div>
                ) : (
                  <ScrollArea className="h-full">
                    <div className="space-y-0.5">
                      {ownedProjects.map((project) => (
                        <WorkspaceProjectItem
                          key={project.id}
                          project={project}
                          isActive={pathname === `/editor/${project.id}`}
                          onRename={openRenameDialog}
                          onDelete={openDeleteDialog}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>

              <TabsContent
                value="shared"
                className="flex-1 mt-2 overflow-hidden"
              >
                {sharedProjects.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-xs text-copy-muted">
                      No shared projects.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-full">
                    <div className="space-y-0.5">
                      {sharedProjects.map((project) => (
                        <WorkspaceProjectItem
                          key={project.id}
                          project={project}
                          isActive={pathname === `/editor/${project.id}`}
                          onRename={openRenameDialog}
                          onDelete={openDeleteDialog}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="p-3 border-t border-surface-border shrink-0">
            <Button className="w-full" size="sm" onClick={openCreateDialog}>
              <Plus className="size-3.5" />
              New Project
            </Button>
          </div>
        </aside>
      )}

      {/* Live collaborative canvas */}
      <div className="flex-1 overflow-hidden">
        <CanvasRoom roomId={projectId} />
      </div>

      {/* Right AI sidebar */}
      <AiSidebar isOpen={isAiSidebarOpen} onClose={toggleAiSidebar} />

      <ShareDialog
        projectId={projectId}
        projectName={projectName}
        isOwner={isOwner}
        open={isShareDialogOpen}
        onClose={closeShareDialog}
      />
    </div>
  );
}

function WorkspaceProjectItem({
  project,
  isActive,
  onRename,
  onDelete,
}: {
  project: Project;
  isActive: boolean;
  onRename: (p: Project) => void;
  onDelete: (p: Project) => void;
}) {
  const router = useRouter();

  function navigate() {
    router.push(`/editor/${project.id}`);
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer",
        isActive ? "bg-accent-dim" : "hover:bg-subtle",
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
      {isActive && <span className="size-1.5 rounded-full bg-brand shrink-0" />}
      <span
        className={cn(
          "flex-1 min-w-0 text-sm truncate",
          isActive ? "text-brand font-medium" : "text-copy-secondary",
        )}
      >
        {project.name}
      </span>
      {project.isOwned && (
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              onRename(project);
            }}
            aria-label={`Rename ${project.name}`}
          >
            <Pencil className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
            aria-label={`Delete ${project.name}`}
            className="text-error hover:text-error"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      )}
    </div>
  );
}

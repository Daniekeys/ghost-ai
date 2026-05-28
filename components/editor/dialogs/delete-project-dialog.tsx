"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { Project } from "@/lib/projects"

interface DeleteProjectDialogProps {
  open: boolean
  project: Project | null
  isLoading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export function DeleteProjectDialog({
  open,
  project,
  isLoading = false,
  onConfirm,
  onClose,
}: DeleteProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && !isLoading && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md bg-elevated border-surface-border rounded-3xl"
      >
        <DialogHeader>
          <DialogTitle className="text-copy-primary">Delete Project</DialogTitle>
          {project && (
            <DialogDescription>
              Are you sure you want to delete &quot;{project.name}&quot;? This
              action cannot be undone.
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogFooter className="border-0 bg-transparent -mx-0 -mb-0 p-0 pt-2 flex-row justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Project"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

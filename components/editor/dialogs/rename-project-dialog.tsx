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
import { Input } from "@/components/ui/input"
import type { Project } from "@/hooks/use-project-dialogs"

interface RenameProjectDialogProps {
  open: boolean
  project: Project | null
  name: string
  onNameChange: (name: string) => void
  onConfirm: () => void
  onClose: () => void
}

export function RenameProjectDialog({
  open,
  project,
  name,
  onNameChange,
  onConfirm,
  onClose,
}: RenameProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md bg-elevated border-surface-border rounded-3xl"
      >
        <DialogHeader>
          <DialogTitle className="text-copy-primary">Rename Project</DialogTitle>
          {project && (
            <DialogDescription>
              Renaming &quot;{project.name}&quot;
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-1.5 py-1">
          <label
            htmlFor="rename-project-name"
            className="text-sm text-copy-secondary"
          >
            Project name
          </label>
          <Input
            id="rename-project-name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && name.trim() && onConfirm()}
          />
        </div>

        <DialogFooter className="border-0 bg-transparent -mx-0 -mb-0 p-0 pt-2 flex-row justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={!name.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

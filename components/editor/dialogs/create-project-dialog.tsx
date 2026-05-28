"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface CreateProjectDialogProps {
  open: boolean
  name: string
  slug: string
  isLoading?: boolean
  onNameChange: (name: string) => void
  onConfirm: () => void
  onClose: () => void
}

export function CreateProjectDialog({
  open,
  name,
  slug,
  isLoading = false,
  onNameChange,
  onConfirm,
  onClose,
}: CreateProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && !isLoading && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md bg-elevated border-surface-border rounded-3xl"
      >
        <DialogHeader>
          <DialogTitle className="text-copy-primary">New Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-1">
          <div>
            <label
              htmlFor="create-project-name"
              className="text-sm text-copy-secondary"
            >
              Project name
            </label>
            <Input
              id="create-project-name"
              placeholder="My Architecture"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              autoFocus
              disabled={isLoading}
              className="text-white mt-3"
              onKeyDown={(e) => e.key === "Enter" && name.trim() && !isLoading && onConfirm()}
            />
          </div>

          {name.trim() && (
            <p className="text-xs font-mono text-copy-muted">
              room ID:{" "}
              <span className="text-copy-secondary">{slug || "—"}</span>
            </p>
          )}
        </div>

        <DialogFooter className="border-0 bg-transparent -mx-0 -mb-0 p-0 pt-2 flex-row justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={!name.trim() || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

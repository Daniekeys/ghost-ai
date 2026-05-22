"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProjectDialogsContext } from "@/components/editor/project-dialogs-provider"

export function NewProjectButton() {
  const { openCreateDialog } = useProjectDialogsContext()
  return (
    <Button className="mt-2" onClick={openCreateDialog}>
      <Plus />
      New Project
    </Button>
  )
}

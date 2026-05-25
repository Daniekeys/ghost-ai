import { Lock } from 'lucide-react'
import Link from 'next/link'

export function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] gap-4">
      <Lock className="h-8 w-8 text-copy-muted" />
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-copy-primary font-medium">
          You don&apos;t have access to this project.
        </p>
        <p className="text-copy-muted text-sm">
          This project may not exist or you haven&apos;t been invited.
        </p>
      </div>
      <Link href="/editor" className="text-brand text-sm hover:underline">
        ← Back to your projects
      </Link>
    </div>
  )
}

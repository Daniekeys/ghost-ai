# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 1 — Design System & UI Primitives

## Current Goal

- Project creation and workspace navigation.

## Completed

- Scaffolded Next.js 16 app (layout.tsx, page.tsx, globals.css with Tailwind v4 import)
- Feature 01: Design System
  - Installed and configured shadcn/ui (Nova preset — Lucide + Geist fonts)
  - Added components: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea (components/ui/)
  - lucide-react installed (^1.16.0)
  - lib/utils.ts with cn() helper (clsx + tailwind-merge)
  - globals.css: dark-only theme — project tokens (--bg-base, --accent-primary, etc.) + shadcn vars aligned to dark palette, mapped via @theme inline; dark class on <html>
- Feature 02: Editor Chrome
  - `components/editor/editor-navbar.tsx` — fixed top navbar (h-14, z-50), left toggle with PanelLeftOpen/PanelLeftClose, center + right reserved
  - `components/editor/project-sidebar.tsx` — fixed overlay sidebar (top-14, z-40, w-72), slides in from left, tabs (My Projects / Shared) with empty states, New Project CTA at bottom
  - Dialog pattern ready for future use via existing `components/ui/dialog.tsx` and project color tokens
- Feature 04: Project Dialogs & Editor Home
  - `app/editor/page.tsx` — home screen: heading, description, New Project button (client component, consumes context)
  - `hooks/use-project-dialogs.ts` — dialog state, form state, loading state, mock projects, slug derivation
  - `components/editor/project-dialogs-provider.tsx` — React context exposing `projects`, `openCreateDialog`, `openRenameDialog`, `openDeleteDialog`
  - `components/editor/dialogs/create-project-dialog.tsx` — name input + live slug preview, Enter submits
  - `components/editor/dialogs/rename-project-dialog.tsx` — prefilled input, auto-focus, Enter submits
  - `components/editor/dialogs/delete-project-dialog.tsx` — destructive confirmation, no input
  - `components/editor/project-sidebar.tsx` — project list, per-item rename/delete (owned only), mobile backdrop scrim
  - `components/editor/editor-shell.tsx` — wires hook + provides context + renders dialogs + mobile scrim
- Feature 03: Authentication (Clerk)
  - `@clerk/nextjs` (^7.3.7) and `@clerk/ui` (^1.12.1) installed
  - `proxy.ts` at project root — `clerkMiddleware` with `createRouteMatcher`; protects all routes except sign-in/sign-up; uses `proxy` export (Next.js 16 convention, renamed from `middleware`)
  - `ClerkProvider` wraps app content inside the root layout `<body>` with `@clerk/ui/themes` `dark` base theme; appearance overrides via CSS custom property references (no hardcoded colors)
  - Removed root-level `<body suppressHydrationWarning>` after validation (`npm run build` clean, no hydration mismatch warnings); hydration warnings remain enabled globally
  - `EditorShell` moved out of root layout into `app/editor/layout.tsx`
  - `app/page.tsx` — server component: redirects authenticated users to `/editor`, unauthenticated to `/sign-in`
  - `app/sign-in/[[...sign-in]]/page.tsx` — two-panel layout (left: logo + tagline + feature list; right: Clerk `<SignIn />`); form-only on small screens
  - `app/sign-up/[[...sign-up]]/page.tsx` — same two-panel layout with Clerk `<SignUp />`
  - `app/editor/page.tsx` — placeholder editor landing page
  - `UserButton` added to editor navbar right section
  - `.env.local` updated with `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
  - `npm run build` passes
- Feature 05: Prisma Data Models & Client
  - `prisma/models/project.prisma` — `Project` (ownerId, name, description?, status enum DRAFT/ARCHIVED, canvasJsonPath?, timestamps, indexes on ownerId and createdAt) and `ProjectCollaborator` (project relation with cascade delete, collaboratorEmail, createdAt, unique on projectId+email, indexes on email and projectId+createdAt)
  - `lib/prisma.ts` — cached singleton; branches on `DATABASE_URL`: `prisma+postgres://` prefix → Accelerate via `accelerateUrl` + `withAccelerate()`; otherwise → `@prisma/adapter-pg` direct connection; cached on `global.prismaGlobal` in development; return type pinned to `PrismaClient` to avoid union-type conflicts from `$extends`
  - Migration `20260522085005_init` applied to Prisma Postgres (pooled.db.prisma.io)
  - Client generated to `app/generated/prisma/`
  - Installed: `@prisma/client`, `@prisma/adapter-pg`, `pg`, `@prisma/extension-accelerate`, `dotenv`
  - `npm run build` passes
- Feature 06: Project REST APIs
  - `app/api/projects/route.ts` — `GET` lists the authenticated user's projects (ordered by `createdAt` desc); `POST` creates a project (name defaults to `"Untitled Project"`)
  - `app/api/projects/[projectId]/route.ts` — `PATCH` renames the project (owner only, name required); `DELETE` deletes the project (owner only, returns 204)
  - Auth: all routes return `401` for unauthenticated requests; mutations return `403` for non-owners
  - `npm run build` passes
- Feature 07: Wire Editor Home to Real APIs
  - `lib/projects.ts` — `getOwnedProjects(userId)` and `getSharedProjects(userEmail)` server-side helpers; `Project` interface (`id`, `name`, `isOwned`)
  - `hooks/use-project-actions.ts` — client hook managing dialog state and real API mutations; create calls `POST /api/projects` then `router.push(/editor/{id})`; rename calls `PATCH` then `router.refresh()`; delete calls `DELETE` then redirects to `/editor` if active workspace, otherwise `router.refresh()`; async transition via `useTransition`
  - `components/editor/new-project-button.tsx` — small `"use client"` CTA that consumes dialog context
  - `app/editor/layout.tsx` — async server component; fetches owned and shared projects via `currentUser()` + helpers; passes both lists to `EditorShell`
  - `app/editor/page.tsx` — converted to server component; renders static heading + `<NewProjectButton />`
  - `components/editor/editor-shell.tsx` — accepts `ownedProjects` and `sharedProjects` props; uses `useProjectActions`; merges lists for context
  - `components/editor/dialogs/create-project-dialog.tsx` — slug preview label updated to "room ID"
  - All dialog and sidebar components updated to import `Project` from `lib/projects`
  - `npm run build` passes
- Feature 08: Editor Workspace Shell
  - `lib/project-access.ts` — `getCurrentIdentity()` returns `{ userId, userEmail }` from Clerk; `checkProjectAccess(projectId, userId, userEmail)` queries project + collaborators, returns `{ project, isOwner }` or `null`
  - `components/editor/access-denied.tsx` — centered layout (lock icon, message, link back to `/editor`); used for missing or unauthorized projects
  - `components/editor/workspace-provider.tsx` — React context (`WorkspaceProvider`, `useWorkspace`) providing `projectName`, `setProjectName`, `isAiSidebarOpen`, `toggleAiSidebar`; wraps EditorShell content
  - `components/editor/editor-shell.tsx` — now wraps all children in `WorkspaceProvider`
  - `components/editor/editor-navbar.tsx` — reads `useWorkspace()`; shows project name in center + Share button + AI toggle when `projectName` is set
  - `components/editor/project-sidebar.tsx` — `ProjectItem` uses `usePathname()` to highlight the active room (`bg-accent-dim text-brand`)
  - `components/editor/workspace-canvas.tsx` — client component; sets `projectName` in context on mount (cleans up on unmount); renders canvas placeholder + conditional AI sidebar placeholder
  - `app/editor/[roomId]/page.tsx` — server component; unauthenticated → redirect `/sign-in`; no access / not found → `<AccessDenied />`; renders `<WorkspaceCanvas projectName={...} />`
  - `hooks/use-project-actions.ts` — delete handler now reads `params.roomId` (was `projectId`) to detect active workspace
  - `npm run build` passes
- Feature 09: Share Dialog
  - `app/api/projects/[projectId]/collaborators/route.ts` — `GET` lists collaborators enriched with Clerk display name + avatar; `POST` invites by email (owner only, self-invite blocked, duplicate returns 409)
  - `app/api/projects/[projectId]/collaborators/[email]/route.ts` — `DELETE` removes collaborator by email (owner only, URL-decoded)
  - `components/editor/dialogs/share-dialog.tsx` — Dialog with copy-link button (temporary "Copied!" feedback), collaborator list (avatar/initials fallback + name/email), remove button (owner only), invite-by-email form (owner only) with inline error display
  - `components/editor/workspace-provider.tsx` — extended with `projectId`, `isOwner`, `isShareDialogOpen`, `openShareDialog`, `closeShareDialog`
  - `components/editor/workspace-canvas.tsx` — accepts `projectId` and `isOwner` props; sets them in context on mount; renders `<ShareDialog />`
  - `app/editor/[roomId]/page.tsx` — passes `projectId` and `isOwner` to `<WorkspaceCanvas />`
  - `components/editor/editor-navbar.tsx` — Share button `onClick` calls `openShareDialog()`
  - `npm run build` passes

## In Progress

- None.

## Next Up

- Feature 10 and beyond (canvas, Liveblocks, AI generation, etc.).

## Open Questions

- None yet.

## Architecture Decisions

- Tailwind v4 CSS-native approach — no tailwind.config.js; all tokens defined via CSS custom properties and @theme inline in globals.css.
- Dark-only theme — no light mode; all variables at :root level, dark class on <html> for dark: variant utilities.
- shadcn/ui components in components/ui/ must not be modified after generation.
- Nova preset: Geist Sans (--font-sans) + Lucide icons.
- `proxy.ts` is the Next.js 16 renamed convention for `middleware.ts`. The exported function is named `proxy` instead of `middleware`.
- Clerk appearance overrides use CSS custom property references (e.g. `'var(--accent-primary)'`), not hardcoded hex values. Theme base is `dark` from `@clerk/ui/themes`.

## Session Notes

- Stack: Next.js 16.2.6, React 19, Tailwind v4 (@tailwindcss/postcss), TypeScript strict.
- @import "shadcn/tailwind.css" resolves via package.json exports "./tailwind.css" → dist/tailwind.css. The CSS language server flags it as unknown — this is a false positive, not a build error.
- Project Tailwind utilities: bg-base, bg-surface, bg-elevated, bg-subtle, text-copy-primary, text-copy-muted, text-copy-faint, border-surface-border, text-brand, bg-accent-dim, text-ai, text-ai-text, bg-error, bg-success, bg-warning.
- Clerk `Appearance` type uses `theme` (not `baseTheme`) for the base theme, and `Variables` uses `colorForeground`/`colorMutedForeground`/`colorInput`/`colorInputForeground` (not `colorText`/`colorInputBackground`).

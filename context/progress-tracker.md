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

- Feature 10: Liveblocks Setup
  - `@liveblocks/node` (^3.19.3) installed
  - `liveblocks.config.ts` — global `Liveblocks` interface typed: `Presence` (`cursor: { x, y } | null`, `isThinking: boolean`), `UserMeta` (`id`, `info: { name, avatar, color }`)
  - `lib/liveblocks.ts` — lazy cached `Liveblocks` node client (`getLiveblocksClient()`); `getCursorColor(userId)` deterministically maps a user ID to one of 12 fixed hex colors via unsigned hash
  - `app/api/liveblocks-auth/route.ts` — `POST` handler: requires Clerk auth (401), parses `projectId` from body (400), verifies project access via `checkProjectAccess` (403), calls `getOrCreateRoom` (private `defaultAccesses: []`, owner `room:write`), calls `identifyUser` with `name`/`avatar`/`color` in `userInfo`, returns session token
  - `.env.local` — `LIVEBLOCKS_SECRET_KEY` placeholder added (value must be set from Liveblocks dashboard)
  - `npm run build` passes
- Feature 11: Base Canvas
  - `types/canvas.ts` — `CanvasNodeData` (`label`, `color?`, `shape?`), `CanvasNode` (`Node<CanvasNodeData, "canvasNode">`), `CanvasEdge` (`Edge<CanvasEdgeData, "canvasEdge">`)
  - `components/editor/canvas/canvas-room.tsx` — `LiveblocksProvider` (auth callback POSTs `projectId: room` to `/api/liveblocks-auth`), `RoomProvider` (initial presence: `cursor: null, isThinking: false`), `ErrorBoundary` + `ClientSideSuspense` with loading/error fallbacks
  - `components/editor/canvas/canvas-flow.tsx` — `useLiveblocksFlow({ suspense: true, nodes: { initial: [] }, edges: { initial: [] } })`, `ReactFlow` with synced nodes/edges + change handlers, `ConnectionMode.Loose`, `fitView`, `Background` (dots), `MiniMap`, `Cursors`
  - `components/editor/workspace-canvas.tsx` — canvas placeholder replaced with `<CanvasRoom roomId={projectId} />`
  - `react-error-boundary` (^6.1.2) installed
  - `npm run build` passes
- Feature 12: Shape Panel
  - `types/canvas.ts` — `CanvasNodeData` extended with `width?: number; height?: number;`
  - `components/editor/canvas/canvas-node.tsx` — custom `"canvasNode"` renderer; bordered rectangle with centered label, handles on all four sides; respects `data.width`/`data.height` via inline style; highlights border on selection
  - `components/editor/canvas/shape-panel.tsx` — `ShapePanel` renders inside React Flow `Panel position="bottom-center"`; pill-shaped toolbar with six draggable shape buttons (rectangle, diamond, circle, pill, cylinder, hexagon); `ShapeDragPayload` interface (`shape`, `width`, `height`) serialized to `application/ghost-shape` dataTransfer key; default sizes: rectangle 160×80, diamond 140×120, circle 80×80, pill 160×64, cylinder 100×100, hexagon 120×120
  - `components/editor/canvas/canvas-flow.tsx` — refactored: outer `CanvasFlow` wraps inner `CanvasFlowInner` in `ReactFlowProvider`; inner component uses `useReactFlow().screenToFlowPosition` for coordinate conversion; `onDragOver` + `onDrop` on wrapper div; reads `application/ghost-shape` payload, creates `CanvasNode` with `type: "canvasNode"`, centered on drop position; node ID: `${shape}-${Date.now()}-${counter}`; `nodeTypes` constant registered at module level; `<ShapePanel />` rendered as React Flow child
  - `npm run build` passes
- Feature 13: Node Shape Rendering & Drag Preview
  - `components/editor/canvas/canvas-node.tsx` — shape-specific rendering: rectangle/pill/circle use CSS (`rounded-xl` / `rounded-full`); diamond/hexagon/cylinder render with inline SVG polygons/paths that scale with node size; subtle border at rest, bright `--accent-primary` stroke when selected; label overlaid via absolute div for SVG shapes
  - `components/editor/canvas/shape-panel.tsx` — drag ghost preview: `onDragStart` suppresses native browser ghost via transparent 1×1 GIF `setDragImage`; tracks cursor via `document` `dragover` listener (added/removed only while dragging); renders `GhostShape` via `createPortal` to `document.body` at `position: fixed` centered on cursor with `opacity: 0.75`; cleared on `dragend`/`drop`; `GhostShape` mirrors the same SVG/CSS rendering as `CanvasNodeComponent`; drag/drop logic in `canvas-flow.tsx` unchanged
  - `npm run build` passes

- Feature 14: Node Resizing & Inline Label Editing
  - `components/editor/canvas/canvas-actions-context.tsx` — React context (`CanvasActionsContext`, `useCanvasActions`) exposing `onNodesChange` from `useLiveblocksFlow` to node components
  - `components/editor/canvas/canvas-flow.tsx` — provides `CanvasActionsContext` wrapping `ReactFlow`; context value memoized via `useMemo`
  - `components/editor/canvas/canvas-node.tsx` — `NodeResizer` added to all shapes (`isVisible={selected}`, `minWidth=60`, `minHeight=40`, subtle dark-themed handle/line styles); rendering uses `nodeWidth ?? data.width ?? 160` / `nodeHeight ?? data.height ?? 80` so post-resize dimensions are reflected; double-click activates inline textarea editing; `EditingTextarea` positioned `absolute inset-0` over the label, `nodrag nopan nowheel` classes prevent canvas drag/pan/scroll during edit; blur and Enter commit via `NodeReplaceChange` through `onNodesChange`; Escape cancels; label span hidden (`invisible`) while editing
  - `npm run build` passes

- Feature 15: Node Color Toolbar
  - `types/canvas.ts` - added `NODE_COLORS` palette from `ui-context.md`, `DEFAULT_NODE_COLOR`, `NodeColorPair`, and `CanvasNodeData.textColor`; converted empty `CanvasEdgeData` interface to a type alias
  - `components/editor/canvas/canvas-flow.tsx` - newly dropped nodes now receive the default predefined background/text color pair while preserving existing drag/drop behavior
  - `components/editor/canvas/canvas-node.tsx` - nodes render with their stored background/text colors across CSS and SVG shapes; selected nodes show a `NodeToolbar` above the node with one swatch per predefined pair; swatch clicks replace only the selected node's `data.color` and `data.textColor` through the existing Liveblocks-backed `onNodesChange`; toolbar interactions use `nodrag nopan nowheel` and event propagation guards
  - Visibility follow-up: empty dropped nodes now keep the paired text color for the placeholder label and use a stronger unselected border so default neutral nodes remain visible on the dark canvas
  - Size follow-up: increased `ShapePanel` default drag payload dimensions; fixed sizing at the React Flow node layer by setting `initialWidth`/`initialHeight` on newly dropped nodes and making `CanvasNodeComponent` prefer stored dimensions over early content measurements; resize previews remain live and resize-end dimensions are persisted back into node data
  - `npm.cmd run build` passed before final formatting polish; final rerun was blocked by sandboxed Google Fonts fetch after escalation was declined; `npx.cmd tsc --noEmit` passes
- Feature 16: Edge Behavior
  - `components/editor/canvas/canvas-node.tsx` - connection handles now appear on top, right, bottom, and left for every node; handles use small light dots with dark borders and fade in on node hover
  - `components/editor/canvas/canvas-edge.tsx` - added custom `canvasEdge` renderer using `getSmoothStepPath` right-angle routing, rounded light strokes, wider invisible interaction width, hover/selection brightening, and `EdgeLabelRenderer` label placement
  - `components/editor/canvas/canvas-flow.tsx` - registered `edgeTypes`, added default custom edge options with closed arrowheads, and creates new Liveblocks-backed connections as typed `canvasEdge` edges
  - `components/editor/canvas/canvas-actions-context.tsx` - exposes Liveblocks-backed `onEdgesChange` to edge components for inline label persistence
  - `types/canvas.ts` - `CanvasEdgeData` now supports an optional `label`
  - `npm.cmd run build` passes
- Feature 17: Canvas Ergonomics
  - `components/editor/canvas/canvas-control-bar.tsx` - added a bottom-left floating pill control bar with zoom out, fit view, zoom in, undo, redo, and a divider between zoom/history groups
  - `components/editor/canvas/canvas-flow.tsx` - removed the minimap; wired control-bar zoom actions to the React Flow instance with short animation durations; wired undo/redo through Liveblocks history hooks and disabled unavailable history buttons
  - `hooks/use-keyboard-shortcuts.ts` - added canvas keyboard shortcuts for zoom in/out and undo/redo while ignoring inputs, textareas, and content-editable fields
  - `npm.cmd run build` passes
- Feature 18: Starter Templates
  - `components/editor/starter-templates.ts` - added typed static canvas templates for microservices commerce, CI/CD pipeline, and event-driven systems using the shared canvas node/edge types and node color palette
  - `components/editor/starter-templates-modal.tsx` - added a dark themed template picker dialog with scrollable card grid, lightweight SVG diagram previews, and per-template import actions
  - `components/editor/workspace-provider.tsx` and `components/editor/editor-navbar.tsx` - added workspace state and navbar entry point for opening starter templates
  - `components/editor/canvas/canvas-flow.tsx` - imports selected templates through the existing Liveblocks-backed flow handlers, clearing current nodes/edges before adding the selected template and fitting the view afterward
  - Follow-up visual polish: widened the import dialog, changed cards to landscape preview-first layouts, improved SVG preview legibility, shortened card descriptions, and matched the quieter outline import action style
  - Width follow-up: increased the template dialog to an explicit `1120px` desktop width with `max-w-none` and wider card columns so the three templates sit comfortably side by side
  - `npm.cmd run build` passes

- Feature 19: Presence Avatars & Live Cursors
  - `liveblocks.config.ts` — renamed `Presence.isThinking` → `Presence.thinking` to match spec
  - `components/editor/canvas/canvas-room.tsx` — updated `initialPresence` to `thinking: false`; wrapped `RoomProvider` children in `relative div` so `PresenceAvatars` can overlay the canvas; imports and renders `<PresenceAvatars />`
  - `components/editor/canvas/presence-avatars.tsx` — new component; uses `useOthers()` (filtered against current Clerk user ID via `useUser()`) to render up to 5 overlapping collaborator avatars with photo or initials fallback, subtle `ring-2 ring-surface` ring, +N overflow chip; shows a divider only when collaborators exist; renders `UserButton` for the current user at matching size; positioned `absolute top-3 right-3 z-10` inside the canvas area
  - `components/editor/canvas/canvas-flow.tsx` — imports `useUpdateMyPresence`; broadcasts canvas-coordinate cursor on `onMouseMove` (via `screenToFlowPosition`) and clears to `null` on `onMouseLeave` on the canvas wrapper div; existing `<Cursors />` from `@liveblocks/react-flow` renders the live colored pointers with name badges for other participants
  - Editor home navbar unchanged; presence UI is canvas-view only
  - `npm run build` passes

- Feature 20: AI Sidebar Shell
  - `components/editor/ai-sidebar.tsx` — extracted AI sidebar into its own component; accepts `isOpen` and `onClose` props controlled by the parent workspace context
  - Header: `AI Workspace` title, `Collaborate with Ghost AI` subtitle, bot icon (`text-ai-text`), and close button aligned right
  - Two-tab layout using shadcn `Tabs`: `AI Architect` and `Specs`; active tab styled with `bg-accent text-accent-foreground`, inactive with `text-copy-muted`
  - AI Architect tab: scrollable chat area with empty state (bot icon, description, three starter prompt chips styled as `bg-subtle text-ai-text` pills); user messages right-aligned (`bg-accent-dim border-2 border-brand/50 text-copy-primary`); assistant messages left-aligned (`bg-elevated border border-surface-border text-ai-text`); auto-resizing textarea (min 72px, max 160px), Enter submits, Shift+Enter newline; Send button (`bg-brand text-base`)
  - Specs tab: `Generate Spec` button (`bg-brand text-base`), demo spec card (`bg-elevated border-surface-border`) with file icon, title, snippet, and disabled Download action
  - `components/editor/workspace-canvas.tsx` — replaced inline AI sidebar placeholder with `<AiSidebar isOpen={isAiSidebarOpen} onClose={toggleAiSidebar} />`; removed unused `Bot` and `Settings` lucide imports
  - `npm run build` passes
- Clerk server identity hardening
  - `lib/project-access.ts` now derives `userId` from `auth()` before calling `currentUser()`, and catches `currentUser()` failures so Clerk Backend API errors do not crash `/editor/[roomId]` server rendering
  - `npm.cmd run build` passes
- Liveblocks collaborator access fix
  - `lib/liveblocks.ts` now exposes `grantLiveblocksRoomAccess(roomId, userId)`, which upserts private rooms and patches the authenticated user's `room:write` access on existing rooms
  - `app/api/liveblocks-auth/route.ts` now calls the grant helper after verifying Prisma project access, so invited collaborators receive matching Liveblocks room permissions before token issuance
  - `npm.cmd run build` passes

- Feature 21: Delete Nodes and Edges
  - `hooks/use-keyboard-shortcuts.ts` — extended `UseKeyboardShortcutsOptions` with `onDelete`; handles `Delete` and `Backspace` at the `window` level by reading selected nodes/edges from the flow instance and calling `onDelete`; skips editable targets and no-ops when nothing is selected
  - `components/editor/canvas/canvas-flow.tsx` — passes `onDelete` (from `useLiveblocksFlow`) to `useKeyboardShortcuts` so window-level key events propagate through the Liveblocks-backed delete handler
  - `npx tsc --noEmit` passes
- Bug Fixes (current-issue.md)
  - `components/editor/canvas/canvas-node.tsx` — `Handles()` now renders both `type="source"` and `type="target"` handles at each of the four positions (top, right, bottom, left); source ids unchanged (`top`, `right`, `bottom`, `left`), target ids suffixed with `-t`; ensures connections can be initiated and received from all four handles
  - `components/editor/canvas/canvas-flow.tsx` — removed `fitView` prop from `<ReactFlow>`; the prop was triggering an automatic zoom-in when the first node was added to an empty canvas, shifting the node's visual position and causing the apparent drop-offset bug; explicit `flow.fitView()` in the canvas-load `useEffect` is preserved
  - `components/editor/editor-navbar.tsx` — `<UserButton />` is now conditionally rendered only when `!isWorkspaceMode`; in workspace context the UserButton is already provided by `<PresenceAvatars />` inside the canvas room
  - `components/editor/canvas/canvas-flow.tsx` and `hooks/use-canvas-autosave.ts` — fixed React Hooks compliance by removing the conditional `useCanvasAutosave` call; the hook now accepts `projectId: string | null` as its first arg and always returns a unified `{ saveStatus, triggerSave }` shape, reporting `saveStatus: "idle"` and a no-op save behavior when `projectId` is null
  - `npm run build` passes

- Feature 22: Trigger.dev Setup
  - `@trigger.dev/sdk` installed
  - `trigger.config.ts` at project root — `project` placeholder must be replaced with ref from cloud.trigger.dev
  - `trigger/generate-design.ts` — `generateDesign` task stub; accepts `projectId`, `prompt`, `canvasSnapshot`; TODOs for Anthropic call + Liveblocks room write
  - `trigger/generate-spec.ts` — `generateSpec` task stub; accepts `projectId`, `canvasSnapshot`; TODOs for Anthropic call + Vercel Blob upload + Prisma Spec record
  - `.env.local` — `TRIGGER_SECRET_KEY` placeholder added (value from cloud.trigger.dev > API Keys)
  - Start local dev worker: `npx trigger dev`
- Feature 22: Design Agent API (backend task wiring)
  - `prisma/models/task-run.prisma` — `TaskRun` model (`runId` unique, `projectId`, `userId`, `createdAt`; index on `runId`, compound index on `userId`+`projectId`)
  - Migration `20260527022320_add_task_run` applied to Prisma Postgres
  - `trigger/design-agent.ts` — `designAgent` task (id `"design-agent"`, accepts `prompt` + `roomId`, logs input, TODOs for AI + Liveblocks)
  - `app/api/ai/design/route.ts` — `POST`: verifies Clerk auth + project access, triggers `design-agent` task via Trigger.dev SDK, creates `TaskRun` record, returns `runId`
  - `app/api/ai/design/token/route.ts` — `POST`: verifies Clerk auth, looks up `TaskRun` by `runId`+`userId` (ownership check), issues Trigger.dev public read token scoped to that run, returns `token`
  - `npm run build` passes
- Feature 23: Design Agent Logic (AI generation + canvas update)
  - `trigger/design-agent.ts` — full implementation: Gemini (`gemini-1.5-flash-latest` via `@ai-sdk/google` + `generateObject`) generates structured node/edge schema; `liveblocks.setPresence` sets AI agent presence (`userId: "ai-ghost"`, `thinking: true/false`, TTL-based); `liveblocks.broadcastEvent` sends `AI_STATUS`/`AI_COMPLETE`/`AI_ERROR` events; `liveblocks.mutateStorage` writes nodes + edges directly into the `"flow"` LiveObject (LiveMap for nodes, LiveMap for edges); edges referencing missing nodes are silently skipped; error path broadcasts `AI_ERROR` and rethrows
  - `liveblocks.config.ts` — `RoomEvent` typed as union: `AI_STATUS | AI_COMPLETE | AI_ERROR` (each with `message` and `runId`)
  - `components/editor/workspace-provider.tsx` — added `AiTaskStatus` interface and `aiStatus`/`setAiStatus` to context; allows canvas and sidebar to share AI task progress without a direct Liveblocks hook crossing the RoomProvider boundary
  - `components/editor/canvas/canvas-flow.tsx` — `useEventListener` bridges Liveblocks room events into workspace context `setAiStatus`; canvas-level `Panel position="top-center"` overlay shows thinking/complete/error with matching icon and message; overlay auto-clears after 6-8 s on terminal events
  - `components/editor/ai-sidebar.tsx` — wired to `POST /api/ai/design` on send; tracks `pendingRunId`; `useEffect` on `aiStatus` adds assistant response message when matching run completes or errors; loading state disables input + shows spinner; starter chips disabled while loading
  - `app/api/ai/design/route.ts` — passes `userId` in task payload; `runId` sourced from `ctx.run.id` inside the task
  - `npm run build` passes

- Feature 24: AI Presence State
  - `types/tasks.ts` — `AiStatusFeedPayloadSchema` (zod) with `message`, `type`, `runId`, `text?`, `timestamp`; validates all incoming feed messages before display
  - `liveblocks.config.ts` — `Storage.aiStatusFeed` typed as `{ message, type, runId, timestamp, text? } | null`; single source of truth for shared AI activity
  - `components/editor/canvas/canvas-cursor.tsx` — custom `CanvasCursor` component for `<Cursors components={{ Cursor }}>`: reads `thinking` from other user's presence via `useOther`; shows `Loader2` spinner in the name badge when `thinking: true`
  - `components/editor/canvas/canvas-flow.tsx` — added `useMutation` to write to `aiStatusFeed` in Storage on `AI_STATUS`/`AI_COMPLETE`/`AI_ERROR` events; clears feed to `null` after terminal-event timeout; passes `CanvasCursor` as custom cursor renderer
  - `components/editor/canvas/canvas-room.tsx` — added `initialStorage={{ aiStatusFeed: null }}` to `RoomProvider`; moved `AiSidebar` rendering inside the `RoomProvider` boundary so it can access Liveblocks Storage; renders as flex row (canvas + sidebar)
  - `components/editor/ai-sidebar.tsx` — replaced workspace context `aiStatus` bridge with `useStorage((root) => root.aiStatusFeed)` from `@liveblocks/react`; validates feed via `AiStatusFeedPayloadSchema.safeParse`; derives `feedIsThinking` from validated feed; shared status indicator strip appears for ALL room members when AI is active; `inputDisabled = isLoading || feedIsThinking` disables input for everyone during generation
  - `components/editor/workspace-canvas.tsx` — removed `AiSidebar` import and render (now inside `CanvasRoom`); removed unused `isAiSidebarOpen`/`toggleAiSidebar` destructuring
  - `npm run build` passes

- Feature 25: Sidebar Chat Feed
  - `types/tasks.ts` — `ChatMessageSchema` (zod) with `id`, `sender` (`id`, `name`), `role` (`"user"`), `content`, `timestamp`; `ChatMessage` type alias
  - `liveblocks.config.ts` — `Storage.aiChat` typed as `LiveList<{...}>` (separate from `aiStatusFeed`); `LiveList` imported from `@liveblocks/client`
  - `components/editor/canvas/canvas-room.tsx` — `initialStorage` extended with `aiChat: new LiveList([])`
  - `components/editor/ai-sidebar.tsx` — added "Chat" tab (third tab alongside Architect and Specs); subscribes to `aiChat` via `useStorage`; sends messages via `useMutation` appending to the `LiveList`; validates each incoming message via `ChatMessageSchema.safeParse` before rendering; shows sender name, relative timestamp, and content per message; own messages right-aligned with brand border, others left-aligned; input clears on successful send; shows small error text if mutation throws; input and send disabled while storage or self not yet loaded; `useSelf` from `@liveblocks/react` provides current user id and name
  - `npm run build` passes

- Feature 26: Design Agent Frontend
  - `types/tasks.ts` — `ChatMessageSchema.role` widened to `z.enum(["user", "assistant"])`; added optional `source: z.enum(["architect", "chat"])` field to separate tab messages
  - `liveblocks.config.ts` — `Storage.aiChat` updated to `role: "user" | "assistant"` and `source?: "architect" | "chat"`
  - `app/api/ai/design/route.ts` — after triggering task, creates a scoped `publicToken` via `triggerAuth.createPublicToken` and returns `{ runId, publicToken }` in the response
  - `components/editor/ai-sidebar.tsx` — `useRealtimeRun` (from `@trigger.dev/react-hooks`) tracks run status in real time; on submit: pushes user message to `aiChat` with `source: "architect"`, calls `POST /api/ai/design`, stores `runId` + `publicToken`; `useEffect` on `activeRun.status` pushes AI response to `aiChat` on terminal status and resets loading state; architect tab reads and displays only `source === "architect"` messages; chat tab filters to `source === "chat"` (or untagged); removed header-level status strip; added compact status strip above input in architect tab (dark base + brand accent pulse); user bubbles: `bg-brand text-white`; AI bubbles: dark elevated + `text-ai-text`; input disabled and spinner shown while run is active; `feedIsThinking` from `aiStatusFeed` provides collaborative blocking so all clients see active state
  - `npx tsc --noEmit` passes

- Feature 27: Spec Generation Flow (backend)
  - `app/api/ai/spec/route.ts` — `POST`: authenticates user via Clerk; validates body (`roomId`, `chatHistory`, `nodes`, `edges`) with Zod; resolves project access from `roomId` via `checkProjectAccess` (never trusts client-supplied `projectId`); triggers `generate-spec` task; creates `TaskRun` record; returns `runId`
  - `app/api/ai/spec/token/route.ts` — `POST`: authenticates user; validates `runId` with Zod; verifies `TaskRun` ownership via Prisma; issues Trigger.dev public read token scoped to that run (1h expiry); returns token
  - `trigger/generate-spec.ts` — `generateSpec` `schemaTask`; Zod schema validates `projectId`, `roomId`, `chatHistory`, `nodes`, `edges`; builds structured prompt from node/edge graph + chat context; calls OpenRouter (`google/gemini-2.0-flash-001`) for Markdown spec generation; updates run metadata (`status`, `progress`) for realtime tracking; returns `{ spec: string }` as plain Markdown task output
  - `npx tsc --noEmit` passes

- Feature 28: Spec Persistence & Download
  - `prisma/models/project-spec.prisma` — `ProjectSpec` model (`id`, `projectId` FK with cascade delete, `filePath` Blob URL, `createdAt`; indexes on `projectId` and `projectId+createdAt`)
  - `prisma/models/project.prisma` — added `specs ProjectSpec[]` relation to `Project`
  - Migration `20260527211341_add_project_spec` applied to Prisma Postgres
  - `trigger/generate-spec.ts` — after AI generation, uploads Markdown to Vercel Blob at `specs/{projectId}/{specId}.md` (private, `text/markdown`); creates `ProjectSpec` record in DB with blob URL; returns `{ spec, specId }` from task
  - `app/api/projects/[projectId]/specs/[specId]/download/route.ts` — `GET`: authenticates user via Clerk; verifies project access via `checkProjectAccess`; verifies spec belongs to that project via Prisma; fetches blob using stored `filePath`; returns Markdown as `attachment; filename="spec-{specId}.md"`; returns 401/403/404 appropriately
  - `npm run build` passes

- Feature 29: Spec UI Integration
  - `app/api/projects/[projectId]/specs/route.ts` — `GET` lists specs for a project (newest first); returns `id` and `createdAt` only — blob URL never sent to client
  - `components/editor/ai-sidebar.tsx` — Specs tab replaced with live implementation: fetches spec list on tab activation; compact clickable list items (truncated ID-based filename + formatted date + hover-revealed download button); preview Dialog fetches content via existing download endpoint and renders it as Markdown using `react-markdown` (dynamic import, ssr:false); download action uses anchor-click pattern to trigger browser file download; Tabs converted from `defaultValue` to controlled `value/onValueChange` to drive the fetch effect
  - `app/globals.css` — added `.prose-spec` CSS class to style rendered Markdown elements (headings, paragraphs, lists, code, blockquote, etc.) using project CSS custom property tokens; no @tailwindcss/typography dependency
  - `react-markdown` installed (ESM-only, loaded via `next/dynamic`)
  - `npm run build` passes

## In Progress

- None

## Next Up

- Feature 30 and beyond.

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

# Canvarch — Application Overview

## What Is Canvarch?

Canvarch is a real-time collaborative system design workspace. Users describe a software architecture in plain English, an AI agent maps that system onto a shared visual canvas, collaborators refine the design together in real time, and the application generates a technical Markdown specification from the resulting graph.

It is built for engineers and teams who want to go from idea to documented architecture without switching between tools or writing boilerplate spec documents by hand.

---

## Core User Flow

1. User signs in via Clerk authentication.
2. User creates or selects a project from the editor home.
3. User enters the project workspace (a dedicated room URL).
4. User optionally imports a prebuilt starter system design template into the canvas.
5. User prompts Canvarch to generate or extend the architecture.
6. The AI agent generates nodes and edges directly into the shared collaborative canvas.
7. Collaborators edit, resize, recolor, and connect nodes in real time.
8. User triggers spec generation from the AI sidebar.
9. A Markdown technical specification is generated, persisted, and linked to the project.
10. User previews the spec in the sidebar or downloads it as a `.md` file.

---

## Features

### Authentication & Project Management

- Sign-in and sign-up via Clerk with a branded two-panel layout.
- Route protection — unauthenticated users are redirected to `/sign-in`.
- Project creation with auto-derived room IDs.
- Project rename and delete with ownership enforcement.
- Collaborator invitation by email with role-based access (owner vs. collaborator).
- Share dialog with copy-link, collaborator list, and invite/remove controls.

### Collaborative Canvas

- Full-viewport real-time canvas powered by Liveblocks and React Flow.
- Live cursors with collaborator names and color-coded pointers.
- Presence avatar stack (top-right) showing all active room members with photo or initials fallback.
- AI presence indicator — a spinning cursor badge when Canvarch is thinking.
- Node creation by drag-and-drop from the shape panel toolbar.
- Six node shapes: rectangle, diamond, circle, pill, cylinder, hexagon.
- Node inline label editing via double-click with commit on Enter or blur.
- Node resizing via drag handles on selection.
- Eight color themes per node, selectable from a toolbar on selection.
- Custom edge renderer with smooth-step right-angle routing, arrowheads, and hover brightening.
- Edge label editing inline.
- Delete selected nodes and edges via `Delete` or `Backspace`.
- Keyboard shortcuts for zoom in/out, undo, and redo.
- Floating control bar (bottom-left) for zoom, fit view, and history.
- Canvas autosave to Vercel Blob.

### Starter System Design Templates

A curated library of prebuilt architecture templates users can import into the active canvas at any time. Templates clear the current canvas and populate it with a fully designed graph.

Included templates:

- **Microservices E-Commerce** — API gateway, auth, order, product, payment, and notification services with an event bus and shared databases.
- **CI/CD Pipeline** — source control, build server, test runner, security scan, artifact registry, staging, and production deployment stages.
- **Event-Driven System** — event producer, message broker, multiple consumer services, dead-letter queue, and monitoring layer.

### AI Architecture Generation

- User types a natural language prompt in the AI Architect tab.
- A durable background task runs on Trigger.dev (Gemini `gemini-1.5-flash-latest` via the AI SDK).
- The AI generates a structured schema of nodes and edges, which is written directly into the shared Liveblocks room.
- All collaborators see the generated design appear live on the canvas.
- Real-time status strip in the sidebar tracks task progress (thinking, complete, error).
- Input is locked for all room members while generation is running.
- Prompt history is persisted in shared Liveblocks storage as a per-run chat log.

### Spec Generation

- User clicks "Generate Spec" in the Specs tab of the AI sidebar.
- A durable background task calls OpenRouter (`google/gemini-2.0-flash-001`) with the canvas graph and chat history as context.
- The output is a structured Markdown technical specification.
- The spec is uploaded to Vercel Blob and a `ProjectSpec` record is created in the database.
- The Specs tab lists all generated specs for the project with formatted timestamps.
- Each spec can be previewed in a full-screen dialog with rendered Markdown styling.
- Specs can be downloaded directly from the sidebar.

### AI Sidebar

A slide-over panel on the right of the workspace with three tabs:

- **AI Architect** — prompt input, streamed chat log, and real-time run status strip.
- **Chat** — general room chat shared by all collaborators, persisted in Liveblocks Storage.
- **Specs** — spec list, preview dialog, and download action.

---

## Technology Stack

| Layer | Technology | Role |
|---|---|---|
| Framework | Next.js 16 + TypeScript | Full-stack app, server/client boundaries |
| UI | Tailwind v4 + shadcn/ui | Styling and component composition |
| Fonts | Geist Sans + Geist Mono | UI text and monospace code |
| Icons | Lucide React | Stroke-only icon set |
| Auth | Clerk | Identity, route protection, and user metadata |
| Database | Prisma + PostgreSQL (Prisma Postgres) | Project metadata, specs, task runs, collaborators |
| Canvas | Liveblocks + React Flow | Shared real-time canvas, presence, cursors, storage |
| Background Tasks | Trigger.dev v4 | Durable AI generation workflows |
| AI Models | Gemini 1.5 Flash (design), Gemini 2.0 Flash via OpenRouter (specs) | Architecture and spec generation |
| Artifact Storage | Vercel Blob | Canvas snapshots and generated Markdown specs |

---

## Brand & Visual Design

### Theme

**Dark only.** No light mode. The visual language is a dark technical workspace — near-black backgrounds, layered surfaces, and vivid accent colors for interactive elements. All colors are defined as CSS custom properties in `globals.css`.

### Color Palette

| Role | CSS Variable | Hex Value | Description |
|---|---|---|---|
| Page background | `--bg-base` | `#080809` | Deepest background, page-level |
| Surface | `--bg-surface` | `#111114` | Card and panel backgrounds |
| Elevated surface | `--bg-elevated` | `#18181c` | Dialogs, elevated panels |
| Subtle surface | `--bg-subtle` | `#1e1e23` | Slightly raised UI zones |
| Default border | `--border-default` | `#2a2a30` | Standard separators |
| Subtle border | `--border-subtle` | `#3a3a42` | Softer dividers |
| Primary text | `--text-primary` | `#f0f0f4` | Headings and body copy |
| Secondary text | `--text-secondary` | `#c0c0cc` | Subtext and labels |
| Muted text | `--text-muted` | `#808090` | Placeholders and hints |
| Faint text | `--text-faint` | `#505060` | Disabled or decorative text |
| **Brand accent (cyan)** | `--accent-primary` | `#00c8d4` | Primary CTA, links, active states |
| Brand accent dim | `--accent-primary-dim` | `rgba(0, 200, 212, 0.12)` | Subtle highlight fills |
| **AI accent (indigo-purple)** | `--accent-ai` | `#6457f9` | AI-generated content borders and markers |
| AI text | `--accent-ai-text` | `#8b82ff` | AI message text and icons |
| Error | `--state-error` | `#ff4d4f` | Error states and destructive actions |
| Success | `--state-success` | `#34d399` | Success states and confirmations |
| Warning | `--state-warning` | `#fbbf24` | Warning notices |

**Primary brand color: `#00c8d4` (cyan)** — used for CTAs, active nav items, brand text, and interactive highlights.

**AI color: `#6457f9` (indigo-purple)** — exclusively used to distinguish AI-generated content and AI status indicators from user-created content.

### Canvas Node Color Palette

Eight predefined color pairs — dark fill with a vivid contrasting text color — available on every canvas node.

| Fill | Text | Character |
|---|---|---|
| `#1F1F1F` | `#EDEDED` | Neutral dark (default) |
| `#10233D` | `#52A8FF` | Blue |
| `#2E1938` | `#BF7AF0` | Purple |
| `#331B00` | `#FF990A` | Orange |
| `#3C1618` | `#FF6166` | Red |
| `#3A1726` | `#F75F8F` | Pink |
| `#0F2E18` | `#62C073` | Green |
| `#062822` | `#0AC7B4` | Teal |

### Typography

| Role | Font | Usage |
|---|---|---|
| UI text | Geist Sans | All interface text, labels, and headings |
| Code / mono | Geist Mono | Spec previews, code blocks, and IDs |

### Border Radius Scale

| Context | Class | Usage |
|---|---|---|
| Inline / small elements | `rounded-xl` | Buttons, chips, badges, input fields |
| Cards / panels | `rounded-2xl` | Sidebar panels, project cards, list items |
| Modals / overlays | `rounded-3xl` | Dialogs, share modal, template picker |

### Layout Patterns

- **Editor workspace**: full-viewport — floating sidebar overlay left, center canvas, slide-over AI sidebar right.
- **Sidebars**: floating overlay with dark semi-transparent background and subtle border.
- **Modals**: centered overlay with `rounded-3xl`, dark background, backdrop blur.
- **Navbar**: fixed top bar (`h-14`) with dark background and bottom border.
- **Shape panel**: pill-shaped floating toolbar centered at the bottom of the canvas.
- **Control bar**: floating pill bottom-left with zoom and history controls.

### Canvas Visual Style

- Canvas background: React Flow dot-grid on `--bg-base`.
- Edge style: smooth-step right-angle paths, white stroke (`#f8fafc`), closed arrowhead, thin stroke (edges are visually secondary to nodes).
- Connection handles: small white circles, hidden by default, revealed on node hover at all four sides.
- Node selection: brightened `--accent-primary` border stroke.
- Node resizer: subtle dark-themed handles, visible only on selection.

---

## Data & Storage Model

| Data type | Storage location |
|---|---|
| Projects, collaborators, specs metadata, task runs | PostgreSQL via Prisma |
| Canvas snapshots | Vercel Blob at `canvas/{projectId}.json` |
| Generated Markdown specs | Vercel Blob at `specs/{projectId}/{specId}.md` |
| Real-time canvas state (nodes, edges, chat, AI status) | Liveblocks Storage |
| User presence and cursors | Liveblocks Presence |

---

## Access & Security Model

- Every project has a single owner (Clerk user ID).
- Projects can include additional collaborators identified by email.
- Only authenticated users can access any route beyond `/sign-in` and `/sign-up`.
- Only the owner or a confirmed collaborator can view or mutate project resources.
- Liveblocks room tokens are issued only after server-side project membership verification.
- Trigger.dev public tokens are scoped to specific run IDs and issued only to the user who triggered that run.
- Blob URLs are never sent directly to clients — downloads are proxied through authenticated API routes.

---

## Scope

### In Scope

- Authentication and route protection
- Project creation, ownership, and management
- Collaborator access and invitation
- Starter system design template library and import
- Real-time shared canvas with nodes, edges, and presence
- AI-powered architecture generation from natural language prompts
- AI-powered Markdown spec generation from the canvas graph
- Persistent storage for project metadata and generated artifacts
- Spec preview and download

### Out of Scope

- Billing and subscription systems
- Enterprise permission tiers beyond owner and collaborator
- Versioned spec history and review workflows
- Production object storage migration
- Mobile-native applications

# Ghost AI — Phase 3: Workspace + Canvas UI

> **Instructions for Claude Code**: This is Phase 3. Phases 1–2 built the design system, landing page, auth pages, and editor home. This phase builds the full workspace — the core product UI. Use the same CSS custom properties throughout. Write every component completely.

---

## Design System Reference (from Phase 1)

```
--bg-base: #080809       --bg-surface: #111114     --bg-elevated: #18181c
--bg-subtle: #1e1e23     --border-default: #2a2a30  --border-subtle: #3a3a42
--text-primary: #f0f0f4  --text-secondary: #c0c0cc  --text-muted: #808090
--accent-primary: #00c8d4  --accent-primary-dim: rgba(0,200,212,0.12)
--accent-ai: #6457f9       --accent-ai-dim: rgba(100,87,249,0.15)
--accent-ai-text: #8b82ff  --radius-sm: 12px  --radius-md: 16px  --radius-lg: 24px
```

Canvas node color pairs (fill → text):
`#1F1F1F→#EDEDED` | `#10233D→#52A8FF` | `#2E1938→#BF7AF0` | `#331B00→#FF990A` | `#3C1618→#FF6166` | `#3A1726→#F75F8F` | `#0F2E18→#62C073` | `#062822→#0AC7B4`

---

## Architecture Overview

The workspace (`/editor/[id]`) is a full-viewport layout with three layers:

```
┌─────────────────────────────────────────────────┐
│  Navbar (56px, fixed top)                        │
├────────────┬────────────────────────┬────────────┤
│            │                        │            │
│  Left      │   Canvas (fills        │  AI        │
│  Sidebar   │   remaining space)     │  Sidebar   │
│  (optional)│                        │  (320px)   │
│            │                        │            │
└────────────┴────────────────────────┴────────────┘
│  Shape Panel Toolbar (floating, bottom-center)   │
│  Control Bar (floating, bottom-left)             │
```

The canvas fills all remaining space after the sidebars. Sidebars are overlays (not displacing the canvas).

---

## Files to Build This Phase

1. `app/editor/[id]/page.tsx` — workspace root layout
2. `components/workspace/WorkspaceNavbar.tsx` — workspace-specific top bar
3. `components/workspace/AISidebar.tsx` — right AI sidebar with 3 tabs
4. `components/workspace/ShapePanel.tsx` — floating bottom toolbar
5. `components/workspace/ControlBar.tsx` — floating bottom-left controls
6. `components/workspace/PresenceAvatarStack.tsx` — live presence indicator
7. `components/workspace/AIStatusStrip.tsx` — real-time AI task status
8. `components/workspace/NodeColorPicker.tsx` — per-node color selector
9. `components/workspace/SpecPreviewDialog.tsx` — full-screen spec viewer
10. `components/workspace/ChatPanel.tsx` — room chat tab content
11. `components/workspace/ArchitectTab.tsx` — AI prompt tab content
12. `components/workspace/SpecsTab.tsx` — spec list tab content

---

## File 1 — Workspace Root (`app/editor/[id]/page.tsx`)

```typescript
// Full-viewport workspace layout
// No page scroll — everything is contained in 100vh
```

```css
.workspace {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--bg-base);
  display: flex;
  flex-direction: column;
  padding-top: 56px; /* workspace navbar height */
}

.canvas-layer {
  flex: 1;
  position: relative;
  overflow: hidden;
}
```

Inside `.canvas-layer`:
- The canvas area (React Flow placeholder or a static mock canvas)
- `<ShapePanel />` — `position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%)`
- `<ControlBar />` — `position: absolute; bottom: 24px; left: 24px`
- `<AISidebar />` — `position: absolute; top: 0; right: 0; height: 100%`

Static mock canvas (since React Flow is a library integration — build the UI shell, mark the canvas mounting point):
```tsx
<div className="canvas-mount" style={{
  width: '100%', height: '100%',
  background: 'var(--bg-base)',
  backgroundImage: 'radial-gradient(circle, #2a2a30 1px, transparent 1px)',
  backgroundSize: '24px 24px',
  position: 'relative'
}}>
  {/* React Flow mounts here via: <ReactFlow nodes={nodes} edges={edges} ... /> */}
  {/* For this UI build, render mock nodes */}
  <MockCanvasNodes />
</div>
```

**MockCanvasNodes**: A component that renders 5 static node cards absolutely positioned on the canvas to demonstrate the visual design. Use the same node styling as the hero canvas from Phase 1 but larger (min-width 140px).

---

## File 2 — WorkspaceNavbar (`components/workspace/WorkspaceNavbar.tsx`)

Height 56px, fixed top, same visual base as the main Navbar from Phase 2.

**Left section**:
- Back arrow (`←`) + "My Projects" link — 13px, `var(--text-muted)`, hover `var(--text-primary)`
- Separator `/` (14px, `var(--text-faint)`)
- Project name input — inline editable. Default: shows project name as text (`var(--text-primary)`, 15px, weight 600). On click/double-click: becomes a text input with same styles. On blur or Enter: saves. Visual affordance: on hover, faint underline dashes appear.
- Auto-save indicator: small dot + text. States:
  - Saving: `●` (pulsing, `var(--text-faint)`) + "Saving..."
  - Saved: `●` (static, `var(--state-success)`) + "Saved"
  - Error: `●` (static, `var(--state-error)`) + "Save failed"

**Right section**:
- `<PresenceAvatarStack />` (see below)
- "Share" button: outlined, 14px, `var(--text-secondary)`, hover `var(--text-primary)`, with users icon. Opens `<ShareDialog />`
- AI sidebar toggle button: an icon button (brain/sparkle icon), 32×32px, `border-radius: 8px`. Active state (sidebar open): `background: var(--accent-ai-dim)`, `color: var(--accent-ai-text)`, `border: 1px solid var(--accent-ai)`. Inactive: `var(--bg-subtle)`, `var(--text-muted)`.

---

## File 3 — PresenceAvatarStack (`components/workspace/PresenceAvatarStack.tsx`)

Similar to `AvatarGroup` from Phase 2, but for live room presence.

Props: `users: { id: string; name: string; color: string; isAI?: boolean }[]`.

Render each user as a 32px avatar circle. Overlap by 10px (`margin-left: -10px`).

**Regular user**: initials + their presence color as background (`${color}22`) + border: `2px solid ${color}`.

**AI presence** (when `isAI: true`): special Ghost AI indicator:
- Avatar: `background: var(--accent-ai-dim)`, `border: 2px solid var(--accent-ai)`
- Content: a small spinning ghost icon SVG (or just `✦` character) in `var(--accent-ai-text)`
- When AI is active, a subtle pulsing ring animation on this avatar:
  ```css
  @keyframes ai-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(100, 87, 249, 0.4); }
    50%       { box-shadow: 0 0 0 6px rgba(100, 87, 249, 0); }
  }
  animation: ai-pulse 1.5s ease-in-out infinite;
  ```

Tooltip on hover: "Ghost AI (generating)" or user's name.

---

## File 4 — AISidebar (`components/workspace/AISidebar.tsx`)

A slide-over panel on the right side of the workspace.

```css
.ai-sidebar {
  width: 320px;
  height: 100%;
  background: var(--bg-surface);
  border-left: 1px solid var(--border-default);
  display: flex;
  flex-direction: column;
  position: relative;
  transform: translateX(0);
  transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
}

.ai-sidebar.collapsed {
  transform: translateX(100%);
}
```

**Sidebar header** (48px, `border-bottom: 1px solid var(--border-default)`):
- Ghost AI label with the indigo dot: `●` in `var(--accent-ai)` + "Ghost AI" in `var(--accent-ai-text)`, 14px, weight 600
- Collapse button (right): `→` chevron icon, `var(--text-muted)`, 24×24 target

**Tab bar** (40px height, `border-bottom: 1px solid var(--border-default)`):
Three tabs: "Architect", "Chat", "Specs".

```css
.tab {
  flex: 1; display: flex; align-items: center; justify-content: center;
  font-size: 13px; color: var(--text-muted); cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 150ms, border-color 150ms;
}
.tab.active {
  color: var(--text-primary);
  border-bottom-color: var(--accent-primary);
}
.tab:hover:not(.active) { color: var(--text-secondary); }
```

**Tab content area**: `flex: 1; overflow: hidden; display: flex; flex-direction: column`.

Renders `<ArchitectTab />`, `<ChatPanel />`, or `<SpecsTab />` based on active tab.

---

## File 5 — ArchitectTab (`components/workspace/ArchitectTab.tsx`)

The AI prompt interface.

**Layout**: `display: flex; flex-direction: column; height: 100%`.

### AI Status Strip (`<AIStatusStrip />` component, see below)
Rendered at the very top of this tab when a generation is running.

### Chat log area (`flex: 1; overflow-y: auto; padding: 16px`)

Renders the prompt/response history. Message types:

**User message** (right-aligned):
```css
.user-message {
  display: flex; justify-content: flex-end; margin-bottom: 12px;
}
.user-bubble {
  background: var(--bg-elevated); border: 1px solid var(--border-subtle);
  border-radius: 14px 14px 4px 14px; padding: 10px 14px;
  max-width: 85%; font-size: 14px; line-height: 1.5; color: var(--text-primary);
}
```

**AI message** (left-aligned):
```css
.ai-message {
  display: flex; gap: 8px; margin-bottom: 12px; align-items: flex-start;
}
.ai-avatar {
  width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0; margin-top: 2px;
  background: var(--accent-ai-dim); border: 1px solid var(--accent-ai);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; color: var(--accent-ai-text);
}
.ai-bubble {
  background: var(--bg-elevated); border: 1px solid var(--accent-ai);
  border-radius: 4px 14px 14px 14px; padding: 10px 14px;
  max-width: 90%; font-size: 14px; line-height: 1.5; color: var(--text-primary);
}
```

**System event** (centered, small):
```css
font-size: 12px; color: var(--text-faint); text-align: center;
padding: 4px 0; margin-bottom: 8px;
```
Example: "Ghost AI generated 8 nodes and 6 connections"

**Typing indicator** (3 dots when AI is generating):
```css
display: flex; gap: 4px; padding: 12px 14px;
```
Each dot: `8px` circle, `var(--accent-ai)`. Bouncing animation staggered 150ms:
```css
@keyframes bounce-dot {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40%           { transform: translateY(-6px); opacity: 1; }
}
```

**Empty state** (when no messages yet):
Centered in the chat area:
- Large ghost icon or sparkle (40px, `var(--text-faint)`)
- "Ask Ghost AI to design your system" — 14px, `var(--text-muted)`, centered
- Suggestion chips below (clickable):
  - "Design a microservices e-commerce system"
  - "Add a Redis cache to the architecture"
  - "Create a CI/CD pipeline"
  Each chip: `background: var(--bg-subtle)`, `border: 1px solid var(--border-default)`, `border-radius: var(--radius-sm)`, `font-size: 12px`, `padding: 6px 12px`. Hover: `border-color: var(--accent-primary-dim)`.

### Input area (bottom, `border-top: 1px solid var(--border-default)`, `padding: 12px`)

**Textarea**:
```css
width: 100%; resize: none; min-height: 80px; max-height: 160px;
background: var(--bg-elevated); border: 1px solid var(--border-default);
border-radius: var(--radius-sm); padding: 12px; padding-bottom: 40px;
color: var(--text-primary); font-size: 14px; font-family: inherit;
line-height: 1.5; outline: none;
transition: border-color 150ms, box-shadow 150ms;
```
Focus: `border-color: var(--accent-ai); box-shadow: 0 0 0 3px var(--accent-ai-dim)`.
Placeholder: "Describe the system you want to design..."

**Send button** (absolute bottom-right inside textarea container):
```css
position: absolute; bottom: 20px; right: 20px;
background: var(--accent-ai); color: #fff;
border-radius: 8px; padding: 6px 14px; font-size: 13px; font-weight: 600;
border: none; cursor: pointer;
transition: filter 150ms;
```
Hover: `filter: brightness(1.15)`.
Disabled (empty input or generating): `background: var(--bg-subtle)`, `color: var(--text-faint)`, `cursor: not-allowed`.

Below textarea, a row: `Shift+Enter for new line` hint (12px, `var(--text-faint)`, left) + character count (right, turns amber at 800, red at 950 chars, max 1000).

**Locked state** (when AI is generating): Overlay the input area with a semi-transparent cover:
```css
background: rgba(8,8,9,0.7); backdrop-filter: blur(2px);
border-radius: var(--radius-sm);
```
Text: "Ghost AI is generating..." in `var(--accent-ai-text)` with spinning indicator.

---

## File 6 — AIStatusStrip (`components/workspace/AIStatusStrip.tsx`)

Props: `status: 'idle' | 'thinking' | 'complete' | 'error'`, `message?: string`.

Only renders when status is not `'idle'`.

```css
.status-strip {
  padding: 8px 12px;
  display: flex; align-items: center; gap: 8px;
  font-size: 12px;
  border-bottom: 1px solid var(--border-default);
}
```

States:
- **Thinking**: `background: var(--accent-ai-dim)`, spinning ring in `var(--accent-ai)`, text in `var(--accent-ai-text)`: "Ghost AI is designing your architecture..."
- **Complete**: `background: rgba(52,211,153,0.08)`, check icon in `var(--state-success)`, text in `var(--state-success)`: "Architecture generated — 8 nodes added"
- **Error**: `background: rgba(255,77,79,0.08)`, warning icon in `var(--state-error)`, text in `var(--state-error)`: "Generation failed · Try again"

Complete and Error states show a dismiss `×` button (right-aligned).

Complete state auto-dismisses after 4s with a CSS progress underline: a cyan `border-bottom` that shrinks from 100% to 0% over 4s.

---

## File 7 — ChatPanel (`components/workspace/ChatPanel.tsx`)

The general room chat shared by all collaborators.

**Layout**: `display: flex; flex-direction: column; height: 100%`.

**Messages area** (`flex: 1; overflow-y: auto; padding: 16px`):

Each message:
```css
.chat-message {
  display: flex; gap: 8px; margin-bottom: 14px; align-items: flex-start;
}
```
- Avatar (24px circle, user color as background, initials)
- Content column:
  - Header: `<span class="name">` (12px, weight 600, user's color) + `<span class="time">` (11px, `var(--text-faint)`, right-aligned)
  - Message text: 14px, `var(--text-secondary)`, line-height 1.5

**Empty state**: "No messages yet. Say hi to your collaborators." — centered, `var(--text-faint)`.

**Input area** (`border-top: 1px solid var(--border-default)`, `padding: 12px`):
Single-line input: same styles as other inputs. Placeholder: "Message the room...". Send on Enter. Right side: send button (paper plane icon, `var(--accent-primary)`, 32×32px, `border-radius: 8px`, `background: var(--accent-primary-dim)`).

**Mock messages** (render 3–4 to show the UI):
```
Alex: "Let's add a Redis layer between the API and DB"  — 2m ago
Maya: "Good idea — should we use it for sessions or caching?"  — 1m ago
Alex: "Both! Ghost AI, add Redis cache to the current architecture"  — 45s ago
[System] Ghost AI generated 2 nodes and 3 connections  — 30s ago
```

---

## File 8 — SpecsTab (`components/workspace/SpecsTab.tsx`)

**Layout**: `display: flex; flex-direction: column; height: 100%`.

**Header area** (`padding: 16px`, `border-bottom: 1px solid var(--border-default)`):
- "Generate Spec" button: full-width, `background: var(--accent-ai)`, `color: #fff`, `font-weight: 600`, `font-size: 14px`, `padding: 11px`, `border-radius: var(--radius-sm)`. Left icon: file-code icon. Hover: brightness 115%.
- Below: "Generates a Markdown technical specification from your current canvas." — 12px, `var(--text-faint)`.

**Spec list** (`flex: 1; overflow-y: auto; padding: 8px`):

Each spec item:
```css
.spec-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px; border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 150ms;
}
.spec-item:hover { background: var(--bg-elevated); }
```
- Left: file icon (16px, `var(--text-muted)`)
- Content:
  - Name: "Architecture Spec" — 14px, weight 500, `var(--text-primary)`
  - Date: "Generated Jun 4, 2025 at 2:34 PM" — 12px, `var(--text-faint)`
- Right: download icon button (`var(--text-muted)`, hover `var(--accent-primary)`)

On click: opens `<SpecPreviewDialog />`.

**Empty state**: "No specs generated yet." + small file-code icon.

**Mock spec items** (2 entries to show the UI).

---

## File 9 — SpecPreviewDialog (`components/workspace/SpecPreviewDialog.tsx`)

Full-screen dialog. Same backdrop as other modals.

**Modal**: near-full-screen, `max-width: 860px`, `max-height: 90vh`, `width: calc(100vw - 48px)`.

```css
background: var(--bg-elevated);
border: 1px solid var(--border-subtle);
border-radius: var(--radius-lg);
display: flex; flex-direction: column;
overflow: hidden;
```

**Header** (`padding: 20px 24px`, `border-bottom: 1px solid var(--border-default)`):
- Left: file icon + spec name + date
- Right: "Download .md" button (outlined, `var(--accent-primary)` text, download icon) + X close button

**Content area** (`flex: 1; overflow-y: auto; padding: 32px`):
Rendered Markdown preview with custom styles:
```css
/* Apply to content area */
--prose-text: var(--text-secondary);
--prose-heading: var(--text-primary);
--prose-code-bg: var(--bg-subtle);
--prose-border: var(--border-default);
```

Markdown styles:
- `h1, h2, h3`: `var(--text-primary)`, weight 700, letter-spacing -0.5px. `h1`: 24px, `h2`: 18px, `h3`: 15px. Bottom border on h2: `1px solid var(--border-default)`.
- `p`: 14px, `var(--text-secondary)`, line-height 1.7
- `code` (inline): `background: var(--bg-subtle)`, `border-radius: 4px`, `padding: 2px 6px`, font-family Geist Mono, `color: var(--accent-primary)`, `font-size: 13px`
- `pre > code` (block): `background: var(--bg-base)`, `border: 1px solid var(--border-default)`, `border-radius: var(--radius-sm)`, `padding: 16px`, full-width
- `ul, ol`: `color: var(--text-secondary)`, `line-height: 1.8`
- `hr`: `border: none; border-top: 1px solid var(--border-default)`
- `a`: `color: var(--accent-primary)`, no underline, hover underline

**Mock spec content** (render a realistic example):
```markdown
# System Architecture Specification

**Generated by Ghost AI** · Jun 4, 2025 at 2:34 PM

---

## Overview

This document describes the microservices architecture for a payment processing system consisting of 8 services with an event-driven communication layer.

## Services

### API Gateway
- **Type**: Entry point
- **Responsibilities**: Request routing, rate limiting, authentication verification
- **Connections**: Auth Service, Order Service, Payment Service

### Auth Service
- **Type**: Microservice
- **Responsibilities**: JWT issuance, token validation, session management
- **Database**: PostgreSQL (users, sessions)

## Data Flow

1. Client requests hit the API Gateway
2. Gateway verifies token with Auth Service
3. Authenticated requests route to appropriate services
4. Events published to the message bus for async operations

## Infrastructure Notes

- All inter-service communication via gRPC
- PostgreSQL for transactional data
- Redis for session cache and rate limiting
```

---

## File 10 — ShapePanel (`components/workspace/ShapePanel.tsx`)

Floating bottom-center toolbar for adding nodes to the canvas.

```css
.shape-panel {
  display: flex; align-items: center; gap: 4px;
  padding: 8px 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: 99px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}
```

**6 shape buttons** in a row:

Each button: 36×36px, `border-radius: 8px`, centered SVG icon (20px).
```css
.shape-btn {
  display: flex; align-items: center; justify-content: center;
  border-radius: 8px; cursor: pointer; color: var(--text-muted);
  transition: background 150ms, color 150ms;
}
.shape-btn:hover { background: var(--bg-subtle); color: var(--text-primary); }
.shape-btn.active { background: var(--accent-primary-dim); color: var(--accent-primary); }
```

Tooltip on hover: shape name appears above.

**Shapes** (inline SVG icons for each):

1. **Rectangle** — `<rect x="4" y="7" width="16" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/>`
2. **Diamond** — `<polygon points="12,3 21,12 12,21 3,12" fill="none" stroke="currentColor" stroke-width="1.5"/>`
3. **Circle** — `<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/>`
4. **Pill** — `<rect x="3" y="7" width="18" height="10" rx="5" fill="none" stroke="currentColor" stroke-width="1.5"/>`
5. **Cylinder** — `<ellipse cx="12" cy="8" rx="8" ry="3" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="4" y1="8" x2="4" y2="16" stroke="currentColor" stroke-width="1.5"/><line x1="20" y1="8" x2="20" y2="16" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="16" rx="8" ry="3" fill="none" stroke="currentColor" stroke-width="1.5"/>`
6. **Hexagon** — `<polygon points="12,3 20.5,7.5 20.5,16.5 12,21 3.5,16.5 3.5,7.5" fill="none" stroke="currentColor" stroke-width="1.5"/>`

**Divider**: `1px solid var(--border-default)`, height 24px, `margin: 0 8px`.

**Text tool button** (after divider): `T` label, same hover styles.

**Cursor tool** (first, before shapes): arrow cursor icon.

---

## File 11 — ControlBar (`components/workspace/ControlBar.tsx`)

Floating bottom-left bar for zoom and history controls.

```css
.control-bar {
  display: flex; align-items: center; gap: 2px;
  padding: 6px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  box-shadow: 0 4px 16px rgba(0,0,0,0.4);
}
```

**Controls** (each 32×32px icon buttons, same hover as shape buttons):

1. **Zoom out** — `−` icon
2. **Zoom level** — "100%" text, 13px, `var(--text-secondary)`, width 48px, centered. On click: resets to 100%.
3. **Zoom in** — `+` icon
4. **Divider** — `1px solid var(--border-default)`, height 20px
5. **Fit view** — expand arrows icon (fit-to-screen)
6. **Divider**
7. **Undo** — rotate-left icon
8. **Redo** — rotate-right icon

Undo/Redo: disabled state when nothing to undo/redo (`opacity: 0.3`, `cursor: not-allowed`).

---

## File 12 — NodeColorPicker (`components/workspace/NodeColorPicker.tsx`)

Appears when a node is selected (floating above or beside the selected node).

```css
.color-picker {
  display: flex; gap: 6px;
  padding: 8px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}
```

8 color swatches, each 24×24px circle:

```css
.swatch {
  width: 24px; height: 24px; border-radius: 50%;
  cursor: pointer; transition: transform 150ms, box-shadow 150ms;
  border: 2px solid transparent;
}
.swatch:hover { transform: scale(1.2); }
.swatch.active {
  border-color: var(--text-primary);
  box-shadow: 0 0 0 1px var(--bg-elevated);
}
```

Use the fill colors from the canvas node palette as swatch backgrounds.

Also include:
- A divider
- **Duplicate node** button (copy icon, 28×28px)
- **Delete node** button (trash icon, 28×28px, hover `color: var(--state-error)`)

---

## Canvas Node Component (static demo — not React Flow)

For the MockCanvasNodes visual, build a `CanvasNode` component:

```typescript
interface CanvasNodeProps {
  label: string;
  sublabel?: string;
  colorPair: { fill: string; text: string };
  style?: React.CSSProperties;
  isSelected?: boolean;
}
```

```css
.canvas-node {
  position: absolute;
  min-width: 140px;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  cursor: move;
  user-select: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  transition: box-shadow 150ms;
}
.canvas-node:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.6);
}
.canvas-node.selected {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-primary-dim), 0 8px 32px rgba(0,0,0,0.6);
}

.node-label { font-size: 13px; font-weight: 600; }
.node-sublabel { font-size: 11px; opacity: 0.65; margin-top: 2px; }

/* Resize handles — visible on selection */
.resize-handle {
  width: 8px; height: 8px; border-radius: 2px;
  background: var(--bg-elevated); border: 1.5px solid var(--accent-primary);
  position: absolute; cursor: nwse-resize;
}
/* Position handles at corners and midpoints */

/* Connection handles — visible on hover */
.connect-handle {
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--text-primary); border: 1.5px solid var(--bg-elevated);
  position: absolute; opacity: 0; transition: opacity 150ms;
}
.canvas-node:hover .connect-handle { opacity: 1; }
```

Place 5–6 mock nodes using the node colors and position them to show an interesting topology. Add an SVG overlay for edges.

---

## Mobile Considerations

Below 768px:
- AI Sidebar: becomes a bottom sheet (slides up from bottom, `height: 70vh`, `width: 100%`, `border-radius: var(--radius-lg) var(--radius-lg) 0 0`)
- Shape Panel: smaller (32×32 buttons), may truncate to 4 shapes + "More"
- Control Bar: only zoom and fit-view on mobile
- WorkspaceNavbar: hide project rename input detail, keep core controls
- Node color picker: larger touch targets (32px swatches)

---

## Keyboard Shortcuts Reference (document in UI)

Add a keyboard shortcut overlay (triggered by `?` key):

| Shortcut | Action |
|----------|--------|
| `Delete` / `Backspace` | Delete selected nodes/edges |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Ctrl+=` | Zoom in |
| `Ctrl+-` | Zoom out |
| `Ctrl+0` | Reset zoom |
| `Ctrl+Shift+F` | Fit view |
| `Escape` | Deselect / close panel |
| `?` | Open this help panel |

Help overlay: same backdrop as other modals, `max-width: 460px`, renders the table above in styled rows.

---

**Write every file completely. No truncation. No `// TODO`. No placeholder components.**

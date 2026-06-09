# Ghost AI — Phase 4: Templates, Polish & Final Responsive Pass

> **Instructions for Claude Code**: This is the final phase. Phases 1–3 built the design system, landing page, auth, editor home, and workspace. This phase adds the template picker, all micro-interactions, loading/empty/error states, toast notifications, and the full mobile-responsive audit. Do not regress anything from prior phases. Write every component completely.

---

## Design System Reference (from Phase 1 — use exactly)

```
--bg-base: #080809       --bg-surface: #111114     --bg-elevated: #18181c
--bg-subtle: #1e1e23     --border-default: #2a2a30  --border-subtle: #3a3a42
--text-primary: #f0f0f4  --text-secondary: #c0c0cc  --text-muted: #808090
--accent-primary: #00c8d4  --accent-primary-dim: rgba(0,200,212,0.12)
--accent-ai: #6457f9       --accent-ai-text: #8b82ff
--state-error: #ff4d4f     --state-success: #34d399   --state-warning: #fbbf24
--radius-sm: 12px  --radius-md: 16px  --radius-lg: 24px
```

---

## Files to Build This Phase

1. `components/workspace/TemplatePicker.tsx` — template import modal with animated previews
2. `components/Toast.tsx` + `hooks/useToast.ts` — global toast notification system
3. `components/workspace/GeneratingOverlay.tsx` — full-canvas AI generation animation
4. `components/workspace/EdgeLabel.tsx` — animated edge label component
5. `components/LoadingSpinner.tsx` — reusable loading states
6. `components/EmptyState.tsx` — reusable empty state component
7. `components/ErrorState.tsx` — reusable error state
8. `styles/mobile.css` — complete mobile responsive overrides
9. `styles/animations.css` — all animation keyframes consolidated
10. `components/workspace/OnboardingTooltip.tsx` — first-time user hints

---

## File 1 — TemplatePicker (`components/workspace/TemplatePicker.tsx`)

The most visually rich component in the app. A large modal for selecting and previewing architecture templates.

### Trigger
A "Templates" button in the shape panel or workspace navbar. Opens the picker modal.

### Modal Layout

Same backdrop as other modals (`position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(6px); z-index: 400`).

**Modal box**: 
```css
background: var(--bg-elevated);
border: 1px solid var(--border-subtle);
border-radius: var(--radius-lg);
width: calc(100vw - 64px);
max-width: 960px;
max-height: calc(100vh - 80px);
display: flex;
flex-direction: column;
overflow: hidden;
animation: modal-in 250ms cubic-bezier(0.16, 1, 0.3, 1);
```

### Modal Header (56px, `border-bottom: 1px solid var(--border-default)`)

Left: "Starter Templates" (18px, weight 700) with a grid icon
Subtext: "Import a template to start designing" (13px, `var(--text-muted)`)
Right: X close button

Below header: search input + category filter tabs in one row, `padding: 16px 24px`, `border-bottom: 1px solid var(--border-default)`.

**Search**: 240px, same input styles, magnifying glass icon inside, placeholder "Search templates...".

**Filter tabs**: "All", "Microservices", "Pipelines", "Event-Driven". Same pill tab style as sidebar tabs.

### Template Grid (`padding: 24px`, `overflow-y: auto`, `flex: 1`)

`display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px`.

### Template Card

```css
.template-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: border-color 200ms, transform 200ms, box-shadow 200ms;
  position: relative;
}
.template-card:hover {
  border-color: var(--accent-primary);
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.5), var(--shadow-glow-cyan);
}
.template-card.selected {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px var(--accent-primary-dim);
}
```

**Card top — animated canvas preview** (180px height):

```css
.template-preview {
  height: 180px;
  background: var(--bg-base);
  position: relative;
  overflow: hidden;
}
```

Dot-grid background. Render the template's node topology as a small interactive SVG or CSS layout inside. The nodes should be tiny (min-width 60px, height 28px) but readable.

**Animation on card hover**: The nodes in the preview gently animate — a subtle "pulse" on each node in sequence, making it feel alive.

```css
@keyframes node-pulse {
  0%, 100% { opacity: 0.7; }
  50%       { opacity: 1; }
}
/* Apply with increasing animation-delay to each node */
```

Also on hover, a "Preview" pill appears (fade in) centered in the preview area:
```css
.preview-pill {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  background: rgba(0,200,212,0.9); color: #000; font-size: 12px; font-weight: 700;
  border-radius: 99px; padding: 6px 16px;
  opacity: 0; transition: opacity 200ms;
}
.template-card:hover .preview-pill { opacity: 1; }
```

**Template 1 — Microservices E-Commerce**:
Mini node layout (top to bottom in the preview):
- Row 1 (top, center): "API Gateway" node — Blue `#10233D`/`#52A8FF`
- Row 2: "Auth" (Purple), "Orders" (Orange), "Products" (Green) — 3 nodes side by side
- Row 3: "PostgreSQL" (Teal), "Redis" (Blue), "Event Bus" (default) — 3 nodes
- SVG lines connecting them in a hierarchy

**Template 2 — CI/CD Pipeline**:
Linear left-to-right flow (rotated to fit the vertical card):
- Source → Build → Test → Security → Registry → Deploy
- Each node small and connected by arrows
- Use alternating Blue and Green colors for pipeline stages

**Template 3 — Event-Driven System**:
Fan-out pattern:
- "Producer" at top (Orange)
- "Message Broker" center (Purple) — larger
- 3 Consumer nodes below (Green, Teal, Blue)
- "Dead Letter Queue" bottom-right (Red)

**Card bottom section** (`padding: 16px`):

```css
.template-info { padding: 16px; }
.template-name { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
.template-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 12px; }
.template-meta { display: flex; gap: 8px; flex-wrap: wrap; }
.meta-tag {
  font-size: 11px; padding: 3px 8px; border-radius: 99px;
  background: var(--bg-subtle); color: var(--text-muted);
  border: 1px solid var(--border-default);
}
```

Tags for each template:
- Microservices E-Commerce: "12 nodes" "8 connections" "Microservices"
- CI/CD Pipeline: "8 nodes" "Linear flow" "DevOps"
- Event-Driven: "10 nodes" "Async" "Event-driven"

### Modal Footer (56px, `border-top: 1px solid var(--border-default)`)

```css
display: flex; align-items: center; justify-content: space-between; padding: 0 24px;
```

Left: selected template name pill (appears when a card is selected):
```css
background: var(--accent-primary-dim); border: 1px solid var(--accent-primary);
border-radius: 99px; padding: 6px 14px; font-size: 13px; color: var(--accent-primary);
```

Right: "Cancel" ghost button + "Import template" filled button (disabled until selection, cyan background).

**Import confirmation animation**: When "Import template" is clicked:
1. Button shows spinner + "Importing..."
2. After 800ms (simulated), modal closes with a scale-down + fade animation
3. A toast appears: "Microservices E-Commerce template imported — 12 nodes added"
4. Canvas clears and new nodes "draw in" with staggered animation

---

## File 2 — Toast System

### `hooks/useToast.ts`

```typescript
type ToastType = 'success' | 'error' | 'warning' | 'info' | 'ai';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms, default 4000
  action?: { label: string; onClick: () => void };
}
```

Use a simple global store pattern (Zustand or React context). Expose:
- `toast.success(title, options?)` 
- `toast.error(title, options?)`
- `toast.warning(title, options?)`
- `toast.ai(title, options?)` — indigo-themed, for AI events

### `components/Toast.tsx`

Toast container: `position: fixed; bottom: 24px; right: 24px; z-index: 500; display: flex; flex-direction: column; gap: 8px; pointer-events: none`.

Individual toast:
```css
.toast {
  min-width: 300px; max-width: 420px;
  padding: 14px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
  display: flex; align-items: flex-start; gap: 12px;
  pointer-events: all;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  animation: toast-in 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.toast.removing {
  animation: toast-out 250ms ease forwards;
}
```

```css
@keyframes toast-in {
  from { opacity: 0; transform: translateX(24px) scale(0.95); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes toast-out {
  from { opacity: 1; transform: translateX(0) scale(1); }
  to   { opacity: 0; transform: translateX(24px) scale(0.95); }
}
```

Type-specific styles:

| Type | Background | Border | Icon color |
|------|-----------|--------|------------|
| `success` | `rgba(52,211,153,0.08)` | `rgba(52,211,153,0.3)` | `var(--state-success)` |
| `error` | `rgba(255,77,79,0.08)` | `rgba(255,77,79,0.3)` | `var(--state-error)` |
| `warning` | `rgba(251,191,36,0.08)` | `rgba(251,191,36,0.3)` | `var(--state-warning)` |
| `info` | `var(--bg-elevated)` | `var(--border-subtle)` | `var(--accent-primary)` |
| `ai` | `rgba(100,87,249,0.08)` | `rgba(100,87,249,0.3)` | `var(--accent-ai-text)` |

Toast content: icon (20px) + content column (title in 14px weight 600 + optional message in 13px `var(--text-secondary)`) + optional action button + X dismiss button.

**Auto-dismiss progress bar**: A 3px bar at the bottom of the toast that shrinks from 100% to 0% over the duration.
```css
.progress-bar {
  position: absolute; bottom: 0; left: 0; height: 3px;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  transition: width linear;
}
```

**Toast examples to demo** (fire these on page interactions):
- Import template → `toast.ai("Template imported", { message: "12 nodes added to your canvas" })`
- Copy share link → `toast.success("Link copied to clipboard")`  
- Save failed → `toast.error("Save failed", { message: "Changes will retry automatically", action: { label: "Retry now", onClick: () => {} } })`
- Spec generated → `toast.ai("Spec generated", { message: "Architecture Spec — Jun 4, 2025" })`

---

## File 3 — GeneratingOverlay (`components/workspace/GeneratingOverlay.tsx`)

A subtle overlay on the canvas while Ghost AI is generating architecture. Does NOT block the canvas completely — allows viewing but not editing.

```css
.generating-overlay {
  position: absolute; inset: 0;
  pointer-events: none; /* Allow viewing, block clicking below */
  z-index: 10;
}
```

**Visual effects during generation**:

1. **Edge shimmer**: A traveling light pulse along all existing edges (CSS animation on SVG `stroke-dashoffset`).

2. **Canvas ambient glow**: A very subtle `box-shadow: inset 0 0 80px rgba(100,87,249,0.06)` that pulses:
```css
@keyframes ambient-pulse {
  0%, 100% { box-shadow: inset 0 0 80px rgba(100,87,249,0.04); }
  50%       { box-shadow: inset 0 0 120px rgba(100,87,249,0.10); }
}
animation: ambient-pulse 2s ease-in-out infinite;
```

3. **Node appearance animation**: When new nodes are added by AI, each one animates in:
```css
@keyframes node-appear {
  from { opacity: 0; transform: scale(0.8); }
  to   { opacity: 1; transform: scale(1); }
}
/* Each new node: animation: node-appear 400ms cubic-bezier(0.16, 1, 0.3, 1) */
/* Stagger: animation-delay: calc(var(--node-index) * 80ms) */
```

4. **Edge draw-in**: New edges animate with `stroke-dashoffset`:
```css
@keyframes edge-draw {
  from { stroke-dashoffset: var(--edge-length, 200); }
  to   { stroke-dashoffset: 0; }
}
```

5. **Ghost AI cursor on canvas**: A special ghost-themed cursor that drifts around the canvas area during generation:
```css
.ai-cursor {
  position: absolute;
  display: flex; align-items: center; gap: 6px;
  pointer-events: none;
  z-index: 20;
  animation: ai-cursor-drift 3s ease-in-out infinite;
}

@keyframes ai-cursor-drift {
  0%   { transform: translate(120px, 80px); }
  25%  { transform: translate(280px, 160px); }
  50%  { transform: translate(200px, 240px); }
  75%  { transform: translate(380px, 120px); }
  100% { transform: translate(120px, 80px); }
}
```

Cursor visual: a small indigo arrow SVG (14px) + pill label "Ghost AI" with the spinning dot:
```css
background: var(--accent-ai-dim); border: 1px solid var(--accent-ai);
border-radius: 99px; padding: 3px 10px; font-size: 11px; color: var(--accent-ai-text);
```

---

## File 4 — LoadingSpinner (`components/LoadingSpinner.tsx`)

Reusable loading indicator with three sizes.

```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'ai' | 'muted';
}
```

Sizes: sm=16px, md=24px, lg=40px.

**Spinner design**: A circle with one-quarter transparent arc (not a full ring):
```css
.spinner {
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-right-color: currentColor;
  animation: spin 600ms linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

Colors: `primary` = `var(--accent-primary)`, `ai` = `var(--accent-ai)`, `muted` = `var(--text-muted)`.

**Skeleton loader variant**: For loading cards/content areas:
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-subtle) 25%,
    var(--bg-elevated) 50%,
    var(--bg-subtle) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}
@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}
```

Provide skeleton variants:
- `<SkeletonText lines={3} />` — stacked text line skeletons
- `<SkeletonCard />` — a full project card skeleton (with preview area + two text lines)
- `<SkeletonNode />` — a canvas node skeleton

**Loading state for editor home**: When projects are loading, show a grid of 3 `<SkeletonCard />` components.

---

## File 5 — EmptyState (`components/EmptyState.tsx`)

```typescript
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  size?: 'sm' | 'md' | 'lg';
}
```

```css
.empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; padding: 48px 24px;
  gap: 12px;
}

.empty-icon {
  /* Icon container */
  width: 64px; height: 64px; border-radius: var(--radius-md);
  background: var(--bg-subtle); border: 1px solid var(--border-default);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-faint); margin-bottom: 8px;
}

.empty-title { font-size: 16px; font-weight: 600; color: var(--text-secondary); }
.empty-desc  { font-size: 14px; color: var(--text-muted); max-width: 280px; line-height: 1.5; }
```

Action button: outlined, small, `var(--accent-primary)` border and text, hover fill.

**Use in**:
- Editor home (no projects): icon=FolderOpen, title="No projects yet", desc="Create your first project to start designing"
- Specs tab (no specs): icon=FileCode, title="No specs generated", desc="Generate your first spec from the canvas"  
- Chat (no messages): icon=MessageSquare, title="No messages yet", desc="Say hi to your collaborators"
- Search results (no matches): icon=Search, title="No results", desc="Try a different search term"

---

## File 6 — ErrorState (`components/ErrorState.tsx`)

```typescript
interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}
```

```css
.error-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 48px 24px; text-align: center; gap: 12px;
}

.error-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: rgba(255,77,79,0.08); border: 1px solid rgba(255,77,79,0.2);
  display: flex; align-items: center; justify-content: center;
  color: var(--state-error);
}
```

Title: "Something went wrong" (default), 16px, weight 600, `var(--text-secondary)`.
Description: customizable, 14px, `var(--text-muted)`.
Retry button: outlined, `var(--state-error)` border and text, rotate-CCW icon, hover: `background: rgba(255,77,79,0.08)`.

---

## File 7 — OnboardingTooltip (`components/workspace/OnboardingTooltip.tsx`)

For first-time users, show contextual hints pointing to key UI elements.

```typescript
interface OnboardingStep {
  target: string;     // CSS selector
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const steps: OnboardingStep[] = [
  {
    target: '.ai-sidebar',
    position: 'left',
    title: 'Meet Ghost AI',
    description: 'Type a system description here and Ghost AI will generate your architecture live on the canvas.',
  },
  {
    target: '.shape-panel',
    position: 'top',
    title: 'Add nodes manually',
    description: 'Drag shapes onto the canvas or click to place them.',
  },
  {
    target: '.control-bar',
    position: 'top',
    title: 'Zoom and navigate',
    description: 'Control zoom level, fit the canvas to screen, and undo changes.',
  },
];
```

**Tooltip visual**:
```css
.onboarding-tooltip {
  position: fixed; z-index: 600;
  background: var(--bg-elevated);
  border: 1px solid var(--accent-primary);
  border-radius: var(--radius-md);
  padding: 16px;
  max-width: 260px;
  box-shadow: var(--shadow-glow-cyan);
  animation: tooltip-appear 200ms ease;
}

.tooltip-arrow {
  position: absolute;
  width: 10px; height: 10px;
  background: var(--bg-elevated);
  border: 1px solid var(--accent-primary);
  transform: rotate(45deg);
  /* Position based on direction */
}
```

Title: 14px, weight 700, `var(--text-primary)`.
Description: 13px, `var(--text-secondary)`, line-height 1.5, `margin-top: 6px`.

Bottom row: step counter ("1 of 3") + "Next" button (small, cyan) + "Skip tour" (small, `var(--text-muted)`).

**Highlight pulse**: When a tooltip targets an element, add a glowing ring:
```css
.onboarding-highlight {
  box-shadow: 0 0 0 4px rgba(0,200,212,0.3), 0 0 0 8px rgba(0,200,212,0.1);
  border-radius: inherit;
  animation: highlight-pulse 1.5s ease-in-out infinite;
}
@keyframes highlight-pulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(0,200,212,0.3), 0 0 0 8px rgba(0,200,212,0.1); }
  50%       { box-shadow: 0 0 0 6px rgba(0,200,212,0.2), 0 0 0 12px rgba(0,200,212,0.06); }
}
```

Store completion in `localStorage`: `ghost_ai_onboarding_complete`. Don't show on subsequent visits.

---

## File 8 — Mobile Styles (`styles/mobile.css`)

Complete responsive overrides. Apply these in addition to existing component styles.

```css
/* ===================================
   GHOST AI — MOBILE RESPONSIVE STYLES
   Applied at these breakpoints:
   - sm: 640px
   - md: 768px  
   - lg: 1024px
   =================================== */

/* ─── LANDING PAGE ─────────────────── */

@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  .features-grid .feature-card[style*="span 2"] {
    grid-column: span 2 !important;
  }
  .features-grid .feature-card[style*="span 1"] {
    grid-column: span 1 !important;
  }
  .templates-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 768px) {
  /* Hero */
  .hero { padding: 80px 24px 48px; }
  .hero-canvas { height: 220px !important; margin-top: 40px !important; }
  .hero-canvas .canvas-node { transform: scale(0.8); transform-origin: top left; }

  /* Sections */
  section { padding: 64px 20px !important; }

  /* Grids → single column */
  .features-grid,
  .templates-grid,
  .testimonials-grid,
  .pricing-grid { 
    grid-template-columns: 1fr !important;
  }
  .features-grid .feature-card {
    grid-column: span 1 !important;
  }

  /* How it works → vertical */
  .steps-row {
    flex-direction: column !important;
    gap: 32px !important;
  }
  .steps-connector { display: none !important; }
  
  /* Pricing cards → stack */
  .pricing-card.featured { order: -1; }
  
  /* Social proof → scroll */
  .social-proof-logos {
    overflow-x: auto; white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .social-proof-logos::-webkit-scrollbar { display: none; }

  /* Footer → 2 column */
  .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .footer-brand { grid-column: 1 / -1; }
}

@media (max-width: 480px) {
  /* Typography scale down */
  h1, .hero-headline { font-size: clamp(32px, 9vw, 44px) !important; }
  h2, .section-title  { font-size: clamp(24px, 7vw, 36px) !important; }

  /* Navbar */
  .navbar { padding: 0 16px !important; }
  .navbar-cta-secondary { display: none !important; } /* Hide "Sign in", keep "Start free" */

  /* Footer → 1 column */
  .footer-grid { grid-template-columns: 1fr !important; }
  
  /* Hero CTAs → stack vertically */
  .cta-row { flex-direction: column !important; width: 100%; }
  .cta-row button { width: 100% !important; }
}

/* ─── AUTH PAGES ─────────────────────── */

@media (max-width: 768px) {
  .auth-layout { grid-template-columns: 1fr !important; }
  .auth-left-panel { display: none !important; }
  .auth-right-panel { 
    min-height: 100vh;
    padding: 40px 24px !important;
  }
  /* Show logo at top of right panel on mobile */
  .auth-mobile-logo { display: flex !important; margin-bottom: 32px; }
}

/* ─── EDITOR HOME ──────────────────── */

@media (max-width: 768px) {
  .editor-home { padding: 32px 16px !important; }
  .editor-top-row { flex-direction: column !important; gap: 16px; align-items: flex-start; }
  .editor-top-row .filter-bar { width: 100%; }
  .projects-grid { grid-template-columns: 1fr !important; }
}

/* ─── WORKSPACE ──────────────────────── */

@media (max-width: 768px) {
  /* AI Sidebar → bottom sheet */
  .ai-sidebar {
    position: fixed !important;
    top: auto !important; bottom: 0 !important; right: 0 !important;
    width: 100% !important; height: 70vh !important;
    border-left: none !important;
    border-top: 1px solid var(--border-subtle) !important;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0 !important;
    transform: translateY(0) !important;
    transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1) !important;
  }
  .ai-sidebar.collapsed {
    transform: translateY(100%) !important;
  }
  /* Drag handle at top of bottom sheet */
  .ai-sidebar::before {
    content: '';
    display: block; width: 40px; height: 4px;
    background: var(--border-subtle); border-radius: 99px;
    margin: 10px auto -4px;
  }

  /* Shape Panel → smaller, fewer items */
  .shape-panel {
    padding: 6px 10px !important;
    bottom: 16px !important;
  }
  .shape-btn { width: 32px !important; height: 32px !important; }

  /* Control Bar → minimal */
  .control-bar {
    bottom: 16px !important; left: 16px !important;
  }
  /* Hide undo/redo on mobile */
  .control-bar .control-undo,
  .control-bar .control-redo { display: none !important; }

  /* WorkspaceNavbar → tighter */
  .workspace-navbar { padding: 0 12px !important; }
  .workspace-navbar .project-rename { max-width: 140px !important; }
  .workspace-navbar .save-indicator span { display: none !important; } /* Hide text, keep dot */

  /* Toast → full width at bottom */
  .toast-container {
    bottom: 0 !important; right: 0 !important; left: 0 !important;
    padding: 0 16px 16px !important;
  }
  .toast { min-width: unset !important; max-width: unset !important; width: 100% !important; }
}

@media (max-width: 480px) {
  /* Canvas nodes → smaller */
  .canvas-node { min-width: 100px !important; font-size: 11px !important; }

  /* Modals → near full screen */
  .modal-box {
    width: calc(100vw - 32px) !important;
    max-height: calc(100vh - 40px) !important;
    border-radius: var(--radius-md) !important;
  }

  /* Template picker → full screen on mobile */
  .template-picker-modal {
    width: 100vw !important; height: 100vh !important;
    max-width: unset !important; max-height: unset !important;
    border-radius: 0 !important;
  }

  /* Presence avatars → smaller */
  .presence-avatar { width: 26px !important; height: 26px !important; }
}

/* ─── TOUCH TARGETS ──────────────────── */
/* All interactive elements min 44×44px on touch */
@media (hover: none) and (pointer: coarse) {
  button, a, [role="button"], [role="menuitem"] {
    min-height: 44px;
    min-width: 44px;
  }
  
  /* Exception: inline text links can be narrower */
  a.inline-link { min-height: unset; min-width: unset; }
  
  /* Larger hit targets for canvas handles */
  .connect-handle { width: 20px !important; height: 20px !important; opacity: 1 !important; }
  .resize-handle  { width: 16px !important; height: 16px !important; }
  
  /* Remove hover-only states on touch */
  .template-card .preview-pill { opacity: 0.6 !important; }
  .canvas-node .connect-handle { opacity: 0.6 !important; }
}
```

---

## File 9 — Animations Consolidated (`styles/animations.css`)

All keyframes in one file for reference and deduplication:

```css
/* ─── PAGE TRANSITIONS ─── */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

/* ─── MODALS / OVERLAYS ─── */
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes modal-out {
  from { opacity: 1; transform: scale(1) translateY(0); }
  to   { opacity: 0; transform: scale(0.95) translateY(8px); }
}
@keyframes dropdown-in {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes sheet-up {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}

/* ─── LOADING ─── */
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}
@keyframes bounce-dot {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40%           { transform: translateY(-6px); opacity: 1; }
}

/* ─── TOASTS ─── */
@keyframes toast-in {
  from { opacity: 0; transform: translateX(24px) scale(0.95); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
}
@keyframes toast-out {
  from { opacity: 1; transform: translateX(0) scale(1); max-height: 100px; }
  to   { opacity: 0; transform: translateX(24px) scale(0.95); max-height: 0; }
}

/* ─── AI / PRESENCE ─── */
@keyframes ai-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(100, 87, 249, 0.4); }
  50%       { box-shadow: 0 0 0 6px rgba(100, 87, 249, 0); }
}
@keyframes spin-pulse {
  0%        { transform: scale(1); opacity: 0.7; }
  50%       { transform: scale(1.3); opacity: 1; }
  100%      { transform: scale(1); opacity: 0.7; }
}
@keyframes ambient-pulse {
  0%, 100% { box-shadow: inset 0 0 80px rgba(100,87,249,0.04); }
  50%       { box-shadow: inset 0 0 120px rgba(100,87,249,0.10); }
}

/* ─── CANVAS ─── */
@keyframes node-appear {
  from { opacity: 0; transform: scale(0.8); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes edge-draw {
  from { stroke-dashoffset: var(--edge-length, 200); }
  to   { stroke-dashoffset: 0; }
}
@keyframes node-pulse {
  0%, 100% { opacity: 0.7; }
  50%       { opacity: 1; }
}
@keyframes cta-pulse {
  0%, 100% { box-shadow: 0 0 60px rgba(0,200,212,0.12); }
  50%       { box-shadow: 0 0 80px rgba(0,200,212,0.28); }
}
@keyframes drift-1 {
  0%, 100% { transform: translate(0, 0); }
  33%       { transform: translate(6px, -4px); }
  66%       { transform: translate(-3px, 5px); }
}
@keyframes drift-2 {
  0%, 100% { transform: translate(0, 0); }
  33%       { transform: translate(-4px, 6px); }
  66%       { transform: translate(5px, -3px); }
}
@keyframes line-draw {
  from { stroke-dashoffset: var(--path-length, 300); }
  to   { stroke-dashoffset: 0; }
}

/* ─── ONBOARDING ─── */
@keyframes tooltip-appear {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes highlight-pulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(0,200,212,0.3), 0 0 0 8px rgba(0,200,212,0.1); }
  50%       { box-shadow: 0 0 0 6px rgba(0,200,212,0.2), 0 0 0 12px rgba(0,200,212,0.06); }
}

/* ─── REDUCED MOTION ─── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Final QA Checklist

Before declaring Phase 4 complete, verify every item:

### Visual Quality
- [ ] All dark backgrounds use CSS custom properties, no hardcoded colors
- [ ] Cyan accent (`--accent-primary`) used only for CTAs, active states, links
- [ ] Indigo (`--accent-ai`) used only for AI-specific elements
- [ ] Every border uses `--border-default` or `--border-subtle` — no hardcoded grays
- [ ] Geist Sans loads correctly, no fallback to system fonts
- [ ] Geist Mono on all code/ID/spec content
- [ ] All border radii follow the scale: sm=12, md=16, lg=24px

### Interactions
- [ ] All buttons have hover + active + focus-visible states
- [ ] All inputs have focus ring (`var(--accent-primary)` glow)
- [ ] All modals open/close with animation and close on Escape + backdrop click
- [ ] Toast notifications appear and auto-dismiss
- [ ] Template cards animate on hover (node pulse, preview pill)
- [ ] AI status strip appears/dismisses correctly

### Responsiveness
- [ ] Landing page at 375px: no horizontal scroll, text readable
- [ ] Landing page at 768px: 2-column grids, no overflow
- [ ] Auth pages at 375px: single column, form fills width
- [ ] Editor home at 375px: project cards stacked, usable
- [ ] Workspace at 375px: AI sidebar as bottom sheet, controls accessible

### Accessibility
- [ ] All focus states visible (2px `var(--accent-primary)` outline)
- [ ] Modals trap focus
- [ ] `aria-label` on all icon-only buttons
- [ ] Form inputs linked to labels
- [ ] `prefers-reduced-motion` respected (all animations disabled)
- [ ] Minimum 4.5:1 contrast ratio on all text

### Performance
- [ ] No `will-change` on static elements
- [ ] Animations only on `transform` and `opacity`
- [ ] Images use `next/image` with explicit dimensions
- [ ] No `@import` inside component-level CSS (fonts only in globals)

---

**Write every file completely. This is the final polish phase — every detail matters. No truncation.**

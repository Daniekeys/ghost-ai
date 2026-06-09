# Ghost AI — Phase 2: Auth Pages + Editor Home

> **Instructions for Claude Code**: This is Phase 2. Phase 1 established the design system and landing page. Apply the exact same CSS custom properties and font stack here. Do not redefine the design system — import `globals.css` from Phase 1. Write every component completely.

---

## Design System Reference (from Phase 1 — do not redefine, just use)

```
--bg-base: #080809       --bg-surface: #111114     --bg-elevated: #18181c
--bg-subtle: #1e1e23     --border-default: #2a2a30  --border-subtle: #3a3a42
--text-primary: #f0f0f4  --text-secondary: #c0c0cc  --text-muted: #808090
--text-faint: #505060    --accent-primary: #00c8d4  --accent-primary-dim: rgba(0,200,212,0.12)
--accent-ai: #6457f9     --accent-ai-dim: rgba(100,87,249,0.15)
--accent-ai-text: #8b82ff --radius-sm: 12px         --radius-md: 16px   --radius-lg: 24px
```

Fonts: Geist Sans (UI), Geist Mono (mono/code). Fallbacks: DM Sans, JetBrains Mono.

---

## Files to Build This Phase

1. `components/Navbar.tsx` — authenticated + unauthenticated states
2. `app/sign-in/page.tsx` — two-panel sign-in
3. `app/sign-up/page.tsx` — two-panel sign-up
4. `app/editor/page.tsx` — editor home (project list)
5. `components/ProjectCard.tsx` — individual project card
6. `components/CreateProjectModal.tsx` — create project modal
7. `components/ShareDialog.tsx` — share / invite collaborators dialog
8. `components/AvatarGroup.tsx` — presence avatar stack

---

## Component 1 — Navbar (`components/Navbar.tsx`)

Accept a prop `isAuthenticated: boolean`.

**Fixed**, `height: 56px`, `z-index: 100`, full width.
```css
background: var(--bg-base);
backdrop-filter: blur(16px);
border-bottom: 1px solid var(--border-default);
transition: border-color 200ms, box-shadow 200ms;
```

On `scrollY > 20` (via `useEffect` + `scroll` listener):
```css
border-bottom-color: var(--border-subtle);
box-shadow: 0 1px 24px rgba(0,0,0,0.6);
```

**Layout**: `display: flex; align-items: center; justify-content: space-between; padding: 0 24px; max-width: 1400px; margin: 0 auto;`

### Left — Logo
Inline SVG ghost icon (20×20px): a simplified ghost shape:
- A rounded rect body (width 16, height 18, rx 8) filling `var(--text-muted)`
- Two small circle cutouts at the bottom for the ghost tail bumps

"Ghost" text: `var(--text-primary)`, 16px, weight 600, letter-spacing -0.3px  
"AI" text: `var(--accent-primary)`, same size/weight  
Gap 6px between icon and text. Wrapped in a `<Link href="/">`.

### Center — Nav Links (hidden below 768px)
Links: "Features", "Templates", "Pricing", "Docs"
```css
font-size: 14px; color: var(--text-secondary); text-decoration: none;
padding: 4px 0; gap: 32px;
transition: color 150ms;
```
Hover: `color: var(--text-primary)`.

When `isAuthenticated`, replace center links with: "My Projects", "Templates", "Docs".

### Right — Unauthenticated
- "Sign in": 14px, `var(--text-secondary)`, hover `var(--text-primary)`, no border, `background: transparent`
- "Start for free": filled button, `background: var(--accent-primary)`, `color: #000`, 14px, weight 600, `border-radius: var(--radius-sm)`, `padding: 8px 18px`, hover: brightness 110%, scale 1.02

### Right — Authenticated
- `<AvatarGroup />` (see below)
- User avatar dropdown button: 32px circle, user initial or photo, `border-radius: 50%`, `background: var(--bg-subtle)`, `border: 1.5px solid var(--border-subtle)`. On click, opens a dropdown menu (below).

**Dropdown menu** (authenticated):
```css
position: absolute; top: calc(100% + 8px); right: 0;
background: var(--bg-elevated); border: 1px solid var(--border-subtle);
border-radius: var(--radius-md); padding: 6px; min-width: 180px;
box-shadow: 0 8px 32px rgba(0,0,0,0.5);
animation: dropdown-in 150ms ease;
```
`@keyframes dropdown-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }`

Menu items:
- "My Projects" (with folder icon)
- "Settings" (with settings icon)
- Divider: `1px solid var(--border-default)`
- "Sign out" (with log-out icon, `color: var(--state-error)` on hover)

Item styles: `display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; font-size: 14px; color: var(--text-secondary); cursor: pointer;` Hover: `background: var(--bg-subtle)`, `color: var(--text-primary)`.

### Mobile (below 768px)
Hide center links. Show hamburger icon (3 horizontal lines, 18px, `var(--text-secondary)`).

On click, open full-screen overlay:
```css
position: fixed; inset: 0; background: var(--bg-elevated);
z-index: 200; padding: 24px;
animation: overlay-in 200ms ease;
```
`@keyframes overlay-in { from { opacity: 0; } to { opacity: 1; } }`

Overlay contains:
- Top row: logo (left) + X close button (right)
- Nav links stacked vertically, 20px, `padding: 16px 0`, `border-bottom: 1px solid var(--border-default)`
- Bottom: Sign in + Start for free buttons, full width

---

## Component 2 — AvatarGroup (`components/AvatarGroup.tsx`)

Props: `users: { name: string; imageUrl?: string; color: string }[]`, `max?: number` (default 4).

Render up to `max` avatar circles, overlapping by 8px (`margin-left: -8px` on all but first). If more than `max`, show a `+N` overflow circle.

Each avatar (28px circle):
- If `imageUrl`: `<img>` with `border-radius: 50%`, `object-fit: cover`
- If no image: initials (first letter of name), `background: [user.color]20`, `color: [user.color]`, `font-size: 11px`, `font-weight: 600`
- Border: `2px solid var(--bg-base)` (creates separation between overlapping avatars)
- Tooltip on hover: user's name — small pill above avatar

Overflow circle: `background: var(--bg-subtle)`, `color: var(--text-muted)`, same 28px size, same border.

On hover of the group, spread the avatars slightly: `gap: 2px` transition on the container.

---

## Page 1 — Sign In (`app/sign-in/page.tsx`)

**Two-panel full-viewport layout**. No navbar on this page (replace with just the logo top-left).

```css
display: grid;
grid-template-columns: 1fr 1fr;  /* desktop */
min-height: 100vh;
```
Mobile (below 768px): `grid-template-columns: 1fr`, left panel hidden.

### Left Panel

`background: var(--bg-elevated)`, `border-right: 1px solid var(--border-default)`, `position: relative`, `overflow: hidden`.

**Top-left logo**: Ghost AI logo mark (same as navbar), `position: absolute; top: 24px; left: 32px`.

**Center content**: `display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 80px 48px; text-align: center;`

**Display text** (three lines, stacked):
```
"Design systems."    — var(--text-primary), clamp(32px,3vw,48px), weight 700, letter-spacing -1.5px
"In plain English."  — var(--accent-primary), same size, weight 700, letter-spacing -1.5px
"Together."          — var(--text-secondary), same size, weight 400, font-style: italic
```
Line height 1.1, stacked with 4px gap.

**Mini canvas preview** (below display text, `margin-top: 48px`):
A 320×220px dark rounded container showing a static miniature architecture diagram.
```css
background: var(--bg-base);
border-radius: var(--radius-md);
border: 1px solid var(--border-default);
position: relative;
overflow: hidden;
```
Dot-grid background. 4 small node cards placed absolutely using the canvas node color pairs. SVG connecting lines between them. This is the same visual language as the Phase 1 hero canvas, smaller and simpler.

**Testimonial strip** (bottom of panel, `position: absolute; bottom: 32px; left: 32px; right: 32px`):
Three lines of social proof text, 13px, `var(--text-faint)`:
- `"★★★★★  'Replaced every diagramming tool on our team.'"` — Alex R., Lead Eng
- Vertical `|` separator
- `"10,000+ engineers already designing"`

### Right Panel

`background: var(--bg-base)`, `display: flex; align-items: center; justify-content: center; padding: 48px 40px`.

**Form container**: `width: 100%; max-width: 400px`.

**"Welcome back"**: 26px, weight 700, letter-spacing -0.5px, `var(--text-primary)`, `margin-bottom: 8px`.
**Subtext**: "Sign in to continue building" — 14px, `var(--text-muted)`, `margin-bottom: 32px`.

**Social auth buttons** (two, full-width, `margin-bottom: 8px` between):
```css
display: flex; align-items: center; justify-content: center; gap: 10px;
padding: 11px 20px; border-radius: var(--radius-sm);
border: 1px solid var(--border-subtle); background: var(--bg-surface);
color: var(--text-primary); font-size: 14px; font-weight: 500;
cursor: pointer; transition: background 150ms, border-color 150ms;
```
Hover: `background: var(--bg-elevated)`, `border-color: var(--border-default)`.

- "Continue with Google" — Google "G" SVG icon (colored, 18px)
- "Continue with GitHub" — GitHub mark SVG (white, 18px)

**OR divider**:
```css
display: flex; align-items: center; gap: 12px;
color: var(--text-faint); font-size: 13px; margin: 20px 0;
```
Lines: `flex: 1; height: 1px; background: var(--border-default)`.

**Email + Password form**:

Label style: `display: block; font-size: 13px; font-weight: 500; color: var(--text-secondary); margin-bottom: 6px`.

Input style:
```css
width: 100%; padding: 11px 14px; border-radius: var(--radius-sm);
background: var(--bg-surface); border: 1px solid var(--border-default);
color: var(--text-primary); font-size: 14px; font-family: inherit;
transition: border-color 150ms, box-shadow 150ms;
outline: none;
```
Focus: `border-color: var(--accent-primary); box-shadow: 0 0 0 3px var(--accent-primary-dim)`.

Fields: "Email address", "Password" (with show/hide toggle icon inside input — eye icon, `var(--text-muted)`).

"Forgot password?" link: right-aligned below password field, 13px, `var(--accent-primary)`.

**Sign in button** (full-width, `margin-top: 20px`):
```css
background: var(--accent-primary); color: #000; font-weight: 700;
font-size: 15px; padding: 13px; border-radius: var(--radius-sm);
border: none; cursor: pointer;
transition: filter 150ms, transform 150ms;
```
Hover: `filter: brightness(1.1)`, `transform: scale(1.01)`.
Loading state: replace text with a small spinner, `opacity: 0.8`, `cursor: wait`.

**Bottom link**: "Don't have an account? " + "Start for free →" (cyan, font-weight 600).

**Clerk integration note**: Add a `/* Clerk <SignIn /> component goes here */` comment block wrapped in the exact form layout above, so swapping in Clerk's component preserves the visual design.

---

## Page 2 — Sign Up (`app/sign-up/page.tsx`)

Identical two-panel layout as sign-in. Left panel: same display text, same mini canvas.

**Right panel differences**:
- Title: "Create your account"
- Subtext: "Start designing in 60 seconds"
- Form fields: Full name, Email address, Password, Confirm Password
- Submit button: "Create free account"
- Bottom: "Already have an account? Sign in →"
- Add terms fine print below button: "By creating an account, you agree to our Terms of Service and Privacy Policy." (12px, `var(--text-faint)`)

**Password strength indicator**: Below password field, a 4-segment progress bar showing strength.
```css
display: flex; gap: 4px; margin-top: 6px;
```
Each segment: `height: 3px; flex: 1; border-radius: 99px; background: var(--border-default); transition: background 200ms`.
Active segments: 1 = `var(--state-error)`, 2 = `var(--state-warning)`, 3–4 = `var(--state-success)`.

---

## Page 3 — Editor Home (`app/editor/page.tsx`)

The authenticated main hub where users see and manage their projects.

Use the `<Navbar isAuthenticated={true} />` component.

**Page layout**:
```css
min-height: 100vh;
background: var(--bg-base);
padding-top: 56px; /* navbar height */
```

**Content area**: `max-width: 1100px; margin: 0 auto; padding: 48px 24px`.

### Top Row
```css
display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px;
```

**Left**: 
- "My Projects" — 26px, weight 700, letter-spacing -0.5px
- Below: "3 projects" — 14px, `var(--text-muted)`

**Right**: 
- "New project" button with `+` icon. Style: `background: var(--accent-primary); color: #000; font-weight: 600; font-size: 14px; padding: 10px 20px; border-radius: var(--radius-sm)`. Hover: brightness 110%.
- On click: opens `<CreateProjectModal />`.

### Filter/Search Bar
Below top row, `margin-bottom: 32px`:
- Search input (300px): magnifying glass icon inside, placeholder "Search projects...", same input styles as auth pages
- Filter pills: "All" | "Owner" | "Collaborator" — pill buttons, active one has `background: var(--accent-primary-dim)`, `border-color: var(--accent-primary)`, `color: var(--accent-primary)`. Others: `var(--bg-surface)`, `var(--border-default)`.

### Project Grid
`display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px`.

Render 3–5 `<ProjectCard />` components with mock data.

**Empty state** (when no projects): centered in the grid area, 200px height:
- A faint icon (large canvas/grid icon, 48px, `var(--text-faint)`)
- "No projects yet" — 18px, `var(--text-muted)`
- Subtext: "Create your first project to get started" — 14px, `var(--text-faint)`
- "Create project" button

---

## Component 3 — ProjectCard (`components/ProjectCard.tsx`)

Props:
```typescript
{
  id: string;
  name: string;
  updatedAt: Date;
  nodeCount: number;
  collaborators: { name: string; color: string; imageUrl?: string }[];
  isOwner: boolean;
}
```

**Card layout**:
```css
background: var(--bg-surface);
border: 1px solid var(--border-default);
border-radius: var(--radius-md);
overflow: hidden;
cursor: pointer;
transition: border-color 200ms, transform 200ms, box-shadow 200ms;
```
Hover: `border-color: var(--border-subtle)`, `transform: translateY(-2px)`, `box-shadow: var(--shadow-card)`.

**Top section — Mini canvas preview** (height: 140px):
```css
background: var(--bg-base);
position: relative;
border-bottom: 1px solid var(--border-default);
```
Dot-grid background. 2–3 tiny node rectangles absolutely positioned with the canvas node colors. For each project, vary the node positions and colors.

A subtle gradient overlay at the bottom:
```css
background: linear-gradient(to bottom, transparent 60%, var(--bg-surface) 100%);
```

**Bottom section** (`padding: 16px 20px`):

Row 1: Project name (16px, weight 600) + 3-dot menu button (right-aligned, `var(--text-muted)`, hover `var(--text-primary)`)

Row 2 (mt: 4px): "Updated 2h ago" — 13px, `var(--text-faint)`. Prepend a small clock icon.

Row 3 (mt: 12px): `display: flex; align-items: center; justify-content: space-between`
- Left: `<AvatarGroup />` with collaborator data, `max={3}`
- Right: Node count badge — `background: var(--bg-subtle)`, `border-radius: 99px`, `padding: 3px 10px`, `font-size: 12px`, `color: var(--text-muted)`, text: "12 nodes"

**3-dot menu** (absolute dropdown, same styles as navbar dropdown):
- "Open" (with external-link icon)
- "Rename" (with edit icon)
- "Share" (with users icon)
- Divider
- "Delete" (with trash icon, red hover)

**Owner badge**: If `isOwner`, small "Owner" pill top-right of the canvas preview area:
```css
position: absolute; top: 10px; right: 10px;
background: var(--accent-primary-dim); color: var(--accent-primary);
border: 1px solid rgba(0,200,212,0.3); border-radius: 99px;
font-size: 11px; font-weight: 600; padding: 2px 8px;
```

---

## Component 4 — CreateProjectModal (`components/CreateProjectModal.tsx`)

Props: `isOpen: boolean; onClose: () => void; onCreate: (name: string) => void`.

**Backdrop**: `position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 300; display: flex; align-items: center; justify-content: center`.

Click backdrop to close.

**Modal box**:
```css
background: var(--bg-elevated);
border: 1px solid var(--border-subtle);
border-radius: var(--radius-lg);
padding: 32px;
width: 100%;
max-width: 440px;
animation: modal-in 200ms cubic-bezier(0.16, 1, 0.3, 1);
```
`@keyframes modal-in { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }`

**Header**: "New project" (20px, weight 700) + X close button (top-right, 16px icon, `var(--text-muted)`).

**Form** (`margin-top: 24px`):
- Label: "Project name"
- Input: same styles as auth inputs, placeholder "e.g. Payment Service Architecture", autofocus
- Helper text below: "A room ID will be auto-generated from your project name." — 13px, `var(--text-faint)`

**Button row** (`margin-top: 24px`, `display: flex; gap: 10px; justify-content: flex-end`):
- "Cancel" — bordered ghost button, `var(--text-secondary)`
- "Create project" — filled `var(--accent-primary)` button, `color: #000`, disabled + dimmed until name is entered

Close on Escape key. Trap focus within modal.

---

## Component 5 — ShareDialog (`components/ShareDialog.tsx`)

Props: `isOpen: boolean; onClose: () => void; projectId: string; collaborators: Collaborator[]`.

Same backdrop + modal styles as CreateProjectModal.

**Modal width**: `max-width: 520px`.

**Header**: "Share project" + X button.

**Share link section** (`margin-top: 24px`):
- Label: "Project link" (13px, `var(--text-secondary)`)
- Row: URL input (read-only, `var(--bg-surface)`, `color: var(--text-muted)`, showing "ghost.ai/workspace/abc-123") + "Copy link" button (outlined, 13px). On copy: button flashes "Copied! ✓" in `var(--state-success)` for 2s.

**Collaborators section** (`margin-top: 28px`):
- Title: "People with access" (14px, weight 600)
- List of collaborators with avatar (32px), name, role pill ("Owner" or "Collaborator"), and a remove button (×) for non-owner entries.

Role pill: `background: var(--bg-subtle); border-radius: 99px; padding: 3px 10px; font-size: 12px; color: var(--text-muted)`.

Owner role pill: `color: var(--accent-primary); background: var(--accent-primary-dim)`.

**Invite section** (`margin-top: 24px`, `border-top: 1px solid var(--border-default)`, `padding-top: 24px`):
- Label: "Invite collaborator"
- Row: email input + "Invite" button (filled cyan, small). Input placeholder: "colleague@company.com". On submit: adds to collaborator list optimistically.

**Bottom**: "Only invited collaborators and the owner can access this project." — 12px, `var(--text-faint)`.

---

## Mock Data for Editor Home

Use this data when rendering the editor home:

```typescript
const mockProjects = [
  {
    id: "prj_01",
    name: "Payment Service Architecture",
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    nodeCount: 14,
    isOwner: true,
    collaborators: [
      { name: "Alex Reed", color: "#00c8d4" },
      { name: "Maya Lin", color: "#f75f8f" },
      { name: "Jordan S.", color: "#62C073" },
    ],
  },
  {
    id: "prj_02",
    name: "Auth Microservice Redesign",
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    nodeCount: 8,
    isOwner: true,
    collaborators: [{ name: "Sam Park", color: "#BF7AF0" }],
  },
  {
    id: "prj_03",
    name: "CI/CD Pipeline — Staging",
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    nodeCount: 11,
    isOwner: false,
    collaborators: [
      { name: "You", color: "#00c8d4" },
      { name: "Dana K.", color: "#FF990A" },
    ],
  },
];
```

---

## Animations in This Phase

```css
/* Dropdown open */
@keyframes dropdown-in {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Modal open */
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

/* Overlay nav open (mobile) */
@keyframes overlay-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Project card stagger on load */
/* Apply animation-delay: Xms to each card, 50ms increment */
@keyframes card-appear {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## Accessibility Requirements

- All modals trap focus (use a focus trap utility or `inert` attribute on background)
- Modals closeable with Escape key
- All form inputs have associated `<label>` elements
- Dropdown menus use `role="menu"` and `role="menuitem"` with keyboard navigation (arrow keys)
- Buttons without visible text labels have `aria-label`
- `aria-modal="true"` on modal elements
- Color is not the sole differentiator for any state

---

**Output every file completely. No truncation, no `// TODO`, no placeholder code. Write the full implementation.**

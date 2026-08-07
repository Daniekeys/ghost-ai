# Canvarch — Phase 1: Foundation + Landing Page

> **Instructions for Claude Code**: This is Phase 1 of a 4-phase build. Complete everything in this prompt before moving to Phase 2. Do not truncate code or use placeholder comments. Write every line.

---

## What You Are Building

The complete marketing landing page for **Canvarch** — a real-time collaborative system design workspace where engineers describe software architecture in plain English and an AI agent generates it live on a shared canvas.

This phase establishes the entire design system and builds the full public landing page (`/`).

---

## Design System — Implement First in `globals.css`

```css
/* CANVARCH — GLOBAL DESIGN TOKENS */
:root {
  --bg-base: #080809;
  --bg-surface: #111114;
  --bg-elevated: #18181c;
  --bg-subtle: #1e1e23;

  --border-default: #2a2a30;
  --border-subtle: #3a3a42;

  --text-primary: #f0f0f4;
  --text-secondary: #c0c0cc;
  --text-muted: #808090;
  --text-faint: #505060;

  --accent-primary: #00c8d4;
  --accent-primary-dim: rgba(0, 200, 212, 0.12);
  --accent-ai: #6457f9;
  --accent-ai-dim: rgba(100, 87, 249, 0.15);
  --accent-ai-text: #8b82ff;

  --state-error: #ff4d4f;
  --state-success: #34d399;
  --state-warning: #fbbf24;

  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 24px;

  --shadow-glow-cyan: 0 0 60px rgba(0, 200, 212, 0.12);
  --shadow-glow-ai: 0 0 60px rgba(100, 87, 249, 0.18);
  --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.5);
}
```

**Typography**: Import **Geist Sans** and **Geist Mono** via `@import` from Google Fonts or `next/font`. Fallback stack: `'DM Sans', sans-serif` and `'JetBrains Mono', monospace`. **Never use Inter, Roboto, or system-ui as the primary font.**

Apply globally:
```css
* { box-sizing: border-box; }
html { background: var(--bg-base); color: var(--text-primary); }
body { font-family: 'Geist Sans', 'DM Sans', sans-serif; }
```

---

## Canvas Node Color Palette

Eight predefined fill + text pairs used on canvas nodes throughout the page visuals:

| Fill | Text | Name |
|------|------|------|
| `#1F1F1F` | `#EDEDED` | Neutral (default) |
| `#10233D` | `#52A8FF` | Blue |
| `#2E1938` | `#BF7AF0` | Purple |
| `#331B00` | `#FF990A` | Orange |
| `#3C1618` | `#FF6166` | Red |
| `#3A1726` | `#F75F8F` | Pink |
| `#0F2E18` | `#62C073` | Green |
| `#062822` | `#0AC7B4` | Teal |

---

## Page Structure

Build a single `page.tsx` (Next.js App Router) or `index.html`. Sections in order:

1. Navbar
2. Hero
3. Social Proof Strip
4. Features Bento Grid
5. How It Works
6. Templates Showcase
7. Testimonials
8. Pricing
9. Final CTA
10. Footer

---

## Section 1 — Navbar

**Sticky**, `height: 56px`, `z-index: 100`.

**Background**: `var(--bg-base)` with `backdrop-filter: blur(16px)`. Bottom border: `1px solid var(--border-default)`.

**Scroll behavior**: When `scrollY > 20`, transition border to `var(--border-subtle)` and add `box-shadow: 0 1px 24px rgba(0,0,0,0.6)`.

**Left**: Canvarch wordmark.
- A minimal SVG logo icon (20×20px): a rounded rectangle body with two small bumps at the bottom, filled `var(--text-muted)`. Inline SVG.
- "Canvarch" in `var(--text-primary)`. Font size 16px, weight 600. Letter-spacing -0.3px.

**Center** (desktop only, hidden below 768px): Nav links — "Features", "Templates", "Pricing", "Docs". Font size 14px, `var(--text-secondary)`. Hover: `var(--text-primary)`. Active underline: 1px `var(--accent-primary)`.

**Right**:
- "Sign in" — ghost text button, 14px, `var(--text-secondary)`, hover `var(--text-primary)`
- "Start for free" — filled button, background `var(--accent-primary)`, color `#000`, font-weight 600, font-size 14px, `border-radius: var(--radius-sm)`, padding `8px 18px`. Hover: brightness 110%, scale 1.02. Transition 150ms.

**Mobile** (below 768px): Hide center links. Show hamburger (3 lines, `var(--text-secondary)`). On click, open a full-screen overlay nav (`var(--bg-elevated)`, `z-index: 200`) with links stacked vertically and a close button.

---

## Section 2 — Hero

**Full viewport height** (`min-height: 100vh`). Centered content, `max-width: 1100px`, horizontal padding `24px`.

### Eyebrow badge
Small pill above headline: a spinning indigo dot + "Now in open beta" text. 
```
background: var(--accent-ai-dim); border: 1px solid var(--accent-ai); 
color: var(--accent-ai-text); border-radius: 99px; padding: 4px 14px; font-size: 13px;
```
Spinning dot: `width: 7px; height: 7px; background: var(--accent-ai); border-radius: 50%;` with a CSS `@keyframes spin-pulse` that scales 1→1.3→1 over 1.5s infinitely.

### Headline
```
font-size: clamp(44px, 6vw, 80px);
font-weight: 700;
letter-spacing: -2px;
line-height: 1.05;
```
Text: 
```
Architecture lives
on the canvas.
```
"on the canvas." — wrap in a `<span>` with `color: var(--accent-primary)`.

### Subheadline
```
font-size: clamp(16px, 2vw, 20px);
color: var(--text-secondary);
max-width: 560px;
line-height: 1.65;
margin: 24px auto;
```
Text: "Describe your system in plain English. Canvarch generates the architecture live — and every collaborator sees it happen in real time."

### CTA Row
Two buttons, centered, gap 12px:

**Primary**: "Start building free →"
```
background: var(--accent-primary); color: #000; font-weight: 700;
font-size: 16px; padding: 14px 32px; border-radius: var(--radius-sm);
box-shadow: var(--shadow-glow-cyan);
```
Pulse animation: `@keyframes cta-pulse` — `box-shadow` expands and fades out every 3s.

**Secondary**: "▶ Watch demo"
```
background: transparent; color: var(--text-primary); font-weight: 500;
font-size: 16px; padding: 14px 28px; border-radius: var(--radius-sm);
border: 1px solid var(--border-subtle);
```
Hover: border brightens to `var(--border-default)`, background `var(--bg-surface)`.

### Hero Canvas Visual

A dark rounded container below the CTAs, `max-width: 900px`, `margin: 64px auto 0`, `border-radius: var(--radius-lg)`, `background: var(--bg-surface)`, `border: 1px solid var(--border-default)`, `overflow: hidden`.

**Top bar** (mock browser chrome): 40px height, `var(--bg-elevated)`, flex row with:
- 3 small circles (12px, colors `#ff5f57`, `#ffbd2e`, `#28ca42`, 8px apart)
- A centered URL pill: `var(--bg-subtle)`, text "canvarch.ai/workspace/my-system", 12px `var(--text-muted)`

**Canvas area** (below top bar): `height: 360px` (desktop) / `200px` (mobile), `background: var(--bg-base)`, dot-grid pattern via CSS:
```css
background-image: radial-gradient(circle, var(--border-default) 1px, transparent 1px);
background-size: 24px 24px;
```

**Nodes on canvas**: Place 5 absolutely-positioned node cards inside the canvas. Each node:
```
background: [fill from palette]; color: [text from palette];
border-radius: 10px; padding: 10px 16px; font-size: 13px; font-weight: 600;
border: 1px solid rgba(255,255,255,0.08);
position: absolute;
box-shadow: 0 4px 20px rgba(0,0,0,0.4);
```

Node positions and data:
1. "API Gateway" — Blue fill — top:60px, left:40px
2. "Auth Service" — Purple fill — top:60px, left:220px  
3. "Order Service" — Orange fill — top:160px, left:130px
4. "PostgreSQL" — Green fill — top:260px, left:60px
5. "Redis Cache" — Teal fill — top:260px, left:260px

**Active selection node** (API Gateway): add `border: 1.5px solid var(--accent-primary); box-shadow: 0 0 0 3px var(--accent-primary-dim), 0 4px 20px rgba(0,0,0,0.4);`

**SVG connection lines**: An absolutely positioned `<svg>` over the canvas (`inset: 0, pointer-events: none`) with `<line>` or `<path>` elements connecting the nodes. Use `stroke: var(--border-subtle)`, `stroke-width: 1.5`, `marker-end: url(#arrowhead)`. Define an `<arrowhead>` marker in `<defs>`.

Animate lines drawing in with `stroke-dasharray` + `stroke-dashoffset` animation on load (1.2s, ease-out).

**Live cursors**: 2 absolutely-positioned cursor indicators:
- Cursor 1: small arrow SVG (12px) in `#00c8d4` + pill label "Alex" — top:120px, left:310px
- Cursor 2: small arrow SVG in `#f75f8f` + pill label "Maya" — top:200px, left:400px
Each cursor drifts slowly using CSS `@keyframes` that nudges translate(x,y) back and forth over 4–6s.

**AI Thinking badge** (bottom-right of canvas): 
```
position: absolute; bottom: 16px; right: 16px;
background: var(--accent-ai-dim); border: 1px solid var(--accent-ai);
border-radius: 99px; padding: 6px 12px; font-size: 12px;
color: var(--accent-ai-text); display: flex; align-items: center; gap: 6px;
```
A spinning ring loader (8px, `var(--accent-ai)` border, one side transparent) + "Canvarch is thinking..."

### Load Animation Sequence
On page load, animate hero elements with staggered `opacity: 0 → 1` + `translateY(16px → 0)`:
- 0ms: eyebrow badge
- 100ms: headline
- 200ms: subheadline  
- 350ms: CTA row
- 500ms: canvas container (fade + scale 0.97→1)

---

## Section 3 — Social Proof Strip

`padding: 32px 0`, `border-top: 1px solid var(--border-default)`, `border-bottom: 1px solid var(--border-default)`.

Center row: "Trusted by engineering teams at" (14px, `var(--text-faint)`) followed by 5 company name logos in a flex row, `gap: 40px`.

Company names styled as wordmarks: "Stripe", "Vercel", "Linear", "Notion", "Figma" — use 16px, `var(--text-faint)`, font-weight 700, letter-spacing -0.5px. Hover: `var(--text-muted)` transition 200ms.

On mobile: horizontal scroll with `overflow-x: auto`, no scrollbar visible.

---

## Section 4 — Features Bento Grid

`padding: 100px 24px`, `max-width: 1100px`, `margin: 0 auto`.

**Section header** (centered):
- Label pill: "Features" — `background: var(--accent-primary-dim)`, `color: var(--accent-primary)`, `border-radius: 99px`, `font-size: 12px`, `padding: 4px 12px`, `font-weight: 600`
- H2: "Everything your architecture needs" — `font-size: clamp(32px, 4vw, 52px)`, `font-weight: 700`, `letter-spacing: -1.5px`
- Subtext: "One canvas. Real-time collaboration. AI that actually understands systems."

**Bento grid** (CSS Grid, `gap: 12px`):

```
Desktop layout (1100px):
[ Large AI Card (2 col)  ][ Collab Card (1 col) ]
[ Templates Card (2 col) ][ Spec Card (1 col)   ]
[ Color Card  ][ Access Card ][ Status Card ]
```

Use `grid-template-columns: repeat(3, 1fr)` with `grid-column: span 2` for wide cards.

**Card base styles**:
```css
.feature-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: 28px;
  transition: border-color 200ms, transform 200ms, box-shadow 200ms;
}
.feature-card:hover {
  border-color: var(--border-subtle);
  transform: translateY(-3px);
  box-shadow: var(--shadow-card);
}
```

**Icon styles**: 40px container, `background: var(--accent-primary-dim)`, `border-radius: 10px`, centered icon 20px in `var(--accent-primary)`. Use Lucide React or inline SVG.

**Feature cards data**:

1. **AI Architecture Generation** (`grid-column: span 2`)  
   Icon: Sparkles  
   Title: "AI Architecture Generation"  
   Description: "Type a prompt. Canvarch generates nodes, edges, and service topology directly on the shared canvas — while every collaborator watches it appear live."  
   Visual extra: A small mock prompt input at the bottom of the card: dark input field, placeholder "Describe a microservices e-commerce system...", cyan "Generate" button. Non-functional, pure CSS.

2. **Real-time Collaboration** (`grid-column: span 1`)  
   Icon: Users  
   Title: "Real-time Collaboration"  
   Description: "Live cursors, presence avatars, and shared canvas state. Everyone sees every change the instant it happens."  
   Visual extra: Three small colored avatar circles (28px) with initials A, M, J in a row, overlapping slightly.

3. **Starter Templates** (`grid-column: span 2`)  
   Icon: LayoutGrid  
   Title: "Starter Templates"  
   Description: "Import a production-ready architecture. Microservices, CI/CD pipelines, event-driven systems — fully wired and ready to extend."  
   Visual extra: 3 mini template thumbnails (100×60px each) side by side — tiny node graphs using the canvas node colors. Just CSS boxes with connecting lines.

4. **Spec Generation** (`grid-column: span 1`)  
   Icon: FileCode  
   Title: "One-click Spec Generation"  
   Description: "Turn your canvas into a Markdown technical specification. Stored, versioned, and downloadable."  
   Visual extra: A code snippet block (`var(--bg-elevated)`, monospace font):
   ```
   # System Architecture
   ## Services
   - API Gateway
   - Auth Service...
   ```

5. **Node Customization** (`grid-column: span 1`)  
   Icon: Palette  
   Title: "Full Node Control"  
   Description: "8 color themes, 6 shapes, resize handles, inline label editing."  
   Visual extra: The 8 canvas color swatches in a 2×4 grid of 20×20 rounded squares.

6. **Role-based Access** (`grid-column: span 1`)  
   Icon: Shield  
   Title: "Role-based Access"  
   Description: "Owner and collaborator roles. Invite by email. Room tokens scoped per user."

7. **Background AI Tasks** (`grid-column: span 1`)  
   Icon: Zap  
   Title: "Durable AI Tasks"  
   Description: "Architecture generation runs as a background task. Close the tab — it still finishes and syncs when you return."

Mobile: all cards collapse to `grid-column: span 1`.

---

## Section 5 — How It Works

`padding: 100px 24px`, `max-width: 900px`, `margin: 0 auto`, centered.

**Header**: Label pill "How it works" + H2 "From idea to spec in minutes".

**3 steps** in a horizontal row (desktop) / vertical stack (mobile). Connected by a dashed line on desktop (`border-top: 1px dashed var(--border-default)` running between step numbers).

Each step:
- Large number circle: `48px`, `background: var(--accent-primary-dim)`, `border: 1px solid var(--accent-primary)`, `color: var(--accent-primary)`, `font-size: 20px`, `font-weight: 700`
- Step title: 18px, font-weight 600
- Description: 15px, `var(--text-secondary)`, line-height 1.6

Step content:
1. **Describe your system** — "Type what you're building in plain English. Canvarch interprets architecture intent, not just words — services, databases, queues, and connections."
2. **Watch it build live** — "Nodes and edges appear on the shared canvas in real time. Every collaborator sees the design form as the AI generates it."
3. **Generate the spec** — "One click exports your canvas as a structured Markdown technical specification. Ready to commit, share, or review."

**Scroll reveal**: Each step fades in with `translateY(20px → 0)` as it enters the viewport via `IntersectionObserver`. Stagger 150ms between steps.

---

## Section 6 — Templates Showcase

`padding: 100px 24px`, `max-width: 1100px`, `margin: 0 auto`.

**Header**: Label pill "Templates" + H2 "Start with battle-tested architectures" + subtext "Import any template into your canvas. Extend it with AI."

**3 template cards** in a 3-column grid (mobile: 1 column), `gap: 20px`.

Each template card:
```css
background: var(--bg-surface);
border: 1px solid var(--border-default);
border-radius: var(--radius-md);
overflow: hidden;
transition: transform 200ms, box-shadow 200ms, border-color 200ms;
```
Hover: `transform: translateY(-4px)`, `box-shadow: var(--shadow-card)`, `border-color: var(--border-subtle)`.

**Card structure**:
- Top: template mini-canvas (160px height, `var(--bg-base)`, dot-grid background, small SVG/CSS node diagram inside)
- Bottom section (padding 20px): template name, description, node count badge, "Import template →" link in `var(--accent-primary)`

**Template 1 — Microservices E-Commerce**
- Mini canvas: API Gateway at top center → Auth, Order, Product, Payment nodes below → PostgreSQL, Redis at bottom. Use Blue, Purple, Orange, Green, Teal node colors.
- Description: "API gateway, auth, order, product, payment, and notification services with an event bus and shared databases."
- Badge: "12 nodes · 8 connections"

**Template 2 — CI/CD Pipeline**
- Mini canvas: Linear left-to-right flow: Source → Build → Test → Security → Registry → Deploy
- Description: "Source control, build server, test runner, security scan, artifact registry, and staged deployment."
- Badge: "8 nodes · Linear flow"

**Template 3 — Event-Driven System**
- Mini canvas: Producer → Broker → 3 Consumers (fan-out), Dead-letter Queue bottom
- Description: "Event producer, message broker, multiple consumers, dead-letter queue, and monitoring layer."
- Badge: "10 nodes · Event mesh"

---

## Section 7 — Testimonials

`padding: 80px 24px`, `max-width: 1000px`, `margin: 0 auto`.

**Header**: H2 "Built for engineers who ship" (centered).

**3 testimonial cards** in a 3-column grid (mobile: 1 column), `gap: 16px`.

Card style: `background: var(--bg-surface)`, `border: 1px solid var(--border-default)`, `border-radius: var(--radius-md)`, `padding: 24px`.

Card content:
- Stars: 5 × `★` in `var(--accent-primary)`, font-size 14px
- Quote: italic, 15px, `var(--text-secondary)`, line-height 1.7
- Bottom: avatar circle (40px, initials, `var(--bg-subtle)` background) + name (14px, font-weight 600) + role (13px, `var(--text-muted)`)

**Data**:
1. Quote: "Canvarch cut our architecture review time from two hours to twenty minutes. We just pull up the canvas and everyone is aligned." — Sarah K., Staff Engineer
2. Quote: "I've tried every diagramming tool. This is the first one that actually understands what I'm trying to build, not just what I'm drawing." — Marcus T., CTO
3. Quote: "The spec generation alone is worth it. We finally have real technical documentation instead of outdated Confluence pages." — Priya M., Engineering Lead

---

## Section 8 — Pricing

`padding: 100px 24px`, `max-width: 1000px`, `margin: 0 auto`, centered.

**Header**: Label pill "Pricing" + H2 "Simple, transparent pricing" + subtext "Start free. Scale with your team."

**Annual/monthly toggle**: A pill toggle above cards.
```
background: var(--bg-surface); border: 1px solid var(--border-default);
border-radius: 99px; padding: 4px; display: inline-flex;
```
Two options: "Monthly" and "Annual (save 20%)". Active option: `background: var(--accent-primary)`, `color: #000`. Inactive: `var(--text-muted)`. Smooth `background-color` transition 200ms. When toggled, prices update via JS.

**3 pricing cards** in a 3-column grid (mobile: 1 column), same height with flexbox. Middle card (Pro) is featured.

**Card base**:
```css
background: var(--bg-surface);
border: 1px solid var(--border-default);
border-radius: var(--radius-md);
padding: 32px;
```

**Featured card** (Pro):
```css
border: 1px solid var(--accent-primary);
box-shadow: var(--shadow-glow-cyan);
position: relative;
```
"Most popular" badge: absolute top -14px, centered, `background: var(--accent-primary)`, `color: #000`, `border-radius: 99px`, `font-size: 12px`, `font-weight: 700`, `padding: 4px 16px`.

**Card content structure**:
- Plan name (18px, font-weight 700)
- Price (48px, font-weight 800, letter-spacing -1px) + "/month" (16px, `var(--text-muted)`)
- Description (14px, `var(--text-secondary)`)
- Divider line
- Feature list with ✓ checkmarks in `var(--accent-primary)`
- CTA button (full-width)

**Plan data**:

**Free — $0/month** (Annual: $0)
- 3 projects
- 1 collaborator per project
- 10 AI generations / month
- 5 spec generations
- Community support
- CTA: "Start free" — bordered button, `var(--text-primary)`, full width

**Pro — $19/month** (Annual: $15/month)
- Unlimited projects
- 5 collaborators per project
- 100 AI generations / month
- Unlimited spec generations
- Priority generation queue
- Email support
- CTA: "Start Pro trial" — filled `var(--accent-primary)` button, `color: #000`, full width

**Team — $49/month** (Annual: $39/month)
- Everything in Pro
- Unlimited collaborators
- Dedicated generation queue
- SSO / SAML
- Priority support + SLA
- Custom data retention
- CTA: "Contact sales" — bordered button, full width

---

## Section 9 — Final CTA

Full-width section, `padding: 120px 24px`, `background: var(--bg-elevated)`, `border-top: 1px solid var(--border-default)`.

Center everything. Radial gradient behind content: 
```css
background: radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,200,212,0.08) 0%, transparent 70%), var(--bg-elevated);
```

**Content**:
- H2: "Your architecture, on the canvas." — `clamp(36px, 5vw, 60px)`, weight 700, letter-spacing -1.5px
- Subtext: "Start designing in 60 seconds. No setup. No boilerplate."
- Big CTA: "Start building for free →" — same style as hero primary button, font-size 18px, padding `16px 40px`
- Fine print: "Free forever plan · No credit card required" — 13px, `var(--text-faint)`

---

## Section 10 — Footer

`background: var(--bg-base)`, `border-top: 1px solid var(--border-default)`, `padding: 64px 24px 32px`.

**4-column grid** (desktop), `max-width: 1100px`, `margin: 0 auto`. Mobile: 2 columns then 1 column.

**Col 1 — Brand**:
- Canvarch logo + tagline: "The canvas that thinks with you."
- Social icons row: Twitter/X, GitHub, Discord — 20px, `var(--text-muted)`, hover `var(--text-primary)`, gap 16px

**Col 2 — Product**: Features, Templates, Pricing, Changelog

**Col 3 — Resources**: Docs, API Reference, Blog, Status

**Col 4 — Company**: About, Careers, Privacy Policy, Terms of Service

Link styles: 14px, `var(--text-muted)`, hover `var(--text-primary)`, no underline, transition 150ms. Column headers: 13px, `var(--text-faint)`, font-weight 600, letter-spacing 0.5px, uppercase, `margin-bottom: 16px`.

**Bottom row** (divider + `padding-top: 32px`, `border-top: 1px solid var(--border-default)`):
- Left: "© 2025 Canvarch. All rights reserved."
- Right: Privacy · Terms · Security

Both in 13px, `var(--text-faint)`.

---

## Animations Reference

Implement all of these:

```css
/* Staggered page load — hero sequence */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* CTA glow pulse — fires every 3s */
@keyframes cta-pulse {
  0%   { box-shadow: 0 0 60px rgba(0,200,212,0.12); }
  50%  { box-shadow: 0 0 80px rgba(0,200,212,0.28); }
  100% { box-shadow: 0 0 60px rgba(0,200,212,0.12); }
}

/* AI thinking spinner */
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Cursor drift — offset per cursor */
@keyframes drift-1 {
  0%, 100% { transform: translate(0, 0); }
  33%       { transform: translate(6px, -4px); }
  66%       { transform: translate(-3px, 5px); }
}

/* SVG line draw-in */
/* Set stroke-dasharray and stroke-dashoffset equal to path length, then animate offset to 0 */
@keyframes line-draw {
  from { stroke-dashoffset: var(--path-length); }
  to   { stroke-dashoffset: 0; }
}

/* Scroll reveal — applied via IntersectionObserver */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 500ms ease, transform 500ms ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

Use `IntersectionObserver` to add `.visible` to every `.reveal` element when it enters the viewport (threshold 0.1).

Apply staggered delays to feature cards, step cards, testimonial cards, and pricing cards using inline `style="transition-delay: Xms"`.

---

## Mobile Responsive Rules

| Breakpoint | Rules |
|------------|-------|
| < 1024px | 2-column features grid, hide dashed step connector |
| < 768px | All grids to 1 column, hide navbar center links, hamburger visible |
| < 480px | Hero headline `clamp(36px, 9vw, 44px)`, hide canvas visual partially |

All tap targets: minimum 44×44px. No horizontal scroll at any width. Test at 375px, 768px, 1280px.

---

## Technical Notes

- Framework: **Next.js 15+ App Router + TypeScript**
- Styling: **Tailwind v4 for utilities**, CSS custom properties for all brand values
- Icons: **Lucide React** (`npm install lucide-react`) or inline SVG
- No external animation libraries — CSS keyframes only
- All interactive elements must have `:focus-visible` outlines (2px `var(--accent-primary)`, offset 2px)
- Use `will-change: transform` only on actively animating elements
- `prefers-reduced-motion`: wrap all `animation` and `transition` values in `@media (prefers-reduced-motion: no-preference)`
- Images: use `next/image` with proper `width`/`height` or CSS `aspect-ratio`

**Output the complete production code. Do not omit, truncate, or use `// TODO` placeholders. Write every file completely.**

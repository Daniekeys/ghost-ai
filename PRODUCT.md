# Ghost AI — Product Intelligence Brief

## What Is Ghost AI?

**Ghost AI is a real-time collaborative system architecture design platform powered by AI.** It's where engineers, architects, and teams describe what they want to build in plain English — and an AI agent turns that description into a structured, visual system design diagram on a shared canvas. Teams can collaborate live on the diagram, and when they're done, the app generates a professional Markdown technical specification document from the final architecture.

Think of it as **Figma meets architecture diagramming, with an AI co-designer built in.**

---

## Target Audience

### Primary Users

| Segment | Why They Need It |
|---|---|
| **Software engineers & tech leads** | Need to design and document system architecture fast, without wrestling with diagramming tools |
| **Solutions architects** | Need to rapidly prototype and communicate architectural decisions to stakeholders |
| **Engineering teams at startups** | Need async + real-time collaboration on system design without expensive tools |
| **Technical co-founders** | Need to produce credible architecture specs for investors, contractors, or early hires |

### Secondary Users

| Segment | Use Case |
|---|---|
| **DevRel & Developer Educators** | Creating architecture visuals for blog posts, documentation, courses |
| **Product managers with technical background** | Participating in architecture discussions without deep diagramming skills |
| **Freelance developers** | Generating client-deliverable system specs and architecture documents |

### Ideal Company Profile (B2B)

- Seed to Series B tech startups (5–100 engineers)
- Software agencies doing client architecture work
- Platform and infrastructure teams inside mid-market tech companies

---

## The Core Problem Being Solved

**System design is time-consuming, siloed, and produces outdated documentation.**

- Diagramming tools like Lucidchart, draw.io, and Miro are manual — you drag and drop everything yourself
- Architecture decisions stay in people's heads or get lost in Notion docs
- Getting from "whiteboard sketch" to "deliverable technical spec" is a full day of work
- Real-time collaboration on architecture diagrams is broken (Figma exists for design, nothing great exists for system design)

---

## App Features

### 1. AI Architecture Generation

- User describes a system in plain English ("Build me a microservices e-commerce platform with event-driven order processing")
- Ghost AI generates the full node/edge diagram directly onto the shared canvas
- Runs as a durable background job — no timeouts, handles complex architectures
- All collaborators see the AI "thinking" in real time (presence indicators, status feed)

### 2. Real-Time Collaborative Canvas

- Powered by Liveblocks + React Flow
- Multiple engineers can work on the same diagram simultaneously
- Live cursors with names and activity indicators
- Conflict-free, synced node/edge state across all participants

### 3. Visual Architecture Canvas

- 6 node shapes: rectangle, diamond, circle, pill, cylinder, hexagon (maps to services, databases, decisions, APIs, etc.)
- 8 color palettes for visual organization by system layer
- Drag-and-drop node creation, inline label editing, resizing
- Custom smooth-step edges with arrow routing
- Undo/redo, keyboard shortcuts, zoom controls

### 4. Starter System Design Templates

- Pre-built templates: microservices, event-driven, CI/CD pipeline, serverless, monolith, and more
- Import a template into the canvas with one click — then customize from there
- Great for teams starting from a known pattern instead of a blank canvas

### 5. Technical Spec Generation

- One click converts the finished canvas diagram into a full Markdown technical specification
- Spec includes architecture description, component definitions, data flows, and design rationale
- Specs are persisted and downloadable — ready to drop into GitHub, Notion, or a wiki

### 6. Collaboration & Access Control

- Project ownership with collaborator invites by email
- Share dialog with live collaborator list, copy-link, invite/remove
- Role-based access: owners can mutate, collaborators can edit canvas

### 7. Authentication & Project Management

- Full user authentication (sign-in, sign-up, route protection)
- Unlimited projects with workspace navigation
- Project rename, delete, and organization

---

## Tech Stack

| Technology | Role |
|---|---|
| **Next.js 16 + TypeScript** | Full-stack framework with clean server/client boundaries |
| **Liveblocks** | Real-time collaborative canvas, presence, and cursors |
| **React Flow** | Interactive node/edge diagram renderer |
| **Trigger.dev** | Durable AI background tasks — no timeouts, failure-resilient |
| **Gemini + OpenRouter** | Multi-model AI generation — swappable without rewrites |
| **Prisma + PostgreSQL** | Relational metadata: projects, collaborators, specs, task runs |
| **Vercel Blob** | Artifact storage for canvas snapshots and generated specs |
| **Clerk** | User identity and route protection |
| **Tailwind + shadcn/ui** | Dark-only design system and component library |

---

## SaaS Packaging

### Company Name: Ghost AI

**Tagline:** *"Describe it. Design it. Ship it."*

---

### Pricing Tiers

| Plan | Target | Price | Key Limits |
|---|---|---|---|
| **Free** | Solo devs, students | $0/mo | 3 projects, 1 collaborator, 10 AI generations/mo |
| **Pro** | Individual engineers & freelancers | $19/mo | Unlimited projects, 5 collaborators, 100 AI generations/mo |
| **Team** | Engineering teams | $49/seat/mo | Unlimited everything, SSO, priority AI, custom templates |
| **Enterprise** | Large orgs | Custom | Dedicated instance, SLA, admin controls, audit logs |

---

## Competitive Positioning

| Competitor | Weakness | How Ghost AI Wins |
|---|---|---|
| **Lucidchart / draw.io** | No AI, no real-time collaboration, fully manual | AI-first generation + real-time sync + spec output |
| **Eraser.io** | AI diagrams but limited collaboration depth | Better live collaboration, richer canvas controls |
| **Miro** | General whiteboard, not architecture-specific | Specialized shapes, language, and spec generation |
| **Excalidraw** | No AI, no structured output | AI generation + structured spec export |
| **Whimsical** | No AI, no spec generation | Full flow: prompt → diagram → spec |

---

## Go-To-Market Strategy

1. **Developer-led growth** — Free tier brings in engineers organically through shareable project links and generated specs posted on GitHub/Notion
2. **Template library SEO** — "Microservices architecture diagram" / "Event-driven system design" template pages rank organically
3. **Product Hunt launch** — The AI + real-time collaboration angle is highly compelling for a PH audience
4. **Engineering community** — Share generated spec demos and canvas walkthroughs on Twitter/X and LinkedIn
5. **Team expansion** — Individual users evangelize into company-wide adoption, driving upgrades to Team plans

---

## Product Roadmap

### High Priority

- Billing & subscription (Stripe)
- Version history for specs and canvas snapshots
- Export diagrams to PNG / SVG / PDF

### Medium Priority

- AI chat inside the canvas ("explain this node", "suggest an improvement")
- Public shareable diagram links (read-only)
- Expanded template library (Kubernetes, data pipelines, auth flows, real-time systems)
- Spec review and approval workflows

### Lower Priority

- Slack / GitHub integration (post spec on PR, notify on generation complete)
- Mobile-responsive canvas viewer
- Enterprise permission tiers (admin roles, team namespaces, audit logs)
- Versioned spec history with diff view

---

## Summary

Ghost AI is an AI-powered, real-time collaborative system design tool that lets engineering teams go from a plain-English description to a finished visual architecture diagram and downloadable technical specification — in minutes instead of hours. It targets software engineers and technical teams who need to design, communicate, and document systems fast.

The SaaS opportunity sits at the intersection of Figma (design collaboration), Lucidchart (architecture diagramming), and GitHub Copilot (AI assistance) — and none of those tools cover the full workflow end-to-end the way Ghost AI does.

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
- Feature 03: Authentication (Clerk)
  - `@clerk/nextjs` (^7.3.7) and `@clerk/ui` (^1.12.1) installed
  - `proxy.ts` at project root — `clerkMiddleware` with `createRouteMatcher`; protects all routes except sign-in/sign-up; uses `proxy` export (Next.js 16 convention, renamed from `middleware`)
  - `ClerkProvider` wraps app content inside the root layout `<body>` with `@clerk/ui/themes` `dark` base theme; appearance overrides via CSS custom property references (no hardcoded colors)
  - `EditorShell` moved out of root layout into `app/editor/layout.tsx`
  - `app/page.tsx` — server component: redirects authenticated users to `/editor`, unauthenticated to `/sign-in`
  - `app/sign-in/[[...sign-in]]/page.tsx` — two-panel layout (left: logo + tagline + feature list; right: Clerk `<SignIn />`); form-only on small screens
  - `app/sign-up/[[...sign-up]]/page.tsx` — same two-panel layout with Clerk `<SignUp />`
  - `app/editor/page.tsx` — placeholder editor landing page
  - `UserButton` added to editor navbar right section
  - `.env.local` updated with `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
  - `npm run build` passes

## In Progress

- None.

## Next Up

- Project creation and workspace navigation

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

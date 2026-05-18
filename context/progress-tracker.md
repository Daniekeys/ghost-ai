# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Phase 1 — Design System & UI Primitives

## Current Goal

- Authentication (Clerk) and route protection.

## Completed

- Scaffolded Next.js 16 app (layout.tsx, page.tsx, globals.css with Tailwind v4 import)
- Feature 01: Design System
  - Installed and configured shadcn/ui (Nova preset — Lucide + Geist fonts)
  - Added components: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea (components/ui/)
  - lucide-react installed (^1.16.0)
  - lib/utils.ts with cn() helper (clsx + tailwind-merge)
  - globals.css: dark-only theme — project tokens (--bg-base, --accent-primary, etc.) + shadcn vars aligned to dark palette, mapped via @theme inline; dark class on <html>

## In Progress

- None.

## Next Up

- Authentication (Clerk) and route protection
- Project creation and workspace navigation

## Open Questions

- None yet.

## Architecture Decisions

- Tailwind v4 CSS-native approach — no tailwind.config.js; all tokens defined via CSS custom properties and @theme inline in globals.css.
- Dark-only theme — no light mode; all variables at :root level, dark class on <html> for dark: variant utilities.
- shadcn/ui components in components/ui/ must not be modified after generation.
- Nova preset: Geist Sans (--font-sans) + Lucide icons.

## Session Notes

- Stack: Next.js 16.2.6, React 19, Tailwind v4 (@tailwindcss/postcss), TypeScript strict.
- @import "shadcn/tailwind.css" resolves via package.json exports "./tailwind.css" → dist/tailwind.css. The CSS language server flags it as unknown — this is a false positive, not a build error.
- Project Tailwind utilities: bg-base, bg-surface, bg-elevated, bg-subtle, text-copy-primary, text-copy-muted, text-copy-faint, border-surface-border, text-brand, bg-accent-dim, text-ai, text-ai-text, bg-error, bg-success, bg-warning.

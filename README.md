# Kerala MCH Tracker — EOI Demo

BPL Mother & Child Health Tracking demonstration for state health admin EOI evaluation.

**This is a demo, not the production system.** See `docs/superpowers/specs/2026-05-20-bpl-mch-demo-design.md` for the full design rationale.

## Quick start

```bash
pnpm install
cp .env.example .env.local
# Edit .env.local — paste your Neon DATABASE_URL
pnpm db:push
pnpm db:seed
pnpm dev
```

Open http://localhost:3000.

## Surfaces

- `/field` — ASHA mobile (phone-framed on desktop)
- `/admin` — district dashboard
- `/demo` — narrator controls (`Ctrl+Shift+D` on any page)

## Demo flow

Open two browser tabs:
- Tab 1: `/field`
- Tab 2: `/admin`

Run through the Sreelakshmi narrative arc (see spec §4 for the script).

## T-30 min smoke checklist

See `e2e/smoke-checklist.md`.

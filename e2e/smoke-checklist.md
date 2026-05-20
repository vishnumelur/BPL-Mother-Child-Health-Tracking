# T-30 min Smoke Checklist

Run this 30 minutes before any pitch. Should take ~4 minutes total.

## Environment
- [ ] `pnpm dev` is running
- [ ] `curl http://localhost:3000/demo/warmup` returns `{ warm: true }`
- [ ] `curl http://localhost:3000/demo/reset` returns `{ ok: true }`
- [ ] `curl http://localhost:3000/demo/seed` returns `{ ok: true, meta: { ... } }`

## /field
- [ ] `/field` renders, shows Sreelakshmi as CRITICAL
- [ ] `/field/sos` opens, dropdown shows mothers
- [ ] `/field/reminders` shows at least 2 rows; "Preview SMS" opens Malayalam modal
- [ ] `/field/iec` shows 6 cards with Malayalam titles

## /admin
- [ ] `/admin` shows 4 KPI cards
- [ ] Live alerts panel shows the SOS
- [ ] Palakkad map shows dots
- [ ] `/admin/people` shows Sreelakshmi in CRITICAL row
- [ ] `/admin/alerts/[id]` shows dispatch channels + GPS
- [ ] `/admin/schemes` shows PMMVY compliance

## Demo controls
- [ ] `Ctrl+Shift+D` opens narrator panel
- [ ] Scenario "post-anc" navigates without error
- [ ] Role switch to "ADMIN" works

## Two-tab sync test
- [ ] Open `/admin` in Tab 1
- [ ] Open `/field/sos` in Tab 2
- [ ] Raise SOS for any mother
- [ ] Tab 1 shows the new alert within 8 seconds (poller tick)

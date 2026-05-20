# BPL Mother & Child Health Tracking Demo — Design Spec

**Date:** 2026-05-20
**Status:** Approved design, ready for implementation planning
**Owner:** lijovarghese@gmail.com

---

## 0. Context

This spec describes the **EOI demo** for the *BPL Mother & Child Health Tracking and Decision Support System*. It is **not** the production system. It is a working, web-accessible prototype intended to be shown during a live pitch to **state/district health administrators in Kerala** (NHM, CMO, state health mission).

### Scope at a glance

- **Output:** a working Next.js application deployed to Vercel, backed by Neon Postgres
- **Cost:** $0 (Vercel Hobby + Neon free tier)
- **Build effort:** ~7–9 working days
- **Audience:** State/district health admin reviewers (Kerala)
- **Format:** live walkthrough (presenter-driven), ~12–15 minutes
- **Geographic anchor:** Attappadi block, Palakkad district, Kerala — known site for tribal SAM/IMR cases, real EOI relevance

### What the demo proves

Coverage of every Phase 1–5 feature in the EOI, organised as 8 polished **hero flows** (scripted, narrated) and 16 **supporting features** (functional, woven into surrounding screens, available if an evaluator asks).

### What the demo does NOT do

- Real ABHA / HMIS / ICDS / e-Sanjeevani integration calls (status tiles only)
- Real SMS gateway dispatch (preview modals only)
- Real OTP authentication (a cookie + role switcher)
- Real Service Worker / IndexedDB offline-first PWA (localStorage queue simulating the same architecture)
- Multi-state, multi-district tenancy (single Attappadi/Palakkad/Kerala context)

These omissions are deliberate and **disclosed in the narrator script** — a technical reviewer will be told exactly what's real and what's mocked.

---

## 1. Architecture

```
ONE Next.js 16 App Router app on Vercel Hobby
│
├── /field/*   — ASHA mobile surface (phone-framed on desktop)
├── /admin/*   — district dashboard surface (desktop)
└── /demo/*    — narrator controls (presenter-only, hidden behind key chord)
        │
        ▼
  Server Actions (typed mutations)
  React Server Components (typed reads)
        │
        ▼
  Drizzle ORM → Neon Postgres (free tier)
```

### Key decisions

| Decision | Rationale |
|---|---|
| One Next.js app, two URL surfaces | Live demo switches between ASHA phone view and CMO dashboard; one URL = no tab fumbling on stage |
| Server Actions over REST API | Demo doesn't need an API layer; typed mutations + automatic revalidation = zero glue code |
| Drizzle over Prisma | Lighter, no codegen step, faster cold starts on Hobby tier, end-to-end TypeScript inference |
| Neon Postgres (free) | Real persistence makes the demo "feel alive"; 0.5 GB is more than enough for ~100 seeded beneficiaries |
| No real auth | Cookie holds `currentUserId` + `currentRole`; `/demo/role-switch` flips it; disclosed in narration |
| Tailwind + shadcn/ui | Polished modern gov-tech aesthetic without bespoke design system overhead |

### Stack

- **Framework:** Next.js 16 (App Router, RSC, Server Actions)
- **Hosting:** Vercel Hobby (free)
- **Database:** Neon Postgres (free tier, 0.5 GB)
- **ORM:** Drizzle + drizzle-kit migrations
- **UI:** Tailwind CSS + shadcn/ui (Radix primitives)
- **Animation:** motion/react (Framer Motion)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Fonts:** Geist Sans + Geist Mono (English, via the `geist` npm package), Noto Sans Malayalam (via `next/font/google`)
- **E2E test:** Playwright (happy-path only)

---

## 2. Data Model

17 Postgres tables, modelling the actual healthcare domain at the minimum granularity needed to back all hero flows and supporting features.

### Entity map

```
                facilities (SC / PHC / CHC / DH)
                       ▲
                       │ assigned_to
                field_workers (ASHA / ANM / MO / Supervisor / Admin)
                       │
                       │ asha_id
                       ▼
   families ──1──► mothers ──1──► children
       │              │              │
       │              │              │
       ▼              ▼              ▼
   bpl_score    anc_visits      growth_records
   scheme_tier  pnc_visits      immunizations
                scheme_enroll   milestones

  all of the above generate → alerts, referrals, reminders, sms_log
                                  ▲
                                  │
                           sync_events (offline queue log)
```

### Tables

| Table | Purpose | Key columns |
|---|---|---|
| `families` | BPL household record | `bpl_score`, `scheme_priority_tier`, `village`, `block`, `district`, `asha_id` |
| `mothers` | One per pregnancy | `beneficiary_id_12`, `lmp`, `edd`, `pregnancy_no`, `family_id` |
| `children` | 0–24 month child | `beneficiary_id_12`, `dob`, `birth_weight_g`, `sex`, `mother_id` |
| `field_workers` | All app users | `role` enum (ASHA/ANM/MO/SUPERVISOR/ADMIN), `facility_id`, `name`, `photo_url` |
| `facilities` | Care delivery points | `type` enum (SC/PHC/CHC/DH), `lat`, `lng`, `block`, `district` |
| `anc_visits` | Per visit + computed risk | `bp_systolic`, `bp_diastolic`, `hb_value`, `weight_kg`, `fetal_hr`, `risk_level` enum, `kb_used` |
| `pnc_visits` | Mother postnatal | `bp`, `hb`, `complications`, `visit_day` |
| `immunizations` | Schedule + record | `vaccine_code`, `scheduled_date`, `given_date`, `status` enum (DUE/GIVEN/MISSED/UPCOMING) |
| `growth_records` | Weight/MUAC + Z-scores | `weight_z`, `muac_cm`, `classification` enum (NORMAL/MAM/SAM) |
| `milestones` | 0–24m developmental | `milestone_code`, `expected_age_months`, `status` |
| `alerts` | SOS + anomalies | `type` enum, `status`, `lat`, `lng`, `channels` JSONB |
| `referrals` | Tier escalation | `from_facility_id`, `to_facility_id`, `tier_from`, `tier_to`, `status`, `reason` |
| `scheme_enrollments` | PMMVY/JSY/KASP/JSSK | `scheme_code`, `installment_no`, `expected_date`, `disbursed_date`, `amount` |
| `iec_content` | Educational content | `category`, `language`, `asset_url`, `title_ml`, `title_en` |
| `reminders` | AN/PN/imm reminders | `type`, `due_date`, `channel`, `sent_at` |
| `sms_log` | Vernacular SMS preview | `language`, `body_text` (Malayalam Unicode), `sent_at` |
| `sync_events` | Offline sync visualization | `payload_kb`, `queued_at`, `synced_at`, `status` |

### Design notes

- **Risk score is denormalised onto `anc_visits.risk_level`.** Computed at write time by a pure TypeScript function. No separate `risk_assessments` table.
- **`alerts.channels` is JSONB.** Captures multi-fan-out for SOS without inventing a child table.
- **`kb_used` lives on every visit row.** Backs the "<50 KB per transaction" claim with real measurements.
- **FKs use `ON DELETE CASCADE`** for easy demo reseeding.
- **Drizzle migrations are checked into the repo.** One `pnpm db:migrate && pnpm db:seed` reset → fresh demo state.

### Out of scope

- ABHA/HMIS/ICDS integration tables — mocked via status tiles
- Multi-tenant routing — single Kerala/Palakkad/Attappadi context
- Persistent audit log — narrated as "production feature"
- Permissions matrix — 4 roles get 4 hardcoded landing pages

---

## 3. Two Surfaces

### `/field` — ASHA mobile (phone-framed on desktop, full-width on real mobile)

Rendered inside a `<PhoneFrame>` component (max-width 414px, rounded bezel, faux status bar) on desktop. Same code is full-width on actual phones.

**Routes:**
- `/field` — Home (today's tasks, beneficiary list, quick actions, IEC tile, SOS)
- `/field/register` — 3-step wizard (Family → Mother → Child) + OTP screen + 12-digit ID generation animation
- `/field/b/[id]` — Beneficiary detail with 3 tabs: Mother / Child / Family
- `/field/b/[id]/anc/new` — ANC visit entry → risk auto-calc on save → flash banner if HIGH/CRITICAL
- `/field/b/[id]/pnc/new` — PNC visit entry
- `/field/b/[id]/growth/new` — Child growth entry → Z-score + SAM/MAM auto-calc
- `/field/b/[id]/immunizations` — Vaccine strip, tap to mark given
- `/field/sos` — SOS modal: confirm patient → GPS capture → fire 3 channels → live status
- `/field/iec` — Content library
- `/field/reminders` — Reminders inbox; "Preview SMS" → Malayalam Unicode modal
- `/field/sync` — Offline-sync demo controls

### `/admin` — District dashboard (desktop full-width)

**Routes:**
- `/admin` — Overview: KPI cards + stylized Palakkad map + Live Alerts panel + Scheme Compliance chart
- `/admin/people` — Beneficiary directory with filters (block, risk, scheme status)
- `/admin/people/[id]` — Full beneficiary record (read-only mirror of field view)
- `/admin/alerts` — Alert queue
- `/admin/alerts/[id]` — Alert detail with GPS pin + channel timeline
- `/admin/referrals` — Tier-flow visualization (Sankey-style SC→PHC→CHC→DH)
- `/admin/schemes` — Per-scheme disbursement table; per-beneficiary status
- `/admin/ashas` — ASHA performance leaderboard
- `/admin/facilities` — Facility list, current load, referrals received
- `/admin/integrations` — Status tiles for ABHA, HMIS, ICDS-CAS, e-Sanjeevani (mocked)

### `/demo` — Narrator controls (presenter-only)

Hidden behind `Ctrl+Shift+D` key chord. Not linked from the UI.

- `/demo/reset` — wipe + reseed DB
- `/demo/seed` — pre-flight seed (also warms Neon)
- `/demo/warmup` — health check + warm DB
- `/demo/health` — returns `{ db, seedVersion, lastSync }`
- `/demo/scenario/sreelakshmi/[checkpoint]` — jump story arc to checkpoint (pre-anc / post-anc / post-sos / post-delivery)
- `/demo/role-switch?role=ASHA|ANM|MO|SUPERVISOR|ADMIN` — flip current user role
- `/demo/offline?on=true|false` — toggle simulated offline mode
- `/demo/play` — scripted auto-walkthrough fallback (last-resort)

### Live-feel mechanics

Two cooperating mechanisms keep `/admin` "live" during the demo:

1. **Server-side revalidation.** Every Server Action that mutates demo-visible state (`raiseSos`, `saveAncVisit`, `saveGrowthRecord`, etc.) ends with `revalidatePath('/admin')` and the relevant child paths. This invalidates the RSC cache.
2. **Client-side polling on `/admin`.** A small `setInterval` (~8s) on the dashboard's client wrapper triggers `router.refresh()`. This catches updates when no Server Action originated from the admin tab itself.

The combination means: an SOS raised in `/field/sos` (different tab) shows up in `/admin`'s Live Alerts panel within ~1 second (revalidation hits the server-side cache; the next router-refresh tick pulls the new data). This cross-tab live update is the most memorable moment of the demo.

No WebSockets, no Server-Sent Events, no Pusher. Plain RSC + polling. Free tier compatible.

---

## 4. Hero Flows — One Story, Eight Moments

### Cast

- **Sreelakshmi M.** — 24, G2P1, tribal, Agali village, BPL household (protagonist)
- **Anu** — Sreelakshmi's newborn (Act 4)
- **Lakshmi K.** — ASHA, Agali Sub-Centre (`/field` user)
- **Dr. Priya Nair** — MO, Agali PHC (referral recipient)
- **Ramesh Pillai** — Block Supervisor, Attappadi (SOS escalation)
- **Dr. Suresh** — CMO, Palakkad District (`/admin` user)

### Five acts, eight hero flows

| Act | Beat | Hero flows | Surface | Time |
|---|---|---|---|---|
| **1. Onboarding** | Lakshmi registers Sreelakshmi's family. ABHA-aligned 12-digit ID generated. OTP confirmed. BPL Poverty Index → Tier 1. | #5 Registration | `/field/register` | 1.5 min |
| **2. Week 28 home visit** | ANC visit: BP 162/108, Hb 6.8. System flashes red → CRITICAL. Auto-referral to PHC. "Visit synced · 38 KB" badge after offline-queue drain. | #3 Risk Scoring + #4 Offline Sync + #8 Referral Routing | `/field/b/sreelakshmi/anc/new` | 3 min |
| **3. Week 30 emergency** | Bleeding at home. SOS fired. Three channels light up: field worker, 102 ambulance, supervisor. **Switch to `/admin` tab** — Live Alerts panel updates within 1 sec. CMO clicks → GPS pin, escalation timeline, CHC Mannarkkad routing. | #2 SOS + #1 Dashboard | `/field/sos` → `/admin` | 4 min |
| **4. Day +90 growth check** | Baby Anu's weight drops. MUAC 11.2 cm. WFH Z-score -3.2 → SAM detected. NRC referral suggested. Immunisations strip beside growth chart. | #6 Child Growth + SAM | `/field/b/anu/growth/new` | 2 min |
| **5. The compliance picture** | `/admin/schemes`: Sreelakshmi's PMMVY/JSY/KASP status. Hover → full beneficiary timeline crossing alerts, referrals, schemes, ASHA performance. *"One mother, one record, every program."* | #7 Schemes + closing #1 Dashboard | `/admin/schemes` → `/admin/people/sreelakshmi` | 1.5 min |

### Narrative mechanics

- **Two browser tabs open side-by-side throughout** — `/field` (phone-frame) and `/admin` (district dashboard). Switch between them mid-Act-3.
- **Each act ends with state visibly persisting.** By Act 5, the dashboard is full of artifacts the audience watched being created.
- **`/demo` escape hatches.** `Ctrl+Shift+D` opens the narrator panel for off-script questions.
- **Supporting features as B-roll.** IEC library tile, integrations strip, PNC tab, immunisations strip — visible throughout, not narrated.
- **`/demo/play` fallback** — full scripted auto-walkthrough in case of catastrophic failure during pitch.

---

## 5. Visual Language

### Palette

| Token | Hex | Use |
|---|---|---|
| `--primary` | `#0F4C75` | Headers, primary buttons, links — deep teal-blue |
| `--primary-50` | `#E8F1F7` | Highlighted rows, hover states |
| `--accent` | `#2D7A3E` | Positive states, ASHA chips, disbursed checks |
| `--surface` | `#FAFAF7` | App background — warm off-white |
| `--card` | `#FFFFFF` | Card backgrounds |
| `--fg` | `#1A1F2C` | Body text — slate, not pure black |
| `--fg-muted` | `#5A6373` | Secondary text |
| `--border` | `#E2E5EA` | Hairlines |
| `--risk-normal` | `#16A34A` | Normal status |
| `--risk-high` | `#D97706` | High risk (amber, not yellow) |
| `--risk-critical` | `#DC2626` | Critical (red, exclusive use) |

Dark mode: **not built**. Light mode reads better on projectors.

### Typography

- **English UI:** Geist Sans (via the `geist` npm package — Geist is not on Google Fonts; do not use `next/font/google` for it)
- **Tabular figures (KPIs):** Geist Mono (same `geist` package)
- **Malayalam:** Noto Sans Malayalam (via `next/font/google`)
- **Base size:** 16px on `/admin`, **17px on `/field`** (sunlight readability)
- **Line height:** 1.55 body, 1.3 headings
- **Never:** thin/extra-light weights (reads "marketing")

### Components

shadcn/ui foundation. Install: `card`, `button`, `badge`, `sheet`, `dialog`, `tabs`, `tooltip`, `table`, `progress`, `avatar`, `toast`, `command`, `select`, `input`, `label`, `form`, `separator`.

Custom components:

- `<PhoneFrame>` — rounded bezel + faux status bar (only on `/field/*`)
- `<RiskBadge level="critical">` — color + icon + text
- `<KbBadge bytes={38000}>` — "38 KB · synced"
- `<SosChannelList>` — animated multi-channel timeline
- `<SchemeProgress code="PMMVY" installments={3} disbursed={2}>`
- `<SmsPreviewModal>` — Malayalam Unicode SMS preview
- `<PalakkadMap>` — stylized SVG (no Mapbox/API key)
- `<OfflineToggle>` — airplane-mode simulator + sync animation
- `<MalayalamLabel>` — bilingual `English / മലയാളം` field labels

### Iconography

Lucide React. Curated set of ~30 icons total. SOS uses `Siren` exclusively, never reused.

### Malayalam touches (surgical, not blanket)

| Surface | Treatment |
|---|---|
| `/field` form labels (key fields) | Bilingual: `Hemoglobin / ഹീമോഗ്ലോബിൻ` |
| `/field` home greeting | `നമസ്കാരം, Lakshmi K.` above English |
| `/field` IEC content cards | Malayalam title + English subtitle |
| SMS preview modal | **Fully Malayalam Unicode** |
| `/field` other text | English |
| `/admin` | **English only** |

Narrator script: *"in production every label and content asset is fully localised — for the demo we've prioritised the moments that matter."*

### Animation

`motion/react`. Rule: animation must communicate state change, never decorate.

- ABHA ID generation → digits roll into place, ~600ms (the one "celebratory" moment)
- Risk banner flash → slide-down + brief pulse (no loop), ~300ms
- SOS channels → stagger-light-up, 250ms per channel
- Offline sync → progress bar + queue items fading
- Dashboard counter → tick-up when new alert arrives

All animations respect `prefers-reduced-motion`. Durations 200–400ms, never longer.

### Chrome

- **Header lockup:** "Government of Kerala · Health & Family Welfare Dept" — greyscale, small, restrained
- **Footer:** "Built for the National Health Mission · ABHA-aligned · HMIS-ready" + monochrome integration logo strip
- **No marketing copy.** No "Sign up". No SaaS-speak.
- **Demo data banner:** footer note "Demonstration data — no real patient information."

### Explicitly not doing

- Gradients on cards, glassmorphism, neumorphism
- Dark mode
- Confetti / celebration animations (except the one ABHA ID reveal)
- Stock 3D illustrations
- Skeleton loaders >100ms

---

## 6. Offline-Sync Demo Strategy

The differentiator claim must feel real. Honest simulation, not full PWA build-out.

### What we build

A `useOfflineQueue` client-side hook wraps every Server Action invocation on `/field/*`.

- When `navigator.onLine && !demoOfflineMode` → call Server Action directly
- Else → push to localStorage queue: `{ action, args, queuedAt, payloadBytes }`
- Bottom-sheet "Pending sync (N)" panel shows queued items with KB sizes
- Toggling online → drain loop fires queued actions serially, animating each as it succeeds

### What's honest

- **Server-side code path is real.** Server Actions, Drizzle, Neon writes — production-grade.
- **The transport is faked.** localStorage instead of Service Worker + IndexedDB. Same architecture from the application's POV.
- **KB-per-visit numbers are real.** `new Blob([JSON.stringify(payload)]).size / 1024`. The "<50 KB" claim is demonstrably true.
- **Queue survives refresh.** localStorage persists; behavior matches real offline app.

### Narrator script

> "What you're seeing is the same queue-and-drain architecture we'd ship in production. The only difference is the storage layer — production wraps this same logic in a Service Worker backed by IndexedDB, giving us full PWA install + background sync. For the demo we're using localStorage, which behaves identically from the application's point of view. The payload sizes you see are real."

### Demo beats

| Beat | What viewer sees | Time |
|---|---|---|
| Lakshmi taps OfflineToggle | Banner: "Offline · queued sync" | 5s |
| ANC visit saved | Toast: "Saved offline · 38 KB queued" | 10s |
| Bottom sheet shows queue | 1 item pending | 5s |
| Toggle flips back online | "Syncing 1 of 1…" → "All synced · 38 KB total" | 8s |
| `/admin` second tab | Revalidation lands the row | 5s |

### Vernacular SMS fallback (bundled here)

Every reminder row has a "Preview SMS" link → modal with full Malayalam Unicode message text, sender ID `KLNHM-MCH`, metadata. Narrator: *"in production this hits a registered SMS gateway — Karix or Gupshup with DLT-registered templates."*

### Explicitly NOT built

- Real Service Worker + manifest.json
- Real IndexedDB
- Real conflict resolution / vector clocks
- Real 2G throttling (can show DevTools throttling if asked)
- Background Sync API

---

## 7. Non-Functional Concerns

### Performance

- **Neon free tier suspends after 5 min idle.** Mitigation: `/demo/warmup` endpoint hit at start of pitch; `/admin` dashboard's ~8s `router.refresh()` polling keeps DB warm.
- **Cold starts:** Server Actions on Vercel Fluid Compute typically <100ms after warm-up.
- **Bundle discipline:** RSC by default. `"use client"` only for: OfflineToggle, SOS modal, offline queue hook, dashboard polling wrapper.
- **No heavy libs:** stylized SVG for Palakkad map (no Mapbox), Recharts for charts (tree-shakable).

### Error handling

| Failure | Recovery |
|---|---|
| Neon connection drops | Toast "Sync failed · retry"; refresh reconnects |
| Vercel deploy mid-demo | Cached version serves; don't push from `main` during pitch |
| Hero flow bug | Toast + console log; switch to `/demo/play` |
| Browser tab crash | `/demo/seed` reset + scenario checkpoint jump |
| Wifi dies | `/demo/static` screenshots; last resort: pre-recorded video on phone |

### Testing

- **One Playwright happy-path test** through all 8 flows. Run before every deploy.
- **Manual smoke checklist** (Markdown in repo): 12 steps, 4 minutes, run T-30 min before pitch.
- **`/demo/health`** endpoint for quick sanity checks.

No unit tests. No TDD. No coverage targets. This is a brochure, not a clinical system.

### Deployment

- **GitHub repo** (private). One branch: `main`. Vercel auto-deploys to production. PR branches → preview URLs.
- **Production URL:** `<something>.vercel.app` (free). Optional custom domain ~$10/year.
- **Env vars (1):** `DATABASE_URL` (Neon connection string). Set in Vercel dashboard.

### Demo-day insurance checklist

| T-minus | Step |
|---|---|
| T-24h | Run Playwright happy-path |
| T-30 min | Run manual smoke checklist |
| T-15 min | Hit `/demo/warmup` |
| T-10 min | `/demo/reset` then `/demo/seed` |
| T-5 min | Confirm `/field` and `/admin` tabs both open |
| T-5 min | Confirm `Ctrl+Shift+D` narrator panel works |
| T-2 min | Confirm `/demo/play` fallback works |
| T-0 | 90-sec video on phone as ultimate failsafe |

### A11y & security (light touch)

- **A11y:** keyboard nav works, WCAG AA contrast (palette designed for it), `prefers-reduced-motion` respected
- **Security:** zero real PII; all names synthetic; `/demo` routes hidden by key chord, not auth; public URL safe to share
- **Footer banner:** "Demonstration data — no real patient information."

### Explicitly NOT built

- Real auth system
- Real SMS gateway integration
- Real ABHA/HMIS/ICDS integration calls
- Multi-tenant routing
- Audit log persistence
- Backups (Neon handles its own; demo data is reseedable)

---

## 8. Feature Coverage Matrix (EOI checklist)

Every Phase 1–5 feature in the EOI is accounted for. 🎯 = hero flow (scripted, narrated). ✅ = supporting feature (functional, visible, woven in).

| EOI Feature | Coverage | Where |
|---|---|---|
| **Phase 1 — Onboarding** | | |
| BPL family registration + 12-digit ABHA-aligned ID | 🎯 | `/field/register` |
| OTP authentication UX (screen + entry + verification animation) | 🎯 | Inside registration — *the UX is hero; the SMS delivery itself is mocked (any 6-digit code accepted, or hardcoded `123456`)* |
| OTP offline fallback | ✅ | Offline sync toggle |
| Mother + Child + Family profile linking | 🎯 | After registration |
| ASHA/ANM mapping | ✅ | Beneficiary card |
| **Phase 2 — Dashboards** | | |
| Mother profile (LMP/EDD/risk) | 🎯 | Risk-scoring flow |
| Child profile (birth, WHO Z-score) | 🎯 | Growth flow |
| Family profile + BPL Poverty Index | ✅ | Tile on family tab |
| **Phase 3 — Core Tracking** | | |
| ANC visit tracking | 🎯 | Risk flow |
| PNC visit tracking | ✅ | Mother timeline |
| Immunisation scheduling | ✅ | Child profile strip |
| Risk classification | 🎯 | Color-coded throughout |
| Cash incentive eligibility | 🎯 | Schemes flow |
| Child development milestones | ✅ | Beside growth chart |
| Severe anaemia (Hb<7) | 🎯 | Risk flow |
| Weight loss >7% | ✅ | Growth flow |
| SAM/MAM | 🎯 | Growth flow climax |
| Hypertension | ✅ | ANC entry |
| **Phase 4 — Escalation** | | |
| SOS emergency button | 🎯 | SOS flow |
| 102 dispatch + supervisor alert | 🎯 | Multi-channel fan-out |
| GPS location | 🎯 | Map pin |
| Referral routing SC→PHC→CHC→DH | 🎯 | Referral flow |
| Real-time facility notification | ✅ | Admin queue |
| **Phase 5 — Reminders/Education/Offline** | | |
| Automated AN/PN/imm reminders | ✅ | Today's tasks panel |
| Vernacular Malayalam SMS | ✅ | Preview modal |
| IEC content library | ✅ | Field tile |
| Offline-first / 2G | 🎯 | Offline sync flow |
| Data sync on connectivity restore | 🎯 | Inside offline |
| <50 KB per visit | ✅ | KbBadge per save |
| **Phase 6 — Implementation** | | |
| Mobile-first ASHA app | 🎯 | `/field` surface |
| Cloud admin dashboard | 🎯 | `/admin` surface |
| ABHA/HMIS/ICDS integration-ready | ✅ | Integrations strip |
| 4 roles (Field/MO/Supervisor/Admin) | ✅ | Demo role switcher |

---

## 9. Acceptance Criteria

The demo is "done" when:

1. All 8 hero flows can be walked through end-to-end without bugs
2. All 16 supporting features are visible and clickable in their parent screens
3. The single Sreelakshmi narrative arc threads naturally across Acts 1–5
4. Cross-tab revalidation works: SOS in `/field` appears in `/admin` within ~1s
5. The KB-per-visit badge shows real measured byte counts
6. The offline queue persists across browser refresh
7. Malayalam SMS preview renders Unicode correctly
8. `/demo/reset` + `/demo/seed` produces a clean repeatable starting state
9. `Ctrl+Shift+D` narrator panel opens; all `/demo/*` controls work
10. Playwright happy-path test passes
11. Manual smoke checklist passes in <5 min
12. `/demo/play` scripted fallback completes without intervention
13. Production deploy on Vercel runs at $0 cost

---

## 10. Out of Scope (and why)

| Excluded | Why |
|---|---|
| Real OTP / authentication | Not needed for demo; disclosed in narration |
| Real ABHA / HMIS / ICDS calls | API access requires onboarding; mocked as status tiles |
| Real SMS gateway | DLT registration takes weeks; preview modal demonstrates intent |
| Real PWA / Service Worker | Adds 2 days, fragile under demo conditions; localStorage simulates same architecture |
| Multi-state, multi-district | Single Kerala/Palakkad/Attappadi context only |
| Real audit log persistence | Production concern; not visible in demo |
| Real role-based permissions | 4 hardcoded role landing pages suffice |
| Dark mode | Light mode reads better on projectors |
| Unit tests, TDD, coverage targets | Demo, not clinical system |
| Backups | Neon handles its own; data reseedable |

---

## 11. Glossary

| Term | Meaning |
|---|---|
| ABHA | Ayushman Bharat Health Account — India's 14-digit health ID; demo uses ABHA-aligned 12-digit format |
| ANC | Antenatal Care visit |
| PNC | Postnatal Care visit |
| ASHA | Accredited Social Health Activist — village-level community health worker |
| ANM | Auxiliary Nurse Midwife — sub-centre-based clinical worker |
| MO | Medical Officer (typically at PHC) |
| SC / PHC / CHC / DH | Sub-Centre / Primary Health Centre / Community Health Centre / District Hospital |
| BPL | Below Poverty Line |
| NHM | National Health Mission |
| MoHFW | Ministry of Health & Family Welfare |
| PMMVY | Pradhan Mantri Matru Vandana Yojana — maternity benefit scheme |
| JSY | Janani Suraksha Yojana — safe-motherhood incentive |
| JSSK | Janani Shishu Suraksha Karyakram — free maternal & newborn care |
| KASP | Karunya Arogya Suraksha Padhathi — Kerala state health insurance |
| HMIS | Health Management Information System |
| ICDS / ICDS-CAS | Integrated Child Development Services / Common Application Software |
| SAM / MAM | Severe / Moderate Acute Malnutrition |
| MUAC | Mid-Upper Arm Circumference (malnutrition screening) |
| LMP / EDD | Last Menstrual Period / Expected Date of Delivery |
| NRC | Nutritional Rehabilitation Centre |
| WHO Z-score | World Health Organization weight-for-age standard deviation |
| 102 | Government emergency ambulance service (free for maternal/child cases) |
| IEC | Information, Education, Communication content |

---

## 12. Next steps

1. User reviews this spec
2. On approval, the `superpowers:writing-plans` skill produces a phased implementation plan
3. Implementation executes against the plan in subagents or sequentially
4. Demo dry-run + smoke checklist before pitch

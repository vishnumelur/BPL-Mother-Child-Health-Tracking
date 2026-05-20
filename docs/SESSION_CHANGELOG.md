# Session changelog — 2026-05-21

A single working session covering: a comprehensive EOI-aligned landing page, the
portal-switcher architecture, the bottom-nav viewport fix, the sticky admin
sidebar fix, premium iconography, a redesigned Palakkad map, and a long pass
of mobile responsiveness and UX polish.

The implementation maps 1:1 to every claim in the BPL Mother & Child Health
Tracking and Decision Support EOI — Section 3's five phases, Section 4's
innovations, Section 5's outcomes, Section 6's integrations and roles all
have shipping code on the demo behind them.

---

## 1. Comprehensive landing page (`/`)

**Files:** `src/app/page.tsx` (full rewrite), `src/components/animated-word.tsx` (new)

Sections, top to bottom, every one mapped to an EOI section:

| Section | What it shows | EOI map |
|---|---|---|
| Sticky nav | MCH brand (→ landing), anchor links to each section, ASHA + Admin CTAs | Navigation chrome |
| **Hero** | Animated headline "Every {word}." cycling through mother / village / visit / alert / child. Subhead with operational outcome promise ("caught early, routed fast, counted every time"). Geographic anchor (Attappadi → Palakkad). 4-tile trust strip pulling live KPIs. Dual CTA. Ctrl+Shift+D narrator hint. | Overall thesis |
| **Hero preview card** | Sreelakshmi M.'s actual case — portrait, vitals, auto-triage callout, 3-channel SOS dispatch, footer ribbon | Hero proof |
| Problem band | 3 cards naming the failure points (connectivity / late detection / fragmented response) | Implicit problem |
| **5-phase timeline** | Each phase = title, subtitle, feature list, and a real UI preview built from the same shared components used elsewhere in the app | EOI § 3 Phase 1–5 |
| **Live Palakkad map** | Embedded `<PalakkadMap>` with actual `getBlockRiskCounts()` data — same component as the admin dashboard | EOI § 3 Phase 2 |
| Innovations grid | 7 cards covering Poverty Index, Offline-first, Low-bandwidth, Vernacular, SAM/MAM, Decision support, Scheme linkage | EOI § 4 |
| Outcomes grid | 6 measurable KPIs with gradient-text numbers | EOI § 5 |
| Integrations | ABHA, HMIS, ICDS-CAS, e-Sanjeevani — 4 system cards | EOI § 6 |
| Roles | 4 role cards (ASHA / MO / Block Supervisor / District Admin) | EOI § 6 |
| Final CTA | Gradient hero with dual portal buttons | Demo call to action |
| Footer | NHM + ABHA + HMIS credentials | Compliance |

### Animated headline
`src/components/animated-word.tsx`
- Uses `motion/react` `AnimatePresence` with `mode="wait"` (clean exit before next enter)
- Container reserves the *longest word's* width so the line never reflows mid-animation
- `em`-based slide offsets so the motion distance scales with font size at every breakpoint
- Period rides with the word (so it doesn't float at a fixed offset)
- 2.4s per word, 5 words = 12s loop
- Gradient applied only to the rotating word — "Every" stays static

### Mobile responsive pass
After visual audit at 390×844:
- All section `<h2>` → `text-[26px] sm:text-4xl` (was `text-3xl sm:text-4xl`)
- Hero `<h1>` → `text-[44px] sm:text-6xl lg:text-[5.25rem]` (was `text-5xl …`)
- Hero subhead → `text-[15px] sm:text-lg`
- Section padding: all `py-20 sm:py-24` → `py-14 sm:py-24`; ProblemBand `py-16 → py-12`; FinalCta `py-20 → py-14`
- Section header bottom margin: `mb-10/mb-12` → `mb-8 sm:mb-10/12`
- Hero trust-strip stats values: `text-2xl` → `text-xl sm:text-2xl`
- Hero preview AUTO-TRIAGE description: `text-[11.5px]` → `text-xs`
- Phase `<h3>` → `text-[22px] sm:text-3xl`

---

## 2. Portal switcher

**Files:** `src/components/portal-switcher.tsx` (new), integrated into
`AdminSidebar`, `AdminTopBar`, `PhoneFrame`.

A login-style segmented control letting the presenter jump between **ASHA** and
**Admin** views in a single click — no URL editing, no back button.

| Surface | Placement |
|---|---|
| Admin desktop | Inside the sidebar's account card at the bottom (avatar + name + role + "SWITCH VIEW" + full-width pill) |
| Admin mobile (drawer closed) | Compact pill inline in the top bar |
| Admin mobile (drawer open) | Same account card visible at the bottom of the drawer |
| Field (every size) | Inside `PhoneFrame`'s integrated top app bar |
| Landing | Replaced by the explicit "ASHA app" + "Admin dashboard" CTAs in the sticky nav |

The component supports `variant="floating" | "inline"`, `showEyebrow`, and
`fullWidth` so the same component renders cleanly in three different chrome
contexts.

---

## 3. PhoneFrame architecture — bottom nav stays put

**Files:** `src/components/phone-frame.tsx`, `src/components/field-bottom-nav.tsx`,
`src/app/field/layout.tsx`.

**Two bugs fixed:**

### a) Bottom nav floating mid-page on real mobile
`FieldBottomNav` used `absolute bottom-0` of a `min-h-full` container. On real
mobile browsers, `min-h-full`/`100vh` resolves to the *larger* viewport (URL bar
hidden), so absolute-bottom-zero anchored to a container that didn't match the
visible viewport. Empty white band appeared between the nav and the device
chrome.

**Fix:** PhoneFrame now uses `h-[100dvh]` (dynamic viewport height that tracks
URL bar visibility), and renders children as flex items directly. FieldBottomNav
became a normal flex sibling with `shrink-0` and `safe-area-inset-bottom` —
docks to the visible viewport via flex layout, not absolute positioning.

### b) Whole phone scrolled on desktop, hiding the bottom nav
Outer wrapper was `md:py-10 md:min-h-screen` → total height `40+840+40 = 920px`,
larger than a 1366×768 laptop. The whole page scrolled. Bottom nav was 840px
down, requiring page scroll to reach.

**Fix:** outer wrapper now `md:h-[100dvh] md:items-center`. Phone capped to
`md:h-[min(840px,calc(100dvh-2rem))]`. Phone is always vertically centered and
always fits; only the inner content area scrolls.

### c) Integrated top app bar inside the phone
PhoneFrame now hosts a slim top app bar (status bar + MCH logo link to `/` +
inline PortalSwitcher). Replaces the orphan-floating switcher that previously
sat *above* the phone on desktop.

---

## 4. Sticky admin sidebar

**Files:** `src/components/admin-shell.tsx`.

**Bug:** sidebar moved upward when the page scrolled.

**Root cause (classic flex-1 + overflow-hidden trap):** AdminShell used
`min-h-screen` on the outer. `min-h-screen` allows growth, so `flex-1
overflow-hidden` on the middle never got a fixed height to constrain against,
which meant `<main>`'s `overflow-y-auto` never kicked in — main expanded to its
content (3029px on the schemes page), outer grew to 3134px, body scrolled,
sidebar moved with it.

**Fix:** `min-h-screen` → `h-[100dvh] overflow-hidden`. Middle got `min-h-0`
(required for nested flex children to shrink below their content size). Now:
- Outer locked to viewport height
- Middle fills remaining `~795px`
- Sidebar stretches to fill the middle and stays put
- Only `<main>` scrolls internally

Verified with `document.documentElement.scrollHeight === window.innerHeight`.

---

## 5. Palakkad map redesign

**Files:** `src/components/palakkad-map.tsx`, `src/app/globals.css`
(`@keyframes map-pulse`).

Replaced the skeletal "5 dots in an octagon" with a substantive geographic
visualization:

- Recognizable district-shaped SVG outline (elongated east-west, NE Attappadi bulge)
- Subtle Western Ghats topographic wave pattern overlay
- "Western Ghats" label pill + dashed range line on the eastern edge
- Bhavani river curve through Attappadi
- Compass + "ATTAPPADI" sub-region label
- Footer ribbon: `{total} mothers across {n} blocks · {c} critical · {h} high`

### Block representation — responsive
- **Desktop (sm+):** rich tile overlays on the map (name + mother count + per-severity pills + per-severity ring color)
- **Mobile (<sm):** **dots only on the map** (no overlapping tile labels) + a clean 2-column grid of block cards below the map carrying the same data

This was the only way to handle clustering — 4 blocks within 14-20% horizontal
distance of each other in viewBox space, which is ~14-68 pixels on a 340px
mobile map. No font/padding tuning could prevent collisions; the data had to
move out of the map.

### Critical-block pulse — proportional at every size
Replaced Tailwind's `animate-ping` (which scales 2× and dominated small mobile
maps) with a custom `map-pulse` keyframe (1.12× peak scale, calm). Ring inset
tightened from `-inset-1.5` to `-inset-0.5`; ring thickness `ring-1 sm:ring-2`.

---

## 6. Person avatars — local Indian portraits

**Files:** `src/components/person-avatar.tsx` (new), `src/lib/avatar.ts` (new),
`public/avatars/woman-1..10.jpg`, `public/avatars/man-1.jpg`.

Replaced initials-on-gradient circles with real photographs. Iterated three times:

1. **First pass:** randomuser.me CDN. Rejected — mostly Western faces, culturally mismatched for Kerala BPL beneficiaries.
2. **Second pass:** reverted to gradient initials. User wanted photos but better.
3. **Final pass:** curated **10 Indian women + 1 Indian male doctor** portraits from Pexels, hand-verified by visual inspection, downloaded locally to `/public/avatars/`. Hash-mapped deterministically so each beneficiary always shows the same face. Fallback when image fails to load: neutral Lucide `User` icon on the gradient tile — **never initials** (user requirement).

Process: scraped Pexels search results via WebSearch to find verified photo
IDs, curled each, visually reviewed every downloaded image, dropped 5 that
turned out to be non-Indian or awkwardly framed.

**Drop-in sites:** `BeneficiaryCard`, `admin/people` directory, mother & child
detail headers, `admin/ashas` leaderboard, `admin-sidebar` account card,
`admin-top-bar` avatar, field home Lakshmi K. greeting.

---

## 7. Brand mark → landing navigation

**Files:** `src/components/admin-top-bar.tsx`, `src/components/phone-frame.tsx`,
`src/components/admin-shell.tsx`.

Wrapped the MCH brand block in `<Link href="/">` in three places:
- Admin top bar (the "Kerala MCH Tracker / Palakkad District" block)
- PhoneFrame top app bar (small MCH tile, 3-column grid: logo-left / switcher-center / spacer-right keeps the switcher truly centered)
- Admin mobile drawer header (text link, also dismisses the drawer)

---

## 8. Registration success state — refined

**Files:** `src/components/register-wizard.tsx`, `src/app/globals.css`
(`@keyframes glow-pulse`, `shimmer-text`).

Applied the Stitch "Registration Success (Refined)" design:
- 4 filled gradient dots progress row
- Pulsing halo (`glow-pulse`) around the check icon
- "ABHA-ALIGNED ID" eyebrow + shimmer-animated 12-digit ID
- "Mother profile created for {name}" subtitle from form state
- Pill-shaped primary CTA with arrow + secondary text link "+ Register another"
- Bento-lite "Next step: schedule first ANC" recommendation card below

---

## 9. Bug fix — empty LMP crashed `registerBeneficiary`

**File:** `src/actions/register.ts`.

Empty-string `lmp` was being inserted into a PostgreSQL `date` column, causing
500 errors when users skipped LMP. Fixed `data.lmp ?? null` → `data.lmp || null`
(empty string falsy-coalesces to null).

---

## 10. Hero preview card — premium tuning

**File:** `src/app/page.tsx::HeroPreview`.

Initial implementation had three red-flooded moments (red-fill BP tile +
red-fill HB tile + pink-flood triage box) which read as crisis-alarm, not
premium dashboard.

Rebuilt as a Linear/Stripe-style monitoring card:
- Header eyebrow ("LIVE PREVIEW · ASHA · ATTAPPADI")
- Profile row with avatar + name + ABHA ID + Critical pill
- Vitals as a 3-column divided strip on an off-white wash; ONLY the digit is red for critical metrics (BP, HB)
- Triage callout: white card with a thin red vertical accent strip + small red icon-tile + neutral typography
- Dispatch list: 3 clean rows with primary-tinted icon squares + `0s` timestamps + green checks
- Footer ribbon with pulsing-dot "synced" indicator

Net effect: red appears *once* as accent. The CRITICAL signal is sharper
precisely because it's the only red moment.

---

## 11. New components & lib

- `src/components/portal-switcher.tsx` — segmented portal control
- `src/components/animated-word.tsx` — single-line word rotator
- `src/components/person-avatar.tsx` — photo avatar with neutral fallback
- `src/lib/avatar.ts` — deterministic local-avatar URL mapper

---

## 12. Bonus reliability fixes

- **PhoneFrame contract:** children render as direct flex items (no wrapping `flex-1 overflow-y-auto` div). Field layout is now `<PhoneFrame><scrollArea/><BottomNav/></PhoneFrame>` — true mobile-app shell.
- **`safe-area-inset-bottom`** applied via inline `style` on FieldBottomNav for notched device support.
- **Turbopack disk-cache:** `.next` ballooned to **3.6 GB** twice during the session and broke the bash tool when the partition hit 100%. Cleared each time. Recommended: `pkill -f 'next dev'; rm -rf .next/cache; pnpm dev` before each demo.

---

## Files changed (full list)

```
Modified:
  src/actions/register.ts                   empty-LMP fix
  src/app/admin/ashas/page.tsx              PersonAvatar
  src/app/admin/people/[id]/page.tsx        PersonAvatar (mother + child)
  src/app/admin/people/page.tsx             PersonAvatar
  src/app/field/layout.tsx                  flex-sibling pattern
  src/app/field/page.tsx                    Lakshmi K. avatar
  src/app/globals.css                       map-pulse, glow-pulse, shimmer-text
  src/app/page.tsx                          full landing rewrite + mobile tuning
  src/components/admin-shell.tsx            h-[100dvh] overflow-hidden + brand Link
  src/components/admin-sidebar.tsx          account card with PortalSwitcher
  src/components/admin-top-bar.tsx          PortalSwitcher inline (mobile only), brand → Link
  src/components/beneficiary-card.tsx       PersonAvatar
  src/components/field-bottom-nav.tsx       shrink-0 flex sibling + safe-area
  src/components/palakkad-map.tsx           full redesign + responsive split
  src/components/phone-frame.tsx            h-[100dvh] + integrated top app bar
  src/components/register-wizard.tsx        refined success state

Added:
  src/components/animated-word.tsx
  src/components/person-avatar.tsx
  src/components/portal-switcher.tsx
  src/lib/avatar.ts
  public/avatars/woman-1.jpg .. woman-10.jpg
  public/avatars/man-1.jpg
  docs/SESSION_CHANGELOG.md (this file)
```

---

## Verification matrix (final state)

| Surface | Viewport | Status |
|---|---|---|
| `/` landing | 1440×900 | ✅ all sections render, nav unblocked, hero animation works |
| `/` landing | 390×844 | ✅ proportional typography, tight section padding, no overflow |
| `/admin` overview | 1440×900 | ✅ sidebar pinned, map + alerts panel + scheme chart |
| `/admin` overview | 390×844 | ✅ drawer + map dots + 2-col block grid |
| `/admin/schemes` | any | ✅ sidebar stays fixed when main scrolls (was the sticky bug) |
| `/admin/people` | any | ✅ portraits for all 64 beneficiaries |
| `/admin/people/m-1` | any | ✅ Sreelakshmi detail with portrait + risk timeline |
| `/field` home | desktop | ✅ phone-frame centered in viewport, bottom nav permanently visible |
| `/field` home | mobile | ✅ h-dvh locked, bottom nav docked, no white gap |
| `/field/register` | any | ✅ refined success state with shimmer ID + bento next-step card |
| Portal switching | any → any | ✅ 1-click swap from sidebar / top bar / phone-frame |
| Logo → landing | from any portal | ✅ MCH brand returns to `/` |

`pnpm tsc --noEmit` clean at every checkpoint.

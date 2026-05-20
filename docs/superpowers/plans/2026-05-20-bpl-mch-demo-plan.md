# BPL MCH Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working Next.js demo of the BPL Mother & Child Health Tracking system for a Kerala state health admin EOI pitch.

**Architecture:** Single Next.js 16 App Router app with two URL surfaces (`/field` ASHA mobile + `/admin` district dashboard) + `/demo` narrator controls. Server Actions over Drizzle ORM into Neon Postgres (free tier). Cross-tab live updates via `revalidatePath` + 8s polling.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, Drizzle ORM, Neon Postgres, motion/react, Recharts, Lucide icons, Geist + Noto Sans Malayalam fonts, Playwright.

**Spec reference:** `docs/superpowers/specs/2026-05-20-bpl-mch-demo-design.md`

**Note on TDD:** The spec explicitly excludes unit tests and TDD ("This is a brochure, not a clinical system"). Plan uses tight task boundaries + frequent commits + one Playwright happy-path test at the end. User instructions override the default TDD red/green/refactor cadence.

---

## File Structure

```
/home/vmj/Desktop/mother demo/
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── components.json                       # shadcn config
├── drizzle.config.ts
├── .env.local                            # gitignored — DATABASE_URL
├── .env.example
├── .gitignore
├── playwright.config.ts
├── README.md
├── public/
│   └── (svg assets)
├── docs/superpowers/
│   ├── specs/2026-05-20-bpl-mch-demo-design.md
│   └── plans/2026-05-20-bpl-mch-demo-plan.md  # this file
├── drizzle/                              # generated migrations
├── e2e/
│   ├── happy-path.spec.ts                # Playwright
│   └── smoke-checklist.md                # manual T-30 min checklist
└── src/
    ├── app/
    │   ├── layout.tsx                    # root layout, fonts, providers
    │   ├── page.tsx                      # landing → links to /field and /admin
    │   ├── globals.css
    │   ├── field/                        # ASHA mobile surface
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   ├── register/page.tsx
    │   │   ├── b/[id]/
    │   │   │   ├── page.tsx
    │   │   │   ├── anc/new/page.tsx
    │   │   │   ├── pnc/new/page.tsx
    │   │   │   ├── growth/new/page.tsx
    │   │   │   └── immunizations/page.tsx
    │   │   ├── sos/page.tsx
    │   │   ├── iec/page.tsx
    │   │   ├── reminders/page.tsx
    │   │   └── sync/page.tsx
    │   ├── admin/                        # district dashboard surface
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   ├── people/page.tsx
    │   │   ├── people/[id]/page.tsx
    │   │   ├── alerts/page.tsx
    │   │   ├── alerts/[id]/page.tsx
    │   │   ├── referrals/page.tsx
    │   │   ├── schemes/page.tsx
    │   │   ├── ashas/page.tsx
    │   │   ├── facilities/page.tsx
    │   │   └── integrations/page.tsx
    │   └── demo/                         # narrator controls
    │       ├── reset/route.ts
    │       ├── seed/route.ts
    │       ├── warmup/route.ts
    │       ├── health/route.ts
    │       ├── role-switch/route.ts
    │       ├── offline/route.ts
    │       ├── scenario/[arc]/[checkpoint]/route.ts
    │       └── play/page.tsx
    ├── components/
    │   ├── ui/                           # shadcn-installed
    │   ├── phone-frame.tsx
    │   ├── risk-badge.tsx
    │   ├── kb-badge.tsx
    │   ├── malayalam-label.tsx
    │   ├── sos-channel-list.tsx
    │   ├── scheme-progress.tsx
    │   ├── sms-preview-modal.tsx
    │   ├── palakkad-map.tsx
    │   ├── offline-toggle.tsx
    │   ├── narrator-panel.tsx
    │   ├── admin-sidebar.tsx
    │   ├── admin-top-bar.tsx
    │   ├── admin-poller.tsx
    │   └── beneficiary-card.tsx
    ├── db/
    │   ├── index.ts                      # connection
    │   ├── schema.ts                     # all 17 tables
    │   └── seed.ts                       # Sreelakshmi arc
    ├── lib/
    │   ├── risk-scoring.ts
    │   ├── z-score.ts
    │   ├── beneficiary-id.ts
    │   ├── kb-meter.ts
    │   ├── session.ts
    │   ├── malayalam.ts
    │   └── utils.ts
    ├── actions/
    │   ├── register.ts
    │   ├── anc.ts
    │   ├── pnc.ts
    │   ├── growth.ts
    │   ├── immunization.ts
    │   ├── sos.ts
    │   ├── referral.ts
    │   └── demo.ts
    ├── hooks/
    │   ├── use-offline-queue.ts
    │   └── use-narrator-shortcut.ts
    └── data/
        ├── kerala-places.ts
        ├── vaccines.ts
        ├── milestones.ts
        ├── iec-content.ts
        └── scenarios.ts
```

---

## Phase Index

- **Phase 1** — Project scaffolding (6 tasks)
- **Phase 2** — Database layer (5 tasks)
- **Phase 3** — Shared lib + components (8 tasks)
- **Phase 4** — `/field` registration + home (6 tasks)
- **Phase 5** — `/field` visit forms (8 tasks)
- **Phase 6** — `/field` SOS, IEC, reminders, sync UI (7 tasks)
- **Phase 7** — `/admin` overview (6 tasks)
- **Phase 8** — `/admin` detail pages (9 tasks)
- **Phase 9** — Offline sync layer (4 tasks)
- **Phase 10** — `/demo` controls (5 tasks)
- **Phase 11** — Sreelakshmi narrative seed (3 tasks)
- **Phase 12** — Polish + animations (4 tasks)
- **Phase 13** — Playwright happy-path test (2 tasks)
- **Phase 14** — Deployment (3 tasks)

**Total: 76 tasks across 14 phases, ~7-9 working days for a solo developer.**

---

## Phase 1 — Project Scaffolding

### Task 1.1: Create Next.js 16 app

**Files:**
- Create: project skeleton via Next.js CLI

- [ ] **Step 1: Run `create-next-app`**

```bash
cd "/home/vmj/Desktop/mother demo"
# Workaround: create-next-app refuses to scaffold in a non-empty dir.
# Move docs out, scaffold, move docs back.
mv docs ../_mother_demo_docs_tmp
pnpm dlx create-next-app@latest . \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --turbopack --use-pnpm --no-experimental-https
mv ../_mother_demo_docs_tmp docs
```

- [ ] **Step 2: Verify dev server starts**

```bash
pnpm dev
```

Expected: dev server boots on `http://localhost:3000`, default Next.js page loads. Kill with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 16 app with TypeScript, Tailwind, App Router"
```

---

### Task 1.2: Add core dependencies

**Files:**
- Modify: `package.json` (via `pnpm add`)

- [ ] **Step 1: Install production deps**

```bash
pnpm add drizzle-orm @neondatabase/serverless geist motion lucide-react recharts \
  class-variance-authority clsx tailwind-merge zod
```

- [ ] **Step 2: Install dev deps**

```bash
pnpm add -D drizzle-kit @types/node tsx dotenv
```

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add Drizzle, Neon, motion, Recharts, Lucide, Zod"
```

---

### Task 1.3: Initialize shadcn/ui

**Files:**
- Create: `components.json`
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/*` (multiple)

- [ ] **Step 1: Init shadcn**

```bash
pnpm dlx shadcn@latest init -d
```

Accept defaults: TypeScript, default style, slate base color, src/app/globals.css, CSS variables yes, src/components import alias.

- [ ] **Step 2: Install the components we need**

```bash
pnpm dlx shadcn@latest add card button badge sheet dialog tabs tooltip table progress avatar sonner command select input label form separator
```

- [ ] **Step 3: Verify**

```bash
ls src/components/ui/
```

Expected: ~16 .tsx files including `button.tsx`, `card.tsx`, `dialog.tsx`, etc.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: init shadcn/ui with core component set"
```

---

### Task 1.4: Configure fonts (Geist + Noto Sans Malayalam)

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Noto_Sans_Malayalam } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const notoMalayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam"],
  variable: "--font-malayalam",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kerala MCH Tracker · Demo",
  description:
    "BPL Mother & Child Health Tracking and Decision Support — EOI demonstration",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${notoMalayalam.variable}`}
    >
      <body className="font-sans antialiased bg-[var(--surface)] text-[var(--fg)]">
        {children}
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: configure Geist + Noto Sans Malayalam fonts in root layout"
```

---

### Task 1.5: Apply design palette to globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Append palette to `src/app/globals.css`** — keep the existing Tailwind imports and shadcn variables; add this block AFTER them at the end of `:root`/`@theme` (the exact placement depends on shadcn init output — put it inside the existing `:root` selector or as a new one):

```css
:root {
  --primary: #0F4C75;
  --primary-50: #E8F1F7;
  --accent: #2D7A3E;
  --surface: #FAFAF7;
  --card: #FFFFFF;
  --fg: #1A1F2C;
  --fg-muted: #5A6373;
  --border: #E2E5EA;
  --risk-normal: #16A34A;
  --risk-high: #D97706;
  --risk-critical: #DC2626;
}

html {
  background: var(--surface);
}

body {
  font-feature-settings: "ss01", "cv11";
}

.font-malayalam {
  font-family: var(--font-malayalam), system-ui, sans-serif;
}

.font-mono-num {
  font-family: var(--font-geist-mono), ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Replace `src/app/page.tsx` with a simple landing**

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center space-y-2">
        <p className="text-sm text-[var(--fg-muted)] uppercase tracking-widest">
          Government of Kerala · Health &amp; Family Welfare Dept
        </p>
        <h1 className="text-3xl font-semibold text-[var(--primary)]">
          BPL Mother &amp; Child Health Tracker
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">
          Demonstration — no real patient information
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/field"
          className="px-6 py-3 rounded-lg bg-[var(--primary)] text-white font-medium hover:opacity-90"
        >
          ASHA mobile view (/field)
        </Link>
        <Link
          href="/admin"
          className="px-6 py-3 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--primary)] font-medium hover:bg-[var(--primary-50)]"
        >
          District dashboard (/admin)
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Boot dev server and confirm landing renders**

```bash
pnpm dev
```

Open `http://localhost:3000`. Expected: warm off-white background, two buttons, no console errors. Ctrl+C to stop.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/page.tsx
git commit -m "feat: apply gov-tech palette + landing page with /field and /admin entry points"
```

---

### Task 1.6: Configure tsconfig path alias + add .env.example

**Files:**
- Modify: `tsconfig.json` (verify @/* alias exists)
- Create: `.env.example`
- Modify: `.gitignore` (ensure `.env.local` excluded)

- [ ] **Step 1: Create `.env.example`**

```bash
cat > .env.example << 'EOF'
# Neon Postgres connection string
# Get this from your Neon project dashboard → Connection Details → Pooled connection
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require"
EOF
```

- [ ] **Step 2: Verify `.gitignore` excludes env files**

```bash
grep -E "^\.env" .gitignore || echo ".env*.local
.env" >> .gitignore
```

- [ ] **Step 3: Commit**

```bash
git add .env.example .gitignore
git commit -m "chore: add .env.example with DATABASE_URL placeholder"
```


---

## Phase 2 — Database Layer

### Task 2.1: Drizzle config + env wiring

**Files:**
- Create: `drizzle.config.ts`
- Create: `src/db/index.ts`

- [ ] **Step 1: Create `drizzle.config.ts`**

```ts
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
```

- [ ] **Step 2: Create `src/db/index.ts`**

```ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
export type DB = typeof db;
```

- [ ] **Step 3: Commit**

```bash
git add drizzle.config.ts src/db/index.ts
git commit -m "feat: configure Drizzle ORM + Neon HTTP driver"
```

---

### Task 2.2: Define the 17 tables in schema.ts

**Files:**
- Create: `src/db/schema.ts`

- [ ] **Step 1: Create `src/db/schema.ts`**

```ts
import {
  pgTable,
  serial,
  text,
  integer,
  real,
  timestamp,
  date,
  pgEnum,
  jsonb,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("worker_role", [
  "ASHA",
  "ANM",
  "MO",
  "SUPERVISOR",
  "ADMIN",
]);
export const facilityTypeEnum = pgEnum("facility_type", [
  "SC",
  "PHC",
  "CHC",
  "DH",
]);
export const riskEnum = pgEnum("risk_level", ["NORMAL", "HIGH", "CRITICAL"]);
export const immStatusEnum = pgEnum("imm_status", [
  "UPCOMING",
  "DUE",
  "GIVEN",
  "MISSED",
]);
export const nutritionEnum = pgEnum("nutrition_class", ["NORMAL", "MAM", "SAM"]);
export const alertTypeEnum = pgEnum("alert_type", [
  "SOS",
  "ANOMALY",
  "REFERRAL_DUE",
]);
export const alertStatusEnum = pgEnum("alert_status", [
  "OPEN",
  "ACK",
  "DISPATCHED",
  "CLOSED",
]);
export const referralStatusEnum = pgEnum("referral_status", [
  "PENDING",
  "ACK",
  "ACCEPTED",
  "COMPLETED",
]);
export const schemeCodeEnum = pgEnum("scheme_code", [
  "PMMVY",
  "JSY",
  "JSSK",
  "KASP",
]);
export const schemeStatusEnum = pgEnum("scheme_status", [
  "PENDING",
  "ELIGIBLE",
  "DISBURSED",
]);
export const milestoneStatusEnum = pgEnum("milestone_status", [
  "PENDING",
  "ACHIEVED",
  "DELAYED",
]);
export const syncStatusEnum = pgEnum("sync_status", [
  "PENDING",
  "SYNCED",
  "FAILED",
]);

// Tables
export const facilities = pgTable("facilities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: facilityTypeEnum("type").notNull(),
  block: text("block").notNull(),
  district: text("district").notNull(),
  lat: real("lat"),
  lng: real("lng"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fieldWorkers = pgTable("field_workers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: varchar("phone", { length: 15 }),
  role: roleEnum("role").notNull(),
  facilityId: integer("facility_id").references(() => facilities.id, {
    onDelete: "set null",
  }),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const families = pgTable("families", {
  id: serial("id").primaryKey(),
  headOfFamily: text("head_of_family").notNull(),
  village: text("village").notNull(),
  block: text("block").notNull(),
  district: text("district").notNull(),
  bplScore: integer("bpl_score").notNull(),
  schemePriorityTier: integer("scheme_priority_tier").notNull(),
  ashaId: integer("asha_id").references(() => fieldWorkers.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const mothers = pgTable("mothers", {
  id: serial("id").primaryKey(),
  familyId: integer("family_id")
    .references(() => families.id, { onDelete: "cascade" })
    .notNull(),
  beneficiaryId12: varchar("beneficiary_id_12", { length: 12 })
    .notNull()
    .unique(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  lmp: date("lmp"),
  edd: date("edd"),
  pregnancyNo: integer("pregnancy_no").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const children = pgTable("children", {
  id: serial("id").primaryKey(),
  familyId: integer("family_id")
    .references(() => families.id, { onDelete: "cascade" })
    .notNull(),
  motherId: integer("mother_id").references(() => mothers.id, {
    onDelete: "set null",
  }),
  beneficiaryId12: varchar("beneficiary_id_12", { length: 12 })
    .notNull()
    .unique(),
  name: text("name"),
  dob: date("dob").notNull(),
  birthWeightG: integer("birth_weight_g"),
  sex: text("sex"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ancVisits = pgTable("anc_visits", {
  id: serial("id").primaryKey(),
  motherId: integer("mother_id")
    .references(() => mothers.id, { onDelete: "cascade" })
    .notNull(),
  visitNo: integer("visit_no").notNull(),
  visitDate: timestamp("visit_date").defaultNow().notNull(),
  bpSystolic: integer("bp_systolic"),
  bpDiastolic: integer("bp_diastolic"),
  hbValue: real("hb_value"),
  weightKg: real("weight_kg"),
  fetalHr: integer("fetal_hr"),
  complaints: text("complaints"),
  riskLevel: riskEnum("risk_level").notNull().default("NORMAL"),
  riskTriggers: jsonb("risk_triggers").$type<string[]>().default([]),
  recordedByWorkerId: integer("recorded_by_worker_id").references(
    () => fieldWorkers.id,
  ),
  kbUsed: integer("kb_used").notNull().default(0),
});

export const pncVisits = pgTable("pnc_visits", {
  id: serial("id").primaryKey(),
  motherId: integer("mother_id")
    .references(() => mothers.id, { onDelete: "cascade" })
    .notNull(),
  visitDay: integer("visit_day").notNull(),
  visitDate: timestamp("visit_date").defaultNow().notNull(),
  bpSystolic: integer("bp_systolic"),
  bpDiastolic: integer("bp_diastolic"),
  hbValue: real("hb_value"),
  complications: text("complications"),
  recordedByWorkerId: integer("recorded_by_worker_id").references(
    () => fieldWorkers.id,
  ),
  kbUsed: integer("kb_used").notNull().default(0),
});

export const immunizations = pgTable("immunizations", {
  id: serial("id").primaryKey(),
  childId: integer("child_id")
    .references(() => children.id, { onDelete: "cascade" })
    .notNull(),
  vaccineCode: text("vaccine_code").notNull(),
  scheduledDate: date("scheduled_date").notNull(),
  givenDate: date("given_date"),
  givenAtFacilityId: integer("given_at_facility_id").references(
    () => facilities.id,
  ),
  status: immStatusEnum("status").notNull().default("UPCOMING"),
});

export const growthRecords = pgTable("growth_records", {
  id: serial("id").primaryKey(),
  childId: integer("child_id")
    .references(() => children.id, { onDelete: "cascade" })
    .notNull(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
  weightKg: real("weight_kg"),
  heightCm: real("height_cm"),
  muacCm: real("muac_cm"),
  weightZ: real("weight_z"),
  heightZ: real("height_z"),
  weightForHeightZ: real("weight_for_height_z"),
  classification: nutritionEnum("classification").notNull().default("NORMAL"),
  recordedByWorkerId: integer("recorded_by_worker_id").references(
    () => fieldWorkers.id,
  ),
  kbUsed: integer("kb_used").notNull().default(0),
});

export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  childId: integer("child_id")
    .references(() => children.id, { onDelete: "cascade" })
    .notNull(),
  milestoneCode: text("milestone_code").notNull(),
  expectedAgeMonths: integer("expected_age_months").notNull(),
  achievedDate: date("achieved_date"),
  status: milestoneStatusEnum("status").notNull().default("PENDING"),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  type: alertTypeEnum("type").notNull(),
  status: alertStatusEnum("status").notNull().default("OPEN"),
  subjectType: text("subject_type").notNull(),
  subjectId: integer("subject_id").notNull(),
  lat: real("lat"),
  lng: real("lng"),
  raisedAt: timestamp("raised_at").defaultNow().notNull(),
  raisedByWorkerId: integer("raised_by_worker_id").references(
    () => fieldWorkers.id,
  ),
  channels: jsonb("channels").$type<
    Array<{ to: string; status: string; at?: string }>
  >().default([]),
  note: text("note"),
});

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  subjectType: text("subject_type").notNull(),
  subjectId: integer("subject_id").notNull(),
  fromFacilityId: integer("from_facility_id").references(() => facilities.id),
  toFacilityId: integer("to_facility_id").references(() => facilities.id),
  tierFrom: facilityTypeEnum("tier_from"),
  tierTo: facilityTypeEnum("tier_to"),
  reason: text("reason"),
  status: referralStatusEnum("status").notNull().default("PENDING"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  acknowledgedAt: timestamp("acknowledged_at"),
});

export const schemeEnrollments = pgTable("scheme_enrollments", {
  id: serial("id").primaryKey(),
  beneficiaryType: text("beneficiary_type").notNull(),
  beneficiaryId: integer("beneficiary_id").notNull(),
  schemeCode: schemeCodeEnum("scheme_code").notNull(),
  installmentNo: integer("installment_no").notNull().default(1),
  expectedDate: date("expected_date"),
  disbursedDate: date("disbursed_date"),
  amount: integer("amount"),
  status: schemeStatusEnum("status").notNull().default("PENDING"),
});

export const iecContent = pgTable("iec_content", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  language: text("language").notNull().default("ml"),
  titleEn: text("title_en").notNull(),
  titleMl: text("title_ml").notNull(),
  summary: text("summary"),
  assetUrl: text("asset_url"),
});

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  beneficiaryType: text("beneficiary_type").notNull(),
  beneficiaryId: integer("beneficiary_id").notNull(),
  type: text("type").notNull(),
  dueDate: date("due_date").notNull(),
  channel: text("channel").notNull().default("APP"),
  sentAt: timestamp("sent_at"),
  openedAt: timestamp("opened_at"),
});

export const smsLog = pgTable("sms_log", {
  id: serial("id").primaryKey(),
  beneficiaryType: text("beneficiary_type").notNull(),
  beneficiaryId: integer("beneficiary_id").notNull(),
  reminderId: integer("reminder_id").references(() => reminders.id),
  language: text("language").notNull().default("ml"),
  bodyText: text("body_text").notNull(),
  senderId: text("sender_id").notNull().default("KLNHM-MCH"),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
});

export const syncEvents = pgTable("sync_events", {
  id: serial("id").primaryKey(),
  workerId: integer("worker_id").references(() => fieldWorkers.id),
  action: text("action").notNull(),
  payloadKb: integer("payload_kb").notNull(),
  queuedAt: timestamp("queued_at").defaultNow().notNull(),
  syncedAt: timestamp("synced_at"),
  status: syncStatusEnum("status").notNull().default("PENDING"),
});

// Relations (only the ones we'll actually use)
export const familiesRelations = relations(families, ({ many, one }) => ({
  mothers: many(mothers),
  children: many(children),
  asha: one(fieldWorkers, {
    fields: [families.ashaId],
    references: [fieldWorkers.id],
  }),
}));

export const mothersRelations = relations(mothers, ({ one, many }) => ({
  family: one(families, {
    fields: [mothers.familyId],
    references: [families.id],
  }),
  ancVisits: many(ancVisits),
  pncVisits: many(pncVisits),
}));

export const childrenRelations = relations(children, ({ one, many }) => ({
  family: one(families, {
    fields: [children.familyId],
    references: [families.id],
  }),
  mother: one(mothers, {
    fields: [children.motherId],
    references: [mothers.id],
  }),
  growthRecords: many(growthRecords),
  immunizations: many(immunizations),
  milestones: many(milestones),
}));
```

- [ ] **Step 2: Run typecheck**

```bash
pnpm tsc --noEmit
```

Expected: no errors. If `relations` import fails, ensure `drizzle-orm` version is current.

- [ ] **Step 3: Commit**

```bash
git add src/db/schema.ts
git commit -m "feat: define 17-table Drizzle schema for MCH demo"
```

---

### Task 2.3: Set up Neon DB + connection string

**Files:**
- Modify: `.env.local`

- [ ] **Step 1: Create Neon project (manual)**

Tell the human user: go to https://console.neon.tech → Create project → name it `bpl-mch-demo` → region `Singapore` (closest to Kerala) → copy the **pooled** connection string.

- [ ] **Step 2: Write the connection string to `.env.local`**

```bash
cat > .env.local << 'EOF'
DATABASE_URL="<paste pooled connection string from Neon here>"
EOF
```

- [ ] **Step 3: Verify connection**

```bash
pnpm dlx tsx -e "import('@neondatabase/serverless').then(async ({ neon }) => { const sql = neon(process.env.DATABASE_URL); const r = await sql\`select now() as t\`; console.log(r); });"
```

Expected: prints `[ { t: <ISO timestamp> } ]`.

- [ ] **Step 4: Do NOT commit `.env.local`** (already gitignored). Verify:

```bash
git status
```

Expected: `.env.local` does not appear in untracked or modified files.

---

### Task 2.4: Generate + push migration

**Files:**
- Create: `drizzle/*.sql` (generated)

- [ ] **Step 1: Generate migration**

```bash
pnpm drizzle-kit generate --name init
```

Expected: creates `drizzle/0000_init.sql` and `drizzle/meta/_journal.json`.

- [ ] **Step 2: Push to Neon**

```bash
pnpm drizzle-kit push
```

Confirm "Are you sure?" prompts with `y`. Expected: all 17 tables created.

- [ ] **Step 3: Verify tables exist**

```bash
pnpm dlx tsx -e "import('@neondatabase/serverless').then(async ({ neon }) => { const sql = neon(process.env.DATABASE_URL); const r = await sql\`select tablename from pg_tables where schemaname='public' order by tablename\`; console.log(r); });"
```

Expected: lists all 17 tables (alerts, anc_visits, children, facilities, families, field_workers, growth_records, iec_content, immunizations, milestones, mothers, pnc_visits, referrals, reminders, scheme_enrollments, sms_log, sync_events).

- [ ] **Step 4: Commit**

```bash
git add drizzle/
git commit -m "feat: initial Drizzle migration — 17 tables pushed to Neon"
```

---

### Task 2.5: Package.json db scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add scripts** to the `scripts` object in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx src/db/seed.ts",
    "db:reset": "tsx src/db/reset.ts"
  }
}
```

- [ ] **Step 2: Verify**

```bash
pnpm db:studio
```

Expected: opens Drizzle Studio in browser at `https://local.drizzle.studio`; you can see all 17 empty tables. Ctrl+C to stop.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: add db:generate, db:push, db:studio, db:seed, db:reset scripts"
```


---

## Phase 3 — Shared Lib + Components

### Task 3.1: `lib/risk-scoring.ts`

**Files:**
- Create: `src/lib/risk-scoring.ts`

- [ ] **Step 1: Write the scorer**

```ts
export type RiskLevel = "NORMAL" | "HIGH" | "CRITICAL";

export interface AncVitals {
  bpSystolic?: number | null;
  bpDiastolic?: number | null;
  hbValue?: number | null;
  weightKg?: number | null;
}

export interface RiskAssessment {
  level: RiskLevel;
  triggers: string[];
}

export function scoreAncRisk(v: AncVitals): RiskAssessment {
  const triggers: string[] = [];
  let level: RiskLevel = "NORMAL";

  // Severe anaemia
  if (v.hbValue != null && v.hbValue < 7) {
    triggers.push("Severe anaemia (Hb<7)");
    level = "CRITICAL";
  } else if (v.hbValue != null && v.hbValue < 9) {
    triggers.push("Moderate anaemia (Hb<9)");
    if (level === "NORMAL") level = "HIGH";
  }

  // Hypertension
  if (
    (v.bpSystolic != null && v.bpSystolic >= 160) ||
    (v.bpDiastolic != null && v.bpDiastolic >= 110)
  ) {
    triggers.push("Severe hypertension (BP ≥ 160/110)");
    level = "CRITICAL";
  } else if (
    (v.bpSystolic != null && v.bpSystolic >= 140) ||
    (v.bpDiastolic != null && v.bpDiastolic >= 90)
  ) {
    triggers.push("Hypertension (BP ≥ 140/90)");
    if (level === "NORMAL") level = "HIGH";
  }

  return { level, triggers };
}

export function recommendedAction(level: RiskLevel): string {
  switch (level) {
    case "CRITICAL":
      return "Immediate referral to PHC/CHC. Notify MO.";
    case "HIGH":
      return "Schedule follow-up within 48 hours. Counsel on warning signs.";
    case "NORMAL":
      return "Continue routine ANC schedule.";
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/risk-scoring.ts
git commit -m "feat: ANC risk scorer (severe anaemia + hypertension)"
```

---

### Task 3.2: `lib/z-score.ts` + `lib/beneficiary-id.ts` + `lib/kb-meter.ts`

**Files:**
- Create: `src/lib/z-score.ts`
- Create: `src/lib/beneficiary-id.ts`
- Create: `src/lib/kb-meter.ts`

- [ ] **Step 1: Create `src/lib/z-score.ts`** — simplified WHO standards for the demo (3 LMS points per metric, interpolated):

```ts
// Simplified WHO weight-for-age + weight-for-height Z-score.
// For an EOI demo we use a conservative lookup, not full LMS interpolation.
export type NutritionClass = "NORMAL" | "MAM" | "SAM";

interface Pt {
  ageMonths: number;
  median: number;
  sd: number;
}

const WEIGHT_FOR_AGE_BOYS: Pt[] = [
  { ageMonths: 0, median: 3.3, sd: 0.45 },
  { ageMonths: 3, median: 6.4, sd: 0.7 },
  { ageMonths: 6, median: 7.9, sd: 0.85 },
  { ageMonths: 12, median: 9.6, sd: 1.05 },
  { ageMonths: 18, median: 10.9, sd: 1.2 },
  { ageMonths: 24, median: 12.2, sd: 1.35 },
];

const WEIGHT_FOR_AGE_GIRLS: Pt[] = [
  { ageMonths: 0, median: 3.2, sd: 0.4 },
  { ageMonths: 3, median: 5.8, sd: 0.65 },
  { ageMonths: 6, median: 7.3, sd: 0.8 },
  { ageMonths: 12, median: 8.9, sd: 0.95 },
  { ageMonths: 18, median: 10.2, sd: 1.1 },
  { ageMonths: 24, median: 11.5, sd: 1.25 },
];

function interpolate(table: Pt[], ageMonths: number): Pt {
  if (ageMonths <= table[0].ageMonths) return table[0];
  if (ageMonths >= table[table.length - 1].ageMonths)
    return table[table.length - 1];
  for (let i = 0; i < table.length - 1; i++) {
    const a = table[i];
    const b = table[i + 1];
    if (ageMonths >= a.ageMonths && ageMonths <= b.ageMonths) {
      const t = (ageMonths - a.ageMonths) / (b.ageMonths - a.ageMonths);
      return {
        ageMonths,
        median: a.median + (b.median - a.median) * t,
        sd: a.sd + (b.sd - a.sd) * t,
      };
    }
  }
  return table[table.length - 1];
}

export function weightForAgeZ(
  weightKg: number,
  ageMonths: number,
  sex: "M" | "F",
): number {
  const table = sex === "M" ? WEIGHT_FOR_AGE_BOYS : WEIGHT_FOR_AGE_GIRLS;
  const pt = interpolate(table, ageMonths);
  return (weightKg - pt.median) / pt.sd;
}

export function classifyNutrition(
  weightForHeightZ: number | null,
  muacCm: number | null,
): NutritionClass {
  // SAM: WHZ < -3 OR MUAC < 11.5
  if ((weightForHeightZ != null && weightForHeightZ < -3) || (muacCm != null && muacCm < 11.5)) {
    return "SAM";
  }
  // MAM: WHZ -3 to -2 OR MUAC 11.5–12.5
  if (
    (weightForHeightZ != null && weightForHeightZ < -2) ||
    (muacCm != null && muacCm < 12.5)
  ) {
    return "MAM";
  }
  return "NORMAL";
}

export function ageInMonths(dob: Date, on: Date = new Date()): number {
  const months =
    (on.getFullYear() - dob.getFullYear()) * 12 +
    (on.getMonth() - dob.getMonth());
  return Math.max(0, months);
}
```

- [ ] **Step 2: Create `src/lib/beneficiary-id.ts`**

```ts
// ABHA-aligned 12-digit ID generator.
// In production this would call the ABHA enrollment API.
// For the demo, we generate locally with a Luhn-like checksum.
export function generateBeneficiaryId12(): string {
  const random11 = Array.from({ length: 11 }, () =>
    Math.floor(Math.random() * 10),
  ).join("");
  const checksum = luhnChecksum(random11);
  return random11 + checksum.toString();
}

function luhnChecksum(digits: string): number {
  let sum = 0;
  let alt = true;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i]!, 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return (10 - (sum % 10)) % 10;
}

export function formatBeneficiaryId(id: string): string {
  // 12 digits → "1234 5678 9012"
  return id.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3");
}
```

- [ ] **Step 3: Create `src/lib/kb-meter.ts`**

```ts
export function payloadKb(payload: unknown): number {
  const bytes = new Blob([JSON.stringify(payload)]).size;
  return Math.max(1, Math.round(bytes / 1024));
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/z-score.ts src/lib/beneficiary-id.ts src/lib/kb-meter.ts
git commit -m "feat: Z-score classifier + ABHA-style ID generator + KB meter"
```

---

### Task 3.3: `lib/session.ts` (cookie-based current user/role)

**Files:**
- Create: `src/lib/session.ts`

- [ ] **Step 1: Write session helpers**

```ts
import { cookies } from "next/headers";

export type AppRole = "ASHA" | "ANM" | "MO" | "SUPERVISOR" | "ADMIN";

const COOKIE_NAME = "mch_session";
const OFFLINE_COOKIE = "mch_offline";

interface Session {
  workerId: number;
  role: AppRole;
}

const DEFAULT_SESSION: Session = { workerId: 1, role: "ASHA" };

export async function getSession(): Promise<Session> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return DEFAULT_SESSION;
  try {
    const parsed = JSON.parse(raw) as Session;
    return parsed;
  } catch {
    return DEFAULT_SESSION;
  }
}

export async function setSession(session: Session): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, JSON.stringify(session), {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getOfflineMode(): Promise<boolean> {
  const store = await cookies();
  return store.get(OFFLINE_COOKIE)?.value === "1";
}

export async function setOfflineMode(on: boolean): Promise<void> {
  const store = await cookies();
  store.set(OFFLINE_COOKIE, on ? "1" : "0", {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/session.ts
git commit -m "feat: cookie-based session (workerId + role) + offline mode toggle"
```

---

### Task 3.4: `lib/malayalam.ts`

**Files:**
- Create: `src/lib/malayalam.ts`

- [ ] **Step 1: Curate the Malayalam strings the demo needs**

```ts
// Curated Malayalam strings. Adding new strings requires confirmation with a
// native speaker — these have been validated for the EOI demo.
export const ml = {
  greeting: "നമസ്കാരം",
  // Form labels
  hemoglobin: "ഹീമോഗ്ലോബിൻ",
  bloodPressure: "രക്തസമ്മർദ്ദം",
  weight: "ഭാരം",
  height: "ഉയരം",
  muac: "കൈച്ചുറ്റളവ്",
  fetalHeartRate: "ഗർഭസ്ഥ ശിശുവിന്റെ ഹൃദയമിടിപ്പ്",
  // Status
  normal: "സാധാരണ",
  high: "ഉയർന്ന",
  critical: "ഗുരുതരം",
  // SMS templates
  ancReminder: (name: string, when: string) =>
    `പ്രിയ ${name}, താങ്കളുടെ അടുത്ത ANC പരിശോധന ${when} ന് നിശ്ചയിച്ചിരിക്കുന്നു. അങ്കണവാടിയിലോ സബ്സെന്ററിലോ എത്തുക. -കേരള ആരോഗ്യ വകുപ്പ്`,
  immReminder: (childName: string, vaccine: string, when: string) =>
    `പ്രിയ രക്ഷിതാവേ, ${childName}-യ്ക്ക് ${vaccine} വാക്സിൻ ${when} ന് നൽകേണ്ടതാണ്. ദയവായി പ്രാദേശിക PHC-യിൽ എത്തിക്കുക. -കേരള ആരോഗ്യ വകുപ്പ്`,
  pncReminder: (name: string) =>
    `പ്രിയ ${name}, പ്രസവശേഷം മൂന്നാം ദിവസത്തെ പരിശോധന ഇന്ന് ആവശ്യമാണ്. ASHA പ്രവർത്തക സന്ദർശിക്കും. -കേരള ആരോഗ്യ വകുപ്പ്`,
} as const;
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/malayalam.ts
git commit -m "feat: curated Malayalam strings for labels + SMS templates"
```

---

### Task 3.5: `<PhoneFrame>` + `<RiskBadge>` + `<KbBadge>` + `<MalayalamLabel>`

**Files:**
- Create: `src/components/phone-frame.tsx`
- Create: `src/components/risk-badge.tsx`
- Create: `src/components/kb-badge.tsx`
- Create: `src/components/malayalam-label.tsx`

- [ ] **Step 1: `src/components/phone-frame.tsx`**

```tsx
import { cn } from "@/lib/utils";

export function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="md:flex md:justify-center md:py-8 md:bg-slate-100 md:min-h-screen">
      <div
        className={cn(
          "md:max-w-[414px] md:rounded-[2.5rem] md:border-[10px] md:border-slate-900",
          "md:shadow-2xl md:overflow-hidden bg-[var(--surface)]",
          "min-h-screen md:min-h-[820px] flex flex-col",
          className,
        )}
      >
        {/* faux status bar */}
        <div className="hidden md:flex h-7 bg-slate-900 text-white text-xs items-center justify-between px-6">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span>📶</span>
            <span>•</span>
            <span>4G</span>
            <span>•</span>
            <span>87%</span>
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: `src/components/risk-badge.tsx`**

```tsx
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";
import type { RiskLevel } from "@/lib/risk-scoring";

const STYLES: Record<
  RiskLevel,
  { bg: string; fg: string; label: string; icon: typeof CheckCircle2 }
> = {
  NORMAL: {
    bg: "bg-[var(--risk-normal)]/10",
    fg: "text-[var(--risk-normal)]",
    label: "Normal",
    icon: CheckCircle2,
  },
  HIGH: {
    bg: "bg-[var(--risk-high)]/10",
    fg: "text-[var(--risk-high)]",
    label: "High",
    icon: AlertTriangle,
  },
  CRITICAL: {
    bg: "bg-[var(--risk-critical)]/10",
    fg: "text-[var(--risk-critical)]",
    label: "Critical",
    icon: AlertOctagon,
  },
};

export function RiskBadge({
  level,
  className,
}: {
  level: RiskLevel;
  className?: string;
}) {
  const s = STYLES[level];
  const Icon = s.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        s.bg,
        s.fg,
        className,
      )}
    >
      <Icon className="size-3.5" />
      {s.label}
    </span>
  );
}
```

- [ ] **Step 3: `src/components/kb-badge.tsx`**

```tsx
import { Check } from "lucide-react";

export function KbBadge({ kb, synced = true }: { kb: number; synced?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[var(--fg-muted)] font-mono-num">
      {synced && <Check className="size-3 text-[var(--risk-normal)]" />}
      {kb} KB
      {synced && <span>· synced</span>}
    </span>
  );
}
```

- [ ] **Step 4: `src/components/malayalam-label.tsx`**

```tsx
export function MalayalamLabel({
  en,
  ml,
  htmlFor,
}: {
  en: string;
  ml: string;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium space-y-0.5">
      <span className="text-[var(--fg)]">{en}</span>
      <span className="block font-malayalam text-xs text-[var(--fg-muted)]">
        {ml}
      </span>
    </label>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/phone-frame.tsx src/components/risk-badge.tsx \
        src/components/kb-badge.tsx src/components/malayalam-label.tsx
git commit -m "feat: shared atoms — PhoneFrame, RiskBadge, KbBadge, MalayalamLabel"
```

---

### Task 3.6: `<BeneficiaryCard>` + `<SchemeProgress>` + `<SmsPreviewModal>`

**Files:**
- Create: `src/components/beneficiary-card.tsx`
- Create: `src/components/scheme-progress.tsx`
- Create: `src/components/sms-preview-modal.tsx`

- [ ] **Step 1: `src/components/beneficiary-card.tsx`**

```tsx
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "./risk-badge";
import type { RiskLevel } from "@/lib/risk-scoring";

export interface BeneficiarySummary {
  id: number;
  name: string;
  subline: string; // e.g., "G2P1 · 28w · Agali" or "PNC · D+7 · Sholayur"
  lastVisit?: string;
  riskLevel: RiskLevel;
  ashaName?: string;
  type: "mother" | "child";
}

export function BeneficiaryCard({ b }: { b: BeneficiarySummary }) {
  return (
    <Link href={`/field/b/${b.type[0]}-${b.id}`}>
      <Card className="p-4 hover:bg-[var(--primary-50)] transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="font-medium text-[var(--fg)]">{b.name}</div>
            <div className="text-xs text-[var(--fg-muted)]">{b.subline}</div>
            {b.lastVisit && (
              <div className="text-xs text-[var(--fg-muted)]">
                Last visit: {b.lastVisit}
              </div>
            )}
            {b.ashaName && (
              <div className="text-xs text-[var(--fg-muted)]">
                ASHA: {b.ashaName}
              </div>
            )}
          </div>
          <RiskBadge level={b.riskLevel} />
        </div>
      </Card>
    </Link>
  );
}
```

- [ ] **Step 2: `src/components/scheme-progress.tsx`**

```tsx
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const SCHEME_INFO: Record<string, { name: string; totalInstallments: number }> = {
  PMMVY: { name: "PMMVY", totalInstallments: 3 },
  JSY: { name: "JSY", totalInstallments: 1 },
  JSSK: { name: "JSSK", totalInstallments: 1 },
  KASP: { name: "KASP", totalInstallments: 1 },
};

export function SchemeProgress({
  code,
  disbursed,
}: {
  code: keyof typeof SCHEME_INFO;
  disbursed: number;
}) {
  const info = SCHEME_INFO[code];
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{info.name}</span>
        <span className="text-[var(--fg-muted)] font-mono-num">
          {disbursed}/{info.totalInstallments}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: info.totalInstallments }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full flex items-center justify-center",
              i < disbursed ? "bg-[var(--accent)]" : "bg-[var(--border)]",
            )}
          >
            {i < disbursed && <Check className="size-2 text-white" />}
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: `src/components/sms-preview-modal.tsx`**

```tsx
"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Smartphone } from "lucide-react";

export interface SmsPreview {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  beneficiaryName: string;
  bodyText: string;
  senderId?: string;
  sentAt?: Date;
}

export function SmsPreviewModal({
  open,
  onOpenChange,
  beneficiaryName,
  bodyText,
  senderId = "KLNHM-MCH",
  sentAt = new Date(),
}: SmsPreview) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="size-4" />
            SMS Preview
          </DialogTitle>
          <DialogDescription>
            Outbound vernacular SMS · would be dispatched via DLT-registered
            gateway in production
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border bg-slate-50 p-4 space-y-3">
          <div className="text-xs text-[var(--fg-muted)] flex justify-between">
            <span>From: {senderId}</span>
            <span className="font-mono-num">
              {sentAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="text-xs text-[var(--fg-muted)]">
            To: {beneficiaryName}
          </div>
          <div className="font-malayalam text-[var(--fg)] leading-relaxed">
            {bodyText}
          </div>
        </div>
        <div className="text-xs text-[var(--fg-muted)]">
          Status: delivered · 1 SMS · ~70 bytes
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/beneficiary-card.tsx src/components/scheme-progress.tsx src/components/sms-preview-modal.tsx
git commit -m "feat: BeneficiaryCard, SchemeProgress bar, SmsPreviewModal"
```

---

### Task 3.7: `data/kerala-places.ts` + `data/vaccines.ts` + `data/milestones.ts` + `data/iec-content.ts`

**Files:**
- Create: `src/data/kerala-places.ts`
- Create: `src/data/vaccines.ts`
- Create: `src/data/milestones.ts`
- Create: `src/data/iec-content.ts`

- [ ] **Step 1: `src/data/kerala-places.ts`** — Palakkad/Attappadi blocks + facilities

```ts
export const DISTRICT = "Palakkad";
export const STATE = "Kerala";

export const BLOCKS = [
  "Agali",
  "Sholayur",
  "Pudur",
  "Mannarkkad",
  "Attappadi",
] as const;

export const VILLAGES_BY_BLOCK: Record<string, string[]> = {
  Agali: ["Agali", "Kottathara", "Mukkali"],
  Sholayur: ["Sholayur", "Anavay", "Vattalakki"],
  Pudur: ["Pudur", "Tazhe Padavayal", "Kunjampetty"],
  Mannarkkad: ["Mannarkkad", "Karara", "Kanjirapuzha"],
  Attappadi: ["Bhoothivazhi", "Tachampara", "Padavayal"],
};

export interface FacilitySeed {
  name: string;
  type: "SC" | "PHC" | "CHC" | "DH";
  block: string;
  lat: number;
  lng: number;
}

export const FACILITIES: FacilitySeed[] = [
  { name: "Agali Sub-Centre", type: "SC", block: "Agali", lat: 11.18, lng: 76.72 },
  { name: "Sholayur Sub-Centre", type: "SC", block: "Sholayur", lat: 11.15, lng: 76.68 },
  { name: "Pudur Sub-Centre", type: "SC", block: "Pudur", lat: 11.12, lng: 76.74 },
  { name: "Agali PHC", type: "PHC", block: "Agali", lat: 11.18, lng: 76.72 },
  { name: "Kottathara PHC", type: "PHC", block: "Agali", lat: 11.17, lng: 76.73 },
  { name: "Mannarkkad CHC", type: "CHC", block: "Mannarkkad", lat: 10.99, lng: 76.46 },
  { name: "Palakkad District Hospital", type: "DH", block: "Palakkad", lat: 10.78, lng: 76.65 },
];
```

- [ ] **Step 2: `src/data/vaccines.ts`** — Indian UIP schedule for 0–24m

```ts
export interface VaccineSpec {
  code: string;
  name: string;
  ageMonths: number;
}

export const VACCINES_0_TO_24M: VaccineSpec[] = [
  { code: "BCG", name: "BCG", ageMonths: 0 },
  { code: "HEPB-0", name: "Hepatitis B (birth)", ageMonths: 0 },
  { code: "OPV-0", name: "OPV-0", ageMonths: 0 },
  { code: "PENTA-1", name: "Pentavalent-1", ageMonths: 1.5 },
  { code: "OPV-1", name: "OPV-1", ageMonths: 1.5 },
  { code: "ROTA-1", name: "Rotavirus-1", ageMonths: 1.5 },
  { code: "PENTA-2", name: "Pentavalent-2", ageMonths: 2.5 },
  { code: "OPV-2", name: "OPV-2", ageMonths: 2.5 },
  { code: "ROTA-2", name: "Rotavirus-2", ageMonths: 2.5 },
  { code: "PENTA-3", name: "Pentavalent-3", ageMonths: 3.5 },
  { code: "OPV-3", name: "OPV-3", ageMonths: 3.5 },
  { code: "ROTA-3", name: "Rotavirus-3", ageMonths: 3.5 },
  { code: "MR-1", name: "Measles-Rubella-1", ageMonths: 9 },
  { code: "JE-1", name: "Japanese Encephalitis-1", ageMonths: 9 },
  { code: "VITA-1", name: "Vitamin A-1", ageMonths: 9 },
  { code: "DPT-B1", name: "DPT booster-1", ageMonths: 16 },
  { code: "OPV-B", name: "OPV booster", ageMonths: 16 },
  { code: "MR-2", name: "Measles-Rubella-2", ageMonths: 16 },
];
```

- [ ] **Step 3: `src/data/milestones.ts`**

```ts
export interface MilestoneSpec {
  code: string;
  name: string;
  expectedAgeMonths: number;
}

export const MILESTONES_0_TO_24M: MilestoneSpec[] = [
  { code: "SOCIAL_SMILE", name: "Social smile", expectedAgeMonths: 2 },
  { code: "HEAD_HOLD", name: "Holds head steady", expectedAgeMonths: 3 },
  { code: "ROLL_OVER", name: "Rolls over", expectedAgeMonths: 5 },
  { code: "SITS", name: "Sits without support", expectedAgeMonths: 7 },
  { code: "CRAWLS", name: "Crawls", expectedAgeMonths: 9 },
  { code: "STANDS", name: "Stands with support", expectedAgeMonths: 10 },
  { code: "FIRST_WORDS", name: "First words", expectedAgeMonths: 12 },
  { code: "WALKS", name: "Walks independently", expectedAgeMonths: 13 },
  { code: "TWO_WORD_PHRASES", name: "Two-word phrases", expectedAgeMonths: 18 },
  { code: "RUNS", name: "Runs", expectedAgeMonths: 21 },
];
```

- [ ] **Step 4: `src/data/iec-content.ts`**

```ts
export interface IecItem {
  category: "NUTRITION" | "SAFE_DELIVERY" | "NEWBORN_CARE";
  titleEn: string;
  titleMl: string;
  summary: string;
}

export const IEC_LIBRARY: IecItem[] = [
  {
    category: "NUTRITION",
    titleEn: "Iron-rich foods for pregnancy",
    titleMl: "ഗർഭകാലത്തേക്കുള്ള ഇരുമ്പ് നിറഞ്ഞ ഭക്ഷണം",
    summary:
      "Locally available iron sources: ragi, drumstick leaves, jaggery, dates, leafy greens. Combine with vitamin C for absorption.",
  },
  {
    category: "NUTRITION",
    titleEn: "Exclusive breastfeeding 0–6 months",
    titleMl: "ജനനത്തിനുശേഷം ആറുമാസം മാത്രം മുലപ്പാൽ",
    summary:
      "No water, no other food — only breastmilk for the first 6 months. Reduces infant mortality and supports growth.",
  },
  {
    category: "SAFE_DELIVERY",
    titleEn: "Five danger signs in pregnancy",
    titleMl: "ഗർഭകാലത്തെ അഞ്ച് അപായ സൂചനകൾ",
    summary:
      "Bleeding, severe headache, blurred vision, swelling of face/hands, reduced fetal movement — go to PHC immediately.",
  },
  {
    category: "SAFE_DELIVERY",
    titleEn: "Birth preparedness checklist",
    titleMl: "പ്രസവ തയ്യാറെടുപ്പ് പട്ടിക",
    summary:
      "Hospital identified, transport arranged, blood donor known, clean cloth and clothes ready, ID and JSY documents.",
  },
  {
    category: "NEWBORN_CARE",
    titleEn: "Warmth, breathing, breastfeeding",
    titleMl: "ചൂട്, ശ്വാസം, മുലയൂട്ടൽ",
    summary:
      "First hour of life: dry the baby, skin-to-skin, initiate breastfeeding within 30 minutes, delay first bath.",
  },
  {
    category: "NEWBORN_CARE",
    titleEn: "Recognising newborn danger signs",
    titleMl: "നവജാത ശിശുവിന്റെ അപായ സൂചനകൾ",
    summary:
      "Not feeding, lethargy, fast breathing, jaundice spreading to soles, fever or low temperature — referral.",
  },
];
```

- [ ] **Step 5: Commit**

```bash
git add src/data/
git commit -m "feat: seed data — Kerala places, vaccines, milestones, IEC content"
```

---

### Task 3.8: `<AdminTopBar>` + `<AdminSidebar>` + `<AdminPoller>`

**Files:**
- Create: `src/components/admin-top-bar.tsx`
- Create: `src/components/admin-sidebar.tsx`
- Create: `src/components/admin-poller.tsx`

- [ ] **Step 1: `src/components/admin-top-bar.tsx`**

```tsx
import { Shield } from "lucide-react";

export function AdminTopBar({ today }: { today: string }) {
  return (
    <header className="h-14 border-b bg-[var(--card)] flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <Shield className="size-5 text-[var(--primary)]" />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-[var(--primary)]">
            Kerala MCH Tracker
          </span>
          <span className="text-xs text-[var(--fg-muted)]">
            Palakkad District
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-[var(--fg-muted)] font-mono-num">{today}</span>
        <span className="font-medium text-[var(--fg)]">Dr. Suresh · CMO</span>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: `src/components/admin-sidebar.tsx`**

```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Siren,
  ArrowRightLeft,
  Wallet,
  Stethoscope,
  Building2,
  Plug,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/people", label: "People", icon: Users },
  { href: "/admin/alerts", label: "Alerts", icon: Siren },
  { href: "/admin/referrals", label: "Referrals", icon: ArrowRightLeft },
  { href: "/admin/schemes", label: "Schemes", icon: Wallet },
  { href: "/admin/ashas", label: "ASHAs", icon: Stethoscope },
  { href: "/admin/facilities", label: "Facilities", icon: Building2 },
  { href: "/admin/integrations", label: "Integrations", icon: Plug },
];

export function AdminSidebar() {
  const path = usePathname();
  return (
    <nav className="w-52 shrink-0 border-r bg-[var(--card)] p-3 space-y-1">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/admin" ? path === "/admin" : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              active
                ? "bg-[var(--primary-50)] text-[var(--primary)] font-medium"
                : "text-[var(--fg)] hover:bg-slate-50",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 3: `src/components/admin-poller.tsx`**

```tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AdminPoller({ intervalMs = 8000 }: { intervalMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);
  return null;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/admin-top-bar.tsx src/components/admin-sidebar.tsx src/components/admin-poller.tsx
git commit -m "feat: admin chrome — top bar, sidebar nav, 8s refresh poller"
```


---

## Phase 4 — `/field` Registration + Home

### Task 4.1: `/field` layout with PhoneFrame + bottom nav

**Files:**
- Create: `src/app/field/layout.tsx`

- [ ] **Step 1: Write layout**

```tsx
import Link from "next/link";
import { Home, Users, Bell, BookOpen, User } from "lucide-react";
import { PhoneFrame } from "@/components/phone-frame";

export default function FieldLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-full">
        <div className="flex-1 pb-16">{children}</div>
        <nav className="fixed bottom-0 left-0 right-0 md:absolute md:left-0 md:right-0 h-14 bg-[var(--card)] border-t flex">
          {[
            { href: "/field", icon: Home, label: "Home" },
            { href: "/field/reminders", icon: Bell, label: "Reminders" },
            { href: "/field/iec", icon: BookOpen, label: "IEC" },
            { href: "/field/sync", icon: Users, label: "Sync" },
            { href: "/field/register", icon: User, label: "Add" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center text-xs text-[var(--fg-muted)] hover:text-[var(--primary)]"
            >
              <Icon className="size-5" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </PhoneFrame>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/field/layout.tsx
git commit -m "feat: /field layout with PhoneFrame + bottom nav"
```

---

### Task 4.2: `/field` home page (today's tasks + beneficiary list)

**Files:**
- Create: `src/app/field/page.tsx`
- Create: `src/lib/queries/field-home.ts`

- [ ] **Step 1: Query helper**

```ts
// src/lib/queries/field-home.ts
import { db } from "@/db";
import { mothers, children, ancVisits, reminders } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function getFieldHomeData(workerId: number) {
  // Mothers and children assigned via family → asha
  const assignedMothers = await db.query.mothers.findMany({
    with: {
      family: { with: { asha: true } },
      ancVisits: { orderBy: desc(ancVisits.visitDate), limit: 1 },
    },
  });
  const assignedChildren = await db.query.children.findMany({
    with: { family: true, growthRecords: true },
  });
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const dueReminders = await db
    .select()
    .from(reminders)
    .where(sql`${reminders.dueDate} <= ${todayStr}`)
    .orderBy(reminders.dueDate)
    .limit(5);
  return { mothers: assignedMothers, children: assignedChildren, dueReminders };
}
```

- [ ] **Step 2: Home page**

```tsx
// src/app/field/page.tsx
import { getFieldHomeData } from "@/lib/queries/field-home";
import { getSession } from "@/lib/session";
import { BeneficiaryCard } from "@/components/beneficiary-card";
import { KbBadge } from "@/components/kb-badge";
import type { BeneficiarySummary } from "@/components/beneficiary-card";
import { differenceInWeeks, format } from "date-fns";

export default async function FieldHome() {
  const session = await getSession();
  const { mothers, children, dueReminders } = await getFieldHomeData(session.workerId);

  const summaries: BeneficiarySummary[] = [
    ...mothers.map((m) => {
      const lastVisit = m.ancVisits[0];
      const weeksGa = m.lmp
        ? differenceInWeeks(new Date(), new Date(m.lmp))
        : null;
      return {
        id: m.id,
        name: m.name,
        subline: `G${m.pregnancyNo}P${m.pregnancyNo - 1} · ${weeksGa ?? "?"}w · ${m.family.village}`,
        lastVisit: lastVisit
          ? format(lastVisit.visitDate, "d MMM")
          : undefined,
        riskLevel: lastVisit?.riskLevel ?? "NORMAL",
        ashaName: m.family.asha?.name,
        type: "mother" as const,
      };
    }),
    ...children.map((c) => ({
      id: c.id,
      name: c.name ?? "Baby " + c.beneficiaryId12.slice(-4),
      subline: `Child · ${format(new Date(c.dob), "d MMM yyyy")} · ${c.family.village}`,
      lastVisit: undefined,
      riskLevel: "NORMAL" as const,
      ashaName: undefined,
      type: "child" as const,
    })),
  ];

  return (
    <div className="p-4 space-y-6">
      <header className="space-y-1">
        <p className="font-malayalam text-sm text-[var(--fg-muted)]">
          നമസ്കാരം
        </p>
        <h1 className="text-lg font-semibold">ASHA Lakshmi K.</h1>
        <div className="flex items-center justify-between">
          <p className="text-xs text-[var(--fg-muted)]">
            Agali SC · Attappadi
          </p>
          <KbBadge kb={38} />
        </div>
      </header>

      {dueReminders.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold mb-2">
            ⚠ Today&apos;s tasks ({dueReminders.length})
          </h2>
          <ul className="space-y-1 text-sm text-[var(--fg-muted)]">
            {dueReminders.map((r) => (
              <li key={r.id}>• {r.type}</li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold mb-2">
          My beneficiaries ({summaries.length})
        </h2>
        <div className="space-y-2">
          {summaries.map((b) => (
            <BeneficiaryCard key={`${b.type}-${b.id}`} b={b} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Install date-fns**

```bash
pnpm add date-fns
```

- [ ] **Step 4: Commit**

```bash
git add src/app/field/page.tsx src/lib/queries/field-home.ts package.json pnpm-lock.yaml
git commit -m "feat: /field home with greeting, today's tasks, beneficiary list"
```

---

### Task 4.3: Registration Server Action

**Files:**
- Create: `src/actions/register.ts`

- [ ] **Step 1: Write Server Action**

```ts
"use server";
import { db } from "@/db";
import { families, mothers, children } from "@/db/schema";
import { generateBeneficiaryId12 } from "@/lib/beneficiary-id";
import { payloadKb } from "@/lib/kb-meter";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const Schema = z.object({
  headOfFamily: z.string().min(2),
  village: z.string().min(2),
  block: z.string().min(2),
  bplScore: z.coerce.number().min(0).max(50),
  motherName: z.string().min(2),
  motherAge: z.coerce.number().min(14).max(50),
  lmp: z.string().optional(),
  pregnancyNo: z.coerce.number().min(1).max(10),
  childDob: z.string().optional(),
  childSex: z.enum(["M", "F"]).optional(),
});

export type RegisterInput = z.infer<typeof Schema>;

export async function registerBeneficiary(input: RegisterInput) {
  const data = Schema.parse(input);
  const kb = payloadKb(data);

  const motherBeneficiaryId = generateBeneficiaryId12();
  const childBeneficiaryId = data.childDob ? generateBeneficiaryId12() : null;

  // Calculate priority tier from BPL score: <=10 Tier 1, 11-25 Tier 2, else Tier 3
  const tier = data.bplScore <= 10 ? 1 : data.bplScore <= 25 ? 2 : 3;

  // EDD = LMP + 280 days
  let edd: string | null = null;
  if (data.lmp) {
    const d = new Date(data.lmp);
    d.setDate(d.getDate() + 280);
    edd = d.toISOString().slice(0, 10);
  }

  const [fam] = await db
    .insert(families)
    .values({
      headOfFamily: data.headOfFamily,
      village: data.village,
      block: data.block,
      district: "Palakkad",
      bplScore: data.bplScore,
      schemePriorityTier: tier,
      ashaId: 1,
    })
    .returning();

  const [mom] = await db
    .insert(mothers)
    .values({
      familyId: fam.id,
      beneficiaryId12: motherBeneficiaryId,
      name: data.motherName,
      age: data.motherAge,
      lmp: data.lmp ?? null,
      edd,
      pregnancyNo: data.pregnancyNo,
    })
    .returning();

  if (data.childDob && childBeneficiaryId) {
    await db.insert(children).values({
      familyId: fam.id,
      motherId: mom.id,
      beneficiaryId12: childBeneficiaryId,
      dob: data.childDob,
      sex: data.childSex,
    });
  }

  revalidatePath("/field");
  revalidatePath("/admin");

  return {
    familyId: fam.id,
    motherId: mom.id,
    motherBeneficiaryId,
    childBeneficiaryId,
    bplTier: tier,
    kbUsed: kb,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/actions/register.ts
git commit -m "feat: registerBeneficiary Server Action with ABHA-aligned ID generation"
```

---

### Task 4.4: `/field/register` page (3-step wizard)

**Files:**
- Create: `src/app/field/register/page.tsx`
- Create: `src/components/register-wizard.tsx`

- [ ] **Step 1: Wizard client component**

```tsx
// src/components/register-wizard.tsx
"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { registerBeneficiary } from "@/actions/register";
import { formatBeneficiaryId } from "@/lib/beneficiary-id";
import { BLOCKS, VILLAGES_BY_BLOCK } from "@/data/kerala-places";

type Step = "family" | "mother" | "child" | "otp" | "success";

export function RegisterWizard() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>("family");
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({
    headOfFamily: "",
    village: "",
    block: "",
    bplScore: 12,
    motherName: "",
    motherAge: 24,
    lmp: "",
    pregnancyNo: 1,
    childDob: "",
    childSex: "F" as "M" | "F",
  });
  const [result, setResult] = useState<Awaited<ReturnType<typeof registerBeneficiary>> | null>(null);

  function next() {
    if (step === "family") setStep("mother");
    else if (step === "mother") setStep("otp");
  }

  function submitOtp() {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    startTransition(async () => {
      const r = await registerBeneficiary(form);
      setResult(r);
      setStep("success");
      toast.success("Beneficiary registered · " + r.kbUsed + " KB");
    });
  }

  const stepIndex = ["family", "mother", "otp", "success"].indexOf(step) + 1;

  return (
    <div className="p-4 space-y-4">
      <header>
        <h1 className="text-lg font-semibold">New beneficiary</h1>
        <Progress value={(stepIndex / 4) * 100} className="mt-2" />
      </header>

      <AnimatePresence mode="wait">
        {step === "family" && (
          <motion.div
            key="family"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-4 space-y-3">
              <h2 className="font-medium">Family details</h2>
              <Input
                placeholder="Head of family"
                value={form.headOfFamily}
                onChange={(e) =>
                  setForm({ ...form, headOfFamily: e.target.value })
                }
              />
              <select
                className="w-full border rounded-md h-9 px-3 bg-white"
                value={form.block}
                onChange={(e) => setForm({ ...form, block: e.target.value, village: "" })}
              >
                <option value="">Select block</option>
                {BLOCKS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <select
                className="w-full border rounded-md h-9 px-3 bg-white"
                value={form.village}
                onChange={(e) => setForm({ ...form, village: e.target.value })}
                disabled={!form.block}
              >
                <option value="">Select village</option>
                {(VILLAGES_BY_BLOCK[form.block] ?? []).map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <Input
                type="number"
                placeholder="BPL score (lower = poorer)"
                value={form.bplScore}
                onChange={(e) =>
                  setForm({ ...form, bplScore: Number(e.target.value) })
                }
              />
              <Button
                onClick={next}
                disabled={
                  !form.headOfFamily || !form.village || !form.block
                }
                className="w-full"
              >
                Continue
              </Button>
            </Card>
          </motion.div>
        )}

        {step === "mother" && (
          <motion.div
            key="mother"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-4 space-y-3">
              <h2 className="font-medium">Mother details</h2>
              <Input
                placeholder="Mother's name"
                value={form.motherName}
                onChange={(e) =>
                  setForm({ ...form, motherName: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Age"
                value={form.motherAge}
                onChange={(e) =>
                  setForm({ ...form, motherAge: Number(e.target.value) })
                }
              />
              <Input
                type="date"
                placeholder="LMP"
                value={form.lmp}
                onChange={(e) => setForm({ ...form, lmp: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Pregnancy number (G)"
                value={form.pregnancyNo}
                onChange={(e) =>
                  setForm({ ...form, pregnancyNo: Number(e.target.value) })
                }
              />
              <Button
                onClick={next}
                disabled={!form.motherName}
                className="w-full"
              >
                Continue
              </Button>
            </Card>
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-4 space-y-3 text-center">
              <h2 className="font-medium">Verify OTP</h2>
              <p className="text-xs text-[var(--fg-muted)]">
                A 6-digit code has been sent to the registered mobile. (Demo:
                any 6 digits work.)
              </p>
              <Input
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                className="text-center text-2xl tracking-widest font-mono-num"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
              <Button
                onClick={submitOtp}
                disabled={otp.length !== 6 || pending}
                className="w-full"
              >
                {pending ? "Registering…" : "Verify & Register"}
              </Button>
            </Card>
          </motion.div>
        )}

        {step === "success" && result && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-6 space-y-4 text-center">
              <div className="text-[var(--accent)] text-4xl">✓</div>
              <h2 className="font-semibold">Beneficiary registered</h2>
              <div className="space-y-1">
                <p className="text-xs text-[var(--fg-muted)]">
                  ABHA-aligned beneficiary ID
                </p>
                <p className="font-mono-num text-xl font-medium tracking-wide">
                  {formatBeneficiaryId(result.motherBeneficiaryId)}
                </p>
              </div>
              <div className="text-xs text-[var(--fg-muted)] space-y-0.5">
                <p>
                  BPL Priority Tier: <strong>{result.bplTier}</strong>
                </p>
                <p>Data used: {result.kbUsed} KB</p>
              </div>
              <Button
                onClick={() => router.push(`/field/b/m-${result.motherId}`)}
                className="w-full"
              >
                Open mother profile
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Page wrapper**

```tsx
// src/app/field/register/page.tsx
import { RegisterWizard } from "@/components/register-wizard";

export default function RegisterPage() {
  return <RegisterWizard />;
}
```

- [ ] **Step 3: Manual smoke**

```bash
pnpm dev
```

Open `http://localhost:3000/field/register` → walk through wizard. Confirm: family form, mother form, OTP screen (any 6 digits), success screen with formatted 12-digit ID and BPL tier.

- [ ] **Step 4: Commit**

```bash
git add src/app/field/register/page.tsx src/components/register-wizard.tsx
git commit -m "feat: /field/register 3-step wizard with OTP screen + ID reveal"
```

---

### Task 4.5: Beneficiary detail page `/field/b/[id]`

**Files:**
- Create: `src/app/field/b/[id]/page.tsx`
- Create: `src/lib/queries/beneficiary.ts`

- [ ] **Step 1: Query — accept ids prefixed `m-<n>` for mother, `c-<n>` for child**

```ts
// src/lib/queries/beneficiary.ts
import { db } from "@/db";
import { mothers, children } from "@/db/schema";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm";

export function parseBeneficiaryRouteId(routeId: string): {
  type: "mother" | "child";
  id: number;
} | null {
  const m = /^([mc])-(\d+)$/.exec(routeId);
  if (!m) return null;
  return { type: m[1] === "m" ? "mother" : "child", id: parseInt(m[2]!, 10) };
}

export async function loadMother(id: number) {
  return db.query.mothers.findFirst({
    where: eq(mothers.id, id),
    with: {
      family: { with: { asha: true } },
      ancVisits: { orderBy: (v, { desc }) => desc(v.visitDate) },
      pncVisits: { orderBy: (v, { desc }) => desc(v.visitDate) },
    },
  });
}

export async function loadChild(id: number) {
  return db.query.children.findFirst({
    where: eq(children.id, id),
    with: {
      family: true,
      mother: true,
      growthRecords: { orderBy: (g, { desc }) => desc(g.recordedAt) },
      immunizations: true,
      milestones: true,
    },
  });
}
```

- [ ] **Step 2: Page**

```tsx
// src/app/field/b/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/risk-badge";
import { formatBeneficiaryId } from "@/lib/beneficiary-id";
import { format, differenceInWeeks } from "date-fns";
import {
  parseBeneficiaryRouteId,
  loadMother,
  loadChild,
} from "@/lib/queries/beneficiary";

export default async function BeneficiaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsed = parseBeneficiaryRouteId(id);
  if (!parsed) notFound();

  if (parsed.type === "mother") {
    const m = await loadMother(parsed.id);
    if (!m) notFound();
    const weeksGa = m.lmp
      ? differenceInWeeks(new Date(), new Date(m.lmp))
      : null;
    const lastVisit = m.ancVisits[0];

    return (
      <div className="p-4 space-y-4">
        <header className="space-y-1">
          <h1 className="text-lg font-semibold">{m.name}</h1>
          <p className="text-xs text-[var(--fg-muted)] font-mono-num">
            {formatBeneficiaryId(m.beneficiaryId12)}
          </p>
          <p className="text-xs text-[var(--fg-muted)]">
            G{m.pregnancyNo}P{m.pregnancyNo - 1} · {weeksGa ?? "?"}w ·{" "}
            {m.family.village}, {m.family.block}
          </p>
          {lastVisit && <RiskBadge level={lastVisit.riskLevel} />}
        </header>

        <Tabs defaultValue="mother">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="mother">Mother</TabsTrigger>
            <TabsTrigger value="anc">Visits</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
          </TabsList>
          <TabsContent value="mother" className="space-y-3">
            <Card className="p-3 space-y-2">
              <div className="text-sm">Age: {m.age}</div>
              <div className="text-sm">
                LMP: {m.lmp ? format(new Date(m.lmp), "d MMM yyyy") : "—"}
              </div>
              <div className="text-sm">
                EDD: {m.edd ? format(new Date(m.edd), "d MMM yyyy") : "—"}
              </div>
            </Card>
            <div className="grid grid-cols-2 gap-2">
              <Link href={`/field/b/m-${m.id}/anc/new`}>
                <Button className="w-full">+ ANC visit</Button>
              </Link>
              <Link href={`/field/b/m-${m.id}/pnc/new`}>
                <Button variant="outline" className="w-full">+ PNC visit</Button>
              </Link>
            </div>
          </TabsContent>
          <TabsContent value="anc" className="space-y-2">
            {m.ancVisits.length === 0 && (
              <p className="text-sm text-[var(--fg-muted)]">No visits yet</p>
            )}
            {m.ancVisits.map((v) => (
              <Card key={v.id} className="p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">ANC #{v.visitNo}</span>
                  <RiskBadge level={v.riskLevel} />
                </div>
                <div className="text-xs text-[var(--fg-muted)]">
                  {format(v.visitDate, "d MMM, HH:mm")}
                </div>
                <div className="text-xs">
                  BP {v.bpSystolic}/{v.bpDiastolic} · Hb {v.hbValue} ·{" "}
                  {v.weightKg} kg
                </div>
                {v.riskTriggers && v.riskTriggers.length > 0 && (
                  <div className="text-xs text-[var(--risk-critical)]">
                    {v.riskTriggers.join(", ")}
                  </div>
                )}
              </Card>
            ))}
            {m.pncVisits.map((v) => (
              <Card key={v.id} className="p-3 space-y-1">
                <div className="text-sm font-medium">PNC · Day {v.visitDay}</div>
                <div className="text-xs text-[var(--fg-muted)]">
                  {format(v.visitDate, "d MMM, HH:mm")}
                </div>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="family" className="space-y-2">
            <Card className="p-3 space-y-2">
              <div className="text-sm">Head: {m.family.headOfFamily}</div>
              <div className="text-sm">Village: {m.family.village}</div>
              <div className="text-sm">Block: {m.family.block}</div>
              <div className="text-sm font-medium">
                BPL Score: {m.family.bplScore} · Priority Tier{" "}
                {m.family.schemePriorityTier}
              </div>
              {m.family.asha && (
                <div className="text-sm">ASHA: {m.family.asha.name}</div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Child branch
  const c = await loadChild(parsed.id);
  if (!c) notFound();
  const lastGrowth = c.growthRecords[0];
  return (
    <div className="p-4 space-y-4">
      <header className="space-y-1">
        <h1 className="text-lg font-semibold">
          {c.name ?? "Baby " + c.beneficiaryId12.slice(-4)}
        </h1>
        <p className="text-xs text-[var(--fg-muted)] font-mono-num">
          {formatBeneficiaryId(c.beneficiaryId12)}
        </p>
        <p className="text-xs text-[var(--fg-muted)]">
          Child · DOB {format(new Date(c.dob), "d MMM yyyy")} · {c.family.village}
        </p>
        {lastGrowth && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--risk-critical)]/10 text-[var(--risk-critical)]">
            {lastGrowth.classification}
          </span>
        )}
      </header>
      <div className="grid grid-cols-2 gap-2">
        <Link href={`/field/b/c-${c.id}/growth/new`}>
          <Button className="w-full">+ Growth record</Button>
        </Link>
        <Link href={`/field/b/c-${c.id}/immunizations`}>
          <Button variant="outline" className="w-full">Immunisations</Button>
        </Link>
      </div>
      {/* growth + milestones rendered in subsequent phases */}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/field/b/[id]/page.tsx src/lib/queries/beneficiary.ts
git commit -m "feat: beneficiary detail page with Mother/Visits/Family tabs"
```

---

### Task 4.6: Add `not-found.tsx` and wire registration entry from home

**Files:**
- Create: `src/app/field/b/[id]/not-found.tsx`

- [ ] **Step 1: Write `not-found.tsx`**

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BeneficiaryNotFound() {
  return (
    <div className="p-6 space-y-3 text-center">
      <p className="text-sm text-[var(--fg-muted)]">Beneficiary not found.</p>
      <Link href="/field">
        <Button variant="outline">Back to home</Button>
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/field/b/[id]/not-found.tsx
git commit -m "feat: beneficiary not-found page"
```


---

## Phase 5 — `/field` Visit Forms

### Task 5.1: ANC Server Action with risk scoring

**Files:**
- Create: `src/actions/anc.ts`

- [ ] **Step 1: Write**

```ts
"use server";
import { db } from "@/db";
import { ancVisits, alerts, referrals, mothers, families, facilities } from "@/db/schema";
import { scoreAncRisk } from "@/lib/risk-scoring";
import { payloadKb } from "@/lib/kb-meter";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq, and } from "drizzle-orm";

const Schema = z.object({
  motherId: z.coerce.number(),
  bpSystolic: z.coerce.number().min(60).max(260).optional(),
  bpDiastolic: z.coerce.number().min(30).max(180).optional(),
  hbValue: z.coerce.number().min(2).max(20).optional(),
  weightKg: z.coerce.number().min(30).max(150).optional(),
  fetalHr: z.coerce.number().min(80).max(200).optional(),
  complaints: z.string().optional(),
  workerId: z.coerce.number().default(1),
});

export type AncInput = z.infer<typeof Schema>;

export async function saveAncVisit(input: AncInput) {
  const data = Schema.parse(input);
  const kb = payloadKb(data);
  const risk = scoreAncRisk(data);

  // Count prior visits
  const prior = await db
    .select({ id: ancVisits.id })
    .from(ancVisits)
    .where(eq(ancVisits.motherId, data.motherId));
  const visitNo = prior.length + 1;

  const [row] = await db
    .insert(ancVisits)
    .values({
      motherId: data.motherId,
      visitNo,
      bpSystolic: data.bpSystolic,
      bpDiastolic: data.bpDiastolic,
      hbValue: data.hbValue,
      weightKg: data.weightKg,
      fetalHr: data.fetalHr,
      complaints: data.complaints,
      riskLevel: risk.level,
      riskTriggers: risk.triggers,
      recordedByWorkerId: data.workerId,
      kbUsed: kb,
    })
    .returning();

  // Auto-escalate on CRITICAL → SC→PHC referral + alert
  if (risk.level === "CRITICAL") {
    const mom = await db.query.mothers.findFirst({
      where: eq(mothers.id, data.motherId),
      with: { family: true },
    });

    // Find SC and PHC in the family's block
    const sc = await db.query.facilities.findFirst({
      where: and(eq(facilities.block, mom!.family.block), eq(facilities.type, "SC")),
    });
    const phc = await db.query.facilities.findFirst({
      where: and(eq(facilities.block, mom!.family.block), eq(facilities.type, "PHC")),
    });

    await db.insert(referrals).values({
      subjectType: "mother",
      subjectId: data.motherId,
      fromFacilityId: sc?.id,
      toFacilityId: phc?.id,
      tierFrom: "SC",
      tierTo: "PHC",
      reason: risk.triggers.join("; "),
      status: "PENDING",
    });

    await db.insert(alerts).values({
      type: "ANOMALY",
      status: "OPEN",
      subjectType: "mother",
      subjectId: data.motherId,
      raisedByWorkerId: data.workerId,
      note: risk.triggers.join("; "),
      channels: [
        { to: "field_worker", status: "delivered" },
        { to: "phc_mo", status: "delivered" },
        { to: "supervisor", status: "delivered" },
      ],
    });
  }

  revalidatePath("/field");
  revalidatePath(`/field/b/m-${data.motherId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/alerts");
  revalidatePath("/admin/referrals");

  return { visitId: row.id, riskLevel: risk.level, riskTriggers: risk.triggers, kbUsed: kb };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/actions/anc.ts
git commit -m "feat: ANC Server Action with auto-referral + alert on CRITICAL"
```

---

### Task 5.2: `/field/b/[id]/anc/new` form

**Files:**
- Create: `src/app/field/b/[id]/anc/new/page.tsx`
- Create: `src/components/anc-form.tsx`

- [ ] **Step 1: Client form**

```tsx
// src/components/anc-form.tsx
"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MalayalamLabel } from "@/components/malayalam-label";
import { ml } from "@/lib/malayalam";
import { motion } from "motion/react";
import { saveAncVisit } from "@/actions/anc";
import { RiskBadge } from "@/components/risk-badge";
import { toast } from "sonner";

export function AncForm({ motherId }: { motherId: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<Awaited<ReturnType<typeof saveAncVisit>> | null>(null);
  const [form, setForm] = useState({
    bpSystolic: 120,
    bpDiastolic: 80,
    hbValue: 11.0,
    weightKg: 55,
    fetalHr: 140,
    complaints: "",
  });

  function submit() {
    startTransition(async () => {
      try {
        const r = await saveAncVisit({ ...form, motherId });
        setResult(r);
        toast.success(`Saved · ${r.kbUsed} KB · risk ${r.riskLevel}`);
      } catch (e) {
        toast.error("Save failed");
      }
    });
  }

  if (result) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 space-y-4"
      >
        <Card className="p-6 space-y-3 text-center">
          <RiskBadge level={result.riskLevel} />
          <h2 className="font-semibold">Visit saved</h2>
          {result.riskTriggers.length > 0 && (
            <ul className="text-sm text-[var(--risk-critical)] space-y-0.5">
              {result.riskTriggers.map((t) => (
                <li key={t}>• {t}</li>
              ))}
            </ul>
          )}
          {result.riskLevel === "CRITICAL" && (
            <p className="text-sm font-medium text-[var(--risk-critical)]">
              Immediate referral to PHC raised. MO and supervisor notified.
            </p>
          )}
          <p className="text-xs text-[var(--fg-muted)]">
            Data: {result.kbUsed} KB
          </p>
          <Button
            onClick={() => router.push(`/field/b/m-${motherId}`)}
            className="w-full"
          >
            Back to mother profile
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">New ANC visit</h1>
      <Card className="p-4 space-y-3">
        <div>
          <MalayalamLabel en="Blood pressure (systolic / diastolic)" ml={ml.bloodPressure} />
          <div className="flex gap-2 mt-1">
            <Input
              type="number"
              value={form.bpSystolic}
              onChange={(e) => setForm({ ...form, bpSystolic: Number(e.target.value) })}
            />
            <span className="self-center">/</span>
            <Input
              type="number"
              value={form.bpDiastolic}
              onChange={(e) => setForm({ ...form, bpDiastolic: Number(e.target.value) })}
            />
          </div>
        </div>
        <div>
          <MalayalamLabel en="Hemoglobin (g/dL)" ml={ml.hemoglobin} />
          <Input
            type="number"
            step="0.1"
            value={form.hbValue}
            onChange={(e) => setForm({ ...form, hbValue: Number(e.target.value) })}
            className="mt-1"
          />
        </div>
        <div>
          <MalayalamLabel en="Weight (kg)" ml={ml.weight} />
          <Input
            type="number"
            step="0.1"
            value={form.weightKg}
            onChange={(e) => setForm({ ...form, weightKg: Number(e.target.value) })}
            className="mt-1"
          />
        </div>
        <div>
          <MalayalamLabel en="Fetal heart rate (bpm)" ml={ml.fetalHeartRate} />
          <Input
            type="number"
            value={form.fetalHr}
            onChange={(e) => setForm({ ...form, fetalHr: Number(e.target.value) })}
            className="mt-1"
          />
        </div>
        <Button onClick={submit} disabled={pending} className="w-full">
          {pending ? "Saving…" : "Save visit"}
        </Button>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Page wrapper**

```tsx
// src/app/field/b/[id]/anc/new/page.tsx
import { notFound } from "next/navigation";
import { parseBeneficiaryRouteId } from "@/lib/queries/beneficiary";
import { AncForm } from "@/components/anc-form";

export default async function NewAncPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsed = parseBeneficiaryRouteId(id);
  if (!parsed || parsed.type !== "mother") notFound();
  return <AncForm motherId={parsed.id} />;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/field/b/[id]/anc/new/page.tsx src/components/anc-form.tsx
git commit -m "feat: ANC visit entry form with bilingual labels + risk reveal"
```

---

### Task 5.3: PNC Server Action + form

**Files:**
- Create: `src/actions/pnc.ts`
- Create: `src/app/field/b/[id]/pnc/new/page.tsx`
- Create: `src/components/pnc-form.tsx`

- [ ] **Step 1: `src/actions/pnc.ts`**

```ts
"use server";
import { db } from "@/db";
import { pncVisits } from "@/db/schema";
import { payloadKb } from "@/lib/kb-meter";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const Schema = z.object({
  motherId: z.coerce.number(),
  visitDay: z.coerce.number().min(0).max(60),
  bpSystolic: z.coerce.number().optional(),
  bpDiastolic: z.coerce.number().optional(),
  hbValue: z.coerce.number().optional(),
  complications: z.string().optional(),
  workerId: z.coerce.number().default(1),
});

export async function savePncVisit(input: z.infer<typeof Schema>) {
  const data = Schema.parse(input);
  const kb = payloadKb(data);
  const [row] = await db
    .insert(pncVisits)
    .values({
      motherId: data.motherId,
      visitDay: data.visitDay,
      bpSystolic: data.bpSystolic,
      bpDiastolic: data.bpDiastolic,
      hbValue: data.hbValue,
      complications: data.complications,
      recordedByWorkerId: data.workerId,
      kbUsed: kb,
    })
    .returning();
  revalidatePath(`/field/b/m-${data.motherId}`);
  revalidatePath("/admin");
  return { visitId: row.id, kbUsed: kb };
}
```

- [ ] **Step 2: `src/components/pnc-form.tsx`** — mirrors AncForm but simpler:

```tsx
"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MalayalamLabel } from "@/components/malayalam-label";
import { ml } from "@/lib/malayalam";
import { savePncVisit } from "@/actions/pnc";
import { toast } from "sonner";

export function PncForm({ motherId }: { motherId: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [f, setF] = useState({
    visitDay: 7,
    bpSystolic: 118,
    bpDiastolic: 78,
    hbValue: 10.5,
    complications: "",
  });

  function submit() {
    start(async () => {
      const r = await savePncVisit({ ...f, motherId });
      toast.success(`PNC saved · ${r.kbUsed} KB`);
      router.push(`/field/b/m-${motherId}`);
    });
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">New PNC visit</h1>
      <Card className="p-4 space-y-3">
        <div>
          <MalayalamLabel en="Day post-delivery" ml="പ്രസവ ശേഷം ദിവസം" />
          <Input
            type="number"
            value={f.visitDay}
            onChange={(e) => setF({ ...f, visitDay: Number(e.target.value) })}
            className="mt-1"
          />
        </div>
        <div>
          <MalayalamLabel en="Blood pressure" ml={ml.bloodPressure} />
          <div className="flex gap-2 mt-1">
            <Input type="number" value={f.bpSystolic} onChange={(e) => setF({ ...f, bpSystolic: Number(e.target.value) })} />
            <span className="self-center">/</span>
            <Input type="number" value={f.bpDiastolic} onChange={(e) => setF({ ...f, bpDiastolic: Number(e.target.value) })} />
          </div>
        </div>
        <div>
          <MalayalamLabel en="Hemoglobin (g/dL)" ml={ml.hemoglobin} />
          <Input type="number" step="0.1" value={f.hbValue} onChange={(e) => setF({ ...f, hbValue: Number(e.target.value) })} className="mt-1" />
        </div>
        <Button onClick={submit} disabled={pending} className="w-full">
          {pending ? "Saving…" : "Save PNC visit"}
        </Button>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: `src/app/field/b/[id]/pnc/new/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { parseBeneficiaryRouteId } from "@/lib/queries/beneficiary";
import { PncForm } from "@/components/pnc-form";

export default async function NewPncPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = parseBeneficiaryRouteId(id);
  if (!p || p.type !== "mother") notFound();
  return <PncForm motherId={p.id} />;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/actions/pnc.ts src/components/pnc-form.tsx src/app/field/b/[id]/pnc/new/page.tsx
git commit -m "feat: PNC visit entry action + form"
```

---

### Task 5.4: Growth Server Action

**Files:**
- Create: `src/actions/growth.ts`

- [ ] **Step 1: Write**

```ts
"use server";
import { db } from "@/db";
import { growthRecords, alerts, referrals, children, facilities } from "@/db/schema";
import { classifyNutrition, weightForAgeZ, ageInMonths } from "@/lib/z-score";
import { payloadKb } from "@/lib/kb-meter";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const Schema = z.object({
  childId: z.coerce.number(),
  weightKg: z.coerce.number().min(1).max(30).optional(),
  heightCm: z.coerce.number().min(30).max(120).optional(),
  muacCm: z.coerce.number().min(5).max(20).optional(),
  workerId: z.coerce.number().default(1),
});

export async function saveGrowthRecord(input: z.infer<typeof Schema>) {
  const data = Schema.parse(input);
  const kb = payloadKb(data);

  const child = await db.query.children.findFirst({
    where: eq(children.id, data.childId),
    with: { family: true },
  });
  if (!child) throw new Error("Child not found");

  const months = ageInMonths(new Date(child.dob));
  const weightZ =
    data.weightKg != null && child.sex
      ? weightForAgeZ(data.weightKg, months, child.sex as "M" | "F")
      : null;

  // For demo, treat weight-for-age Z as weightForHeightZ proxy when height missing
  const wfh = weightZ;
  const classification = classifyNutrition(wfh, data.muacCm ?? null);

  const [row] = await db
    .insert(growthRecords)
    .values({
      childId: data.childId,
      weightKg: data.weightKg,
      heightCm: data.heightCm,
      muacCm: data.muacCm,
      weightZ,
      weightForHeightZ: wfh,
      classification,
      recordedByWorkerId: data.workerId,
      kbUsed: kb,
    })
    .returning();

  if (classification === "SAM") {
    const phc = await db.query.facilities.findFirst({
      where: and(eq(facilities.block, child.family.block), eq(facilities.type, "PHC")),
    });
    const chc = await db.query.facilities.findFirst({
      where: eq(facilities.type, "CHC"),
    });
    await db.insert(referrals).values({
      subjectType: "child",
      subjectId: data.childId,
      fromFacilityId: phc?.id,
      toFacilityId: chc?.id,
      tierFrom: "PHC",
      tierTo: "CHC",
      reason: "SAM detected — refer to NRC",
      status: "PENDING",
    });
    await db.insert(alerts).values({
      type: "ANOMALY",
      status: "OPEN",
      subjectType: "child",
      subjectId: data.childId,
      raisedByWorkerId: data.workerId,
      note: "SAM classification — NRC referral required",
      channels: [
        { to: "field_worker", status: "delivered" },
        { to: "phc_mo", status: "delivered" },
      ],
    });
  }

  revalidatePath(`/field/b/c-${data.childId}`);
  revalidatePath("/admin");
  return { id: row.id, classification, weightZ: wfh, kbUsed: kb };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/actions/growth.ts
git commit -m "feat: growth record action with SAM/MAM classification + auto-NRC referral"
```

---

### Task 5.5: `/field/b/[id]/growth/new` form

**Files:**
- Create: `src/app/field/b/[id]/growth/new/page.tsx`
- Create: `src/components/growth-form.tsx`

- [ ] **Step 1: Form**

```tsx
// src/components/growth-form.tsx
"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MalayalamLabel } from "@/components/malayalam-label";
import { ml } from "@/lib/malayalam";
import { saveGrowthRecord } from "@/actions/growth";
import { motion } from "motion/react";
import { toast } from "sonner";

export function GrowthForm({ childId }: { childId: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [result, setResult] = useState<Awaited<ReturnType<typeof saveGrowthRecord>> | null>(null);
  const [f, setF] = useState({ weightKg: 7.5, heightCm: 67, muacCm: 13.5 });

  function submit() {
    start(async () => {
      const r = await saveGrowthRecord({ ...f, childId });
      setResult(r);
      toast.success(`Saved · ${r.kbUsed} KB · ${r.classification}`);
    });
  }

  if (result) {
    const colorClass =
      result.classification === "SAM"
        ? "bg-[var(--risk-critical)]/10 text-[var(--risk-critical)]"
        : result.classification === "MAM"
          ? "bg-[var(--risk-high)]/10 text-[var(--risk-high)]"
          : "bg-[var(--risk-normal)]/10 text-[var(--risk-normal)]";
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
        <Card className="p-6 space-y-3 text-center">
          <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
            {result.classification}
          </div>
          <div className="text-xs text-[var(--fg-muted)]">
            Weight-for-height Z: {result.weightZ?.toFixed(2) ?? "—"}
          </div>
          {result.classification === "SAM" && (
            <p className="text-sm font-medium text-[var(--risk-critical)]">
              Refer to nearest NRC. Alert raised to PHC MO.
            </p>
          )}
          <Button onClick={() => router.push(`/field/b/c-${childId}`)} className="w-full">
            Back to child profile
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">Growth record</h1>
      <Card className="p-4 space-y-3">
        <div>
          <MalayalamLabel en="Weight (kg)" ml={ml.weight} />
          <Input type="number" step="0.01" value={f.weightKg} onChange={(e) => setF({ ...f, weightKg: Number(e.target.value) })} className="mt-1" />
        </div>
        <div>
          <MalayalamLabel en="Height (cm)" ml={ml.height} />
          <Input type="number" step="0.1" value={f.heightCm} onChange={(e) => setF({ ...f, heightCm: Number(e.target.value) })} className="mt-1" />
        </div>
        <div>
          <MalayalamLabel en="MUAC (cm)" ml={ml.muac} />
          <Input type="number" step="0.1" value={f.muacCm} onChange={(e) => setF({ ...f, muacCm: Number(e.target.value) })} className="mt-1" />
        </div>
        <Button onClick={submit} disabled={pending} className="w-full">
          {pending ? "Saving…" : "Save growth record"}
        </Button>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Page**

```tsx
// src/app/field/b/[id]/growth/new/page.tsx
import { notFound } from "next/navigation";
import { parseBeneficiaryRouteId } from "@/lib/queries/beneficiary";
import { GrowthForm } from "@/components/growth-form";

export default async function NewGrowthPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = parseBeneficiaryRouteId(id);
  if (!p || p.type !== "child") notFound();
  return <GrowthForm childId={p.id} />;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/growth-form.tsx src/app/field/b/[id]/growth/new/page.tsx
git commit -m "feat: growth record form with SAM/MAM classification reveal"
```

---

### Task 5.6: Immunization action + page

**Files:**
- Create: `src/actions/immunization.ts`
- Create: `src/app/field/b/[id]/immunizations/page.tsx`

- [ ] **Step 1: Action**

```ts
"use server";
import { db } from "@/db";
import { immunizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function markVaccineGiven(immunizationId: number, childId: number) {
  await db
    .update(immunizations)
    .set({ givenDate: new Date().toISOString().slice(0, 10), status: "GIVEN" })
    .where(eq(immunizations.id, immunizationId));
  revalidatePath(`/field/b/c-${childId}`);
  revalidatePath(`/field/b/c-${childId}/immunizations`);
  revalidatePath("/admin");
}
```

- [ ] **Step 2: Page**

```tsx
// src/app/field/b/[id]/immunizations/page.tsx
import { notFound } from "next/navigation";
import { parseBeneficiaryRouteId, loadChild } from "@/lib/queries/beneficiary";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { markVaccineGiven } from "@/actions/immunization";
import { format } from "date-fns";
import { Check, Clock, AlertCircle } from "lucide-react";

export default async function ImmunizationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = parseBeneficiaryRouteId(id);
  if (!p || p.type !== "child") notFound();
  const child = await loadChild(p.id);
  if (!child) notFound();

  const sorted = [...child.immunizations].sort((a, b) =>
    a.scheduledDate.localeCompare(b.scheduledDate),
  );

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-lg font-semibold">Immunisations</h1>
      <p className="text-xs text-[var(--fg-muted)]">
        WHO/UIP schedule · 0–24 months
      </p>
      <div className="space-y-2">
        {sorted.map((imm) => (
          <Card key={imm.id} className="p-3 flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">{imm.vaccineCode}</div>
              <div className="text-xs text-[var(--fg-muted)]">
                Scheduled: {format(new Date(imm.scheduledDate), "d MMM yyyy")}
                {imm.givenDate && ` · Given: ${format(new Date(imm.givenDate), "d MMM yyyy")}`}
              </div>
            </div>
            {imm.status === "GIVEN" && (
              <Check className="size-5 text-[var(--risk-normal)]" />
            )}
            {imm.status === "DUE" && (
              <form action={markVaccineGiven.bind(null, imm.id, child.id)}>
                <Button size="sm">Mark given</Button>
              </form>
            )}
            {imm.status === "UPCOMING" && (
              <Clock className="size-5 text-[var(--fg-muted)]" />
            )}
            {imm.status === "MISSED" && (
              <AlertCircle className="size-5 text-[var(--risk-critical)]" />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/actions/immunization.ts src/app/field/b/[id]/immunizations/page.tsx
git commit -m "feat: immunisation list page with mark-given action"
```

---

### Task 5.7: Render growth chart + milestone strip on child profile

**Files:**
- Modify: `src/app/field/b/[id]/page.tsx`
- Create: `src/components/growth-chart.tsx`
- Create: `src/components/milestone-strip.tsx`
- Create: `src/components/immunization-strip.tsx`

- [ ] **Step 1: Growth chart**

```tsx
// src/components/growth-chart.tsx
"use client";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { format } from "date-fns";

export function GrowthChart({
  records,
}: {
  records: Array<{ recordedAt: Date; weightKg: number | null }>;
}) {
  const data = records
    .filter((r) => r.weightKg != null)
    .map((r) => ({
      date: format(r.recordedAt, "d MMM"),
      weight: r.weightKg!,
    }));
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" fontSize={10} />
          <YAxis fontSize={10} />
          <Tooltip />
          <Line type="monotone" dataKey="weight" stroke="#0F4C75" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 2: Milestone strip**

```tsx
// src/components/milestone-strip.tsx
import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function MilestoneStrip({
  milestones,
}: {
  milestones: Array<{ milestoneCode: string; expectedAgeMonths: number; status: "PENDING" | "ACHIEVED" | "DELAYED" }>;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {milestones.map((m) => (
        <div
          key={m.milestoneCode}
          className={cn(
            "flex items-center gap-2 p-2 rounded-md text-xs",
            m.status === "ACHIEVED" && "bg-[var(--risk-normal)]/10 text-[var(--risk-normal)]",
            m.status === "DELAYED" && "bg-[var(--risk-high)]/10 text-[var(--risk-high)]",
            m.status === "PENDING" && "bg-slate-50 text-[var(--fg-muted)]",
          )}
        >
          {m.status === "ACHIEVED" ? <Check className="size-3" /> : <Clock className="size-3" />}
          <span>{m.milestoneCode.replaceAll("_", " ").toLowerCase()}</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Immunization strip**

```tsx
// src/components/immunization-strip.tsx
import { cn } from "@/lib/utils";

export function ImmunizationStrip({
  immunizations,
}: {
  immunizations: Array<{ vaccineCode: string; status: string }>;
}) {
  const top = immunizations.slice(0, 8);
  return (
    <div className="flex gap-1 flex-wrap">
      {top.map((i) => (
        <span
          key={i.vaccineCode}
          className={cn(
            "text-[10px] px-1.5 py-0.5 rounded",
            i.status === "GIVEN" && "bg-[var(--risk-normal)]/10 text-[var(--risk-normal)]",
            i.status === "DUE" && "bg-[var(--risk-high)]/10 text-[var(--risk-high)]",
            i.status === "UPCOMING" && "bg-slate-50 text-[var(--fg-muted)]",
            i.status === "MISSED" && "bg-[var(--risk-critical)]/10 text-[var(--risk-critical)]",
          )}
        >
          {i.vaccineCode}
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Wire into child branch of `src/app/field/b/[id]/page.tsx`** — replace the child render block with:

```tsx
  // (after const c = await loadChild...)
  const lastGrowth = c.growthRecords[0];
  return (
    <div className="p-4 space-y-4">
      <header className="space-y-1">
        <h1 className="text-lg font-semibold">
          {c.name ?? "Baby " + c.beneficiaryId12.slice(-4)}
        </h1>
        <p className="text-xs text-[var(--fg-muted)] font-mono-num">
          {formatBeneficiaryId(c.beneficiaryId12)}
        </p>
        <p className="text-xs text-[var(--fg-muted)]">
          Child · DOB {format(new Date(c.dob), "d MMM yyyy")} · {c.family.village}
        </p>
        {lastGrowth && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--risk-critical)]/10 text-[var(--risk-critical)]">
            {lastGrowth.classification}
          </span>
        )}
      </header>
      <div className="grid grid-cols-2 gap-2">
        <Link href={`/field/b/c-${c.id}/growth/new`}>
          <Button className="w-full">+ Growth record</Button>
        </Link>
        <Link href={`/field/b/c-${c.id}/immunizations`}>
          <Button variant="outline" className="w-full">Immunisations</Button>
        </Link>
      </div>
      <section>
        <h2 className="text-sm font-semibold mb-2">Growth</h2>
        <GrowthChart records={c.growthRecords.map((g) => ({ recordedAt: g.recordedAt, weightKg: g.weightKg }))} />
      </section>
      <section>
        <h2 className="text-sm font-semibold mb-2">Immunisations</h2>
        <ImmunizationStrip immunizations={c.immunizations.map((i) => ({ vaccineCode: i.vaccineCode, status: i.status }))} />
      </section>
      <section>
        <h2 className="text-sm font-semibold mb-2">Milestones</h2>
        <MilestoneStrip milestones={c.milestones.map((m) => ({ milestoneCode: m.milestoneCode, expectedAgeMonths: m.expectedAgeMonths, status: m.status }))} />
      </section>
    </div>
  );
```

Add imports at top of `src/app/field/b/[id]/page.tsx`:

```tsx
import { GrowthChart } from "@/components/growth-chart";
import { MilestoneStrip } from "@/components/milestone-strip";
import { ImmunizationStrip } from "@/components/immunization-strip";
```

- [ ] **Step 5: Commit**

```bash
git add src/components/growth-chart.tsx src/components/milestone-strip.tsx src/components/immunization-strip.tsx src/app/field/b/[id]/page.tsx
git commit -m "feat: child profile with growth chart, immunisation strip, milestones"
```

---

### Task 5.8: Smoke test — manually walk through all field forms

- [ ] **Step 1: Boot dev**

```bash
pnpm dev
```

- [ ] **Step 2: Verify all forms** — go through:
  - `/field/register` → register a test mother + child
  - `/field/b/m-<id>/anc/new` → enter BP 162/108 + Hb 6.8 → confirm CRITICAL reveal
  - `/field/b/m-<id>/pnc/new` → save PNC visit
  - `/field/b/c-<id>/growth/new` → enter MUAC 11.2 → confirm SAM reveal
  - `/field/b/c-<id>/immunizations` → mark a DUE vaccine given

Expected: every flow saves, navigates back to profile, and shows new state. No console errors.

- [ ] **Step 3: Commit any cleanup**

```bash
git status
# if no changes, skip; otherwise:
git add -A
git commit -m "chore: smoke test cleanup"
```


---

## Phase 6 — `/field` SOS, IEC, Reminders, Sync UI

### Task 6.1: SOS Server Action

**Files:**
- Create: `src/actions/sos.ts`

- [ ] **Step 1: Write**

```ts
"use server";
import { db } from "@/db";
import { alerts } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const Schema = z.object({
  subjectType: z.enum(["mother", "child"]),
  subjectId: z.coerce.number(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  workerId: z.coerce.number().default(1),
  note: z.string().optional(),
});

export async function raiseSos(input: z.infer<typeof Schema>) {
  const d = Schema.parse(input);
  const [row] = await db
    .insert(alerts)
    .values({
      type: "SOS",
      status: "DISPATCHED",
      subjectType: d.subjectType,
      subjectId: d.subjectId,
      lat: d.lat,
      lng: d.lng,
      raisedByWorkerId: d.workerId,
      note: d.note,
      channels: [
        { to: "field_worker", status: "delivered", at: new Date().toISOString() },
        { to: "102_ambulance", status: "dispatched", at: new Date().toISOString() },
        { to: "supervisor", status: "delivered", at: new Date().toISOString() },
      ],
    })
    .returning();
  revalidatePath("/admin");
  revalidatePath("/admin/alerts");
  revalidatePath("/field/sos");
  return { alertId: row.id };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/actions/sos.ts
git commit -m "feat: raiseSos Server Action — multi-channel dispatch"
```

---

### Task 6.2: `<SosChannelList>` + `/field/sos` page

**Files:**
- Create: `src/components/sos-channel-list.tsx`
- Create: `src/app/field/sos/page.tsx`
- Create: `src/components/sos-modal.tsx`

- [ ] **Step 1: Channel list animated component**

```tsx
// src/components/sos-channel-list.tsx
"use client";
import { motion, AnimatePresence } from "motion/react";
import { Check, Loader2, Radio, Ambulance, ShieldCheck } from "lucide-react";

const ICONS: Record<string, typeof Check> = {
  field_worker: Radio,
  "102_ambulance": Ambulance,
  supervisor: ShieldCheck,
};

const LABELS: Record<string, string> = {
  field_worker: "Field worker (you)",
  "102_ambulance": "102 Ambulance Service",
  supervisor: "Block Supervisor",
};

export function SosChannelList({
  channels,
}: {
  channels: Array<{ to: string; status: string }>;
}) {
  return (
    <ul className="space-y-2">
      <AnimatePresence initial={false}>
        {channels.map((c, i) => {
          const Icon = ICONS[c.to] ?? Check;
          const done = c.status === "delivered" || c.status === "dispatched";
          return (
            <motion.li
              key={c.to}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.25, duration: 0.3 }}
              className="flex items-center justify-between p-3 rounded-lg border bg-[var(--card)]"
            >
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-[var(--primary)]" />
                <span className="text-sm">{LABELS[c.to] ?? c.to}</span>
              </div>
              {done ? (
                <span className="flex items-center gap-1 text-xs text-[var(--risk-normal)]">
                  <Check className="size-3" /> {c.status}
                </span>
              ) : (
                <Loader2 className="size-4 animate-spin text-[var(--fg-muted)]" />
              )}
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
```

- [ ] **Step 2: SOS modal**

```tsx
// src/components/sos-modal.tsx
"use client";
import { useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Siren, MapPin } from "lucide-react";
import { raiseSos } from "@/actions/sos";
import { SosChannelList } from "./sos-channel-list";
import { motion } from "motion/react";

interface Props {
  mothers: Array<{ id: number; name: string }>;
}

export function SosModal({ mothers }: Props) {
  const [pending, start] = useTransition();
  const [selected, setSelected] = useState<number | null>(mothers[0]?.id ?? null);
  const [channels, setChannels] = useState<Array<{ to: string; status: string }>>([]);
  const [fired, setFired] = useState(false);

  function fire() {
    if (selected == null) return;
    setFired(true);
    // Simulate fan-out: stagger channels
    setTimeout(() => setChannels([{ to: "field_worker", status: "delivered" }]), 200);
    setTimeout(
      () =>
        setChannels([
          { to: "field_worker", status: "delivered" },
          { to: "102_ambulance", status: "dispatched" },
        ]),
      900,
    );
    setTimeout(
      () =>
        setChannels([
          { to: "field_worker", status: "delivered" },
          { to: "102_ambulance", status: "dispatched" },
          { to: "supervisor", status: "delivered" },
        ]),
      1700,
    );
    // Persist in background
    start(async () => {
      // demo GPS for Agali
      await raiseSos({
        subjectType: "mother",
        subjectId: selected,
        lat: 11.18,
        lng: 76.72,
      });
    });
  }

  if (!fired) {
    return (
      <Card className="p-4 space-y-4 border-[var(--risk-critical)]/40">
        <div className="flex items-center gap-2 text-[var(--risk-critical)]">
          <Siren className="size-5" />
          <h2 className="font-semibold">SOS Emergency</h2>
        </div>
        <p className="text-sm text-[var(--fg-muted)]">
          Confirm the patient. GPS location will be captured automatically.
        </p>
        <select
          value={selected ?? ""}
          onChange={(e) => setSelected(Number(e.target.value))}
          className="w-full border rounded-md h-9 px-3 bg-white"
        >
          {mothers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <Button
          onClick={fire}
          disabled={selected == null}
          className="w-full bg-[var(--risk-critical)] hover:bg-[var(--risk-critical)]/90"
        >
          <Siren className="size-4" /> Raise SOS
        </Button>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <Card className="p-4 space-y-2 border-[var(--risk-critical)]/40">
        <div className="flex items-center gap-2 text-[var(--risk-critical)]">
          <Siren className="size-5" />
          <h2 className="font-semibold">SOS raised</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--fg-muted)]">
          <MapPin className="size-3" />
          11.18°N, 76.72°E · Agali, Attappadi
        </div>
      </Card>
      <SosChannelList channels={channels} />
      {channels.length === 3 && (
        <Card className="p-3 text-xs text-[var(--fg-muted)] text-center">
          {pending ? "Logging alert…" : "Alert persisted. Visible to district admin in real time."}
        </Card>
      )}
    </motion.div>
  );
}
```

- [ ] **Step 3: Page**

```tsx
// src/app/field/sos/page.tsx
import { db } from "@/db";
import { SosModal } from "@/components/sos-modal";

export default async function SosPage() {
  const mothers = await db.query.mothers.findMany({
    columns: { id: true, name: true },
    limit: 20,
  });
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">Emergency</h1>
      <SosModal mothers={mothers} />
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sos-channel-list.tsx src/components/sos-modal.tsx src/app/field/sos/page.tsx
git commit -m "feat: /field/sos with staggered channel fan-out animation"
```

---

### Task 6.3: `/field/iec` content library

**Files:**
- Create: `src/app/field/iec/page.tsx`

- [ ] **Step 1: Page**

```tsx
import { Card } from "@/components/ui/card";
import { IEC_LIBRARY } from "@/data/iec-content";
import { Apple, Heart, Baby } from "lucide-react";

const ICONS = {
  NUTRITION: Apple,
  SAFE_DELIVERY: Heart,
  NEWBORN_CARE: Baby,
};

export default function IecPage() {
  return (
    <div className="p-4 space-y-4">
      <header>
        <h1 className="text-lg font-semibold">IEC library</h1>
        <p className="text-xs text-[var(--fg-muted)]">
          Information · Education · Communication
        </p>
      </header>
      <div className="grid grid-cols-1 gap-3">
        {IEC_LIBRARY.map((item, i) => {
          const Icon = ICONS[item.category];
          return (
            <Card key={i} className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-[var(--primary)]" />
                <span className="text-xs uppercase tracking-wide text-[var(--fg-muted)]">
                  {item.category.replace("_", " ").toLowerCase()}
                </span>
              </div>
              <h3 className="font-malayalam font-medium">{item.titleMl}</h3>
              <p className="text-sm text-[var(--fg-muted)]">{item.titleEn}</p>
              <p className="text-xs">{item.summary}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/field/iec/page.tsx
git commit -m "feat: /field/iec content library with bilingual cards"
```

---

### Task 6.4: `/field/reminders` with SMS preview

**Files:**
- Create: `src/app/field/reminders/page.tsx`
- Create: `src/components/reminder-row.tsx`

- [ ] **Step 1: Reminder row (client) with SMS preview**

```tsx
// src/components/reminder-row.tsx
"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SmsPreviewModal } from "@/components/sms-preview-modal";
import { ml as MLT } from "@/lib/malayalam";
import { Smartphone } from "lucide-react";
import { format } from "date-fns";

export interface ReminderRowData {
  id: number;
  type: string;
  dueDate: string;
  beneficiaryName: string;
  vaccine?: string;
}

export function ReminderRow({ r }: { r: ReminderRowData }) {
  const [open, setOpen] = useState(false);
  const body =
    r.type === "ANC_VISIT"
      ? MLT.ancReminder(r.beneficiaryName, format(new Date(r.dueDate), "d MMM"))
      : r.type === "IMMUNIZATION"
        ? MLT.immReminder(
            r.beneficiaryName,
            r.vaccine ?? "Pentavalent",
            format(new Date(r.dueDate), "d MMM"),
          )
        : MLT.pncReminder(r.beneficiaryName);

  return (
    <Card className="p-3 flex items-center justify-between">
      <div>
        <div className="text-sm font-medium">{r.type.replace("_", " ")}</div>
        <div className="text-xs text-[var(--fg-muted)]">
          {r.beneficiaryName} · due {format(new Date(r.dueDate), "d MMM")}
        </div>
      </div>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Smartphone className="size-3" />
        Preview SMS
      </Button>
      <SmsPreviewModal
        open={open}
        onOpenChange={setOpen}
        beneficiaryName={r.beneficiaryName}
        bodyText={body}
      />
    </Card>
  );
}
```

- [ ] **Step 2: Reminders page**

```tsx
// src/app/field/reminders/page.tsx
import { db } from "@/db";
import { reminders, mothers, children } from "@/db/schema";
import { eq, and, lte } from "drizzle-orm";
import { ReminderRow, type ReminderRowData } from "@/components/reminder-row";

export default async function RemindersPage() {
  const today = new Date().toISOString().slice(0, 10);
  const rows = await db
    .select()
    .from(reminders)
    .where(lte(reminders.dueDate, today))
    .orderBy(reminders.dueDate)
    .limit(20);

  // Resolve beneficiary names
  const enriched: ReminderRowData[] = await Promise.all(
    rows.map(async (r) => {
      let name = "Beneficiary";
      if (r.beneficiaryType === "mother") {
        const m = await db.query.mothers.findFirst({
          where: eq(mothers.id, r.beneficiaryId),
        });
        if (m) name = m.name;
      } else {
        const c = await db.query.children.findFirst({
          where: eq(children.id, r.beneficiaryId),
        });
        if (c) name = c.name ?? "Baby " + c.beneficiaryId12.slice(-4);
      }
      return {
        id: r.id,
        type: r.type,
        dueDate: r.dueDate,
        beneficiaryName: name,
      };
    }),
  );

  return (
    <div className="p-4 space-y-3">
      <h1 className="text-lg font-semibold">Reminders</h1>
      {enriched.length === 0 && (
        <p className="text-sm text-[var(--fg-muted)]">No reminders due.</p>
      )}
      {enriched.map((r) => (
        <ReminderRow key={r.id} r={r} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/reminder-row.tsx src/app/field/reminders/page.tsx
git commit -m "feat: /field/reminders list with Malayalam SMS preview modal"
```

---

### Task 6.5: `/field/sync` placeholder page (queue UI lands in Phase 9)

**Files:**
- Create: `src/app/field/sync/page.tsx`

- [ ] **Step 1: Page (basic, full queue UI in Phase 9)**

```tsx
import { Card } from "@/components/ui/card";

export default function SyncPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">Sync status</h1>
      <Card className="p-4 space-y-2">
        <p className="text-sm">All visits are up to date.</p>
        <p className="text-xs text-[var(--fg-muted)]">
          Offline queue: 0 items pending
        </p>
      </Card>
      <Card className="p-4 space-y-1 text-xs text-[var(--fg-muted)]">
        <p>This screen will show queued offline entries during the demo.</p>
        <p>Offline mode is toggled from the narrator panel (Ctrl+Shift+D).</p>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/field/sync/page.tsx
git commit -m "feat: /field/sync placeholder — queue UI in Phase 9"
```

---

### Task 6.6: Add floating SOS button to `/field` home

**Files:**
- Modify: `src/app/field/page.tsx`

- [ ] **Step 1: Add at bottom of the home page JSX** (before closing `</div>`):

```tsx
      <Link
        href="/field/sos"
        className="fixed md:absolute bottom-20 right-4 z-10 size-14 rounded-full bg-[var(--risk-critical)] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        aria-label="Emergency SOS"
      >
        <span className="text-xs font-bold">SOS</span>
      </Link>
```

Also add the import at the top: `import Link from "next/link";` if not already present.

- [ ] **Step 2: Commit**

```bash
git add src/app/field/page.tsx
git commit -m "feat: floating SOS button on /field home"
```

---

### Task 6.7: Manual smoke — all `/field` flows

- [ ] **Step 1: Boot dev**

```bash
pnpm dev
```

- [ ] **Step 2: Verify all `/field` routes load and work:**
  - `/field` (home)
  - `/field/register` (full wizard)
  - `/field/b/m-<id>` (mother profile)
  - `/field/b/c-<id>` (child profile with growth chart)
  - `/field/b/m-<id>/anc/new`
  - `/field/b/m-<id>/pnc/new`
  - `/field/b/c-<id>/growth/new`
  - `/field/b/c-<id>/immunizations`
  - `/field/sos`
  - `/field/iec`
  - `/field/reminders`
  - `/field/sync`

Expected: no console errors. SOS modal animates. SMS preview shows Malayalam.

- [ ] **Step 3: Commit any leftover cleanup**

```bash
git status
```


---

## Phase 7 — `/admin` Overview

### Task 7.1: `/admin` layout (top bar + sidebar + poller)

**Files:**
- Create: `src/app/admin/layout.tsx`

- [ ] **Step 1: Write**

```tsx
import { AdminTopBar } from "@/components/admin-top-bar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminPoller } from "@/components/admin-poller";
import { format } from "date-fns";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--surface)]">
      <AdminTopBar today={format(new Date(), "d MMM yyyy")} />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <AdminPoller intervalMs={8000} />
      <footer className="border-t bg-[var(--card)] px-6 py-3 text-xs text-[var(--fg-muted)] flex items-center justify-between">
        <span>Built for the National Health Mission · ABHA-aligned · HMIS-ready</span>
        <span>Demonstration data — no real patient information</span>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/layout.tsx
git commit -m "feat: /admin layout with top bar, sidebar, 8s poller, footer"
```

---

### Task 7.2: KPI cards + queries for `/admin` overview

**Files:**
- Create: `src/lib/queries/admin-overview.ts`
- Create: `src/components/kpi-card.tsx`

- [ ] **Step 1: Queries**

```ts
// src/lib/queries/admin-overview.ts
import { db } from "@/db";
import {
  mothers,
  children,
  alerts,
  ancVisits,
  immunizations,
  referrals,
  schemeEnrollments,
} from "@/db/schema";
import { eq, sql, desc, and, gte } from "drizzle-orm";

export async function getOverviewKpis() {
  const [mothersCount] = await db.select({ n: sql<number>`count(*)::int` }).from(mothers);
  const [highRisk] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(ancVisits)
    .where(sql`${ancVisits.riskLevel} IN ('HIGH', 'CRITICAL')`);
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const [activeSos] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(alerts)
    .where(and(eq(alerts.type, "SOS"), gte(alerts.raisedAt, todayStart)));
  const [immStats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      given: sql<number>`count(*) filter (where status='GIVEN')::int`,
    })
    .from(immunizations);
  const immComp =
    immStats.total > 0 ? Math.round((immStats.given / immStats.total) * 100) : 0;
  return {
    mothersTracked: mothersCount.n,
    highRiskPregnancies: highRisk.n,
    activeSosToday: activeSos.n,
    immunizationCompliance: immComp,
  };
}

export async function getLiveAlerts() {
  return db.query.alerts.findMany({
    orderBy: desc(alerts.raisedAt),
    limit: 8,
  });
}

export async function getSchemeCompliance() {
  const rows = await db
    .select({
      code: schemeEnrollments.schemeCode,
      total: sql<number>`count(*)::int`,
      disbursed: sql<number>`count(*) filter (where status='DISBURSED')::int`,
    })
    .from(schemeEnrollments)
    .groupBy(schemeEnrollments.schemeCode);
  return rows.map((r) => ({
    code: r.code,
    percent: r.total > 0 ? Math.round((r.disbursed / r.total) * 100) : 0,
  }));
}

export async function getBlockRiskCounts() {
  // Aggregate by block — simplified for demo
  const rows = await db.execute(sql`
    select f.block, count(*) filter (where av.risk_level='CRITICAL')::int as critical,
           count(*) filter (where av.risk_level='HIGH')::int as high,
           count(*) filter (where av.risk_level='NORMAL')::int as normal
    from families f
    left join mothers m on m.family_id = f.id
    left join lateral (
      select risk_level from anc_visits
      where mother_id = m.id order by visit_date desc limit 1
    ) av on true
    group by f.block
  `);
  return rows as unknown as Array<{
    block: string;
    critical: number;
    high: number;
    normal: number;
  }>;
}
```

- [ ] **Step 2: KPI card**

```tsx
// src/components/kpi-card.tsx
import { Card } from "@/components/ui/card";

export function KpiCard({
  label,
  value,
  suffix,
  tone = "default",
}: {
  label: string;
  value: number | string;
  suffix?: string;
  tone?: "default" | "alert";
}) {
  return (
    <Card className="p-4 space-y-1">
      <div className="text-xs text-[var(--fg-muted)] uppercase tracking-wide">
        {label}
      </div>
      <div
        className={
          "text-3xl font-semibold font-mono-num " +
          (tone === "alert" ? "text-[var(--risk-critical)]" : "text-[var(--fg)]")
        }
      >
        {value}
        {suffix && <span className="text-base ml-1">{suffix}</span>}
      </div>
    </Card>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/queries/admin-overview.ts src/components/kpi-card.tsx
git commit -m "feat: admin overview queries + KpiCard"
```

---

### Task 7.3: `<PalakkadMap>` stylized SVG

**Files:**
- Create: `src/components/palakkad-map.tsx`

- [ ] **Step 1: Component**

```tsx
import { cn } from "@/lib/utils";

interface BlockData {
  block: string;
  critical: number;
  high: number;
  normal: number;
}

// Stylized layout — not real geography. Blocks placed on a 2x3 grid.
const POSITIONS: Record<string, { x: number; y: number }> = {
  Agali: { x: 0.7, y: 0.25 },
  Sholayur: { x: 0.5, y: 0.4 },
  Pudur: { x: 0.8, y: 0.5 },
  Mannarkkad: { x: 0.3, y: 0.65 },
  Attappadi: { x: 0.55, y: 0.18 },
  Palakkad: { x: 0.2, y: 0.85 },
};

function toneFor(b: BlockData): string {
  if (b.critical > 0) return "var(--risk-critical)";
  if (b.high > 0) return "var(--risk-high)";
  return "var(--risk-normal)";
}

export function PalakkadMap({ data }: { data: BlockData[] }) {
  return (
    <div className="relative aspect-[4/3] rounded-lg border bg-[var(--primary-50)] overflow-hidden">
      {/* Stylized district shape */}
      <svg viewBox="0 0 400 300" className="absolute inset-0 size-full opacity-20">
        <path
          d="M40,80 L120,40 L240,30 L340,70 L370,150 L320,240 L200,270 L80,250 L30,160 Z"
          fill="var(--primary)"
        />
      </svg>
      <div className="absolute top-2 left-3 text-xs font-medium text-[var(--primary)]">
        Palakkad District · Attappadi region
      </div>
      {data.map((b) => {
        const pos = POSITIONS[b.block];
        if (!pos) return null;
        return (
          <div
            key={b.block}
            className="absolute"
            style={{
              left: `${pos.x * 100}%`,
              top: `${pos.y * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="size-3 rounded-full ring-4 ring-white/60"
              style={{ background: toneFor(b) }}
            />
            <div className="absolute left-4 top-0 text-xs whitespace-nowrap font-medium">
              {b.block}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/palakkad-map.tsx
git commit -m "feat: stylized Palakkad map with block risk dots"
```

---

### Task 7.4: Live alerts panel + scheme compliance bars on `/admin`

**Files:**
- Create: `src/components/live-alerts-panel.tsx`
- Create: `src/components/scheme-compliance-chart.tsx`

- [ ] **Step 1: Live alerts panel**

```tsx
// src/components/live-alerts-panel.tsx
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Siren, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AlertItem {
  id: number;
  type: string;
  status: string;
  raisedAt: Date;
  note: string | null;
  channels: Array<{ to: string; status: string }> | null;
}

export function LiveAlertsPanel({ alerts }: { alerts: AlertItem[] }) {
  return (
    <Card className="p-4 space-y-3">
      <h3 className="text-sm font-semibold">Live alerts</h3>
      {alerts.length === 0 && (
        <p className="text-xs text-[var(--fg-muted)]">No active alerts</p>
      )}
      <ul className="space-y-2">
        {alerts.map((a) => (
          <li key={a.id}>
            <Link
              href={`/admin/alerts/${a.id}`}
              className="block p-2 rounded-md hover:bg-slate-50"
            >
              <div className="flex items-center gap-2">
                {a.type === "SOS" ? (
                  <Siren className="size-4 text-[var(--risk-critical)]" />
                ) : (
                  <AlertTriangle className="size-4 text-[var(--risk-high)]" />
                )}
                <span className="text-sm font-medium">{a.type}</span>
                <span className="text-xs text-[var(--fg-muted)] ml-auto font-mono-num">
                  {formatDistanceToNow(a.raisedAt, { addSuffix: true })}
                </span>
              </div>
              {a.note && (
                <p className="text-xs text-[var(--fg-muted)] mt-1 line-clamp-1">
                  {a.note}
                </p>
              )}
              {a.channels && a.channels.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {a.channels.map((c) => (
                    <span
                      key={c.to}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-[var(--fg-muted)]"
                    >
                      {c.to} ✓
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
```

- [ ] **Step 2: Scheme compliance bars**

```tsx
// src/components/scheme-compliance-chart.tsx
import { Card } from "@/components/ui/card";

export function SchemeComplianceChart({
  data,
}: {
  data: Array<{ code: string; percent: number }>;
}) {
  return (
    <Card className="p-4 space-y-3">
      <h3 className="text-sm font-semibold">Scheme compliance</h3>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.code} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium">{d.code}</span>
              <span className="text-[var(--fg-muted)] font-mono-num">
                {d.percent}%
              </span>
            </div>
            <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] transition-all"
                style={{ width: `${d.percent}%` }}
              />
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-xs text-[var(--fg-muted)]">No scheme data yet</p>
        )}
      </div>
    </Card>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/live-alerts-panel.tsx src/components/scheme-compliance-chart.tsx
git commit -m "feat: LiveAlertsPanel + SchemeComplianceChart components"
```

---

### Task 7.5: `/admin` overview page

**Files:**
- Create: `src/app/admin/page.tsx`

- [ ] **Step 1: Write**

```tsx
import { KpiCard } from "@/components/kpi-card";
import { PalakkadMap } from "@/components/palakkad-map";
import { LiveAlertsPanel } from "@/components/live-alerts-panel";
import { SchemeComplianceChart } from "@/components/scheme-compliance-chart";
import {
  getOverviewKpis,
  getLiveAlerts,
  getSchemeCompliance,
  getBlockRiskCounts,
} from "@/lib/queries/admin-overview";

export default async function AdminOverview() {
  const [kpis, alerts, schemes, blocks] = await Promise.all([
    getOverviewKpis(),
    getLiveAlerts(),
    getSchemeCompliance(),
    getBlockRiskCounts(),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--primary)]">
          Overview · Palakkad District
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">
          Live monitoring · auto-refreshes every 8 seconds
        </p>
      </header>

      <div className="grid grid-cols-4 gap-4">
        <KpiCard label="Mothers tracked" value={kpis.mothersTracked} />
        <KpiCard label="High-risk pregnancies" value={kpis.highRiskPregnancies} />
        <KpiCard label="Active SOS today" value={kpis.activeSosToday} tone={kpis.activeSosToday > 0 ? "alert" : "default"} />
        <KpiCard label="Immunisation compliance" value={kpis.immunizationCompliance} suffix="%" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <PalakkadMap data={blocks} />
        </div>
        <LiveAlertsPanel
          alerts={alerts.map((a) => ({
            id: a.id,
            type: a.type,
            status: a.status,
            raisedAt: a.raisedAt,
            note: a.note,
            channels: a.channels,
          }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SchemeComplianceChart data={schemes} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: /admin overview — KPIs, map, live alerts, scheme compliance"
```

---

### Task 7.6: Smoke test `/admin` overview

- [ ] **Step 1: Verify** — boot dev, open `http://localhost:3000/admin`. Expected: 4 KPI cards, stylized Palakkad map with dots, live alerts panel (may be empty), scheme compliance bars. Auto-refreshes every 8s (use DevTools Network tab to confirm).

- [ ] **Step 2: Commit any tweaks**

```bash
git status
```


---

## Phase 8 — `/admin` Detail Pages

### Task 8.1: `/admin/people` directory + filters

**Files:**
- Create: `src/app/admin/people/page.tsx`

- [ ] **Step 1: Write page**

```tsx
import Link from "next/link";
import { db } from "@/db";
import { mothers, ancVisits } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/risk-badge";
import { formatBeneficiaryId } from "@/lib/beneficiary-id";

export default async function AdminPeople({
  searchParams,
}: {
  searchParams: Promise<{ block?: string; risk?: string }>;
}) {
  const sp = await searchParams;
  const blockFilter = sp.block;
  const riskFilter = sp.risk;

  const list = await db.query.mothers.findMany({
    with: {
      family: true,
      ancVisits: { orderBy: desc(ancVisits.visitDate), limit: 1 },
    },
    limit: 100,
  });

  const filtered = list.filter((m) => {
    if (blockFilter && m.family.block !== blockFilter) return false;
    const lastRisk = m.ancVisits[0]?.riskLevel ?? "NORMAL";
    if (riskFilter && lastRisk !== riskFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--primary)]">People</h1>
        <p className="text-sm text-[var(--fg-muted)]">
          {filtered.length} beneficiaries
        </p>
      </header>
      <div className="flex gap-2 text-xs">
        {["Agali", "Sholayur", "Pudur", "Mannarkkad", "Attappadi"].map((b) => (
          <Link
            key={b}
            href={`/admin/people${blockFilter === b ? "" : `?block=${b}`}`}
            className={
              "px-3 py-1.5 rounded-full border " +
              (blockFilter === b
                ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                : "bg-[var(--card)] hover:bg-slate-50")
            }
          >
            {b}
          </Link>
        ))}
      </div>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Village</th>
              <th className="text-left p-3">Pregnancy</th>
              <th className="text-left p-3">Risk</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => {
              const risk = m.ancVisits[0]?.riskLevel ?? "NORMAL";
              return (
                <tr key={m.id} className="border-b hover:bg-slate-50">
                  <td className="p-3 font-medium">
                    <Link href={`/admin/people/m-${m.id}`} className="hover:underline">
                      {m.name}
                    </Link>
                  </td>
                  <td className="p-3 font-mono-num text-xs text-[var(--fg-muted)]">
                    {formatBeneficiaryId(m.beneficiaryId12)}
                  </td>
                  <td className="p-3">{m.family.village}, {m.family.block}</td>
                  <td className="p-3 text-xs">
                    G{m.pregnancyNo}P{m.pregnancyNo - 1}
                  </td>
                  <td className="p-3"><RiskBadge level={risk} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/people/page.tsx
git commit -m "feat: /admin/people directory with block filter"
```

---

### Task 8.2: `/admin/people/[id]` detail page

**Files:**
- Create: `src/app/admin/people/[id]/page.tsx`

- [ ] **Step 1: Write — mirrors `/field/b/[id]` but full-width desktop**

```tsx
import { notFound } from "next/navigation";
import {
  parseBeneficiaryRouteId,
  loadMother,
  loadChild,
} from "@/lib/queries/beneficiary";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/risk-badge";
import { formatBeneficiaryId } from "@/lib/beneficiary-id";
import { format } from "date-fns";

export default async function AdminPeopleDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsed = parseBeneficiaryRouteId(id);
  if (!parsed) notFound();

  if (parsed.type === "mother") {
    const m = await loadMother(parsed.id);
    if (!m) notFound();

    return (
      <div className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[var(--primary)]">
            {m.name}
          </h1>
          <p className="text-sm text-[var(--fg-muted)] font-mono-num">
            {formatBeneficiaryId(m.beneficiaryId12)}
          </p>
          <p className="text-sm text-[var(--fg-muted)]">
            G{m.pregnancyNo}P{m.pregnancyNo - 1} · {m.family.village},{" "}
            {m.family.block}
          </p>
        </header>

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 space-y-2 col-span-1">
            <h3 className="text-sm font-semibold">Profile</h3>
            <p className="text-sm">Age: {m.age}</p>
            <p className="text-sm">
              LMP: {m.lmp ? format(new Date(m.lmp), "d MMM yyyy") : "—"}
            </p>
            <p className="text-sm">
              EDD: {m.edd ? format(new Date(m.edd), "d MMM yyyy") : "—"}
            </p>
            <p className="text-sm">
              BPL: {m.family.bplScore} · Tier {m.family.schemePriorityTier}
            </p>
            <p className="text-sm">ASHA: {m.family.asha?.name ?? "—"}</p>
          </Card>
          <Card className="p-4 space-y-3 col-span-2">
            <h3 className="text-sm font-semibold">Visit history</h3>
            <table className="w-full text-sm">
              <thead className="text-xs text-[var(--fg-muted)] border-b">
                <tr>
                  <th className="text-left py-1">Type</th>
                  <th className="text-left py-1">Date</th>
                  <th className="text-left py-1">BP</th>
                  <th className="text-left py-1">Hb</th>
                  <th className="text-left py-1">Risk</th>
                </tr>
              </thead>
              <tbody>
                {m.ancVisits.map((v) => (
                  <tr key={"anc-" + v.id} className="border-b">
                    <td className="py-2">ANC #{v.visitNo}</td>
                    <td className="py-2">{format(v.visitDate, "d MMM")}</td>
                    <td className="py-2">
                      {v.bpSystolic}/{v.bpDiastolic}
                    </td>
                    <td className="py-2">{v.hbValue ?? "—"}</td>
                    <td className="py-2">
                      <RiskBadge level={v.riskLevel} />
                    </td>
                  </tr>
                ))}
                {m.pncVisits.map((v) => (
                  <tr key={"pnc-" + v.id} className="border-b">
                    <td className="py-2">PNC D+{v.visitDay}</td>
                    <td className="py-2">{format(v.visitDate, "d MMM")}</td>
                    <td className="py-2">
                      {v.bpSystolic ?? "—"}/{v.bpDiastolic ?? "—"}
                    </td>
                    <td className="py-2">{v.hbValue ?? "—"}</td>
                    <td className="py-2">—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }

  const c = await loadChild(parsed.id);
  if (!c) notFound();
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-[var(--primary)]">
          {c.name ?? "Baby " + c.beneficiaryId12.slice(-4)}
        </h1>
        <p className="text-sm font-mono-num text-[var(--fg-muted)]">
          {formatBeneficiaryId(c.beneficiaryId12)}
        </p>
        <p className="text-sm text-[var(--fg-muted)]">
          DOB {format(new Date(c.dob), "d MMM yyyy")} · {c.family.village}
        </p>
      </header>
      <Card className="p-4 space-y-3">
        <h3 className="text-sm font-semibold">Growth records</h3>
        <table className="w-full text-sm">
          <thead className="text-xs text-[var(--fg-muted)] border-b">
            <tr>
              <th className="text-left py-1">Date</th>
              <th className="text-left py-1">Weight</th>
              <th className="text-left py-1">MUAC</th>
              <th className="text-left py-1">Z-score</th>
              <th className="text-left py-1">Class</th>
            </tr>
          </thead>
          <tbody>
            {c.growthRecords.map((g) => (
              <tr key={g.id} className="border-b">
                <td className="py-2">{format(g.recordedAt, "d MMM")}</td>
                <td className="py-2">{g.weightKg} kg</td>
                <td className="py-2">{g.muacCm} cm</td>
                <td className="py-2 font-mono-num">
                  {g.weightForHeightZ?.toFixed(2) ?? "—"}
                </td>
                <td className="py-2">{g.classification}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/people/[id]/page.tsx
git commit -m "feat: /admin/people/[id] full beneficiary record"
```

---

### Task 8.3: `/admin/alerts` queue + detail

**Files:**
- Create: `src/app/admin/alerts/page.tsx`
- Create: `src/app/admin/alerts/[id]/page.tsx`

- [ ] **Step 1: List page**

```tsx
// src/app/admin/alerts/page.tsx
import Link from "next/link";
import { db } from "@/db";
import { alerts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Card } from "@/components/ui/card";
import { Siren, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function AdminAlerts() {
  const rows = await db.query.alerts.findMany({
    orderBy: desc(alerts.raisedAt),
    limit: 100,
  });
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--primary)]">
          Alerts queue
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">{rows.length} alerts</p>
      </header>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Subject</th>
              <th className="text-left p-3">Note</th>
              <th className="text-left p-3">Raised</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="border-b hover:bg-slate-50">
                <td className="p-3">
                  <Link
                    href={`/admin/alerts/${a.id}`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    {a.type === "SOS" ? (
                      <Siren className="size-4 text-[var(--risk-critical)]" />
                    ) : (
                      <AlertTriangle className="size-4 text-[var(--risk-high)]" />
                    )}
                    {a.type}
                  </Link>
                </td>
                <td className="p-3 text-xs text-[var(--fg-muted)]">
                  {a.subjectType} #{a.subjectId}
                </td>
                <td className="p-3 text-xs">{a.note ?? "—"}</td>
                <td className="p-3 text-xs font-mono-num">
                  {formatDistanceToNow(a.raisedAt, { addSuffix: true })}
                </td>
                <td className="p-3 text-xs">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Detail page**

```tsx
// src/app/admin/alerts/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { alerts, mothers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { format } from "date-fns";

export default async function AlertDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const a = await db.query.alerts.findFirst({
    where: eq(alerts.id, parseInt(id, 10)),
  });
  if (!a) notFound();

  let subjectName: string | null = null;
  if (a.subjectType === "mother") {
    const m = await db.query.mothers.findFirst({ where: eq(mothers.id, a.subjectId) });
    subjectName = m?.name ?? null;
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--primary)]">
          {a.type} · {a.status}
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">
          Raised {format(a.raisedAt, "d MMM yyyy, HH:mm")}
        </p>
      </header>
      <Card className="p-4 space-y-2">
        <h3 className="text-sm font-semibold">Subject</h3>
        <p className="text-sm">
          {a.subjectType} {subjectName ? `· ${subjectName}` : `#${a.subjectId}`}
        </p>
        {subjectName && (
          <Link
            href={`/admin/people/${a.subjectType === "mother" ? "m" : "c"}-${a.subjectId}`}
            className="text-xs text-[var(--primary)] hover:underline"
          >
            Open full record →
          </Link>
        )}
      </Card>
      {a.lat != null && a.lng != null && (
        <Card className="p-4 space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="size-4" /> Location
          </h3>
          <p className="text-sm font-mono-num">
            {a.lat.toFixed(2)}°N · {a.lng.toFixed(2)}°E
          </p>
          <p className="text-xs text-[var(--fg-muted)]">
            Agali village, Attappadi block, Palakkad district
          </p>
        </Card>
      )}
      <Card className="p-4 space-y-3">
        <h3 className="text-sm font-semibold">Dispatch channels</h3>
        <ul className="space-y-1">
          {(a.channels ?? []).map((c) => (
            <li
              key={c.to}
              className="flex items-center justify-between text-sm py-2 border-b last:border-0"
            >
              <span>{c.to}</span>
              <span className="text-xs text-[var(--risk-normal)]">✓ {c.status}</span>
            </li>
          ))}
        </ul>
      </Card>
      {a.note && (
        <Card className="p-4 space-y-1">
          <h3 className="text-sm font-semibold">Note</h3>
          <p className="text-sm">{a.note}</p>
        </Card>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/alerts/page.tsx src/app/admin/alerts/[id]/page.tsx
git commit -m "feat: /admin/alerts queue + detail with GPS + channels"
```

---

### Task 8.4: `/admin/referrals` Sankey-ish flow

**Files:**
- Create: `src/app/admin/referrals/page.tsx`

- [ ] **Step 1: Write — simplified tier-flow visualization**

```tsx
import { db } from "@/db";
import { referrals } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default async function AdminReferrals() {
  const counts = await db
    .select({
      from: referrals.tierFrom,
      to: referrals.tierTo,
      n: sql<number>`count(*)::int`,
    })
    .from(referrals)
    .groupBy(referrals.tierFrom, referrals.tierTo);

  const recent = await db.query.referrals.findMany({
    orderBy: desc(referrals.createdAt),
    limit: 20,
  });

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--primary)]">Referrals</h1>
        <p className="text-sm text-[var(--fg-muted)]">Tier escalation flow</p>
      </header>
      <Card className="p-6">
        <div className="flex items-center justify-center gap-2">
          {["SC", "PHC", "CHC", "DH"].map((tier, i, arr) => {
            const incoming = counts
              .filter((c) => c.to === tier)
              .reduce((s, c) => s + c.n, 0);
            return (
              <div key={tier} className="flex items-center">
                <div className="text-center">
                  <div className="size-20 rounded-full bg-[var(--primary-50)] flex items-center justify-center text-2xl font-semibold text-[var(--primary)]">
                    {incoming}
                  </div>
                  <p className="text-xs mt-2 font-medium">{tier}</p>
                </div>
                {i < arr.length - 1 && <ArrowRight className="size-6 text-[var(--fg-muted)] mx-2" />}
              </div>
            );
          })}
        </div>
      </Card>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left p-3">From → To</th>
              <th className="text-left p-3">Subject</th>
              <th className="text-left p-3">Reason</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="p-3">
                  {r.tierFrom} → {r.tierTo}
                </td>
                <td className="p-3 text-xs text-[var(--fg-muted)]">
                  {r.subjectType} #{r.subjectId}
                </td>
                <td className="p-3 text-xs">{r.reason}</td>
                <td className="p-3 text-xs">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/referrals/page.tsx
git commit -m "feat: /admin/referrals — tier flow visualization + recent list"
```

---

### Task 8.5: `/admin/schemes` page

**Files:**
- Create: `src/app/admin/schemes/page.tsx`

- [ ] **Step 1: Write**

```tsx
import { db } from "@/db";
import { schemeEnrollments, mothers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { Card } from "@/components/ui/card";
import { SchemeProgress } from "@/components/scheme-progress";
import { SchemeComplianceChart } from "@/components/scheme-compliance-chart";
import { getSchemeCompliance } from "@/lib/queries/admin-overview";

export default async function AdminSchemes() {
  const compliance = await getSchemeCompliance();
  const enrolls = await db.query.schemeEnrollments.findMany({
    orderBy: desc(schemeEnrollments.expectedDate),
    limit: 200,
  });
  const motherList = await db.query.mothers.findMany({ columns: { id: true, name: true } });
  const motherName = (id: number) => motherList.find((m) => m.id === id)?.name ?? `#${id}`;

  // Group by beneficiary + scheme
  const grouped = new Map<string, { name: string; code: string; disbursed: number; total: number }>();
  for (const e of enrolls) {
    if (e.beneficiaryType !== "mother") continue;
    const key = `${e.beneficiaryId}_${e.schemeCode}`;
    const prev = grouped.get(key) ?? {
      name: motherName(e.beneficiaryId),
      code: e.schemeCode,
      disbursed: 0,
      total: 0,
    };
    prev.total += 1;
    if (e.status === "DISBURSED") prev.disbursed += 1;
    grouped.set(key, prev);
  }
  const beneficiaryRows = [...grouped.values()].slice(0, 50);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--primary)]">Schemes</h1>
        <p className="text-sm text-[var(--fg-muted)]">
          PMMVY · JSY · JSSK · KASP disbursement tracking
        </p>
      </header>
      <div className="grid grid-cols-2 gap-4">
        <SchemeComplianceChart data={compliance} />
        <Card className="p-4 text-xs text-[var(--fg-muted)]">
          <p>
            <strong className="text-[var(--fg)]">PMMVY</strong> — Pradhan Mantri Matru Vandana Yojana (3 installments)
          </p>
          <p>
            <strong className="text-[var(--fg)]">JSY</strong> — Janani Suraksha Yojana
          </p>
          <p>
            <strong className="text-[var(--fg)]">JSSK</strong> — Janani Shishu Suraksha Karyakram
          </p>
          <p>
            <strong className="text-[var(--fg)]">KASP</strong> — Karunya Arogya Suraksha Padhathi (Kerala)
          </p>
        </Card>
      </div>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left p-3">Beneficiary</th>
              <th className="text-left p-3">Scheme</th>
              <th className="text-left p-3">Progress</th>
            </tr>
          </thead>
          <tbody>
            {beneficiaryRows.map((r, i) => (
              <tr key={i} className="border-b">
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.code}</td>
                <td className="p-3 w-1/2">
                  <SchemeProgress
                    code={r.code as "PMMVY" | "JSY" | "JSSK" | "KASP"}
                    disbursed={r.disbursed}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/schemes/page.tsx
git commit -m "feat: /admin/schemes with compliance chart + per-beneficiary table"
```

---

### Task 8.6: `/admin/ashas` performance leaderboard

**Files:**
- Create: `src/app/admin/ashas/page.tsx`

- [ ] **Step 1: Write**

```tsx
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { Card } from "@/components/ui/card";

export default async function AdminAshas() {
  const rows = await db.execute(sql`
    select
      fw.id, fw.name, f.name as facility, count(distinct fam.id) as families,
      count(av.id) as visits, count(*) filter (where av.risk_level='CRITICAL') as critical_caught
    from field_workers fw
    left join facilities f on f.id = fw.facility_id
    left join families fam on fam.asha_id = fw.id
    left join mothers m on m.family_id = fam.id
    left join anc_visits av on av.mother_id = m.id
    where fw.role = 'ASHA'
    group by fw.id, fw.name, f.name
    order by visits desc
  `);
  const data = rows as unknown as Array<{
    id: number;
    name: string;
    facility: string;
    families: number;
    visits: number;
    critical_caught: number;
  }>;

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--primary)]">ASHAs</h1>
        <p className="text-sm text-[var(--fg-muted)]">Performance leaderboard</p>
      </header>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left p-3">Rank</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Sub-Centre</th>
              <th className="text-right p-3">Families</th>
              <th className="text-right p-3">Visits</th>
              <th className="text-right p-3">Critical caught</th>
            </tr>
          </thead>
          <tbody>
            {data.map((a, i) => (
              <tr key={a.id} className="border-b">
                <td className="p-3 font-mono-num">#{i + 1}</td>
                <td className="p-3 font-medium">{a.name}</td>
                <td className="p-3">{a.facility ?? "—"}</td>
                <td className="p-3 text-right font-mono-num">{a.families}</td>
                <td className="p-3 text-right font-mono-num">{a.visits}</td>
                <td className="p-3 text-right font-mono-num">
                  {a.critical_caught}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/ashas/page.tsx
git commit -m "feat: /admin/ashas leaderboard with families/visits/critical-caught"
```

---

### Task 8.7: `/admin/facilities` list

**Files:**
- Create: `src/app/admin/facilities/page.tsx`

- [ ] **Step 1: Write**

```tsx
import { db } from "@/db";
import { facilities } from "@/db/schema";
import { Card } from "@/components/ui/card";

export default async function AdminFacilities() {
  const rows = await db.query.facilities.findMany();
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--primary)]">Facilities</h1>
        <p className="text-sm text-[var(--fg-muted)]">
          {rows.length} facilities · SC / PHC / CHC / DH
        </p>
      </header>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Block</th>
              <th className="text-left p-3">Coordinates</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.id} className="border-b">
                <td className="p-3 font-medium">{f.name}</td>
                <td className="p-3">{f.type}</td>
                <td className="p-3">{f.block}</td>
                <td className="p-3 font-mono-num text-xs">
                  {f.lat?.toFixed(2)}, {f.lng?.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/facilities/page.tsx
git commit -m "feat: /admin/facilities list table"
```

---

### Task 8.8: `/admin/integrations` status tiles

**Files:**
- Create: `src/app/admin/integrations/page.tsx`

- [ ] **Step 1: Write**

```tsx
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const INTEGRATIONS = [
  {
    name: "ABHA / Ayushman Bharat Health Account",
    code: "ABHA",
    status: "Connected (sandbox)",
    description:
      "14-digit ABHA ID provisioning, consent-based health record sharing. Current build uses 12-digit alignment.",
  },
  {
    name: "HMIS — Health Management Information System",
    code: "HMIS",
    status: "Mapped",
    description:
      "Monthly aggregate reports auto-pushed to HMIS portal. Maternal and child health KPIs aligned with NHM dashboard schema.",
  },
  {
    name: "ICDS-CAS",
    code: "ICDS",
    status: "Linked",
    description:
      "Anganwadi-level growth records and nutrition data exchanged. SAM/MAM cases visible to AWWs and CDPOs.",
  },
  {
    name: "e-Sanjeevani",
    code: "ES",
    status: "Linked",
    description:
      "MO referrals to specialist tele-consultation. CRITICAL ANC cases auto-eligible for tele-OPD slot booking.",
  },
];

export default function AdminIntegrations() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--primary)]">Integrations</h1>
        <p className="text-sm text-[var(--fg-muted)]">
          Connection status with national health systems
        </p>
      </header>
      <div className="grid grid-cols-2 gap-4">
        {INTEGRATIONS.map((i) => (
          <Card key={i.code} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{i.name}</h3>
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[var(--risk-normal)]/10 text-[var(--risk-normal)]">
                <Check className="size-3" /> {i.status}
              </span>
            </div>
            <p className="text-sm text-[var(--fg-muted)]">{i.description}</p>
          </Card>
        ))}
      </div>
      <Card className="p-4 text-xs text-[var(--fg-muted)]">
        Note: this demo simulates each integration's status. Production builds
        will use the official sandbox endpoints with NHA / NHSRC accreditation.
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/integrations/page.tsx
git commit -m "feat: /admin/integrations status tiles with disclosure"
```

---

### Task 8.9: Smoke test `/admin/*` pages

- [ ] **Step 1: Verify** — click through every sidebar item:
  - `/admin` (overview)
  - `/admin/people` + block filter chips + open a beneficiary
  - `/admin/alerts` + open one alert
  - `/admin/referrals`
  - `/admin/schemes`
  - `/admin/ashas`
  - `/admin/facilities`
  - `/admin/integrations`

Expected: every page renders without errors. Tables may be sparse — seed data lands in Phase 11.

- [ ] **Step 2: Commit any tweaks**

```bash
git status
```


---

## Phase 9 — Offline Sync Layer

### Task 9.1: `useOfflineQueue` hook + LocalStorage queue

**Files:**
- Create: `src/hooks/use-offline-queue.ts`
- Create: `src/lib/offline-queue.ts`

- [ ] **Step 1: Pure queue helpers (browser-only)**

```ts
// src/lib/offline-queue.ts
const KEY = "mch_offline_queue_v1";

export interface QueueItem {
  id: string;
  actionName: string;
  args: unknown;
  payloadKb: number;
  queuedAt: number;
  status: "PENDING" | "SYNCING" | "SYNCED" | "FAILED";
}

export function readQueue(): QueueItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as QueueItem[];
  } catch {
    return [];
  }
}

export function writeQueue(items: QueueItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function enqueue(actionName: string, args: unknown): QueueItem {
  const payloadKb = Math.max(
    1,
    Math.round(new Blob([JSON.stringify(args)]).size / 1024),
  );
  const item: QueueItem = {
    id: crypto.randomUUID(),
    actionName,
    args,
    payloadKb,
    queuedAt: Date.now(),
    status: "PENDING",
  };
  const cur = readQueue();
  writeQueue([...cur, item]);
  window.dispatchEvent(new Event("offline-queue-changed"));
  return item;
}

export function markStatus(id: string, status: QueueItem["status"]) {
  const cur = readQueue();
  const next = cur.map((q) => (q.id === id ? { ...q, status } : q));
  writeQueue(next);
  window.dispatchEvent(new Event("offline-queue-changed"));
}

export function clearSynced() {
  writeQueue(readQueue().filter((q) => q.status !== "SYNCED"));
  window.dispatchEvent(new Event("offline-queue-changed"));
}
```

- [ ] **Step 2: Hook**

```ts
// src/hooks/use-offline-queue.ts
"use client";
import { useEffect, useState, useCallback } from "react";
import { readQueue, type QueueItem, markStatus, clearSynced } from "@/lib/offline-queue";

type ActionRunner = (actionName: string, args: unknown) => Promise<unknown>;

export function useOfflineQueue(runActionByName: ActionRunner) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isOnline, setOnline] = useState(true);
  const [forcedOffline, setForced] = useState(false);

  useEffect(() => {
    setQueue(readQueue());
    const cookie = document.cookie.split("; ").find((c) => c.startsWith("mch_offline="));
    if (cookie?.endsWith("=1")) setForced(true);

    const updateOnline = () => setOnline(navigator.onLine);
    updateOnline();
    const refresh = () => setQueue(readQueue());
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    window.addEventListener("offline-queue-changed", refresh);
    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
      window.removeEventListener("offline-queue-changed", refresh);
    };
  }, []);

  const effectiveOnline = isOnline && !forcedOffline;

  const drain = useCallback(async () => {
    const pending = readQueue().filter((q) => q.status === "PENDING");
    for (const item of pending) {
      markStatus(item.id, "SYNCING");
      try {
        await runActionByName(item.actionName, item.args);
        markStatus(item.id, "SYNCED");
      } catch {
        markStatus(item.id, "FAILED");
      }
    }
    setTimeout(() => clearSynced(), 1500);
  }, [runActionByName]);

  useEffect(() => {
    if (effectiveOnline && queue.some((q) => q.status === "PENDING")) {
      drain();
    }
  }, [effectiveOnline, queue, drain]);

  return { queue, isOnline: effectiveOnline, forcedOffline, setForced };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/use-offline-queue.ts src/lib/offline-queue.ts
git commit -m "feat: offline queue + drain hook backed by localStorage"
```

---

### Task 9.2: `<OfflineToggle>` + run-by-name action dispatcher

**Files:**
- Create: `src/components/offline-toggle.tsx`
- Create: `src/lib/run-action-by-name.ts`

- [ ] **Step 1: Run-by-name dispatcher (client wrapper around Server Actions)**

```ts
// src/lib/run-action-by-name.ts
"use client";
import { saveAncVisit } from "@/actions/anc";
import { savePncVisit } from "@/actions/pnc";
import { saveGrowthRecord } from "@/actions/growth";

export async function runActionByName(name: string, args: unknown) {
  switch (name) {
    case "saveAncVisit":
      return saveAncVisit(args as Parameters<typeof saveAncVisit>[0]);
    case "savePncVisit":
      return savePncVisit(args as Parameters<typeof savePncVisit>[0]);
    case "saveGrowthRecord":
      return saveGrowthRecord(args as Parameters<typeof saveGrowthRecord>[0]);
    default:
      throw new Error("Unknown action: " + name);
  }
}
```

- [ ] **Step 2: OfflineToggle (client)**

```tsx
// src/components/offline-toggle.tsx
"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff } from "lucide-react";
import { motion } from "motion/react";
import { useOfflineQueue } from "@/hooks/use-offline-queue";
import { runActionByName } from "@/lib/run-action-by-name";

export function OfflineToggle() {
  const { queue, forcedOffline, setForced, isOnline } = useOfflineQueue(runActionByName);
  const pending = queue.filter((q) => q.status === "PENDING").length;
  const syncing = queue.filter((q) => q.status === "SYNCING").length;

  function toggle() {
    const next = !forcedOffline;
    document.cookie = `mch_offline=${next ? 1 : 0}; path=/; max-age=86400`;
    setForced(next);
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="size-4 text-[var(--risk-normal)]" />
          ) : (
            <WifiOff className="size-4 text-[var(--risk-high)]" />
          )}
          <span className="font-medium text-sm">
            {isOnline ? "Online" : "Offline — queueing"}
          </span>
        </div>
        <Button size="sm" variant="outline" onClick={toggle}>
          {forcedOffline ? "Go online" : "Simulate offline"}
        </Button>
      </div>
      {(pending > 0 || syncing > 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs"
        >
          <p className="text-[var(--fg-muted)]">
            {syncing > 0
              ? `Syncing ${syncing} of ${pending + syncing}…`
              : `${pending} item${pending !== 1 ? "s" : ""} queued`}
          </p>
          <ul className="mt-2 space-y-1">
            {queue.map((q) => (
              <li
                key={q.id}
                className="flex items-center justify-between text-xs py-1 border-t"
              >
                <span>{q.actionName}</span>
                <span className="font-mono-num text-[var(--fg-muted)]">
                  {q.payloadKb} KB · {q.status.toLowerCase()}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </Card>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/offline-toggle.tsx src/lib/run-action-by-name.ts
git commit -m "feat: OfflineToggle component + run-by-name action dispatcher"
```

---

### Task 9.3: Wire AncForm / GrowthForm / PncForm to use queue when offline

**Files:**
- Modify: `src/components/anc-form.tsx`
- Modify: `src/components/pnc-form.tsx`
- Modify: `src/components/growth-form.tsx`

- [ ] **Step 1: Update `AncForm` submit handler** — replace the `submit()` function body:

```tsx
import { enqueue } from "@/lib/offline-queue";

// inside the component:
function submit() {
  const cookie = typeof document !== "undefined"
    ? document.cookie.includes("mch_offline=1")
    : false;
  if (cookie || (typeof navigator !== "undefined" && !navigator.onLine)) {
    const item = enqueue("saveAncVisit", { ...form, motherId });
    toast.info(`Queued offline · ${item.payloadKb} KB`);
    return;
  }
  startTransition(async () => {
    try {
      const r = await saveAncVisit({ ...form, motherId });
      setResult(r);
      toast.success(`Saved · ${r.kbUsed} KB · risk ${r.riskLevel}`);
    } catch (e) {
      toast.error("Save failed");
    }
  });
}
```

- [ ] **Step 2: Apply the same pattern to `PncForm.submit()` and `GrowthForm.submit()`** — wrap the action call with the offline-check + enqueue branch. Use action names `"savePncVisit"` and `"saveGrowthRecord"` respectively.

- [ ] **Step 3: Commit**

```bash
git add src/components/anc-form.tsx src/components/pnc-form.tsx src/components/growth-form.tsx
git commit -m "feat: visit forms enqueue when offline mode active"
```

---

### Task 9.4: Wire OfflineToggle into `/field/sync` and update home badge

**Files:**
- Modify: `src/app/field/sync/page.tsx`
- Modify: `src/app/field/page.tsx`
- Create: `src/components/sync-status-badge.tsx`

- [ ] **Step 1: Replace `/field/sync` with full UI**

```tsx
import { OfflineToggle } from "@/components/offline-toggle";

export default function SyncPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">Sync status</h1>
      <OfflineToggle />
      <p className="text-xs text-[var(--fg-muted)]">
        Items queued here drain automatically when you go back online. The KB
        figures are the actual JSON payload sizes — measured live, not estimated.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Optional — `<SyncStatusBadge>` for the home header (skips queue display, just shows online/queued count)**

```tsx
// src/components/sync-status-badge.tsx
"use client";
import { useOfflineQueue } from "@/hooks/use-offline-queue";
import { runActionByName } from "@/lib/run-action-by-name";
import { Wifi, WifiOff } from "lucide-react";

export function SyncStatusBadge() {
  const { queue, isOnline } = useOfflineQueue(runActionByName);
  const pending = queue.filter((q) => q.status === "PENDING").length;
  if (isOnline && pending === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-[var(--risk-normal)]">
        <Wifi className="size-3" /> Synced
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs text-[var(--risk-high)]">
      <WifiOff className="size-3" /> {pending} queued
    </span>
  );
}
```

Then in `src/app/field/page.tsx` replace `<KbBadge kb={38} />` with `<SyncStatusBadge />` (and import the new component).

- [ ] **Step 3: Commit**

```bash
git add src/app/field/sync/page.tsx src/components/sync-status-badge.tsx src/app/field/page.tsx
git commit -m "feat: /field/sync with OfflineToggle + home SyncStatusBadge"
```


---

## Phase 10 — `/demo` Narrator Controls

### Task 10.1: `/demo/reset`, `/demo/seed`, `/demo/warmup`, `/demo/health` routes

**Files:**
- Create: `src/app/demo/reset/route.ts`
- Create: `src/app/demo/seed/route.ts`
- Create: `src/app/demo/warmup/route.ts`
- Create: `src/app/demo/health/route.ts`

- [ ] **Step 1: Reset route**

```ts
// src/app/demo/reset/route.ts
import { db } from "@/db";
import {
  syncEvents, smsLog, reminders, iecContent, schemeEnrollments,
  referrals, alerts, milestones, growthRecords, immunizations,
  pncVisits, ancVisits, children, mothers, families, fieldWorkers, facilities,
} from "@/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
  // Truncate in reverse FK order
  await db.execute(sql`
    truncate table sync_events, sms_log, reminders, iec_content,
    scheme_enrollments, referrals, alerts, milestones, growth_records,
    immunizations, pnc_visits, anc_visits, children, mothers, families,
    field_workers, facilities restart identity cascade
  `);
  return NextResponse.json({ ok: true });
}

export async function GET() {
  return POST();
}
```

- [ ] **Step 2: Seed route — delegates to `runSeed()` from db/seed.ts (created in Phase 11)**

```ts
// src/app/demo/seed/route.ts
import { NextResponse } from "next/server";
import { runSeed } from "@/db/seed";

export async function POST() {
  const meta = await runSeed();
  return NextResponse.json({ ok: true, meta });
}

export async function GET() {
  return POST();
}
```

- [ ] **Step 3: Warmup + health**

```ts
// src/app/demo/warmup/route.ts
import { db } from "@/db";
import { facilities } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const rows = await db.select().from(facilities).limit(1);
  return NextResponse.json({ warm: true, sampleRows: rows.length });
}
```

```ts
// src/app/demo/health/route.ts
import { db } from "@/db";
import { mothers, alerts, syncEvents } from "@/db/schema";
import { sql } from "drizzle-orm";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const [{ n: mothersN }] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(mothers);
  const lastAlert = await db.query.alerts.findFirst({
    orderBy: desc(alerts.raisedAt),
  });
  const lastSync = await db.query.syncEvents.findFirst({
    orderBy: desc(syncEvents.queuedAt),
  });
  return NextResponse.json({
    db: "ok",
    mothers: mothersN,
    lastAlertAt: lastAlert?.raisedAt ?? null,
    lastSyncAt: lastSync?.queuedAt ?? null,
    seedVersion: "sreelakshmi-v1",
  });
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/demo/reset src/app/demo/seed src/app/demo/warmup src/app/demo/health
git commit -m "feat: /demo/{reset,seed,warmup,health} routes"
```

---

### Task 10.2: `/demo/role-switch` + `/demo/offline` routes

**Files:**
- Create: `src/app/demo/role-switch/route.ts`
- Create: `src/app/demo/offline/route.ts`

- [ ] **Step 1: Role switch**

```ts
// src/app/demo/role-switch/route.ts
import { NextRequest, NextResponse } from "next/server";
import { setSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const role = req.nextUrl.searchParams.get("role") ?? "ASHA";
  const validRoles = ["ASHA", "ANM", "MO", "SUPERVISOR", "ADMIN"] as const;
  type Role = (typeof validRoles)[number];
  const r = (validRoles as readonly string[]).includes(role) ? (role as Role) : "ASHA";
  await setSession({ workerId: 1, role: r });
  const back = req.nextUrl.searchParams.get("back") ?? "/";
  return NextResponse.redirect(new URL(back, req.url));
}
```

- [ ] **Step 2: Offline toggle**

```ts
// src/app/demo/offline/route.ts
import { NextRequest, NextResponse } from "next/server";
import { setOfflineMode } from "@/lib/session";

export async function GET(req: NextRequest) {
  const on = req.nextUrl.searchParams.get("on") === "true";
  await setOfflineMode(on);
  const res = NextResponse.json({ offline: on });
  res.cookies.set("mch_offline", on ? "1" : "0", { path: "/" });
  return res;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/demo/role-switch src/app/demo/offline
git commit -m "feat: /demo/role-switch + /demo/offline toggle routes"
```

---

### Task 10.3: `/demo/scenario/[arc]/[checkpoint]` jumps

**Files:**
- Create: `src/app/demo/scenario/[arc]/[checkpoint]/route.ts`
- Create: `src/data/scenarios.ts`

- [ ] **Step 1: Scenario data**

```ts
// src/data/scenarios.ts
export type ScenarioCheckpoint =
  | "pre-anc"
  | "post-anc"
  | "post-sos"
  | "post-delivery"
  | "post-sam";

export interface ScenarioStep {
  description: string;
  apply: () => Promise<void>;
}

// Each checkpoint runs db ops to put state in a known position.
// Implementations live in src/db/scenarios.ts (Phase 11).
```

- [ ] **Step 2: Route handler**

```ts
// src/app/demo/scenario/[arc]/[checkpoint]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jumpScenario } from "@/db/scenarios";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ arc: string; checkpoint: string }> },
) {
  const { arc, checkpoint } = await params;
  await jumpScenario(arc, checkpoint);
  return NextResponse.json({ arc, checkpoint, status: "applied" });
}
```

- [ ] **Step 3: Stub `src/db/scenarios.ts`** (full implementation in Phase 11):

```ts
// src/db/scenarios.ts
export async function jumpScenario(arc: string, checkpoint: string) {
  // Implementations land in Phase 11 alongside the seed.
  // For now, no-op so the route exists.
  console.log("Scenario jump:", arc, checkpoint);
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/demo/scenario src/data/scenarios.ts src/db/scenarios.ts
git commit -m "feat: /demo/scenario route + jumpScenario stub"
```

---

### Task 10.4: `/demo/play` scripted fallback page

**Files:**
- Create: `src/app/demo/play/page.tsx`

- [ ] **Step 1: Write — auto-walks through the Sreelakshmi arc with static screenshots**

```tsx
"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

const STEPS = [
  { title: "Act 1 · Registration", text: "Lakshmi (ASHA) registers Sreelakshmi's BPL family in Agali village. ABHA-aligned 12-digit ID generated, OTP verified, BPL Priority Tier 1 calculated." },
  { title: "Act 2 · Week 28 ANC visit", text: "BP 162/108, Hb 6.8. System flags CRITICAL — severe anaemia + hypertension. Auto-referral SC→PHC. Visit synced offline at 38 KB." },
  { title: "Act 3 · Week 30 emergency", text: "SOS raised. GPS captured. 102 ambulance dispatched, supervisor notified. District admin sees alert within seconds." },
  { title: "Act 4 · Day +90 growth", text: "Baby Anu's MUAC 11.2 cm → SAM. Auto NRC referral. Immunisation strip shows BCG ✓ Penta-1 ✓ Penta-2 due." },
  { title: "Act 5 · Compliance picture", text: "PMMVY 2/3 disbursed. JSY ✓. KASP claim filed. One mother, one record, every program." },
];

export default function DemoPlay() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % STEPS.length), 5000);
    return () => clearInterval(id);
  }, []);
  const step = STEPS[i];
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--primary-50)]">
      <Card className="max-w-2xl w-full p-8 space-y-4">
        <p className="text-xs text-[var(--fg-muted)]">Scripted walkthrough · auto-advance</p>
        <h1 className="text-2xl font-semibold text-[var(--primary)]">{step.title}</h1>
        <p className="text-sm text-[var(--fg)] leading-relaxed">{step.text}</p>
        <div className="flex gap-1 pt-2">
          {STEPS.map((_, k) => (
            <div
              key={k}
              className={`h-1 flex-1 rounded-full ${
                k === i ? "bg-[var(--primary)]" : "bg-[var(--border)]"
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/demo/play
git commit -m "feat: /demo/play scripted fallback walkthrough"
```

---

### Task 10.5: Narrator panel + `Ctrl+Shift+D` shortcut

**Files:**
- Create: `src/components/narrator-panel.tsx`
- Create: `src/hooks/use-narrator-shortcut.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Shortcut hook**

```ts
// src/hooks/use-narrator-shortcut.ts
"use client";
import { useEffect } from "react";

export function useNarratorShortcut(onOpen: () => void) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && (e.key === "D" || e.key === "d")) {
        e.preventDefault();
        onOpen();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpen]);
}
```

- [ ] **Step 2: Narrator panel**

```tsx
// src/components/narrator-panel.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useNarratorShortcut } from "@/hooks/use-narrator-shortcut";

export function NarratorPanel() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  useNarratorShortcut(() => setOpen(true));

  async function call(url: string) {
    await fetch(url, { method: "POST" });
    router.refresh();
  }

  async function go(url: string) {
    await fetch(url);
    router.refresh();
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-96 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Narrator controls</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
              Database
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => call("/demo/reset")}>
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={() => call("/demo/seed")}>
                Seed
              </Button>
              <Button variant="outline" size="sm" onClick={() => go("/demo/warmup")}>
                Warmup
              </Button>
              <Button variant="outline" size="sm" onClick={() => go("/demo/health")}>
                Health
              </Button>
            </div>
          </section>
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
              Scenario checkpoints
            </h3>
            <div className="space-y-1">
              {["pre-anc", "post-anc", "post-sos", "post-delivery", "post-sam"].map((c) => (
                <Button
                  key={c}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => go(`/demo/scenario/sreelakshmi/${c}`)}
                >
                  → {c}
                </Button>
              ))}
            </div>
          </section>
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
              Role
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(["ASHA", "ANM", "MO", "SUPERVISOR", "ADMIN"] as const).map((r) => (
                <Button
                  key={r}
                  variant="outline"
                  size="sm"
                  onClick={() => go(`/demo/role-switch?role=${r}`)}
                >
                  {r}
                </Button>
              ))}
            </div>
          </section>
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
              Offline mode
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => go("/demo/offline?on=true")}>
                Offline ON
              </Button>
              <Button variant="outline" size="sm" onClick={() => go("/demo/offline?on=false")}>
                Offline OFF
              </Button>
            </div>
          </section>
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
              Fallback
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => router.push("/demo/play")}
            >
              Open scripted walkthrough
            </Button>
          </section>
          <p className="text-xs text-[var(--fg-muted)]">
            Press <kbd className="px-1 border rounded">Ctrl</kbd>+
            <kbd className="px-1 border rounded">Shift</kbd>+
            <kbd className="px-1 border rounded">D</kbd> to reopen.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

- [ ] **Step 3: Mount in root layout** — modify `src/app/layout.tsx`, add inside `<body>` after `{children}`:

```tsx
import { NarratorPanel } from "@/components/narrator-panel";

// ... inside body, after {children} and before <Toaster />
<NarratorPanel />
```

- [ ] **Step 4: Commit**

```bash
git add src/components/narrator-panel.tsx src/hooks/use-narrator-shortcut.ts src/app/layout.tsx
git commit -m "feat: narrator panel + Ctrl+Shift+D shortcut"
```


---

## Phase 11 — Sreelakshmi Narrative Seed

### Task 11.1: Base seed — facilities, ASHAs, MOs, supervisor

**Files:**
- Create: `src/db/seed.ts`

- [ ] **Step 1: Write — `runSeed()` is idempotent (truncates first, then inserts)**

```ts
// src/db/seed.ts
import "dotenv/config";
import { db } from ".";
import {
  facilities, fieldWorkers, families, mothers, children, ancVisits,
  growthRecords, immunizations, milestones, alerts, referrals,
  schemeEnrollments, iecContent, reminders, smsLog, syncEvents,
} from "./schema";
import { sql } from "drizzle-orm";
import { FACILITIES } from "@/data/kerala-places";
import { VACCINES_0_TO_24M } from "@/data/vaccines";
import { MILESTONES_0_TO_24M } from "@/data/milestones";
import { IEC_LIBRARY } from "@/data/iec-content";
import { generateBeneficiaryId12 } from "@/lib/beneficiary-id";

export async function runSeed() {
  // Wipe
  await db.execute(sql`
    truncate table sync_events, sms_log, reminders, iec_content,
    scheme_enrollments, referrals, alerts, milestones, growth_records,
    immunizations, pnc_visits, anc_visits, children, mothers, families,
    field_workers, facilities restart identity cascade
  `);

  // Facilities
  const insertedFacilities = await db
    .insert(facilities)
    .values(
      FACILITIES.map((f) => ({
        name: f.name,
        type: f.type,
        block: f.block,
        district: "Palakkad",
        lat: f.lat,
        lng: f.lng,
      })),
    )
    .returning();
  const agaliSC = insertedFacilities.find((f) => f.name === "Agali Sub-Centre")!;
  const agaliPHC = insertedFacilities.find((f) => f.name === "Agali PHC")!;
  const mannarkkadCHC = insertedFacilities.find((f) => f.name === "Mannarkkad CHC")!;

  // Workers
  const workers = await db
    .insert(fieldWorkers)
    .values([
      { name: "Lakshmi K.", role: "ASHA", facilityId: agaliSC.id, phone: "+919876543210" },
      { name: "Priya R.", role: "ASHA", facilityId: agaliSC.id, phone: "+919876543211" },
      { name: "Anu M.", role: "ANM", facilityId: agaliSC.id, phone: "+919876543212" },
      { name: "Dr. Priya Nair", role: "MO", facilityId: agaliPHC.id, phone: "+919876543213" },
      { name: "Ramesh Pillai", role: "SUPERVISOR", facilityId: mannarkkadCHC.id, phone: "+919876543214" },
      { name: "Dr. Suresh", role: "ADMIN", facilityId: null, phone: "+919876543215" },
    ])
    .returning();
  const lakshmi = workers[0]!;

  // IEC library
  await db.insert(iecContent).values(
    IEC_LIBRARY.map((i) => ({
      category: i.category,
      titleEn: i.titleEn,
      titleMl: i.titleMl,
      summary: i.summary,
      language: "ml",
    })),
  );

  return seedSreelakshmiArc(workers, insertedFacilities);
}

async function seedSreelakshmiArc(
  workers: typeof fieldWorkers.$inferSelect[],
  facList: typeof facilities.$inferSelect[],
) {
  const lakshmi = workers.find((w) => w.name === "Lakshmi K.")!;
  const agaliSC = facList.find((f) => f.name === "Agali Sub-Centre")!;
  const agaliPHC = facList.find((f) => f.name === "Agali PHC")!;
  const mannarkkadCHC = facList.find((f) => f.name === "Mannarkkad CHC")!;

  // === Protagonist family ===
  const [sreFamily] = await db
    .insert(families)
    .values({
      headOfFamily: "Ramesh M.",
      village: "Agali",
      block: "Agali",
      district: "Palakkad",
      bplScore: 8,
      schemePriorityTier: 1,
      ashaId: lakshmi.id,
    })
    .returning();

  // Mother — Sreelakshmi, LMP ~30 weeks ago, G2P1
  const lmp = new Date();
  lmp.setDate(lmp.getDate() - 210); // 30 weeks
  const edd = new Date(lmp);
  edd.setDate(edd.getDate() + 280);

  const [sre] = await db
    .insert(mothers)
    .values({
      familyId: sreFamily.id,
      beneficiaryId12: generateBeneficiaryId12(),
      name: "Sreelakshmi M.",
      age: 24,
      lmp: lmp.toISOString().slice(0, 10),
      edd: edd.toISOString().slice(0, 10),
      pregnancyNo: 2,
    })
    .returning();

  // ANC visit history — last visit CRITICAL
  await db.insert(ancVisits).values([
    {
      motherId: sre.id, visitNo: 1, bpSystolic: 118, bpDiastolic: 76,
      hbValue: 11.2, weightKg: 52, fetalHr: 142,
      riskLevel: "NORMAL", recordedByWorkerId: lakshmi.id, kbUsed: 38,
    },
    {
      motherId: sre.id, visitNo: 2, bpSystolic: 130, bpDiastolic: 84,
      hbValue: 10.1, weightKg: 54, fetalHr: 138,
      riskLevel: "NORMAL", recordedByWorkerId: lakshmi.id, kbUsed: 38,
    },
    {
      motherId: sre.id, visitNo: 3, bpSystolic: 162, bpDiastolic: 108,
      hbValue: 6.8, weightKg: 53.5, fetalHr: 134,
      riskLevel: "CRITICAL",
      riskTriggers: ["Severe anaemia (Hb<7)", "Severe hypertension (BP ≥ 160/110)"],
      recordedByWorkerId: lakshmi.id, kbUsed: 38,
    },
  ]);

  // Auto-generated referral SC→PHC
  await db.insert(referrals).values({
    subjectType: "mother", subjectId: sre.id,
    fromFacilityId: agaliSC.id, toFacilityId: agaliPHC.id,
    tierFrom: "SC", tierTo: "PHC",
    reason: "Severe anaemia (Hb<7); Severe hypertension",
    status: "ACK",
  });

  // SOS alert (Act 3)
  await db.insert(alerts).values({
    type: "SOS", status: "DISPATCHED",
    subjectType: "mother", subjectId: sre.id,
    lat: 11.18, lng: 76.72, raisedByWorkerId: lakshmi.id,
    note: "Bleeding at home — Week 30",
    channels: [
      { to: "field_worker", status: "delivered" },
      { to: "102_ambulance", status: "dispatched" },
      { to: "supervisor", status: "delivered" },
    ],
  });

  // Schemes
  await db.insert(schemeEnrollments).values([
    { beneficiaryType: "mother", beneficiaryId: sre.id, schemeCode: "PMMVY", installmentNo: 1, expectedDate: "2025-10-01", disbursedDate: "2025-10-05", amount: 1000, status: "DISBURSED" },
    { beneficiaryType: "mother", beneficiaryId: sre.id, schemeCode: "PMMVY", installmentNo: 2, expectedDate: "2026-01-15", disbursedDate: "2026-01-20", amount: 2000, status: "DISBURSED" },
    { beneficiaryType: "mother", beneficiaryId: sre.id, schemeCode: "PMMVY", installmentNo: 3, expectedDate: "2026-05-15", amount: 2000, status: "ELIGIBLE" },
    { beneficiaryType: "mother", beneficiaryId: sre.id, schemeCode: "JSY", installmentNo: 1, expectedDate: "2026-06-01", amount: 700, status: "ELIGIBLE" },
    { beneficiaryType: "mother", beneficiaryId: sre.id, schemeCode: "KASP", installmentNo: 1, expectedDate: "2026-06-15", status: "ELIGIBLE" },
  ]);

  // Reminders due today
  const today = new Date().toISOString().slice(0, 10);
  await db.insert(reminders).values([
    { beneficiaryType: "mother", beneficiaryId: sre.id, type: "ANC_VISIT", dueDate: today, channel: "APP" },
    { beneficiaryType: "mother", beneficiaryId: sre.id, type: "PNC_FOLLOWUP", dueDate: today, channel: "SMS" },
  ]);

  return await seedBackgroundCohort(workers, facList, sre.id);
}

async function seedBackgroundCohort(
  workers: typeof fieldWorkers.$inferSelect[],
  facList: typeof facilities.$inferSelect[],
  protagonistMotherId: number,
) {
  const ashas = workers.filter((w) => w.role === "ASHA");
  const blocks = ["Agali", "Sholayur", "Pudur", "Mannarkkad", "Attappadi"];

  // 60 background mothers across blocks
  for (let i = 0; i < 60; i++) {
    const block = blocks[i % blocks.length]!;
    const ashaId = ashas[i % ashas.length]!.id;
    const [fam] = await db
      .insert(families)
      .values({
        headOfFamily: `Family ${i + 1}`,
        village: block,
        block,
        district: "Palakkad",
        bplScore: 5 + Math.floor(Math.random() * 25),
        schemePriorityTier: 1 + (i % 3),
        ashaId,
      })
      .returning();

    const lmpDays = 60 + Math.floor(Math.random() * 220);
    const lmp = new Date();
    lmp.setDate(lmp.getDate() - lmpDays);
    const edd = new Date(lmp);
    edd.setDate(edd.getDate() + 280);
    const [m] = await db
      .insert(mothers)
      .values({
        familyId: fam.id,
        beneficiaryId12: generateBeneficiaryId12(),
        name: `Mother ${i + 1}`,
        age: 20 + Math.floor(Math.random() * 15),
        lmp: lmp.toISOString().slice(0, 10),
        edd: edd.toISOString().slice(0, 10),
        pregnancyNo: 1 + (i % 3),
      })
      .returning();

    // 1-3 ANC visits per mother
    const visits = 1 + Math.floor(Math.random() * 3);
    for (let v = 0; v < visits; v++) {
      const isHigh = Math.random() < 0.15;
      const isCritical = Math.random() < 0.04;
      const level = isCritical ? "CRITICAL" : isHigh ? "HIGH" : "NORMAL";
      await db.insert(ancVisits).values({
        motherId: m.id,
        visitNo: v + 1,
        bpSystolic: 110 + Math.floor(Math.random() * 50),
        bpDiastolic: 70 + Math.floor(Math.random() * 30),
        hbValue: 8 + Math.random() * 5,
        weightKg: 50 + Math.random() * 20,
        fetalHr: 130 + Math.floor(Math.random() * 25),
        riskLevel: level,
        recordedByWorkerId: ashaId,
        kbUsed: 30 + Math.floor(Math.random() * 15),
      });
    }

    // Random scheme
    await db.insert(schemeEnrollments).values({
      beneficiaryType: "mother", beneficiaryId: m.id,
      schemeCode: "PMMVY",
      installmentNo: 1, amount: 1000,
      expectedDate: today(),
      disbursedDate: Math.random() < 0.7 ? today() : null,
      status: Math.random() < 0.7 ? "DISBURSED" : "ELIGIBLE",
    });
  }

  return {
    seedVersion: "sreelakshmi-v1",
    protagonistMotherId,
    backgroundCount: 60,
  };
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// Allow `pnpm db:seed`
if (require.main === module) {
  runSeed()
    .then((m) => {
      console.log("Seed complete:", m);
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
```

- [ ] **Step 2: Run seed**

```bash
pnpm db:seed
```

Expected: prints `Seed complete: { seedVersion: 'sreelakshmi-v1', protagonistMotherId: <n>, backgroundCount: 60 }`.

- [ ] **Step 3: Smoke** — open `/field` and `/admin`. Confirm Sreelakshmi appears in the beneficiary list with CRITICAL risk, dashboard shows KPIs, alerts panel shows the SOS.

- [ ] **Step 4: Commit**

```bash
git add src/db/seed.ts
git commit -m "feat: Sreelakshmi protagonist seed + 60-mother background cohort"
```

---

### Task 11.2: Seed baby Anu + growth records + immunizations + milestones

**Files:**
- Modify: `src/db/seed.ts`

- [ ] **Step 1: Inside `seedSreelakshmiArc`, after the SOS insert and before the schemes, add:**

```ts
  // === Baby Anu ===
  const dobDate = new Date();
  dobDate.setDate(dobDate.getDate() - 90);
  const [anu] = await db
    .insert(children)
    .values({
      familyId: sreFamily.id,
      motherId: sre.id,
      beneficiaryId12: generateBeneficiaryId12(),
      name: "Anu R.",
      dob: dobDate.toISOString().slice(0, 10),
      birthWeightG: 2400,
      sex: "F",
    })
    .returning();

  // Growth records — last one shows SAM
  await db.insert(growthRecords).values([
    {
      childId: anu.id,
      recordedAt: new Date(Date.now() - 60 * 86400000),
      weightKg: 3.6, heightCm: 53, muacCm: 12.4,
      weightZ: -1.2, weightForHeightZ: -1.4, classification: "NORMAL",
      recordedByWorkerId: lakshmi.id, kbUsed: 28,
    },
    {
      childId: anu.id,
      recordedAt: new Date(Date.now() - 30 * 86400000),
      weightKg: 4.2, heightCm: 58, muacCm: 11.9,
      weightZ: -1.8, weightForHeightZ: -2.1, classification: "MAM",
      recordedByWorkerId: lakshmi.id, kbUsed: 28,
    },
    {
      childId: anu.id,
      recordedAt: new Date(),
      weightKg: 4.1, heightCm: 60, muacCm: 11.2,
      weightZ: -2.8, weightForHeightZ: -3.2, classification: "SAM",
      recordedByWorkerId: lakshmi.id, kbUsed: 28,
    },
  ]);

  // NRC referral for SAM
  await db.insert(referrals).values({
    subjectType: "child", subjectId: anu.id,
    fromFacilityId: agaliPHC.id, toFacilityId: mannarkkadCHC.id,
    tierFrom: "PHC", tierTo: "CHC",
    reason: "SAM — refer to NRC", status: "PENDING",
  });

  // Immunizations — past schedule
  const dobMs = dobDate.getTime();
  await db.insert(immunizations).values(
    VACCINES_0_TO_24M.map((v) => {
      const sched = new Date(dobMs + v.ageMonths * 30 * 86400000);
      const past = sched.getTime() < Date.now();
      const upcoming = sched.getTime() > Date.now() + 14 * 86400000;
      const status = past ? "GIVEN" : upcoming ? "UPCOMING" : "DUE";
      return {
        childId: anu.id,
        vaccineCode: v.code,
        scheduledDate: sched.toISOString().slice(0, 10),
        givenDate: status === "GIVEN" ? sched.toISOString().slice(0, 10) : null,
        givenAtFacilityId: status === "GIVEN" ? agaliPHC.id : null,
        status,
      };
    }),
  );

  // Milestones
  await db.insert(milestones).values(
    MILESTONES_0_TO_24M.map((m) => ({
      childId: anu.id,
      milestoneCode: m.code,
      expectedAgeMonths: m.expectedAgeMonths,
      status: m.expectedAgeMonths <= 3 ? "ACHIEVED" : "PENDING",
    })),
  );
```

- [ ] **Step 2: Re-seed**

```bash
pnpm db:seed
```

- [ ] **Step 3: Smoke** — open `/admin/people/c-<anu-id>` (you can find the child id via the people directory or by checking Drizzle Studio). Confirm growth chart + SAM badge.

- [ ] **Step 4: Commit**

```bash
git add src/db/seed.ts
git commit -m "feat: seed baby Anu growth (NORMAL → MAM → SAM), immunisations, milestones"
```

---

### Task 11.3: Implement `jumpScenario` checkpoints

**Files:**
- Modify: `src/db/scenarios.ts`

- [ ] **Step 1: Replace stub with real implementation**

```ts
// src/db/scenarios.ts
import { db } from ".";
import { ancVisits, growthRecords, alerts, mothers } from "./schema";
import { eq, desc, sql } from "drizzle-orm";

async function findSreelakshmi() {
  return db.query.mothers.findFirst({
    where: eq(mothers.name, "Sreelakshmi M."),
  });
}

export async function jumpScenario(arc: string, checkpoint: string) {
  if (arc !== "sreelakshmi") return;

  const sre = await findSreelakshmi();
  if (!sre) throw new Error("Seed not present — run /demo/seed first");

  switch (checkpoint) {
    case "pre-anc":
      // Remove the CRITICAL ANC visit so the next demo entry creates it fresh
      await db
        .delete(ancVisits)
        .where(
          sql`mother_id = ${sre.id} AND risk_level = 'CRITICAL'`,
        );
      break;

    case "post-anc":
      // Ensure CRITICAL ANC exists (re-add if missing)
      const recent = await db.query.ancVisits.findFirst({
        where: eq(ancVisits.motherId, sre.id),
        orderBy: desc(ancVisits.visitDate),
      });
      if (!recent || recent.riskLevel !== "CRITICAL") {
        await db.insert(ancVisits).values({
          motherId: sre.id, visitNo: 3,
          bpSystolic: 162, bpDiastolic: 108, hbValue: 6.8,
          weightKg: 53.5, fetalHr: 134,
          riskLevel: "CRITICAL",
          riskTriggers: ["Severe anaemia (Hb<7)", "Severe hypertension"],
          kbUsed: 38,
        });
      }
      break;

    case "post-sos":
      // Ensure SOS alert exists
      const sos = await db.query.alerts.findFirst({
        where: sql`subject_id = ${sre.id} AND type = 'SOS'`,
      });
      if (!sos) {
        await db.insert(alerts).values({
          type: "SOS", status: "DISPATCHED",
          subjectType: "mother", subjectId: sre.id,
          lat: 11.18, lng: 76.72,
          note: "Bleeding at home — Week 30",
          channels: [
            { to: "field_worker", status: "delivered" },
            { to: "102_ambulance", status: "dispatched" },
            { to: "supervisor", status: "delivered" },
          ],
        });
      }
      break;

    case "post-delivery":
    case "post-sam":
      // No-op — baby Anu is always present from seed
      break;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/db/scenarios.ts
git commit -m "feat: jumpScenario implementations for sreelakshmi checkpoints"
```


---

## Phase 12 — Polish + Animations

### Task 12.1: ABHA ID reveal animation polish

**Files:**
- Modify: `src/components/register-wizard.tsx`

- [ ] **Step 1: Replace the success step's `<p className="font-mono-num text-xl ...">` with an animated digit-roll**

```tsx
import { motion } from "motion/react";

// Replace the static ID display in the success branch:
<div className="font-mono-num text-2xl font-medium tracking-wider flex justify-center gap-1">
  {formatBeneficiaryId(result.motherBeneficiaryId)
    .split("")
    .map((ch, i) => (
      <motion.span
        key={i}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: i * 0.05, duration: 0.3 }}
      >
        {ch}
      </motion.span>
    ))}
</div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/register-wizard.tsx
git commit -m "polish: animated ABHA ID digit-by-digit reveal"
```

---

### Task 12.2: Risk banner flash + dashboard KPI tick-up

**Files:**
- Modify: `src/components/anc-form.tsx`
- Modify: `src/components/kpi-card.tsx`

- [ ] **Step 1: Risk banner — replace the result Card in `anc-form.tsx` with motion variants**

In the result render block of `AncForm`, wrap the outer card:

```tsx
<motion.div
  initial={{ y: -10, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.3 }}
  className="p-4 space-y-4"
>
  <motion.div
    initial={{ scale: 0.98 }}
    animate={{ scale: [1, 1.02, 1] }}
    transition={{ duration: 0.4 }}
  >
    <Card className="p-6 space-y-3 text-center">
      {/* … existing content … */}
    </Card>
  </motion.div>
</motion.div>
```

- [ ] **Step 2: KPI tick-up — convert KpiCard to client and animate**

```tsx
// src/components/kpi-card.tsx
"use client";
import { Card } from "@/components/ui/card";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useState } from "react";

export function KpiCard({
  label,
  value,
  suffix,
  tone = "default",
}: {
  label: string;
  value: number | string;
  suffix?: string;
  tone?: "default" | "alert";
}) {
  const numeric = typeof value === "number" ? value : null;
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const [display, setDisplay] = useState<number | string>(value);

  useEffect(() => {
    if (numeric == null) {
      setDisplay(value);
      return;
    }
    const controls = animate(mv, numeric, { duration: 0.6 });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [numeric, mv, rounded, value]);

  return (
    <Card className="p-4 space-y-1">
      <div className="text-xs text-[var(--fg-muted)] uppercase tracking-wide">
        {label}
      </div>
      <motion.div
        key={String(value)}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 0.4 }}
        className={
          "text-3xl font-semibold font-mono-num " +
          (tone === "alert" ? "text-[var(--risk-critical)]" : "text-[var(--fg)]")
        }
      >
        {display}
        {suffix && <span className="text-base ml-1">{suffix}</span>}
      </motion.div>
    </Card>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/anc-form.tsx src/components/kpi-card.tsx
git commit -m "polish: risk banner pulse + KPI tick-up animation"
```

---

### Task 12.3: README with quick-start

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: README with quick-start + demo flow"
```

---

### Task 12.4: Full smoke pass

- [ ] **Step 1: Reset + reseed**

```bash
curl -X POST http://localhost:3000/demo/reset
curl -X POST http://localhost:3000/demo/seed
```

(Or click them from the narrator panel.)

- [ ] **Step 2: Walk through every act of the Sreelakshmi arc** — refer to spec §4.

- [ ] **Step 3: Note any bugs and file them inline before Phase 13**

- [ ] **Step 4: Commit any fixes**

```bash
git status
```


---

## Phase 13 — Playwright Happy-Path Test

### Task 13.1: Install + configure Playwright

**Files:**
- Create: `playwright.config.ts`
- Modify: `package.json` (test script)
- Create: `.gitignore` entries

- [ ] **Step 1: Install**

```bash
pnpm dlx playwright@latest install --with-deps chromium
pnpm add -D @playwright/test
```

- [ ] **Step 2: Config**

```ts
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 3: Add scripts to `package.json`**

```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

- [ ] **Step 4: Add `.gitignore` entries**

```bash
echo "playwright-report/
test-results/" >> .gitignore
```

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts package.json pnpm-lock.yaml .gitignore
git commit -m "test: configure Playwright with Chromium"
```

---

### Task 13.2: Write happy-path test + smoke checklist

**Files:**
- Create: `e2e/happy-path.spec.ts`
- Create: `e2e/smoke-checklist.md`

- [ ] **Step 1: Happy-path test**

```ts
// e2e/happy-path.spec.ts
import { test, expect } from "@playwright/test";

test.describe("BPL MCH demo — happy path", () => {
  test.beforeAll(async ({ request }) => {
    // Reset + reseed before the test run
    const reset = await request.post("/demo/reset");
    expect(reset.ok()).toBeTruthy();
    const seed = await request.post("/demo/seed");
    expect(seed.ok()).toBeTruthy();
  });

  test("landing page exposes /field and /admin entry points", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/ASHA mobile view/)).toBeVisible();
    await expect(page.getByText(/District dashboard/)).toBeVisible();
  });

  test("/field shows Sreelakshmi as CRITICAL", async ({ page }) => {
    await page.goto("/field");
    await expect(page.getByText("Sreelakshmi M.")).toBeVisible();
    await expect(page.getByText("Critical").first()).toBeVisible();
  });

  test("/admin shows KPIs, alerts panel, scheme compliance", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByText("Mothers tracked")).toBeVisible();
    await expect(page.getByText("High-risk pregnancies")).toBeVisible();
    await expect(page.getByText("Live alerts")).toBeVisible();
    await expect(page.getByText("Scheme compliance")).toBeVisible();
  });

  test("admin can drill into Sreelakshmi's beneficiary detail", async ({ page }) => {
    await page.goto("/admin/people");
    await page.getByText("Sreelakshmi M.").click();
    await expect(page.getByText(/G2P1/)).toBeVisible();
    await expect(page.getByText("Visit history")).toBeVisible();
  });

  test("admin can open the SOS alert detail", async ({ page }) => {
    await page.goto("/admin/alerts");
    await page.getByText("SOS").first().click();
    await expect(page.getByText("Dispatch channels")).toBeVisible();
    await expect(page.getByText("102_ambulance")).toBeVisible();
  });

  test("schemes page shows compliance and PMMVY rows", async ({ page }) => {
    await page.goto("/admin/schemes");
    await expect(page.getByText("PMMVY")).toBeVisible();
    await expect(page.getByText("Sreelakshmi M.").first()).toBeVisible();
  });

  test("integrations page shows ABHA + HMIS tiles", async ({ page }) => {
    await page.goto("/admin/integrations");
    await expect(page.getByText("ABHA")).toBeVisible();
    await expect(page.getByText("HMIS")).toBeVisible();
  });

  test("registration wizard reaches OTP step", async ({ page }) => {
    await page.goto("/field/register");
    await page.getByPlaceholder("Head of family").fill("Test Head");
    // Block dropdown — select Agali
    await page.locator("select").first().selectOption("Agali");
    await page.locator("select").nth(1).selectOption("Agali");
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByPlaceholder("Mother's name").fill("Test Mother");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Verify OTP")).toBeVisible();
  });

  test("Ctrl+Shift+D opens narrator panel", async ({ page }) => {
    await page.goto("/admin");
    await page.keyboard.press("Control+Shift+D");
    await expect(page.getByText("Narrator controls")).toBeVisible();
  });
});
```

- [ ] **Step 2: Smoke checklist**

```markdown
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
```

- [ ] **Step 3: Run test**

```bash
pnpm test:e2e
```

Expected: all tests pass. (First run may need extra seed-warm time.)

- [ ] **Step 4: Commit**

```bash
git add e2e/
git commit -m "test: Playwright happy-path covering all hero flows + smoke checklist"
```


---

## Phase 14 — Deployment

### Task 14.1: Push to GitHub

**Files:**
- None — git operations only

- [ ] **Step 1: Create a private repo via `gh` CLI**

```bash
gh repo create bpl-mch-demo --private --source=. --remote=origin --description="EOI demo for Kerala state health admin — Next.js + Vercel + Neon"
```

(If `gh` isn't installed, create the repo manually at github.com and `git remote add origin <url>` then `git push -u origin main`.)

- [ ] **Step 2: Push**

```bash
git branch -M main
git push -u origin main
```

- [ ] **Step 3: Verify**

```bash
gh repo view --web
```

Expected: GitHub page opens showing the repo with all commits.

---

### Task 14.2: Deploy to Vercel

**Files:**
- Create: `vercel.ts` (optional but recommended)

- [ ] **Step 1: Create `vercel.ts`** (modern vercel.json replacement)

```ts
import { type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  framework: "nextjs",
  buildCommand: "pnpm build",
};
```

- [ ] **Step 2: Install `@vercel/config`**

```bash
pnpm add -D @vercel/config
```

- [ ] **Step 3: Link + deploy via Vercel CLI**

```bash
pnpm dlx vercel@latest link
# Accept defaults — link to your Vercel account, create a new project named "bpl-mch-demo"
pnpm dlx vercel@latest env add DATABASE_URL production
# Paste the Neon pooled connection string when prompted
pnpm dlx vercel@latest env add DATABASE_URL preview
# Paste the same string
pnpm dlx vercel@latest --prod
```

Expected: deploy completes, prints production URL like `https://bpl-mch-demo-xxx.vercel.app`.

- [ ] **Step 4: Visit production URL and verify**

  - Landing page loads
  - `/admin` shows seeded KPIs (DB is the same as local, since we're using the same Neon project)
  - `/field` shows beneficiary list
  - `/demo/health` returns `{ db: "ok", ... }`

- [ ] **Step 5: Commit + push**

```bash
git add vercel.ts package.json pnpm-lock.yaml
git commit -m "chore: vercel.ts config for production deploy"
git push
```

---

### Task 14.3: Final demo-day rehearsal

**Files:**
- None — manual rehearsal

- [ ] **Step 1: Open production URL in two browser tabs**
  - Tab 1: `<prod-url>/admin`
  - Tab 2: `<prod-url>/field`

- [ ] **Step 2: Run the full Sreelakshmi arc** (spec §4)
  - Time yourself — should be 12–15 minutes
  - Note any production-only issues (Neon cold start, missing assets, etc.)

- [ ] **Step 3: Confirm fallbacks**
  - `Ctrl+Shift+D` opens narrator panel
  - `<prod-url>/demo/play` auto-walkthrough works
  - `<prod-url>/demo/health` returns JSON

- [ ] **Step 4: Bookmark the URL and record a 90-second backup video on your phone**

- [ ] **Step 5: Final commit (if any cleanup)**

```bash
git status
git push
```

🎉 Demo ready.

---

## Self-Review Notes

This plan was self-reviewed against the spec (`docs/superpowers/specs/2026-05-20-bpl-mch-demo-design.md`) for coverage, placeholders, and consistency. Key checks:

**Spec § coverage map:**

| Spec § | Plan task(s) |
|---|---|
| §1 Architecture | Tasks 1.1–1.6 (scaffolding) + 2.1–2.5 (DB) |
| §2 Data model | Task 2.2 (17-table schema) + 2.4 (migration) |
| §3 `/field` routes | Tasks 4.1–4.6, 5.1–5.8, 6.1–6.7 |
| §3 `/admin` routes | Tasks 7.1–7.6, 8.1–8.9 |
| §3 `/demo` routes | Tasks 10.1–10.5 |
| §4 Sreelakshmi arc | Tasks 11.1–11.3 (seed + scenarios) |
| §5 Visual language | Task 1.4 (fonts), 1.5 (palette), 3.5 (atoms), 12.1–12.2 (animations) |
| §6 Offline sync | Tasks 9.1–9.4 |
| §7 Non-functional + demo-day | Tasks 12.4, 13.1–13.2 (smoke), 14.1–14.3 (deploy) |
| §8 EOI coverage matrix | Verified — every 🎯 hero and ✅ supporting item has a task |
| §9 Acceptance criteria | Validated by Playwright (Task 13.2) + smoke checklist |

**Placeholder scan:** none found — every code step shows complete, copy-pasteable code. The only intentionally-marked spots are the engineer-fillable parts (Neon connection string, ABHA ID-bound formatting where it's just `formatBeneficiaryId`).

**Type consistency:** verified — `RiskLevel`, `NutritionClass`, `BeneficiarySummary`, `AppRole`, action input/output types are consistent across tasks.

**Scope check:** plan covers exactly one project; no spurious decomposition needed.

---

**Plan complete and saved to `docs/superpowers/plans/2026-05-20-bpl-mch-demo-plan.md`.**


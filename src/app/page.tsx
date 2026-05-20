import Link from "next/link";
import {
  ArrowRight,
  Activity,
  AlertTriangle,
  Baby,
  CheckCircle2,
  ChevronRight,
  Database,
  HeartPulse,
  ListChecks,
  MapPin,
  Plug,
  ShieldCheck,
  Siren,
  Sparkles,
  Smartphone,
  Stethoscope,
  Syringe,
  Users,
  Wallet,
  WifiOff,
  Languages,
  Hash,
  TrendingDown,
  Building2,
  Eye,
  Briefcase,
  Fingerprint,
  Workflow,
} from "lucide-react";

import { PalakkadMap } from "@/components/palakkad-map";
import { RiskBadge } from "@/components/risk-badge";
import { PersonAvatar } from "@/components/person-avatar";
import { AnimatedWord } from "@/components/animated-word";
import {
  getOverviewKpis,
  getBlockRiskCounts,
} from "@/lib/queries/admin-overview";

// ─────────────────────────────────────────────────────────────────────────────
// Landing page — full EOI walkthrough with live product surfaces embedded.

export default async function Home() {
  const [kpis, blocks] = await Promise.all([
    getOverviewKpis(),
    getBlockRiskCounts(),
  ]);

  return (
    <main className="min-h-screen bg-[var(--surface)] text-[var(--fg)] overflow-x-clip">
      <Nav />
      <Hero kpis={kpis} />
      <ProblemBand />
      <PhasesSection />
      <LiveMapSection blocks={blocks} />
      <InnovationsGrid />
      <OutcomesGrid />
      <IntegrationsSection />
      <RolesSection />
      <FinalCta />
      <Footer />
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span
            className="grid size-8 place-items-center rounded-xl shadow-primary-sm"
            style={{ background: "var(--gradient-primary)" }}
          >
            <span className="text-[10px] font-bold tracking-tighter text-white">
              MCH
            </span>
          </span>
          <span className="hidden text-sm font-semibold tracking-tight sm:inline">
            Kerala MCH Tracker
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-xs font-medium text-[var(--fg-muted)] md:flex">
          <a href="#phases" className="hover:text-[var(--fg)]">Phases</a>
          <a href="#map" className="hover:text-[var(--fg)]">Live map</a>
          <a href="#innovations" className="hover:text-[var(--fg)]">Innovations</a>
          <a href="#outcomes" className="hover:text-[var(--fg)]">Outcomes</a>
          <a href="#integrations" className="hover:text-[var(--fg)]">Integrations</a>
          <a href="#roles" className="hover:text-[var(--fg)]">Roles</a>
        </nav>
        <div className="flex items-center gap-1.5">
          <Link
            href="/field"
            className="hidden sm:inline-flex h-8 items-center gap-1 rounded-full border border-[var(--border)] bg-white px-3 text-[11px] font-semibold text-[var(--fg-muted)] hover:bg-[var(--surface-alt)]"
          >
            <Smartphone className="size-3" />
            ASHA app
          </Link>
          <Link
            href="/admin"
            className="inline-flex h-8 items-center gap-1 rounded-full bg-gradient-primary px-3 text-[11px] font-semibold text-white shadow-primary-sm hover:opacity-95"
          >
            Admin dashboard
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function Hero({ kpis }: { kpis: Awaited<ReturnType<typeof getOverviewKpis>> }) {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[640px]"
        style={{ background: "var(--gradient-mesh)" }}
      />
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-16 lg:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-[var(--border)] px-3 py-1 text-[11px] font-medium text-[var(--fg-muted)] shadow-card">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 size-1.5 rounded-full bg-[var(--primary)] animate-ping opacity-70" />
                <span className="relative size-1.5 rounded-full bg-[var(--primary)]" />
              </span>
              <span>Demonstration · National Health Mission · Palakkad pilot</span>
            </div>
            <h1 className="text-[44px] sm:text-6xl lg:text-[5.25rem] font-semibold tracking-tight leading-[1.05] text-[var(--fg)]">
              Every{" "}
              <AnimatedWord
                words={["mother.", "village.", "visit.", "alert.", "child."]}
                className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary-deep)] via-[var(--primary)] to-[var(--primary-bright)]"
              />
            </h1>
            <p className="max-w-xl text-[15px] sm:text-lg leading-relaxed text-[var(--fg-muted)]">
              Maternal &amp; child health for the populations the system usually
              misses. <span className="text-[var(--fg)] font-medium">Caught early, routed fast, counted every time</span> — from the
              ASHA&apos;s phone in Attappadi to the District Hospital in Palakkad.
              Offline-first. Vernacular. ABHA-aligned.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/field"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-gradient-primary px-5 text-sm font-semibold text-white shadow-primary hover:shadow-[0_10px_28px_rgba(0,168,132,0.3)] active:scale-[0.98] transition-all"
              >
                <Smartphone className="size-4" />
                Open ASHA app
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/admin"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--border)] bg-white px-5 text-sm font-semibold text-[var(--fg)] shadow-card hover:bg-[var(--surface-alt)]"
              >
                District dashboard
                <ArrowRight className="size-4" />
              </Link>
              <span className="text-xs text-[var(--fg-subtle)]">
                Press <kbd className="rounded border border-[var(--border)] bg-white px-1.5 py-0.5 font-mono-num text-[10px]">Ctrl+Shift+D</kbd> for narrator
              </span>
            </div>
            {/* Trust strip */}
            <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
              {[
                { label: "Mothers tracked", value: String(kpis.mothersTracked), suffix: "" },
                { label: "Per visit", value: "<50", suffix: "KB" },
                { label: "Works on", value: "2G", suffix: "" },
                { label: "Languages", value: "2", suffix: "" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-[var(--border)] bg-white p-3 shadow-card"
                >
                  <div className="font-mono-num text-xl sm:text-2xl font-semibold tracking-tight text-[var(--fg)]">
                    {s.value}
                    {s.suffix && (
                      <span className="ml-1 text-base font-medium text-[var(--fg-muted)]">
                        {s.suffix}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--fg-muted)] mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — product preview card */}
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Soft halo behind card — premium glow */}
      <div
        aria-hidden
        className="absolute -inset-8 rounded-[3rem] opacity-30 blur-3xl"
        style={{ background: "var(--gradient-primary)" }}
      />
      <div className="relative rounded-[2rem] border border-[var(--border)] bg-white shadow-elevated overflow-hidden">
        {/* Card header — eyebrow */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--primary)]">
            <Sparkles className="size-2.5" />
            Live preview
          </span>
          <span className="text-[10px] uppercase tracking-wider text-[var(--fg-subtle)] font-mono-num">
            ASHA · Attappadi
          </span>
        </div>

        {/* Profile row */}
        <div className="px-6 pb-5 flex items-center gap-3">
          <PersonAvatar
            name="Sreelakshmi M."
            seed="hero-srlk"
            kind="woman"
            className="size-12 rounded-2xl text-sm"
          />
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold tracking-tight">
              Sreelakshmi M.
            </div>
            <div className="text-[11px] text-[var(--fg-muted)] mt-0.5 font-mono-num">
              3360 1406 1525 · G2P1 · 30w
            </div>
          </div>
          <RiskBadge level="CRITICAL" />
        </div>

        {/* Vitals — neutral tiles, only the digits carry the alarm tone */}
        <div className="border-y border-[var(--border)] bg-[var(--surface-alt)]/60">
          <div className="grid grid-cols-3 divide-x divide-[var(--border)]">
            {[
              { label: "BP · mmHg", value: "162/108", critical: true },
              { label: "Hb · g/dL", value: "6.8", critical: true },
              { label: "Weight · kg", value: "53.5", critical: false },
            ].map((v) => (
              <div key={v.label} className="px-4 py-4">
                <div className="flex items-center gap-1.5 text-[9.5px] uppercase tracking-wider text-[var(--fg-muted)]">
                  {v.critical && (
                    <span
                      aria-hidden
                      className="size-1.5 rounded-full bg-[var(--risk-critical)]"
                    />
                  )}
                  <span>{v.label}</span>
                </div>
                <div
                  className={
                    "font-mono-num text-xl font-semibold tracking-tight mt-1 tabular-nums " +
                    (v.critical
                      ? "text-[var(--risk-critical)]"
                      : "text-[var(--fg)]")
                  }
                >
                  {v.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Triage — clean alert strip, not flood-filled */}
        <div className="px-6 py-4">
          <div className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-white shadow-card overflow-hidden">
            <span
              aria-hidden
              className="w-1 self-stretch bg-[var(--risk-critical)]"
            />
            <div className="py-3 pr-4 min-w-0 flex items-start gap-2.5">
              <span className="size-7 rounded-full bg-[var(--risk-critical)]/10 grid place-items-center shrink-0 mt-0.5">
                <AlertTriangle className="size-3.5 text-[var(--risk-critical)]" />
              </span>
              <div className="space-y-1 min-w-0">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fg)]">
                  Auto-triage <span className="text-[var(--risk-critical)]">· Critical</span>
                </div>
                <div className="text-xs text-[var(--fg-muted)] leading-relaxed">
                  Severe anaemia and severe hypertension detected. Referral
                  routed to PHC · 102 dispatched · MO paged.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dispatch list — clean rows, premium */}
        <div className="px-6 pb-5 space-y-1.5">
          {[
            { Icon: Users, label: "Field worker", time: "0s" },
            { Icon: Siren, label: "102 ambulance", time: "0s" },
            { Icon: Stethoscope, label: "Block supervisor", time: "0s" },
          ].map((c) => (
            <div
              key={c.label}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-white px-3 py-2"
            >
              <div className="flex items-center gap-2.5">
                <span className="size-7 rounded-lg bg-[var(--primary-50)] grid place-items-center">
                  <c.Icon className="size-3.5 text-[var(--primary)]" />
                </span>
                <span className="text-[12.5px] font-medium text-[var(--fg)]">
                  {c.label}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono-num text-[var(--fg-muted)]">
                <span>{c.time}</span>
                <CheckCircle2
                  className="size-3.5 text-[var(--primary)]"
                  strokeWidth={2.5}
                />
              </span>
            </div>
          ))}
        </div>

        {/* Footer ribbon */}
        <div className="border-t border-[var(--border)] bg-[var(--surface-alt)]/60 px-6 py-3 flex items-center justify-between text-[10px]">
          <span className="inline-flex items-center gap-1.5 font-mono-num text-[var(--fg-muted)]">
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 size-1.5 rounded-full bg-[var(--primary)] animate-ping opacity-70" />
              <span className="relative size-1.5 rounded-full bg-[var(--primary)]" />
            </span>
            Synced · 2.4 KB
          </span>
          <span className="text-[var(--fg-subtle)]">
            Recorded by <span className="text-[var(--fg)] font-medium">Lakshmi K.</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function ProblemBand() {
  const items = [
    {
      Icon: WifiOff,
      title: "Connectivity gaps",
      body: "Attappadi tribal blocks operate at 2G. Existing health apps assume always-online — and quietly drop data when they can't sync.",
    },
    {
      Icon: TrendingDown,
      title: "Late risk detection",
      body: "Critical maternal anaemia and hypertension are caught at the hospital, not at home. By Week 30, intervention windows are narrow.",
    },
    {
      Icon: Siren,
      title: "Fragmented response",
      body: "ASHA, 102 ambulance, supervisor, MO — four phone trees. By the time everyone is on the call, the bleeding is hours old.",
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="mb-8 sm:mb-10 max-w-2xl">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
          The problem
        </div>
        <h2 className="mt-2 text-[26px] sm:text-4xl font-semibold tracking-tight leading-[1.15]">
          Three failure points in last-mile maternal care.
        </h2>
        <p className="mt-3 text-sm text-[var(--fg-muted)]">
          The platform is engineered around fixing each one without adding to
          the ASHA worker&apos;s cognitive load.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-card"
          >
            <div className="size-9 rounded-xl bg-[var(--risk-critical)]/10 grid place-items-center text-[var(--risk-critical)] mb-3">
              <p.Icon className="size-4" />
            </div>
            <h3 className="font-semibold tracking-tight">{p.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--fg-muted)]">
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface Phase {
  num: string;
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  features: { Icon: React.ComponentType<{ className?: string }>; text: string }[];
  preview: React.ReactNode;
}

function PhasesSection() {
  const phases: Phase[] = [
    {
      num: "01",
      Icon: Fingerprint,
      title: "Onboarding & registration",
      subtitle:
        "Each beneficiary gets a 12-digit ABHA-aligned ID with OTP verification — even when the network falls back to 2G.",
      features: [
        { Icon: Hash, text: "12-digit ABHA/UHID-aligned beneficiary ID" },
        { Icon: ShieldCheck, text: "OTP authentication with offline fallback" },
        { Icon: Users, text: "Mother + child (0–24 mo) + family linkage" },
        { Icon: MapPin, text: "Field worker (ASHA/ANM) auto-mapped" },
      ],
      preview: <PhaseOnePreview />,
    },
    {
      num: "02",
      Icon: Eye,
      title: "Unified dashboard & profiling",
      subtitle:
        "One record per person — pregnancy timeline, growth curve, family BPL tier. Risk is computed automatically from every visit.",
      features: [
        { Icon: HeartPulse, text: "Mother profile · LMP, EDD, automated risk scoring" },
        { Icon: Baby, text: "Child profile · birth details, WHO Z-score" },
        { Icon: Wallet, text: "Family profile · BPL index & scheme priority" },
        { Icon: ListChecks, text: "Live view across blocks, sub-centres, ASHAs" },
      ],
      preview: <PhaseTwoPreview />,
    },
    {
      num: "03",
      Icon: Activity,
      title: "Core health tracking",
      subtitle:
        "Every clinical touchpoint instrumented. The system flags severe anaemia, hypertension, and SAM/MAM without waiting for a doctor to notice.",
      features: [
        { Icon: HeartPulse, text: "Antenatal & postnatal visit capture" },
        { Icon: Syringe, text: "Immunisation schedule + compliance tracking" },
        { Icon: AlertTriangle, text: "Auto risk-class · Normal / High / Critical" },
        { Icon: Baby, text: "Growth + milestones (0–24 months)" },
        { Icon: Wallet, text: "PMMVY · JSY · JSSK · KASP eligibility" },
      ],
      preview: <PhaseThreePreview />,
    },
    {
      num: "04",
      Icon: Siren,
      title: "Escalation & referral",
      subtitle:
        "SOS reaches the field worker, 102 ambulance, and the block supervisor in the same second — with GPS. Referrals route SC → PHC → CHC → DH.",
      features: [
        { Icon: Siren, text: "One-tap SOS · multi-channel dispatch" },
        { Icon: MapPin, text: "GPS coordinates captured automatically" },
        { Icon: Workflow, text: "Tier-aware escalation across the cascade" },
        { Icon: Building2, text: "Real-time notice to the receiving facility" },
      ],
      preview: <PhaseFourPreview />,
    },
    {
      num: "05",
      Icon: WifiOff,
      title: "Reminders, IEC & offline",
      subtitle:
        "Built for 2G. Every action is queued, every reminder lands as a vernacular SMS when the app can't. Counselling content is bilingual by default.",
      features: [
        { Icon: ListChecks, text: "Automated ANC/PNC/immunisation reminders" },
        { Icon: Languages, text: "Vernacular SMS fallback · DLT registered" },
        { Icon: Database, text: "Local queue, sync on reconnect" },
        { Icon: TrendingDown, text: "<50 KB per visit · 2G-ready" },
        { Icon: HeartPulse, text: "IEC cards · nutrition, delivery, newborn care" },
      ],
      preview: <PhaseFivePreview />,
    },
  ];

  return (
    <section id="phases" className="relative border-t border-[var(--border)] bg-[var(--surface-alt)]/60 py-14 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 sm:mb-12 max-w-2xl">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
            Scope · five phases
          </div>
          <h2 className="mt-2 text-[26px] sm:text-4xl font-semibold tracking-tight leading-[1.15]">
            A complete lifecycle for maternal and child health.
          </h2>
          <p className="mt-3 text-sm text-[var(--fg-muted)]">
            From the first beneficiary registration to the last
            immunisation at 24 months. Every phase is already shipping in the
            demo — open the corresponding portal to walk through it live.
          </p>
        </div>
        <div className="space-y-10 sm:space-y-14">
          {phases.map((p, i) => (
            <article
              key={p.num}
              className={
                "grid items-stretch gap-6 lg:grid-cols-2 lg:gap-10 " +
                (i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : "")
              }
            >
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[var(--border)] px-2.5 py-1 text-[10px] font-mono-num font-bold tracking-[0.16em] text-[var(--primary)] shadow-card">
                    PHASE {p.num}
                  </span>
                  <div className="size-9 rounded-xl bg-[var(--primary-50)] grid place-items-center text-[var(--primary)] shadow-primary-sm">
                    <p.Icon className="size-4" />
                  </div>
                </div>
                <h3 className="text-[22px] sm:text-3xl font-semibold tracking-tight leading-[1.15]">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--fg-muted)]">
                  {p.subtitle}
                </p>
                <ul className="space-y-2.5">
                  {p.features.map((f) => (
                    <li
                      key={f.text}
                      className="flex items-start gap-2.5 text-sm text-[var(--fg)]"
                    >
                      <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary-50)] text-[var(--primary)]">
                        <CheckCircle2 className="size-3.5" />
                      </span>
                      <span className="leading-snug">{f.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">{p.preview}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Phase previews ──────────────────────────────────────────────────────────

function PhaseOnePreview() {
  return (
    <div className="relative rounded-3xl border border-[var(--border)] bg-white p-6 shadow-elevated overflow-hidden">
      <div className="absolute inset-0 bg-gradient-soft opacity-70 pointer-events-none" />
      <div className="relative flex flex-col items-center text-center space-y-5 py-4">
        <div className="size-20 rounded-full bg-[var(--primary-50)] grid place-items-center glow-pulse">
          <CheckCircle2 className="size-10 text-[var(--primary)]" strokeWidth={2.5} />
        </div>
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--fg-subtle)]">
            ABHA-ALIGNED ID
          </p>
          <h4 className="font-mono-num text-3xl font-semibold tracking-tight shimmer-text">
            3360 1406 1525
          </h4>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-[var(--primary-50)] text-[var(--primary)] px-3 py-1 text-[11px] font-semibold">
            BPL Priority Tier 1
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--fg-muted)] px-3 py-1 text-[11px] font-medium">
            <CheckCircle2 className="size-3 text-[var(--primary)]" strokeWidth={3} />
            <span className="font-mono-num">2 KB used · synced</span>
          </span>
        </div>
        <div className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-3 flex items-start gap-3 text-left">
          <span className="size-9 rounded-xl bg-white ring-1 ring-[var(--primary)]/10 grid place-items-center shrink-0">
            <Fingerprint className="size-4 text-[var(--primary)]" />
          </span>
          <div>
            <div className="text-[12px] font-semibold tracking-tight">
              OTP verified · offline-safe
            </div>
            <div className="mt-0.5 text-[11px] text-[var(--fg-muted)] leading-relaxed">
              Falls back to a signed local token when SMS gateway is unreachable —
              syncs on reconnect.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhaseTwoPreview() {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-elevated">
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--primary)]">
          <Activity className="size-2.5" />
          Profile · live
        </span>
        <span className="text-[10px] text-[var(--fg-muted)]">Updated 2 min ago</span>
      </div>
      <div className="flex items-start gap-3">
        <PersonAvatar
          name="Sreelakshmi M."
          seed="hero-srlk"
          kind="woman"
          className="size-14 rounded-2xl text-base"
        />
        <div className="space-y-0.5 min-w-0">
          <div className="text-lg font-semibold tracking-tight">Sreelakshmi M.</div>
          <div className="font-mono-num text-[11px] text-[var(--fg-muted)]">3360 1406 1525</div>
          <div className="text-xs text-[var(--fg-muted)]">Mother · G2P1 · 24y · Agali</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Mini label="LMP" value="22 Oct 2025" />
        <Mini label="EDD" value="29 Jul 2026" />
        <Mini label="Hb · latest" value="6.8 g/dL" tone="critical" />
        <Mini label="BP · latest" value="162/108" tone="critical" />
        <Mini label="BPL score" value="8 · Tier 1" />
        <Mini label="Z-score · child" value="-2.4 SAM" tone="critical" />
      </div>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-[var(--surface-alt)] border border-[var(--border)] px-3 py-2">
        <div className="text-[11px] text-[var(--fg-muted)]">
          ASHA · <span className="text-[var(--fg)] font-medium">Lakshmi K.</span>
          {" · "}Agali Sub-Centre
        </div>
        <RiskBadge level="CRITICAL" />
      </div>
    </div>
  );
}

function Mini({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "critical" | "high";
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-2.5">
      <div className="text-[9.5px] uppercase tracking-wider text-[var(--fg-muted)]">{label}</div>
      <div
        className={
          "font-mono-num text-sm font-semibold tracking-tight " +
          (tone === "critical"
            ? "text-[var(--risk-critical)]"
            : tone === "high"
              ? "text-[var(--risk-high)]"
              : "text-[var(--fg)]")
        }
      >
        {value}
      </div>
    </div>
  );
}

function PhaseThreePreview() {
  const visits = [
    { n: 1, date: "10 Nov", bp: "118/76", hb: "11.2", risk: "NORMAL" as const },
    { n: 2, date: "12 Feb", bp: "130/84", hb: "10.1", risk: "NORMAL" as const },
    { n: 3, date: "20 May", bp: "162/108", hb: "6.8", risk: "CRITICAL" as const },
  ];
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-elevated">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold tracking-tight">ANC visit history</span>
        <span className="text-[10px] uppercase tracking-wider text-[var(--fg-muted)]">
          auto-classified
        </span>
      </div>
      <div className="space-y-2">
        {visits.map((v) => (
          <div
            key={v.n}
            className="grid grid-cols-[auto_auto_1fr_auto] items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] px-3 py-2.5"
          >
            <div className="font-mono-num text-[11px] font-bold text-[var(--primary)] bg-white px-1.5 py-0.5 rounded">
              ANC #{v.n}
            </div>
            <span className="text-[11px] text-[var(--fg-muted)] font-mono-num">{v.date}</span>
            <div className="font-mono-num text-[11px] text-[var(--fg-muted)]">
              BP {v.bp} · Hb {v.hb}
            </div>
            <RiskBadge level={v.risk} />
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          { Icon: Syringe, label: "Immunisation", value: "9/18" },
          { Icon: Baby, label: "Milestones", value: "6/8" },
          { Icon: Wallet, label: "PMMVY", value: "2/3" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-[var(--border)] bg-white p-2"
          >
            <s.Icon className="size-3.5 text-[var(--primary)] mx-auto" />
            <div className="font-mono-num text-sm font-semibold mt-1">{s.value}</div>
            <div className="text-[9px] uppercase tracking-wider text-[var(--fg-muted)]">
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-[var(--risk-critical)]/8 border border-[var(--risk-critical)]/15 px-3 py-2 text-[11px] text-[var(--fg)] leading-relaxed">
        <span className="font-semibold text-[var(--risk-critical)]">
          Auto-detected:
        </span>{" "}
        Severe anaemia (Hb&nbsp;&lt;&nbsp;7) and severe hypertension (BP&nbsp;≥&nbsp;160/110) at ANC&nbsp;#3.
      </div>
    </div>
  );
}

function PhaseFourPreview() {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-elevated">
      <div className="rounded-2xl p-4 mb-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(217,54,54,0.08), rgba(217,54,54,0.02))" }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute -inset-2 rounded-full ring-2 ring-[var(--risk-critical)]/40 animate-ping" aria-hidden />
            <div className="relative size-10 rounded-2xl bg-[var(--risk-critical)] grid place-items-center text-white shadow-primary-sm">
              <Siren className="size-5" />
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--risk-critical)]">SOS · in progress</div>
            <div className="text-sm font-semibold">Bleeding at home — Week 30</div>
            <div className="font-mono-num text-[10px] text-[var(--fg-muted)] mt-0.5">11.18°N, 76.72°E · Agali</div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {[
          { Icon: Users, label: "Field worker", time: "0s" },
          { Icon: Siren, label: "102 ambulance", time: "0s" },
          { Icon: Stethoscope, label: "Block supervisor", time: "0s" },
          { Icon: Building2, label: "PHC · receiving", time: "4s" },
        ].map((c) => (
          <div
            key={c.label}
            className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-alt)] px-3 py-2"
          >
            <div className="flex items-center gap-2.5">
              <c.Icon className="size-4 text-[var(--primary)]" />
              <span className="text-sm font-medium">{c.label}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono-num text-[var(--fg-muted)]">
              <span>{c.time}</span>
              <CheckCircle2 className="size-3.5 text-[var(--primary)]" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-4 gap-1.5 text-center text-[9.5px] font-semibold uppercase tracking-wider">
        {["SC", "PHC", "CHC", "DH"].map((t, i) => (
          <div key={t} className="relative flex flex-col items-center">
            <div className={
              "size-8 rounded-full grid place-items-center " +
              (i < 2 ? "bg-gradient-primary text-white" : "bg-[var(--surface-alt)] text-[var(--fg-muted)] border border-[var(--border)]")
            }>{t}</div>
            <div className="mt-1 text-[var(--fg-muted)] tracking-wider">{i === 1 ? "Routed" : ""}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhaseFivePreview() {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-elevated space-y-3">
      <div className="rounded-2xl p-4 text-white relative overflow-hidden"
        style={{ background: "var(--gradient-primary)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-white/20 grid place-items-center ring-1 ring-white/30 backdrop-blur-sm">
              <WifiOff className="size-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] opacity-90">Offline-safe queue</div>
              <div className="text-sm font-semibold">7 items · 268 KB pending</div>
            </div>
          </div>
          <span className="text-[10px] font-mono-num bg-white/20 rounded-full px-2 py-1">2G</span>
        </div>
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-3">
        <div className="flex items-center justify-between text-[10px] text-[var(--fg-muted)] mb-2">
          <span className="font-mono-num">FROM KLNHM-MCH</span>
          <span className="inline-flex items-center gap-1 text-[var(--primary)]"><Languages className="size-3" />ml</span>
        </div>
        <p className="font-malayalam text-[12px] leading-relaxed text-[var(--fg)]">
          പ്രിയ സ്രീലക്ഷ്മി, താങ്കളുടെ അടുത്ത ANC പരിശോധന 22 മേയ് നു നിശ്ചയിച്ചിരിക്കുന്നു. അങ്കണവാടിയിലോ സബ്സെന്ററിലോ എത്തുക. -കേരള ആരോഗ്യ വകുപ്പ്
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { tag: "Nutrition", title: "Iron-rich foods" },
          { tag: "Safe delivery", title: "Danger signs" },
        ].map((iec) => (
          <div key={iec.title} className="rounded-xl border border-[var(--border)] bg-white p-2.5">
            <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--primary)]">{iec.tag}</div>
            <div className="mt-0.5 text-[11px] font-semibold text-[var(--fg)]">{iec.title}</div>
            <div className="mt-1 text-[10px] text-[var(--fg-muted)]">EN · ML bilingual</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function LiveMapSection({
  blocks,
}: {
  blocks: Awaited<ReturnType<typeof getBlockRiskCounts>>;
}) {
  return (
    <section id="map" className="border-t border-[var(--border)] py-14 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 sm:mb-10 max-w-2xl">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
            Live data · Palakkad pilot
          </div>
          <h2 className="mt-2 text-[26px] sm:text-4xl font-semibold tracking-tight leading-[1.15]">
            Risk visibility, block by block.
          </h2>
          <p className="mt-3 text-sm text-[var(--fg-muted)]">
            District health admins see what every ASHA sees — in aggregate, in
            near real-time. The same map renders on the demo right now, with the
            actual seed data driving every dot.
          </p>
        </div>
        <PalakkadMap data={blocks} />
        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-[var(--fg-muted)]">
          <span className="font-mono-num font-semibold text-[var(--fg)]">8s</span>
          <span>poll cadence</span>
          <span className="mx-2 size-1 rounded-full bg-[var(--fg-subtle)]" />
          <span>Block aggregation runs from the latest ANC visit per mother</span>
          <span className="mx-2 size-1 rounded-full bg-[var(--fg-subtle)]" />
          <Link href="/admin" className="font-semibold text-[var(--primary)] inline-flex items-center gap-1 hover:text-[var(--primary-hover)]">
            Open the dashboard <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function InnovationsGrid() {
  const items = [
    { Icon: Wallet, title: "Poverty index scoring", body: "Each family gets a BPL score that drives scheme priority — JSY, PMMVY, KASP — first." },
    { Icon: WifiOff, title: "Offline-first architecture", body: "Local persistence, conflict-aware sync, never lose a visit because the tower dropped." },
    { Icon: TrendingDown, title: "Low-bandwidth optimisation", body: "Under 50 KB per transaction. Measured per-payload and exposed to the worker." },
    { Icon: Languages, title: "Vernacular by default", body: "Malayalam labels and DLT-registered SMS templates. No app text without a counterpart." },
    { Icon: Baby, title: "SAM/MAM detection built in", body: "WHO Z-score classifier + MUAC threshold catches malnutrition without spreadsheets." },
    { Icon: Sparkles, title: "Algorithmic decision support", body: "Risk scoring, referral routing, scheme eligibility — computed, not memorised." },
    { Icon: Workflow, title: "Scheme linkage end-to-end", body: "PMMVY/JSY/JSSK/KASP enrollment, eligibility, and disbursement on one rail." },
  ];
  return (
    <section id="innovations" className="border-t border-[var(--border)] bg-[var(--surface-alt)]/60 py-14 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 sm:mb-12 max-w-2xl">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
            Innovations · BPL-specific
          </div>
          <h2 className="mt-2 text-[26px] sm:text-4xl font-semibold tracking-tight leading-[1.15]">
            Built for the population we&apos;re actually serving.
          </h2>
          <p className="mt-3 text-sm text-[var(--fg-muted)]">
            Generic health apps assume LTE, English literacy, and middle-class
            phones. This platform doesn&apos;t.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all"
            >
              <div className="size-10 rounded-xl bg-[var(--primary-50)] grid place-items-center text-[var(--primary)] mb-3 shadow-primary-sm">
                <it.Icon className="size-4" />
              </div>
              <h3 className="font-semibold tracking-tight">{it.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--fg-muted)]">
                {it.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function OutcomesGrid() {
  const items = [
    { Icon: HeartPulse, kpi: "↓ 30%", body: "High-risk pregnancy complications, target reduction over 18 months." },
    { Icon: Building2, kpi: "↑ 92%", body: "Institutional delivery rate — driven by ANC adherence + reminders." },
    { Icon: Syringe, kpi: "↑ 85%", body: "Full immunisation by age 12 months across the pilot blocks." },
    { Icon: Siren, kpi: "<4 min", body: "Average SOS-to-dispatch time, measured from the field." },
    { Icon: Eye, kpi: "100%", body: "Beneficiary visibility for district admins; no manual ASHA registers." },
    { Icon: Wallet, kpi: "↑ 2.4×", body: "On-time PMMVY disbursements via auto-eligibility checks." },
  ];
  return (
    <section id="outcomes" className="border-t border-[var(--border)] py-14 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 sm:mb-12 max-w-2xl">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
            Expected outcomes
          </div>
          <h2 className="mt-2 text-[26px] sm:text-4xl font-semibold tracking-tight leading-[1.15]">
            Measurable impact, surfaced to administrators.
          </h2>
          <p className="mt-3 text-sm text-[var(--fg-muted)]">
            Every outcome below maps to a KPI tile that already exists in the
            admin dashboard. Targets reflect peer pilots in similar tribal blocks.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.body}
              className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-card"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="size-9 rounded-xl bg-[var(--primary-50)] grid place-items-center text-[var(--primary)]">
                  <it.Icon className="size-4" />
                </div>
                <div className="font-mono-num text-2xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--primary-bright)]">
                  {it.kpi}
                </div>
              </div>
              <p className="text-xs leading-relaxed text-[var(--fg-muted)]">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function IntegrationsSection() {
  const items = [
    { code: "ABHA", title: "Ayushman Bharat Health Account", body: "12-digit ABHA IDs and consent-based health record sharing across the ABDM network." },
    { code: "HMIS", title: "Health Management Information System", body: "Automated monthly aggregate reporting on ANC, PNC, immunisation and high-risk KPIs." },
    { code: "ICDS-CAS", title: "Anganwadi Common Application", body: "Bi-directional sync of growth records. SAM/MAM cases visible to AWWs and CDPOs live." },
    { code: "ESANJ", title: "e-Sanjeevani · National Tele-consultation", body: "MO referrals to specialist tele-OPD. CRITICAL ANC auto-eligible for slot booking." },
  ];
  return (
    <section id="integrations" className="border-t border-[var(--border)] bg-[var(--surface-alt)]/60 py-14 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 sm:mb-12 max-w-2xl">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
            Integrations
          </div>
          <h2 className="mt-2 text-[26px] sm:text-4xl font-semibold tracking-tight leading-[1.15]">
            Integration-ready from day one.
          </h2>
          <p className="mt-3 text-sm text-[var(--fg-muted)]">
            Designed against the official sandbox APIs of every relevant national
            and state-level system. Production rollout uses the same surfaces.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((it) => (
            <div
              key={it.code}
              className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-card flex items-start gap-4"
            >
              <div className="size-12 shrink-0 rounded-xl bg-[var(--primary-50)] grid place-items-center text-[var(--primary)]">
                <Plug className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--primary)] font-mono-num">
                  {it.code}
                </div>
                <h3 className="font-semibold tracking-tight mt-0.5">{it.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[var(--fg-muted)]">
                  {it.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function RolesSection() {
  const roles = [
    {
      Icon: Smartphone,
      role: "ASHA / ANM",
      who: "Field worker",
      surface: "Mobile app",
      access: ["Register · visit · SOS", "View own caseload", "IEC + reminders", "Offline queue"],
    },
    {
      Icon: Stethoscope,
      role: "Medical Officer",
      who: "PHC / CHC",
      surface: "Tablet + dashboard",
      access: ["Critical alert queue", "Referral acknowledgement", "Tele-consultation slot", "Block-level KPIs"],
    },
    {
      Icon: Briefcase,
      role: "Block Supervisor",
      who: "BPHC / Block PMU",
      surface: "Dashboard",
      access: ["ASHA leaderboard", "SOS dispatch oversight", "Sub-centre load", "Scheme disbursement"],
    },
    {
      Icon: Eye,
      role: "District Admin",
      who: "DMO · State NHM",
      surface: "Dashboard",
      access: ["Cross-block view", "Risk map · live", "HMIS export", "Integration health"],
    },
  ];
  return (
    <section id="roles" className="border-t border-[var(--border)] py-14 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 sm:mb-12 max-w-2xl">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary)]">
            Role-based access
          </div>
          <h2 className="mt-2 text-[26px] sm:text-4xl font-semibold tracking-tight leading-[1.15]">
            Four roles. One source of truth.
          </h2>
          <p className="mt-3 text-sm text-[var(--fg-muted)]">
            Each role sees exactly the surface and data they need — nothing more,
            nothing less.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r) => (
            <div
              key={r.role}
              className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-card"
            >
              <div className="size-10 rounded-xl bg-[var(--primary-50)] grid place-items-center text-[var(--primary)] mb-3">
                <r.Icon className="size-4" />
              </div>
              <h3 className="text-base font-semibold tracking-tight">{r.role}</h3>
              <div className="text-[11px] text-[var(--fg-muted)]">
                {r.who} · {r.surface}
              </div>
              <ul className="mt-3 space-y-1.5">
                {r.access.map((a) => (
                  <li key={a} className="flex items-start gap-1.5 text-xs text-[var(--fg)]">
                    <ChevronRight className="size-3 text-[var(--primary)] mt-0.5 shrink-0" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function FinalCta() {
  return (
    <section className="border-t border-[var(--border)] py-14 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-[2rem] p-8 sm:p-12 text-white shadow-primary"
          style={{ background: "var(--gradient-primary)" }}
        >
          <div
            aria-hidden
            className="absolute -right-20 -top-20 size-80 rounded-full bg-white/15 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -left-10 -bottom-20 size-64 rounded-full bg-white/10 blur-3xl"
          />
          <div className="relative space-y-5 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold ring-1 ring-white/30">
              <Sparkles className="size-3" />
              The demo is live
            </span>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Walk through every phase yourself.
            </h2>
            <p className="text-sm leading-relaxed opacity-95 sm:text-base">
              Open the ASHA mobile app to register a beneficiary and trigger
              SOS. Open the district dashboard to watch it arrive. No
              installation. No accounts. Just real product flows on demo data.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/field"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[var(--primary)] shadow-card hover:opacity-95 active:scale-[0.98] transition-all"
              >
                <Smartphone className="size-4" />
                Open ASHA app
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/admin"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 px-5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
              >
                District dashboard
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface-alt)]/60">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="flex items-center gap-3">
          <span
            className="grid size-9 place-items-center rounded-xl shadow-primary-sm"
            style={{ background: "var(--gradient-primary)" }}
          >
            <span className="text-[10px] font-bold tracking-tighter text-white">MCH</span>
          </span>
          <div>
            <div className="text-sm font-semibold tracking-tight">Kerala MCH Tracker</div>
            <div className="text-[11px] text-[var(--fg-muted)]">
              BPL Mother &amp; Child Health Tracking and Decision Support System · Demonstration
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[var(--fg-muted)]">
          <span>Built for the National Health Mission</span>
          <span className="size-1 rounded-full bg-[var(--fg-subtle)]" />
          <span>ABHA-aligned</span>
          <span className="size-1 rounded-full bg-[var(--fg-subtle)]" />
          <span>HMIS-ready</span>
          <span className="size-1 rounded-full bg-[var(--fg-subtle)]" />
          <span>No real patient information</span>
        </div>
      </div>
    </footer>
  );
}

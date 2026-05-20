import Link from "next/link";
import { Siren, Sparkles, ListChecks } from "lucide-react";
import { getFieldHomeData } from "@/lib/queries/field-home";
import { getSession } from "@/lib/session";
import { BeneficiaryCard } from "@/components/beneficiary-card";
import { SyncStatusBadge } from "@/components/sync-status-badge";
import type { BeneficiarySummary } from "@/components/beneficiary-card";
import { differenceInWeeks, format } from "date-fns";

export default async function FieldHome() {
  const session = await getSession();
  const { mothers, children, dueReminders } = await getFieldHomeData(
    session.workerId,
  );

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
        lastVisit: lastVisit ? format(lastVisit.visitDate, "d MMM") : undefined,
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
    <div className="relative">
      {/* Ambient gradient backdrop */}
      <div
        className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
        style={{ background: "var(--gradient-soft)" }}
        aria-hidden
      />

      <div className="relative px-4 py-6 sm:px-5 sm:py-7 space-y-6">
        {/* Greeting header */}
        <header className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <p className="font-malayalam text-sm text-[var(--primary)] font-medium">
              നമസ്കാരം
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight leading-tight">
              Lakshmi K.
            </h1>
            <p className="text-xs text-[var(--fg-muted)]">
              ASHA · Agali Sub-Centre · Attappadi
            </p>
          </div>
          <SyncStatusBadge />
        </header>

        {/* Today's tasks gradient hero card */}
        {dueReminders.length > 0 && (
          <section
            className="relative overflow-hidden rounded-3xl p-5 sm:p-6 text-white shadow-primary-sm"
            style={{ background: "var(--gradient-primary)" }}
          >
            <div
              className="absolute -right-10 -top-10 size-40 rounded-full bg-white/15 blur-2xl"
              aria-hidden
            />
            <div
              className="absolute -left-6 -bottom-12 size-28 rounded-full bg-white/10 blur-2xl"
              aria-hidden
            />
            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/30">
                  <ListChecks className="size-5 text-white" strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-semibold leading-tight">
                    Today&apos;s tasks
                  </h2>
                  <p className="text-[11px] opacity-85">
                    {dueReminders.length} due for follow-up
                  </p>
                </div>
              </div>
              <ul className="space-y-2 pt-1">
                {dueReminders.slice(0, 4).map((r) => (
                  <li
                    key={r.id}
                    className="text-sm flex items-center gap-2.5"
                  >
                    <span className="size-1.5 rounded-full bg-white/90 shrink-0" />
                    <span className="truncate">{r.type.replace(/_/g, " ")}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Beneficiaries */}
        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-[var(--fg)] tracking-tight">
              My beneficiaries
            </h2>
            <span className="inline-flex items-center gap-1 text-[11px] text-[var(--fg-muted)] font-mono-num">
              <Sparkles className="size-3 text-[var(--primary)]" />
              {summaries.length} total
            </span>
          </div>
          <div className="space-y-2.5">
            {summaries.map((b) => (
              <BeneficiaryCard key={`${b.type}-${b.id}`} b={b} />
            ))}
          </div>
        </section>
      </div>

      {/* Floating SOS button with glow halo — anchored above tab bar */}
      <Link
        href="/field/sos"
        className="fixed bottom-20 right-4 sm:right-6 md:right-[max(1rem,calc(50vw-200px+1rem))] z-20 group"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Emergency SOS"
      >
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full opacity-50 blur-lg group-hover:opacity-70 transition-opacity animate-pulse"
            style={{ background: "var(--risk-critical)" }}
            aria-hidden
          />
          <div
            className="relative size-14 sm:size-15 rounded-full text-white flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition-transform shadow-elevated ring-4 ring-white"
            style={{ background: "var(--risk-critical)" }}
          >
            <Siren className="size-6" strokeWidth={2.2} />
          </div>
        </div>
      </Link>
    </div>
  );
}

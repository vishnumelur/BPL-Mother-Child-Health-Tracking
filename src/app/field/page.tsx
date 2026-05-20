import Link from "next/link";
import { Siren, Bell } from "lucide-react";
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
    <div className="px-4 py-5 sm:px-5 sm:py-6 space-y-6">
      {/* Greeting header */}
      <header className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <p className="font-malayalam text-sm text-[var(--fg-muted)]">
              നമസ്കാരം
            </p>
            <h1 className="text-xl font-semibold text-[var(--fg)] tracking-tight">
              Lakshmi K.
            </h1>
            <p className="text-xs text-[var(--fg-muted)]">
              ASHA · Agali Sub-Centre · Attappadi
            </p>
          </div>
          <SyncStatusBadge />
        </div>
      </header>

      {/* Today's tasks */}
      {dueReminders.length > 0 && (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <Bell className="size-3.5 text-white" strokeWidth={2.4} />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-[var(--fg)]">
                Today&apos;s tasks
              </h2>
              <p className="text-[11px] text-[var(--fg-muted)]">
                {dueReminders.length} due
              </p>
            </div>
          </div>
          <ul className="space-y-1.5">
            {dueReminders.map((r) => (
              <li
                key={r.id}
                className="text-sm text-[var(--fg)] flex items-center gap-2"
              >
                <span className="size-1.5 rounded-full bg-[var(--primary)] shrink-0" />
                <span className="truncate">{r.type.replace(/_/g, " ")}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Beneficiaries */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold text-[var(--fg)] tracking-tight">
            My beneficiaries
          </h2>
          <span className="text-[11px] text-[var(--fg-muted)] font-mono-num">
            {summaries.length}
          </span>
        </div>
        <div className="space-y-2.5">
          {summaries.map((b) => (
            <BeneficiaryCard key={`${b.type}-${b.id}`} b={b} />
          ))}
        </div>
      </section>

      {/* Floating SOS */}
      <Link
        href="/field/sos"
        className="absolute bottom-20 right-4 z-10 group"
        aria-label="Emergency SOS"
      >
        <div className="size-14 rounded-full bg-[var(--risk-critical)] text-white flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-105 group-active:scale-95 transition-transform">
          <Siren className="size-6" strokeWidth={2.2} />
        </div>
      </Link>
    </div>
  );
}

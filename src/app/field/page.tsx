// src/app/field/page.tsx
import Link from "next/link";
import { getFieldHomeData } from "@/lib/queries/field-home";
import { getSession } from "@/lib/session";
import { BeneficiaryCard } from "@/components/beneficiary-card";
import { SyncStatusBadge } from "@/components/sync-status-badge";
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
          <SyncStatusBadge />
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

      <Link
        href="/field/sos"
        className="fixed md:absolute bottom-20 right-4 z-10 size-14 rounded-full bg-[var(--risk-critical)] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        aria-label="Emergency SOS"
      >
        <span className="text-xs font-bold">SOS</span>
      </Link>
    </div>
  );
}

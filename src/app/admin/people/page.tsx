import Link from "next/link";
import { db } from "@/db";
import { ancVisits } from "@/db/schema";
import { desc } from "drizzle-orm";
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
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-sm text-[var(--fg-muted)]">
                  No beneficiaries match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

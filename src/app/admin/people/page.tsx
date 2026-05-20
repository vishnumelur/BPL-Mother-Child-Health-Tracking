import Link from "next/link";
import { db } from "@/db";
import { ancVisits } from "@/db/schema";
import { desc } from "drizzle-orm";
import { RiskBadge } from "@/components/risk-badge";
import { DataTable, DataTableHead, DataTableRow } from "@/components/data-table";
import { formatBeneficiaryId } from "@/lib/beneficiary-id";
import { cn } from "@/lib/utils";

const BLOCKS = ["Agali", "Sholayur", "Pudur", "Mannarkkad", "Attappadi"];

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
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
          People
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">
          {filtered.length} beneficiar{filtered.length === 1 ? "y" : "ies"}
        </p>
      </header>

      <div className="flex gap-2 overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-1">
        {BLOCKS.map((b) => (
          <Link
            key={b}
            href={`/admin/people${blockFilter === b ? "" : `?block=${b}`}`}
            className={cn(
              "shrink-0 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-colors",
              blockFilter === b
                ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                : "bg-[var(--card)] border-[var(--border)] text-[var(--fg)] hover:border-[var(--primary)]/40",
            )}
          >
            {b}
          </Link>
        ))}
      </div>

      <DataTable minWidth={720}>
        <DataTableHead>
          <tr>
            <th className="text-left px-4 py-2.5 font-medium">Name</th>
            <th className="text-left px-4 py-2.5 font-medium">ABHA ID</th>
            <th className="text-left px-4 py-2.5 font-medium">Village</th>
            <th className="text-left px-4 py-2.5 font-medium">Pregnancy</th>
            <th className="text-left px-4 py-2.5 font-medium">Risk</th>
          </tr>
        </DataTableHead>
        <tbody>
          {filtered.map((m) => {
            const risk = m.ancVisits[0]?.riskLevel ?? "NORMAL";
            return (
              <DataTableRow key={m.id}>
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/admin/people/m-${m.id}`}
                    className="hover:text-[var(--primary)]"
                  >
                    {m.name}
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono-num text-xs text-[var(--fg-muted)]">
                  {formatBeneficiaryId(m.beneficiaryId12)}
                </td>
                <td className="px-4 py-3 text-[var(--fg-muted)]">
                  {m.family.village}, {m.family.block}
                </td>
                <td className="px-4 py-3 text-xs text-[var(--fg-muted)]">
                  G{m.pregnancyNo}P{m.pregnancyNo - 1}
                </td>
                <td className="px-4 py-3">
                  <RiskBadge level={risk} />
                </td>
              </DataTableRow>
            );
          })}
          {filtered.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-10 text-center text-sm text-[var(--fg-muted)]"
              >
                No beneficiaries match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </DataTable>
    </div>
  );
}

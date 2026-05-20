import { db } from "@/db";
import { referrals } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import { ArrowRight } from "lucide-react";
import { DataTable, DataTableHead, DataTableRow } from "@/components/data-table";

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
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
          Referrals
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">Tier escalation flow</p>
      </header>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-8">
        <div className="flex items-center justify-center gap-1 sm:gap-3 overflow-x-auto">
          {["SC", "PHC", "CHC", "DH"].map((tier, i, arr) => {
            const incoming = counts
              .filter((c) => c.to === tier)
              .reduce((s, c) => s + c.n, 0);
            return (
              <div key={tier} className="flex items-center shrink-0">
                <div className="text-center">
                  <div className="size-16 sm:size-20 rounded-full bg-[var(--primary-50)] flex items-center justify-center text-xl sm:text-2xl font-semibold font-mono-num text-[var(--primary)]">
                    {incoming}
                  </div>
                  <p className="text-[11px] sm:text-xs mt-2 font-semibold text-[var(--fg)]">
                    {tier}
                  </p>
                </div>
                {i < arr.length - 1 && (
                  <ArrowRight className="size-5 sm:size-6 text-[var(--fg-subtle)] mx-1 sm:mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <DataTable minWidth={640}>
        <DataTableHead>
          <tr>
            <th className="text-left px-4 py-2.5 font-medium">From → To</th>
            <th className="text-left px-4 py-2.5 font-medium">Subject</th>
            <th className="text-left px-4 py-2.5 font-medium hidden sm:table-cell">
              Reason
            </th>
            <th className="text-left px-4 py-2.5 font-medium">Status</th>
          </tr>
        </DataTableHead>
        <tbody>
          {recent.map((r) => (
            <DataTableRow key={r.id}>
              <td className="px-4 py-3 font-medium">
                {r.tierFrom} → {r.tierTo}
              </td>
              <td className="px-4 py-3 text-xs text-[var(--fg-muted)]">
                {r.subjectType} #{r.subjectId}
              </td>
              <td className="px-4 py-3 text-xs hidden sm:table-cell">
                {r.reason}
              </td>
              <td className="px-4 py-3 text-xs">
                <span className="inline-flex px-2 py-0.5 rounded-full bg-[var(--surface-alt)] font-medium">
                  {r.status}
                </span>
              </td>
            </DataTableRow>
          ))}
          {recent.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-10 text-center text-sm text-[var(--fg-muted)]"
              >
                No referrals yet.
              </td>
            </tr>
          )}
        </tbody>
      </DataTable>
    </div>
  );
}

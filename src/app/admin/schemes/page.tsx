import { db } from "@/db";
import { schemeEnrollments } from "@/db/schema";
import { desc } from "drizzle-orm";
import { SchemeProgress } from "@/components/scheme-progress";
import { SchemeComplianceChart } from "@/components/scheme-compliance-chart";
import { getSchemeCompliance } from "@/lib/queries/admin-overview";
import { DataTable, DataTableHead, DataTableRow } from "@/components/data-table";

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
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
          Schemes
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">
          PMMVY · JSY · JSSK · KASP disbursement tracking
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SchemeComplianceChart data={compliance} />
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 text-xs text-[var(--fg-muted)] space-y-1.5">
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
        </div>
      </div>

      <DataTable minWidth={640}>
        <DataTableHead>
          <tr>
            <th className="text-left px-4 py-2.5 font-medium">Beneficiary</th>
            <th className="text-left px-4 py-2.5 font-medium hidden sm:table-cell">Scheme</th>
            <th className="text-left px-4 py-2.5 font-medium">Progress</th>
          </tr>
        </DataTableHead>
        <tbody>
          {beneficiaryRows.map((r, i) => (
            <DataTableRow key={i}>
              <td className="px-4 py-3 font-medium">{r.name}</td>
              <td className="px-4 py-3 text-[var(--fg-muted)] hidden sm:table-cell">
                {r.code}
              </td>
              <td className="px-4 py-3 w-1/2 min-w-[180px]">
                <SchemeProgress
                  code={r.code as "PMMVY" | "JSY" | "JSSK" | "KASP"}
                  disbursed={r.disbursed}
                />
              </td>
            </DataTableRow>
          ))}
          {beneficiaryRows.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className="px-4 py-10 text-center text-sm text-[var(--fg-muted)]"
              >
                No enrollments yet.
              </td>
            </tr>
          )}
        </tbody>
      </DataTable>
    </div>
  );
}

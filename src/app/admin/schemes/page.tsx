import { db } from "@/db";
import { schemeEnrollments } from "@/db/schema";
import { desc } from "drizzle-orm";
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

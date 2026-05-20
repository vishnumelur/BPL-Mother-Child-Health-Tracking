import Link from "next/link";
import { db } from "@/db";
import { schemeEnrollments } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ChevronRight } from "lucide-react";
import { SchemeProgress } from "@/components/scheme-progress";
import { SchemeComplianceChart } from "@/components/scheme-compliance-chart";
import { getSchemeCompliance } from "@/lib/queries/admin-overview";
import { DataTable, DataTableHead, DataTableRow } from "@/components/data-table";

const GLOSSARY = [
  {
    code: "PMMVY",
    name: "Pradhan Mantri Matru Vandana Yojana",
    description:
      "Conditional cash transfer for pregnant and lactating mothers (3 installments).",
  },
  {
    code: "JSY",
    name: "Janani Suraksha Yojana",
    description:
      "Safe motherhood intervention under NHM to reduce neonatal and maternal mortality.",
  },
  {
    code: "JSSK",
    name: "Janani Shishu Suraksha Karyakram",
    description:
      "Entitles all pregnant women to free, no-expense delivery and newborn care.",
  },
  {
    code: "KASP",
    name: "Karunya Arogya Suraksha Padhathi",
    description:
      "Kerala's comprehensive health insurance scheme for vulnerable families.",
  },
];

// Indicative per-installment amounts (₹) — demo only
const SCHEME_AMOUNT: Record<string, number> = {
  PMMVY: 5000,
  JSY: 1400,
  JSSK: 0,
  KASP: 12450,
};

function statusFor(disbursed: number, total: number): {
  label: string;
  className: string;
} {
  if (disbursed >= total)
    return {
      label: "Disbursed",
      className: "bg-[var(--primary-50)] text-[var(--primary)]",
    };
  if (disbursed > 0)
    return {
      label: "In progress",
      className: "bg-[var(--risk-high)]/10 text-[var(--risk-high)]",
    };
  return {
    label: "Pending",
    className: "bg-[var(--surface-alt)] text-[var(--fg-muted)]",
  };
}

export default async function AdminSchemes() {
  const compliance = await getSchemeCompliance();
  const enrolls = await db.query.schemeEnrollments.findMany({
    orderBy: desc(schemeEnrollments.expectedDate),
    limit: 200,
  });
  const motherList = await db.query.mothers.findMany({
    columns: { id: true, name: true },
  });
  const motherName = (id: number) =>
    motherList.find((m) => m.id === id)?.name ?? `#${id}`;

  // Group by beneficiary + scheme
  const grouped = new Map<
    string,
    { name: string; code: string; disbursed: number; total: number }
  >();
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
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-[var(--fg-muted)]"
      >
        <Link href="/admin" className="hover:text-[var(--fg)]">
          Admin
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-[var(--fg)] font-medium">Schemes</span>
      </nav>

      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
          Schemes
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">
          PMMVY · JSY · JSSK · KASP disbursement tracking
        </p>
      </header>

      {/* Upper row: compliance + glossary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SchemeComplianceChart data={compliance} />
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6 shadow-card h-full">
          <div className="space-y-1 mb-4">
            <h3 className="text-sm font-semibold text-[var(--fg)] tracking-tight">
              Scheme glossary
            </h3>
            <p className="text-[11px] text-[var(--fg-muted)]">
              Active maternal &amp; child health schemes in Kerala
            </p>
          </div>
          <dl className="divide-y divide-[var(--border)]">
            {GLOSSARY.map((g) => (
              <div
                key={g.code}
                className="grid grid-cols-[64px_1fr] gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <dt className="text-xs font-semibold text-[var(--primary)] font-mono-num pt-0.5">
                  {g.code}
                </dt>
                <dd className="space-y-0.5 min-w-0">
                  <p className="text-xs font-medium text-[var(--fg)] leading-snug">
                    {g.name}
                  </p>
                  <p className="text-[11px] text-[var(--fg-muted)] leading-snug">
                    {g.description}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Disbursements table */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <h2 className="text-sm font-semibold text-[var(--fg)] tracking-tight">
            Per-beneficiary disbursements
          </h2>
          <span className="text-[11px] text-[var(--fg-muted)] font-mono-num">
            Showing {Math.min(beneficiaryRows.length, 50)} of{" "}
            {beneficiaryRows.length} records
          </span>
        </div>
        <DataTable minWidth={720}>
          <DataTableHead>
            <tr>
              <th className="text-left px-4 py-3 font-medium">Beneficiary</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">
                Scheme
              </th>
              <th className="text-left px-4 py-3 font-medium">Progress</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                Amount
              </th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
            </tr>
          </DataTableHead>
          <tbody>
            {beneficiaryRows.map((r, i) => {
              const st = statusFor(r.disbursed, r.total);
              const amount = (SCHEME_AMOUNT[r.code] ?? 0) * Math.max(1, r.total);
              return (
                <DataTableRow key={i}>
                  <td className="px-4 py-3 font-medium text-[var(--fg)] truncate">
                    {r.name}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--fg-muted)] hidden sm:table-cell font-mono-num">
                    {r.code}
                  </td>
                  <td className="px-4 py-3 min-w-[140px]">
                    <SchemeProgress
                      code={r.code as "PMMVY" | "JSY" | "JSSK" | "KASP"}
                      disbursed={r.disbursed}
                    />
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--fg)] font-mono-num hidden md:table-cell whitespace-nowrap">
                    {amount > 0
                      ? `₹${amount.toLocaleString("en-IN")}.00`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${st.className}`}
                    >
                      {st.label}
                    </span>
                  </td>
                </DataTableRow>
              );
            })}
            {beneficiaryRows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-[var(--fg-muted)]"
                >
                  No enrollments yet.
                </td>
              </tr>
            )}
          </tbody>
        </DataTable>
      </section>
    </div>
  );
}

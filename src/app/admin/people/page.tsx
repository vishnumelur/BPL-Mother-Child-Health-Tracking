import Link from "next/link";
import { db } from "@/db";
import { ancVisits } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ChevronRight, Filter } from "lucide-react";
import { RiskBadge } from "@/components/risk-badge";
import { DataTable, DataTableHead, DataTableRow } from "@/components/data-table";
import { formatBeneficiaryId } from "@/lib/beneficiary-id";
import { PersonAvatar } from "@/components/person-avatar";
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

  // Summary tallies for the pagination footer
  const summary = filtered.reduce(
    (acc, m) => {
      const r = m.ancVisits[0]?.riskLevel ?? "NORMAL";
      if (r === "CRITICAL") acc.critical += 1;
      else if (r === "HIGH") acc.high += 1;
      else acc.normal += 1;
      return acc;
    },
    { critical: 0, high: 0, normal: 0 },
  );

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
        <span className="text-[var(--fg)] font-medium">People</span>
      </nav>

      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
          People
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">
          {filtered.length} beneficiar{filtered.length === 1 ? "y" : "ies"} tracked across {BLOCKS.length} blocks in Palakkad District.
        </p>
      </header>

      {/* Filter chips */}
      <div className="flex items-center gap-2 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto pb-1">
        <Link
          href="/admin/people"
          className={cn(
            "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all",
            !blockFilter
              ? "text-white shadow-primary-sm"
              : "bg-white border border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--primary)]/40",
          )}
          style={
            !blockFilter ? { background: "var(--gradient-primary)" } : undefined
          }
        >
          All blocks
        </Link>
        {BLOCKS.map((b) => {
          const active = blockFilter === b;
          return (
            <Link
              key={b}
              href={`/admin/people?block=${b}`}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all",
                active
                  ? "text-white shadow-primary-sm"
                  : "bg-white border border-[var(--border)] text-[var(--fg)] hover:border-[var(--primary)]/40",
              )}
              style={
                active ? { background: "var(--gradient-primary)" } : undefined
              }
            >
              {b}
            </Link>
          );
        })}
        <button
          type="button"
          className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-dashed border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--primary)]/40 hover:text-[var(--fg)] transition-colors"
        >
          <Filter className="size-3" />
          More filters
        </button>
      </div>

      {/* Data table */}
      <DataTable minWidth={760}>
        <DataTableHead>
          <tr>
            <th className="text-left px-4 py-3 font-medium">Beneficiary</th>
            <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
              ABHA ID
            </th>
            <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">
              Village
            </th>
            <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">
              Pregnancy
            </th>
            <th className="text-left px-4 py-3 font-medium">Risk</th>
          </tr>
        </DataTableHead>
        <tbody>
          {filtered.map((m) => {
            const risk = m.ancVisits[0]?.riskLevel ?? "NORMAL";
            return (
              <DataTableRow key={m.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/people/m-${m.id}`}
                    className="flex items-center gap-3 group min-w-0"
                  >
                    <PersonAvatar
                      name={m.name}
                      seed={`m-${m.id}`}
                      kind="woman"
                      className="size-9 text-[11px]"
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors truncate">
                        {m.name}
                      </div>
                      <div className="text-[11px] text-[var(--fg-muted)] truncate md:hidden font-mono-num">
                        {formatBeneficiaryId(m.beneficiaryId12)}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono-num text-xs text-[var(--fg-muted)] hidden md:table-cell whitespace-nowrap">
                  {formatBeneficiaryId(m.beneficiaryId12)}
                </td>
                <td className="px-4 py-3 text-[var(--fg-muted)] text-sm hidden sm:table-cell">
                  {m.family.village}, {m.family.block}
                </td>
                <td className="px-4 py-3 text-xs text-[var(--fg-muted)] hidden lg:table-cell font-mono-num">
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

      {/* Pagination / summary footer */}
      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[var(--fg-muted)]">
          <div>
            Showing <span className="font-mono-num font-semibold text-[var(--fg)]">1</span> to{" "}
            <span className="font-mono-num font-semibold text-[var(--fg)]">{filtered.length}</span> of{" "}
            <span className="font-mono-num font-semibold text-[var(--fg)]">{filtered.length}</span> beneficiaries
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--primary-50)] text-[var(--primary)] font-medium">
              <span className="size-1.5 rounded-full bg-[var(--primary)]" />
              <span className="font-mono-num">{summary.normal}</span> Normal
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--risk-high)]/10 text-[var(--risk-high)] font-medium">
              <span className="size-1.5 rounded-full bg-[var(--risk-high)]" />
              <span className="font-mono-num">{summary.high}</span> High
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--risk-critical)]/10 text-[var(--risk-critical)] font-medium">
              <span className="size-1.5 rounded-full bg-[var(--risk-critical)]" />
              <span className="font-mono-num">{summary.critical}</span> Critical
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { db } from "@/db";
import { referrals } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import { ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { DataTable, DataTableHead, DataTableRow } from "@/components/data-table";

const TIERS = [
  { code: "SC", label: "Sub-Centre" },
  { code: "PHC", label: "Primary Health" },
  { code: "CHC", label: "Community Health" },
  { code: "DH", label: "District Hospital" },
] as const;

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-[var(--risk-high)]/10 text-[var(--risk-high)]",
  ACK: "bg-[var(--primary-50)] text-[var(--primary)]",
  ACCEPTED: "bg-[var(--primary-50)] text-[var(--primary)]",
  COMPLETED: "bg-[var(--primary-50)] text-[var(--primary)]",
};

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
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-[var(--fg-muted)]"
      >
        <Link href="/admin" className="hover:text-[var(--fg)]">
          Admin
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-[var(--fg)] font-medium">Referrals</span>
      </nav>

      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
          Referrals
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">
          Tier escalation flow and state-wide tracking
        </p>
      </header>

      {/* Escalation card */}
      <section className="rounded-2xl border border-[var(--border)] bg-white p-6 sm:p-8 shadow-card">
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div>
            <h2 className="text-sm font-semibold text-[var(--fg)] tracking-tight">
              Escalation cascade
            </h2>
            <p className="text-[11px] text-[var(--fg-muted)] mt-0.5">
              Cumulative incoming referrals per tier
            </p>
          </div>
          <span className="text-[10px] font-mono-num text-[var(--fg-subtle)] uppercase tracking-wider">
            Last 30 days
          </span>
        </div>

        <div className="flex items-start justify-between gap-2 sm:gap-4 overflow-x-auto pb-2">
          {TIERS.map((tier, i) => {
            const incoming = counts
              .filter((c) => c.to === tier.code)
              .reduce((s, c) => s + c.n, 0);
            return (
              <div key={tier.code} className="flex items-start shrink-0">
                <div className="text-center min-w-[88px]">
                  <div className="relative inline-block">
                    <div className="size-20 sm:size-24 rounded-full bg-[var(--primary-50)] border border-[var(--primary)]/15 flex items-center justify-center shadow-card">
                      <span className="text-2xl sm:text-3xl font-semibold font-mono-num text-[var(--primary)] tabular-nums">
                        {incoming}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base mt-3 font-semibold text-[var(--fg)] tracking-tight">
                    {tier.code}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-[var(--fg-muted)] mt-0.5">
                    {tier.label}
                  </p>
                </div>
                {i < TIERS.length - 1 && (
                  <div className="flex items-center justify-center self-center h-20 sm:h-24 px-1 sm:px-2 shrink-0">
                    <ChevronRight className="size-5 sm:size-6 text-[var(--primary)]/40" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent referrals */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <h2 className="text-sm font-semibold text-[var(--fg)] tracking-tight">
            Recent referrals
          </h2>
          <span className="text-[11px] text-[var(--fg-muted)] font-mono-num">
            {recent.length} latest
          </span>
        </div>
        <DataTable minWidth={680}>
          <DataTableHead>
            <tr>
              <th className="text-left px-4 py-3 font-medium">From → To</th>
              <th className="text-left px-4 py-3 font-medium">Subject</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">
                Reason
              </th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                Raised
              </th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
            </tr>
          </DataTableHead>
          <tbody>
            {recent.map((r) => (
              <DataTableRow key={r.id}>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 font-medium text-[var(--fg)] font-mono-num text-xs">
                    <span className="px-1.5 py-0.5 rounded-md bg-[var(--surface-alt)] border border-[var(--border)]">
                      {r.tierFrom}
                    </span>
                    <ChevronRight className="size-3 text-[var(--fg-subtle)]" />
                    <span className="px-1.5 py-0.5 rounded-md bg-[var(--primary-50)] text-[var(--primary)] border border-[var(--primary)]/15">
                      {r.tierTo}
                    </span>
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[var(--fg-muted)] font-mono-num">
                  {r.subjectType} #{r.subjectId}
                </td>
                <td className="px-4 py-3 text-xs text-[var(--fg)] hidden sm:table-cell">
                  {r.reason ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs text-[var(--fg-muted)] font-mono-num hidden md:table-cell whitespace-nowrap">
                  {formatDistanceToNow(r.createdAt, { addSuffix: true })}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold " +
                      (STATUS_STYLES[r.status] ?? "bg-[var(--surface-alt)] text-[var(--fg-muted)]")
                    }
                  >
                    {r.status}
                  </span>
                </td>
              </DataTableRow>
            ))}
            {recent.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-[var(--fg-muted)]"
                >
                  No referrals yet.
                </td>
              </tr>
            )}
          </tbody>
        </DataTable>
      </section>
    </div>
  );
}

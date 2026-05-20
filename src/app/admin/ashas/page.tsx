import { db } from "@/db";
import { sql } from "drizzle-orm";
import {
  DataTable,
  DataTableHead,
  DataTableRow,
} from "@/components/data-table";
import { KpiCard } from "@/components/kpi-card";
import { Star } from "lucide-react";

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (
    (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")
  ).toUpperCase();
}

export default async function AdminAshas() {
  const result = await db.execute(sql`
    select
      fw.id, fw.name, f.name as facility, count(distinct fam.id) as families,
      count(av.id) as visits, count(*) filter (where av.risk_level='CRITICAL') as critical_caught
    from field_workers fw
    left join facilities f on f.id = fw.facility_id
    left join families fam on fam.asha_id = fw.id
    left join mothers m on m.family_id = fam.id
    left join anc_visits av on av.mother_id = m.id
    where fw.role = 'ASHA'
    group by fw.id, fw.name, f.name
    order by visits desc
  `);
  const data = (
    Array.isArray(result) ? result : (result as { rows: unknown[] }).rows ?? []
  ) as Array<{
    id: number;
    name: string;
    facility: string;
    families: number;
    visits: number;
    critical_caught: number;
  }>;

  const totalAshas = data.length;
  const totalVisits = data.reduce((s, a) => s + Number(a.visits || 0), 0);
  const totalCritical = data.reduce(
    (s, a) => s + Number(a.critical_caught || 0),
    0,
  );
  const compliance =
    totalAshas === 0
      ? 0
      : Math.round(
          (data.filter((a) => Number(a.visits || 0) >= 1).length /
            totalAshas) *
            100,
        );

  return (
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
            ASHAs
          </h1>
          <p className="text-sm text-[var(--fg-muted)]">
            Performance leaderboard · last 30 days
          </p>
        </div>
        <div className="inline-flex items-center gap-1 self-start sm:self-auto h-9 px-1 rounded-full bg-[var(--card)] border border-[var(--border)] shrink-0">
          {(["7d", "30d", "QTD"] as const).map((p, i) => (
            <span
              key={p}
              className={
                i === 1
                  ? "inline-flex items-center h-7 px-3 rounded-full text-[11px] font-medium bg-gradient-primary text-white shadow-primary-sm"
                  : "inline-flex items-center h-7 px-3 rounded-full text-[11px] font-medium text-[var(--fg-muted)]"
              }
            >
              {p}
            </span>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard label="Active ASHAs" value={totalAshas} />
        <KpiCard label="Visits" value={totalVisits} />
        <KpiCard
          label="Critical caught"
          value={totalCritical}
          tone="alert"
        />
        <KpiCard label="Compliance" value={compliance} suffix="%" />
      </div>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-card overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--fg)] tracking-tight">
            Leaderboard
          </h2>
          <span className="text-[11px] font-mono-num text-[var(--fg-muted)]">
            {data.length} ASHAs
          </span>
        </div>
        <DataTable minWidth={720}>
          <DataTableHead>
            <tr>
              <th className="text-left px-4 py-2.5 font-medium w-14">
                Rank
              </th>
              <th className="text-left px-4 py-2.5 font-medium">Name</th>
              <th className="text-left px-4 py-2.5 font-medium hidden sm:table-cell">
                Sub-Centre
              </th>
              <th className="text-right px-4 py-2.5 font-medium hidden sm:table-cell">
                Families
              </th>
              <th className="text-right px-4 py-2.5 font-medium">Visits</th>
              <th className="text-right px-4 py-2.5 font-medium">
                Critical
              </th>
            </tr>
          </DataTableHead>
          <tbody>
            {data.map((a, i) => {
              const rank = i + 1;
              const isTop = rank === 1;
              return (
                <DataTableRow key={a.id}>
                  <td className="px-4 py-3">
                    <div
                      className={
                        "size-7 rounded-lg flex items-center justify-center text-[11px] font-semibold font-mono-num " +
                        (isTop
                          ? "bg-[var(--primary-50)] text-[var(--primary)] ring-1 ring-[var(--primary)]/20"
                          : "bg-[var(--surface-alt)] text-[var(--fg-muted)]")
                      }
                    >
                      {rank}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="size-8 rounded-full flex items-center justify-center text-white text-[11px] font-semibold shrink-0 tracking-tight"
                        style={{
                          background: "var(--gradient-primary)",
                        }}
                      >
                        {initialsOf(a.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-[var(--fg)] truncate flex items-center gap-1.5">
                          {a.name}
                          {isTop && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                              <Star
                                className="size-2.5"
                                strokeWidth={2.4}
                                fill="currentColor"
                              />
                              Top
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[var(--fg-muted)] sm:hidden truncate">
                          {a.facility ?? "—"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--fg-muted)] hidden sm:table-cell">
                    {a.facility ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-mono-num text-[var(--fg-muted)] hidden sm:table-cell">
                    {a.families}
                  </td>
                  <td className="px-4 py-3 text-right font-mono-num font-semibold text-[var(--fg)]">
                    {a.visits}
                  </td>
                  <td className="px-4 py-3 text-right font-mono-num">
                    {Number(a.critical_caught) > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--risk-critical)]/10 text-[var(--risk-critical)]">
                        {a.critical_caught}
                      </span>
                    ) : (
                      <span className="text-[var(--fg-subtle)]">0</span>
                    )}
                  </td>
                </DataTableRow>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-sm text-[var(--fg-muted)]"
                >
                  No ASHA records found.
                </td>
              </tr>
            )}
          </tbody>
        </DataTable>
      </section>
    </div>
  );
}

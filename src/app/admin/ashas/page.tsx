import { db } from "@/db";
import { sql } from "drizzle-orm";
import { DataTable, DataTableHead, DataTableRow } from "@/components/data-table";

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
  const data = (Array.isArray(result) ? result : (result as { rows: unknown[] }).rows ?? []) as Array<{
    id: number;
    name: string;
    facility: string;
    families: number;
    visits: number;
    critical_caught: number;
  }>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
          ASHAs
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">Performance leaderboard</p>
      </header>
      <DataTable minWidth={720}>
        <DataTableHead>
          <tr>
            <th className="text-left px-4 py-2.5 font-medium">Rank</th>
            <th className="text-left px-4 py-2.5 font-medium">Name</th>
            <th className="text-left px-4 py-2.5 font-medium hidden sm:table-cell">
              Sub-Centre
            </th>
            <th className="text-right px-4 py-2.5 font-medium hidden sm:table-cell">
              Families
            </th>
            <th className="text-right px-4 py-2.5 font-medium">Visits</th>
            <th className="text-right px-4 py-2.5 font-medium">Critical</th>
          </tr>
        </DataTableHead>
        <tbody>
          {data.map((a, i) => (
            <DataTableRow key={a.id}>
              <td className="px-4 py-3 font-mono-num text-[var(--fg-muted)]">
                #{i + 1}
              </td>
              <td className="px-4 py-3 font-medium">{a.name}</td>
              <td className="px-4 py-3 text-[var(--fg-muted)] hidden sm:table-cell">
                {a.facility ?? "—"}
              </td>
              <td className="px-4 py-3 text-right font-mono-num text-[var(--fg-muted)] hidden sm:table-cell">
                {a.families}
              </td>
              <td className="px-4 py-3 text-right font-mono-num">{a.visits}</td>
              <td className="px-4 py-3 text-right font-mono-num">
                {a.critical_caught}
              </td>
            </DataTableRow>
          ))}
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
    </div>
  );
}

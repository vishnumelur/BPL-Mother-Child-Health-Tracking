import { db } from "@/db";
import { sql } from "drizzle-orm";
import { Card } from "@/components/ui/card";

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
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--primary)]">ASHAs</h1>
        <p className="text-sm text-[var(--fg-muted)]">Performance leaderboard</p>
      </header>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left p-3">Rank</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Sub-Centre</th>
              <th className="text-right p-3">Families</th>
              <th className="text-right p-3">Visits</th>
              <th className="text-right p-3">Critical caught</th>
            </tr>
          </thead>
          <tbody>
            {data.map((a, i) => (
              <tr key={a.id} className="border-b">
                <td className="p-3 font-mono-num">#{i + 1}</td>
                <td className="p-3 font-medium">{a.name}</td>
                <td className="p-3">{a.facility ?? "—"}</td>
                <td className="p-3 text-right font-mono-num">{a.families}</td>
                <td className="p-3 text-right font-mono-num">{a.visits}</td>
                <td className="p-3 text-right font-mono-num">
                  {a.critical_caught}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

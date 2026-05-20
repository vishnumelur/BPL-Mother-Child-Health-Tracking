import { db } from "@/db";
import { Card } from "@/components/ui/card";

export default async function AdminFacilities() {
  const rows = await db.query.facilities.findMany();
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--primary)]">Facilities</h1>
        <p className="text-sm text-[var(--fg-muted)]">
          {rows.length} facilities · SC / PHC / CHC / DH
        </p>
      </header>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Block</th>
              <th className="text-left p-3">Coordinates</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.id} className="border-b">
                <td className="p-3 font-medium">{f.name}</td>
                <td className="p-3">{f.type}</td>
                <td className="p-3">{f.block}</td>
                <td className="p-3 font-mono-num text-xs">
                  {f.lat?.toFixed(2)}, {f.lng?.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

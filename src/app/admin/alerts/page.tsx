import Link from "next/link";
import { db } from "@/db";
import { alerts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Card } from "@/components/ui/card";
import { Siren, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function AdminAlerts() {
  const rows = await db.query.alerts.findMany({
    orderBy: desc(alerts.raisedAt),
    limit: 100,
  });
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--primary)]">
          Alerts queue
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">{rows.length} alerts</p>
      </header>
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Subject</th>
              <th className="text-left p-3">Note</th>
              <th className="text-left p-3">Raised</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="border-b hover:bg-slate-50">
                <td className="p-3">
                  <Link
                    href={`/admin/alerts/${a.id}`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    {a.type === "SOS" ? (
                      <Siren className="size-4 text-[var(--risk-critical)]" />
                    ) : (
                      <AlertTriangle className="size-4 text-[var(--risk-high)]" />
                    )}
                    {a.type}
                  </Link>
                </td>
                <td className="p-3 text-xs text-[var(--fg-muted)]">
                  {a.subjectType} #{a.subjectId}
                </td>
                <td className="p-3 text-xs">{a.note ?? "—"}</td>
                <td className="p-3 text-xs font-mono-num">
                  {formatDistanceToNow(a.raisedAt, { addSuffix: true })}
                </td>
                <td className="p-3 text-xs">{a.status}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-sm text-[var(--fg-muted)]">
                  No alerts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

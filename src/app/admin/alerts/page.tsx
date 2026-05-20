import Link from "next/link";
import { db } from "@/db";
import { alerts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Siren, AlertTriangle } from "lucide-react";
import { DataTable, DataTableHead, DataTableRow } from "@/components/data-table";
import { formatDistanceToNow } from "date-fns";

export default async function AdminAlerts() {
  const rows = await db.query.alerts.findMany({
    orderBy: desc(alerts.raisedAt),
    limit: 100,
  });
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
          Alerts
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">
          {rows.length} alert{rows.length === 1 ? "" : "s"} in queue
        </p>
      </header>
      <DataTable minWidth={720}>
        <DataTableHead>
          <tr>
            <th className="text-left px-4 py-2.5 font-medium">Type</th>
            <th className="text-left px-4 py-2.5 font-medium">Subject</th>
            <th className="text-left px-4 py-2.5 font-medium hidden sm:table-cell">
              Note
            </th>
            <th className="text-left px-4 py-2.5 font-medium">Raised</th>
            <th className="text-left px-4 py-2.5 font-medium">Status</th>
          </tr>
        </DataTableHead>
        <tbody>
          {rows.map((a) => (
            <DataTableRow key={a.id}>
              <td className="px-4 py-3">
                <Link
                  href={`/admin/alerts/${a.id}`}
                  className="inline-flex items-center gap-2 font-medium hover:text-[var(--primary)]"
                >
                  {a.type === "SOS" ? (
                    <Siren className="size-4 text-[var(--risk-critical)]" />
                  ) : (
                    <AlertTriangle className="size-4 text-[var(--risk-high)]" />
                  )}
                  {a.type}
                </Link>
              </td>
              <td className="px-4 py-3 text-xs text-[var(--fg-muted)]">
                {a.subjectType} #{a.subjectId}
              </td>
              <td className="px-4 py-3 text-xs text-[var(--fg-muted)] hidden sm:table-cell max-w-xs truncate">
                {a.note ?? "—"}
              </td>
              <td className="px-4 py-3 text-xs font-mono-num text-[var(--fg-muted)]">
                {formatDistanceToNow(a.raisedAt, { addSuffix: true })}
              </td>
              <td className="px-4 py-3 text-xs">
                <span className="inline-flex px-2 py-0.5 rounded-full bg-[var(--surface-alt)] text-[var(--fg)] font-medium">
                  {a.status}
                </span>
              </td>
            </DataTableRow>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-10 text-center text-sm text-[var(--fg-muted)]"
              >
                No alerts yet.
              </td>
            </tr>
          )}
        </tbody>
      </DataTable>
    </div>
  );
}

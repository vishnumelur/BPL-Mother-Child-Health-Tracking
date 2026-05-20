import Link from "next/link";
import { Siren, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AlertItem {
  id: number;
  type: string;
  status: string;
  raisedAt: Date;
  note: string | null;
  channels: Array<{ to: string; status: string }> | null;
}

export function LiveAlertsPanel({ alerts }: { alerts: AlertItem[] }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6 space-y-4 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--fg)]">
            Live alerts
          </h3>
          <p className="text-[11px] text-[var(--fg-muted)] mt-0.5">
            Most recent dispatches
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono-num font-medium text-[var(--primary)] bg-[var(--primary-50)] px-2.5 py-1 rounded-full">
          <span className="size-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
          {alerts.length}
        </span>
      </div>
      {alerts.length === 0 && (
        <p className="text-xs text-[var(--fg-muted)] py-6 text-center">
          No active alerts
        </p>
      )}
      <ul className="space-y-1.5">
        {alerts.map((a) => (
          <li key={a.id}>
            <Link
              href={`/admin/alerts/${a.id}`}
              className="block p-2.5 -mx-2.5 rounded-xl hover:bg-[var(--surface-alt)] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {a.type === "SOS" ? (
                  <div className="size-8 rounded-xl bg-[var(--risk-critical)]/10 flex items-center justify-center shrink-0">
                    <Siren className="size-4 text-[var(--risk-critical)]" />
                  </div>
                ) : (
                  <div className="size-8 rounded-xl bg-[var(--risk-high)]/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="size-4 text-[var(--risk-high)]" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[var(--fg)]">
                      {a.type}
                    </span>
                    <span className="text-[11px] text-[var(--fg-muted)] font-mono-num">
                      {formatDistanceToNow(a.raisedAt, { addSuffix: true })}
                    </span>
                  </div>
                  {a.note && (
                    <p className="text-[11px] text-[var(--fg-muted)] line-clamp-1 mt-0.5">
                      {a.note}
                    </p>
                  )}
                </div>
              </div>
              {a.channels && a.channels.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 ml-10">
                  {a.channels.map((c) => (
                    <span
                      key={c.to}
                      className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--primary-50)] text-[var(--primary)] font-medium"
                    >
                      {c.to.replace(/_/g, " ")} ✓
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

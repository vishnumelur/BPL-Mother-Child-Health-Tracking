import Link from "next/link";
import { Card } from "@/components/ui/card";
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
    <Card className="p-4 space-y-3">
      <h3 className="text-sm font-semibold">Live alerts</h3>
      {alerts.length === 0 && (
        <p className="text-xs text-[var(--fg-muted)]">No active alerts</p>
      )}
      <ul className="space-y-2">
        {alerts.map((a) => (
          <li key={a.id}>
            <Link
              href={`/admin/alerts/${a.id}`}
              className="block p-2 rounded-lg hover:bg-[var(--surface-alt)]"
            >
              <div className="flex items-center gap-2">
                {a.type === "SOS" ? (
                  <Siren className="size-4 text-[var(--risk-critical)]" />
                ) : (
                  <AlertTriangle className="size-4 text-[var(--risk-high)]" />
                )}
                <span className="text-sm font-medium">{a.type}</span>
                <span className="text-xs text-[var(--fg-muted)] ml-auto font-mono-num">
                  {formatDistanceToNow(a.raisedAt, { addSuffix: true })}
                </span>
              </div>
              {a.note && (
                <p className="text-xs text-[var(--fg-muted)] mt-1 line-clamp-1">
                  {a.note}
                </p>
              )}
              {a.channels && a.channels.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {a.channels.map((c) => (
                    <span
                      key={c.to}
                      className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--surface-alt)] text-[var(--fg-muted)]"
                    >
                      {c.to} ✓
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

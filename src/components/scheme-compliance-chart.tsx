import { Card } from "@/components/ui/card";

export function SchemeComplianceChart({
  data,
}: {
  data: Array<{ code: string; percent: number }>;
}) {
  return (
    <Card className="p-4 space-y-3">
      <h3 className="text-sm font-semibold">Scheme compliance</h3>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.code} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium">{d.code}</span>
              <span className="text-[var(--fg-muted)] font-mono-num">
                {d.percent}%
              </span>
            </div>
            <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] transition-all"
                style={{ width: `${d.percent}%` }}
              />
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-xs text-[var(--fg-muted)]">No scheme data yet</p>
        )}
      </div>
    </Card>
  );
}

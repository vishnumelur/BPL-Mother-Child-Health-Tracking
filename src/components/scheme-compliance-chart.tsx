export function SchemeComplianceChart({
  data,
}: {
  data: Array<{ code: string; percent: number }>;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 space-y-3">
      <h3 className="text-sm font-semibold text-[var(--fg)]">
        Scheme compliance
      </h3>
      <div className="space-y-2.5">
        {data.map((d) => (
          <div key={d.code} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-[var(--fg)]">{d.code}</span>
              <span className="text-[var(--fg-muted)] font-mono-num">
                {d.percent}%
              </span>
            </div>
            <div className="h-2 bg-[var(--surface-alt)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--primary)] transition-all"
                style={{ width: `${d.percent}%` }}
              />
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-xs text-[var(--fg-muted)]">No scheme data yet</p>
        )}
      </div>
    </div>
  );
}

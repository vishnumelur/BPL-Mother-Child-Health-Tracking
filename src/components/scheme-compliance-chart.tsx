export function SchemeComplianceChart({
  data,
}: {
  data: Array<{ code: string; percent: number }>;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6 space-y-4 shadow-card">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-[var(--fg)]">
          Scheme compliance
        </h3>
        <p className="text-[11px] text-[var(--fg-muted)]">
          Disbursement % across active schemes
        </p>
      </div>
      <div className="space-y-3.5">
        {data.map((d) => (
          <div key={d.code} className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-[var(--fg)] tracking-tight">
                {d.code}
              </span>
              <span className="text-[var(--fg)] font-mono-num text-sm font-semibold tabular-nums">
                {d.percent}
                <span className="text-xs text-[var(--fg-muted)] ml-0.5">%</span>
              </span>
            </div>
            <div className="h-2 bg-[var(--surface-alt)] rounded-full overflow-hidden relative">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${d.percent}%`,
                  background: "var(--gradient-primary)",
                }}
              />
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-xs text-[var(--fg-muted)] py-4 text-center">
            No scheme data yet
          </p>
        )}
      </div>
    </div>
  );
}

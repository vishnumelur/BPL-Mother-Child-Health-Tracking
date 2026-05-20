interface BlockData {
  block: string;
  critical: number;
  high: number;
  normal: number;
}

const POSITIONS: Record<string, { x: number; y: number }> = {
  Agali: { x: 0.72, y: 0.28 },
  Sholayur: { x: 0.5, y: 0.4 },
  Pudur: { x: 0.82, y: 0.52 },
  Mannarkkad: { x: 0.3, y: 0.65 },
  Attappadi: { x: 0.55, y: 0.18 },
  Palakkad: { x: 0.22, y: 0.85 },
};

function toneFor(b: BlockData): string {
  if (b.critical > 0) return "var(--risk-critical)";
  if (b.high > 0) return "var(--risk-high)";
  return "var(--primary)";
}

export function PalakkadMap({ data }: { data: BlockData[] }) {
  return (
    <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] overflow-hidden p-5 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-[var(--fg)]">Palakkad District</h3>
          <p className="text-[11px] text-[var(--fg-muted)]">
            Attappadi region · block-level risk
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[var(--fg-muted)]">
          <div className="flex items-center gap-1">
            <div className="size-2 rounded-full bg-[var(--primary)]" />
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="size-2 rounded-full bg-[var(--risk-high)]" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="size-2 rounded-full bg-[var(--risk-critical)]" />
            <span>Critical</span>
          </div>
        </div>
      </div>
      <div className="relative aspect-[4/3]">
        <svg
          viewBox="0 0 400 300"
          className="absolute inset-0 size-full"
          aria-hidden
        >
          <path
            d="M40,80 L120,40 L240,30 L340,70 L370,150 L320,240 L200,270 L80,250 L30,160 Z"
            fill="var(--card)"
            stroke="var(--border)"
            strokeWidth="1.5"
          />
        </svg>
        {data.map((b) => {
          const pos = POSITIONS[b.block];
          if (!pos) return null;
          return (
            <div
              key={b.block}
              className="absolute"
              style={{
                left: `${pos.x * 100}%`,
                top: `${pos.y * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative">
                <div
                  className="size-3 rounded-full ring-[3px] ring-white"
                  style={{ background: toneFor(b) }}
                />
                <div
                  className="absolute size-3 rounded-full animate-ping opacity-30"
                  style={{ background: toneFor(b), top: 0, left: 0 }}
                />
              </div>
              <div className="absolute left-4 top-0 text-[11px] whitespace-nowrap font-medium text-[var(--fg)]">
                {b.block}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

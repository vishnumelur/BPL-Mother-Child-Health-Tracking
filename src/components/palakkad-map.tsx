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
    <div className="relative rounded-2xl border border-[var(--border)] bg-white overflow-hidden p-5 sm:p-6 shadow-card">
      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-semibold text-[var(--fg)]">
            Palakkad District
          </h3>
          <p className="text-[11px] text-[var(--fg-muted)] mt-0.5">
            Attappadi region · block-level risk
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[var(--fg-muted)]">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-[var(--primary)]" />
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-[var(--risk-high)]" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-[var(--risk-critical)]" />
            <span>Critical</span>
          </div>
        </div>
      </div>
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-mesh">
        <svg
          viewBox="0 0 400 300"
          className="absolute inset-0 size-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="district-fill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E7F8F3" />
              <stop offset="100%" stopColor="#F0FBF7" />
            </linearGradient>
          </defs>
          <path
            d="M40,80 L120,40 L240,30 L340,70 L370,150 L320,240 L200,270 L80,250 L30,160 Z"
            fill="url(#district-fill)"
            stroke="#00A884"
            strokeOpacity="0.2"
            strokeWidth="1.5"
          />
        </svg>
        {data.map((b) => {
          const pos = POSITIONS[b.block];
          if (!pos) return null;
          const tone = toneFor(b);
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
                  className="size-3 rounded-full ring-[3px] ring-white shadow-sm"
                  style={{ background: tone }}
                />
                <div
                  className="absolute inset-0 size-3 rounded-full animate-ping opacity-30"
                  style={{ background: tone }}
                />
              </div>
              <div className="absolute left-4 -top-0.5 text-[11px] whitespace-nowrap font-semibold text-[var(--fg)] bg-white/80 backdrop-blur px-1.5 py-0.5 rounded">
                {b.block}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

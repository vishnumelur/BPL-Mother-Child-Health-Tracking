import { Activity, Mountain } from "lucide-react";

interface BlockData {
  block: string;
  critical: number;
  high: number;
  normal: number;
}

// Approximate positions inside the SVG viewBox (0..100). Tuned so blocks
// sit on top of the rendered district polygon and read naturally.
const POSITIONS: Record<string, { x: number; y: number }> = {
  Sholayur:   { x: 58, y: 24 },
  Pudur:      { x: 78, y: 32 },
  Agali:      { x: 62, y: 40 },
  Attappadi:  { x: 44, y: 33 },
  Mannarkkad: { x: 30, y: 60 },
  Palakkad:   { x: 22, y: 78 },
};

function severity(b: BlockData): "critical" | "high" | "normal" {
  if (b.critical > 0) return "critical";
  if (b.high > 0) return "high";
  return "normal";
}

const TONE = {
  normal:   { ring: "ring-[var(--primary)]/15",       dot: "bg-[var(--primary)]",       text: "text-[var(--primary)]",       bg: "bg-[var(--primary)]/10" },
  high:     { ring: "ring-[var(--risk-high)]/25",     dot: "bg-[var(--risk-high)]",     text: "text-[var(--risk-high)]",     bg: "bg-[var(--risk-high)]/15" },
  critical: { ring: "ring-[var(--risk-critical)]/30", dot: "bg-[var(--risk-critical)]", text: "text-[var(--risk-critical)]", bg: "bg-[var(--risk-critical)]/15" },
} as const;

export function PalakkadMap({ data }: { data: BlockData[] }) {
  const totalMothers = data.reduce(
    (acc, b) => acc + b.normal + b.high + b.critical,
    0,
  );
  const totalCritical = data.reduce((acc, b) => acc + b.critical, 0);
  const totalHigh = data.reduce((acc, b) => acc + b.high, 0);

  return (
    <div className="relative rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-card">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap p-5 sm:p-6 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--fg)] tracking-tight">
              Palakkad District
            </h3>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase text-[var(--primary)] bg-[var(--primary-50)] px-1.5 py-0.5 rounded-full">
              <Activity className="size-2.5" />
              Live
            </span>
          </div>
          <p className="text-[11px] text-[var(--fg-muted)]">
            Attappadi region · risk by block · auto-refreshed
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[var(--fg-muted)]">
          {(["normal", "high", "critical"] as const).map((level) => (
            <div key={level} className="flex items-center gap-1.5">
              <span className={`size-2 rounded-full ${TONE[level].dot}`} />
              <span className="capitalize">{level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map canvas */}
      <div className="relative mx-5 sm:mx-6 mb-4 sm:mb-6 aspect-[4/3] rounded-2xl overflow-hidden bg-[var(--surface-alt)] ring-1 ring-[var(--border)]">
        {/* Layered geographic backdrop */}
        <svg
          viewBox="0 0 100 75"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
          aria-hidden
        >
          <defs>
            <radialGradient id="map-glow" cx="55%" cy="35%" r="55%">
              <stop offset="0%" stopColor="#E7F8F3" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#F0FBF7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="district-fill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E7F8F3" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#F7FCFA" stopOpacity="0.9" />
            </linearGradient>
            <pattern id="topo" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
              <path d="M0 7 q 3.5 -4 7 0 t 7 0" fill="none" stroke="#0E7A5F" strokeOpacity="0.05" strokeWidth="0.4" />
            </pattern>
          </defs>

          <rect width="100" height="75" fill="url(#map-glow)" />
          <rect width="100" height="75" fill="url(#topo)" />

          <path
            d="
              M 8 50
              C 8 42, 14 36, 22 36
              L 28 32
              C 32 26, 40 22, 48 24
              L 56 16
              C 64 12, 74 14, 82 22
              C 90 30, 90 40, 84 46
              L 78 50
              C 74 58, 68 62, 60 60
              L 50 60
              C 42 64, 32 68, 24 64
              C 16 60, 8 58, 8 50 Z
            "
            fill="url(#district-fill)"
            stroke="#00A884"
            strokeOpacity="0.35"
            strokeWidth="0.5"
          />

          <text
            x="56"
            y="20"
            fontSize="2.2"
            fontWeight="600"
            letterSpacing="0.35"
            textAnchor="middle"
            fill="#667781"
            opacity="0.7"
          >
            ATTAPPADI
          </text>

          <path
            d="M 78 18 q 4 6 0 12 q -4 6 0 14 q 4 4 0 10"
            fill="none"
            stroke="#0E7A5F"
            strokeOpacity="0.18"
            strokeWidth="0.6"
            strokeDasharray="0.6 1.2"
          />

          <path
            d="M 22 36 C 32 38, 44 36, 56 30 S 70 26, 82 22"
            fill="none"
            stroke="#7AB8D9"
            strokeOpacity="0.35"
            strokeWidth="0.6"
            strokeLinecap="round"
          />
        </svg>

        {/* Mountain glyph */}
        <div className="absolute top-2 right-2.5 flex items-center gap-1 text-[9px] font-medium text-[var(--fg-subtle)] bg-white/75 backdrop-blur-sm border border-[var(--border)] rounded-full px-2 py-0.5">
          <Mountain className="size-2.5" />
          <span>Western Ghats</span>
        </div>

        {/* Compass */}
        <div className="absolute bottom-2 right-2.5 size-7 rounded-full bg-white/85 border border-[var(--border)] flex items-center justify-center text-[8px] font-bold text-[var(--fg-muted)]">
          <span className="absolute top-0.5 text-[7px] text-[var(--primary)]">N</span>
          <span className="text-[10px]">✧</span>
        </div>

        {/* Block markers — mobile shows tiny pulsing dots, desktop overlays rich tiles */}
        {data.map((b) => {
          const pos = POSITIONS[b.block];
          if (!pos) return null;
          const sev = severity(b);
          const tone = TONE[sev];
          const total = b.normal + b.high + b.critical;
          const isCritical = sev === "critical";

          return (
            <div
              key={b.block}
              className="absolute"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* MOBILE: simple pulsing dot — no overlapping tile content */}
              <div className="sm:hidden relative">
                {isCritical && (
                  <span
                    className={`absolute -inset-1 rounded-full ring-1 ring-[var(--risk-critical)]/50 map-pulse pointer-events-none`}
                    aria-hidden
                  />
                )}
                <span
                  className={`block size-2.5 rounded-full ${tone.dot} ring-2 ring-white shadow-card`}
                />
              </div>

              {/* DESKTOP (sm+): rich overlay tile */}
              <div className="hidden sm:block relative">
                {isCritical && (
                  <span
                    className={`absolute -inset-0.5 rounded-xl ring-2 ring-[var(--risk-critical)]/50 map-pulse pointer-events-none`}
                    aria-hidden
                  />
                )}
                <div
                  className={`relative flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur-sm border border-[var(--border)] ring-2 ${tone.ring} px-2.5 py-1.5 shadow-card`}
                >
                  <span className={`size-1.5 rounded-full ${tone.dot}`} />
                  <div className="leading-tight">
                    <div className="text-[10.5px] font-semibold text-[var(--fg)] tracking-tight">
                      {b.block}
                    </div>
                    <div className="flex items-center gap-1 text-[9.5px] text-[var(--fg-muted)] font-mono-num">
                      <span>{total}</span>
                      <span className="text-[8px] uppercase tracking-wider">mothers</span>
                    </div>
                  </div>
                  {(b.high > 0 || b.critical > 0) && (
                    <div className="flex items-center gap-0.5 pl-1.5 ml-0.5 border-l border-[var(--border)]">
                      {b.critical > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[14px] h-3.5 px-1 rounded-full bg-[var(--risk-critical)]/15 text-[8.5px] font-bold text-[var(--risk-critical)] font-mono-num">
                          {b.critical}
                        </span>
                      )}
                      {b.high > 0 && (
                        <span className="inline-flex items-center justify-center min-w-[14px] h-3.5 px-1 rounded-full bg-[var(--risk-high)]/15 text-[8.5px] font-bold text-[var(--risk-high)] font-mono-num">
                          {b.high}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MOBILE-ONLY block list — actual block data lives here, map stays clean */}
      <ul className="sm:hidden mx-5 mb-4 grid grid-cols-2 gap-2">
        {data.map((b) => {
          const sev = severity(b);
          const tone = TONE[sev];
          const total = b.normal + b.high + b.critical;
          return (
            <li
              key={b.block}
              className="rounded-xl border border-[var(--border)] bg-white p-2.5 flex items-center gap-2.5 shadow-card"
            >
              <span className={`size-2 rounded-full shrink-0 ${tone.dot}`} />
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-[var(--fg)] tracking-tight truncate">
                  {b.block}
                </div>
                <div className="text-[10px] text-[var(--fg-muted)] font-mono-num">
                  {total} mothers
                </div>
              </div>
              {(b.critical > 0 || b.high > 0) && (
                <div className="flex items-center gap-0.5 shrink-0">
                  {b.critical > 0 && (
                    <span className={`inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full ${TONE.critical.bg} text-[9px] font-bold ${TONE.critical.text} font-mono-num`}>
                      {b.critical}
                    </span>
                  )}
                  {b.high > 0 && (
                    <span className={`inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full ${TONE.high.bg} text-[9px] font-bold ${TONE.high.text} font-mono-num`}>
                      {b.high}
                    </span>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Footer ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 sm:px-6 pb-5 sm:pb-6">
        <div className="text-[10px] text-[var(--fg-muted)]">
          <span className="font-mono-num font-semibold text-[var(--fg)]">{totalMothers}</span>{" "}
          mothers across <span className="font-mono-num">{data.length}</span> blocks
        </div>
        <div className="flex items-center gap-3 text-[10px] text-[var(--fg-muted)]">
          <span className="inline-flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-[var(--risk-critical)]" />
            <span className="font-mono-num font-semibold text-[var(--risk-critical)]">{totalCritical}</span>
            critical
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-[var(--risk-high)]" />
            <span className="font-mono-num font-semibold text-[var(--risk-high)]">{totalHigh}</span>
            high
          </span>
        </div>
      </div>
    </div>
  );
}

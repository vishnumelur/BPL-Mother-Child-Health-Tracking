import { cn } from "@/lib/utils";

interface BlockData {
  block: string;
  critical: number;
  high: number;
  normal: number;
}

// Stylized layout — not real geography. Blocks placed on a 2x3 grid.
const POSITIONS: Record<string, { x: number; y: number }> = {
  Agali: { x: 0.7, y: 0.25 },
  Sholayur: { x: 0.5, y: 0.4 },
  Pudur: { x: 0.8, y: 0.5 },
  Mannarkkad: { x: 0.3, y: 0.65 },
  Attappadi: { x: 0.55, y: 0.18 },
  Palakkad: { x: 0.2, y: 0.85 },
};

function toneFor(b: BlockData): string {
  if (b.critical > 0) return "var(--risk-critical)";
  if (b.high > 0) return "var(--risk-high)";
  return "var(--risk-normal)";
}

export function PalakkadMap({ data }: { data: BlockData[] }) {
  return (
    <div className="relative aspect-[4/3] rounded-lg border bg-[var(--primary-50)] overflow-hidden">
      {/* Stylized district shape */}
      <svg viewBox="0 0 400 300" className="absolute inset-0 size-full opacity-20">
        <path
          d="M40,80 L120,40 L240,30 L340,70 L370,150 L320,240 L200,270 L80,250 L30,160 Z"
          fill="var(--primary)"
        />
      </svg>
      <div className="absolute top-2 left-3 text-xs font-medium text-[var(--primary)]">
        Palakkad District · Attappadi region
      </div>
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
            <div
              className="size-3 rounded-full ring-4 ring-white/60"
              style={{ background: toneFor(b) }}
            />
            <div className="absolute left-4 top-0 text-xs whitespace-nowrap font-medium">
              {b.block}
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";
import type { RiskLevel } from "@/lib/risk-scoring";

const STYLES: Record<
  RiskLevel,
  { bg: string; fg: string; label: string; icon: typeof CheckCircle2 }
> = {
  NORMAL: {
    bg: "bg-[var(--risk-normal)]/10",
    fg: "text-[var(--risk-normal)]",
    label: "Normal",
    icon: CheckCircle2,
  },
  HIGH: {
    bg: "bg-[var(--risk-high)]/10",
    fg: "text-[var(--risk-high)]",
    label: "High",
    icon: AlertTriangle,
  },
  CRITICAL: {
    bg: "bg-[var(--risk-critical)]/10",
    fg: "text-[var(--risk-critical)]",
    label: "Critical",
    icon: AlertOctagon,
  },
};

export function RiskBadge({
  level,
  className,
}: {
  level: RiskLevel;
  className?: string;
}) {
  const s = STYLES[level];
  const Icon = s.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
        s.bg,
        s.fg,
        className,
      )}
    >
      <Icon className="size-3.5" />
      {s.label}
    </span>
  );
}

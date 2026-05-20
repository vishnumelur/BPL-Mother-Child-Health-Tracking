import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { RiskBadge } from "./risk-badge";
import type { RiskLevel } from "@/lib/risk-scoring";

export interface BeneficiarySummary {
  id: number;
  name: string;
  subline: string;
  lastVisit?: string;
  riskLevel: RiskLevel;
  ashaName?: string;
  type: "mother" | "child";
}

export function BeneficiaryCard({ b }: { b: BeneficiarySummary }) {
  const initials = b.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <Link
      href={`/field/b/${b.type[0]}-${b.id}`}
      className="group block rounded-2xl border border-[var(--border)] bg-white p-4 shadow-card hover:shadow-elevated hover:-translate-y-0.5 hover:border-[var(--primary)]/30 active:scale-[0.99] transition-all"
    >
      <div className="flex items-start gap-3">
        <div
          className={
            "size-11 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 " +
            (b.riskLevel === "CRITICAL"
              ? "bg-[var(--risk-critical)]/10 text-[var(--risk-critical)]"
              : b.riskLevel === "HIGH"
                ? "bg-[var(--risk-high)]/10 text-[var(--risk-high)]"
                : "text-white")
          }
          style={
            b.riskLevel === "NORMAL"
              ? { background: "var(--gradient-primary)" }
              : undefined
          }
        >
          {initials || "·"}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="font-semibold text-[var(--fg)] truncate">
              {b.name}
            </div>
            <RiskBadge level={b.riskLevel} />
          </div>
          <div className="text-xs text-[var(--fg-muted)] truncate">
            {b.subline}
          </div>
          {(b.lastVisit || b.ashaName) && (
            <div className="text-[11px] text-[var(--fg-subtle)] flex items-center gap-2">
              {b.lastVisit && <span>Visit · {b.lastVisit}</span>}
              {b.lastVisit && b.ashaName && (
                <span className="size-0.5 rounded-full bg-[var(--fg-subtle)]" />
              )}
              {b.ashaName && <span>ASHA · {b.ashaName}</span>}
            </div>
          )}
        </div>
        <ChevronRight className="size-4 text-[var(--fg-subtle)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
      </div>
    </Link>
  );
}

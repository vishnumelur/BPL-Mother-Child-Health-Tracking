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
  return (
    <Link
      href={`/field/b/${b.type[0]}-${b.id}`}
      className="group block rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:border-[var(--primary)]/40 hover:shadow-sm active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="font-semibold text-[var(--fg)] truncate">{b.name}</div>
          <div className="text-xs text-[var(--fg-muted)] truncate">{b.subline}</div>
          {b.lastVisit && (
            <div className="text-[11px] text-[var(--fg-subtle)]">
              Last visit · {b.lastVisit}
            </div>
          )}
          {b.ashaName && (
            <div className="text-[11px] text-[var(--fg-subtle)]">
              ASHA · {b.ashaName}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <RiskBadge level={b.riskLevel} />
          <ChevronRight className="size-4 text-[var(--fg-subtle)] group-hover:text-[var(--primary)] transition-colors" />
        </div>
      </div>
    </Link>
  );
}

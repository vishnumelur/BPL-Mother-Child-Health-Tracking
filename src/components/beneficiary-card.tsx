import Link from "next/link";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "./risk-badge";
import type { RiskLevel } from "@/lib/risk-scoring";

export interface BeneficiarySummary {
  id: number;
  name: string;
  subline: string; // e.g., "G2P1 · 28w · Agali" or "PNC · D+7 · Sholayur"
  lastVisit?: string;
  riskLevel: RiskLevel;
  ashaName?: string;
  type: "mother" | "child";
}

export function BeneficiaryCard({ b }: { b: BeneficiarySummary }) {
  return (
    <Link href={`/field/b/${b.type[0]}-${b.id}`}>
      <Card className="p-4 hover:bg-[var(--primary-50)] transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="font-medium text-[var(--fg)]">{b.name}</div>
            <div className="text-xs text-[var(--fg-muted)]">{b.subline}</div>
            {b.lastVisit && (
              <div className="text-xs text-[var(--fg-muted)]">
                Last visit: {b.lastVisit}
              </div>
            )}
            {b.ashaName && (
              <div className="text-xs text-[var(--fg-muted)]">
                ASHA: {b.ashaName}
              </div>
            )}
          </div>
          <RiskBadge level={b.riskLevel} />
        </div>
      </Card>
    </Link>
  );
}

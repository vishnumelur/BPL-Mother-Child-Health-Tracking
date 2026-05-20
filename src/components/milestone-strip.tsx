import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function MilestoneStrip({
  milestones,
}: {
  milestones: Array<{ milestoneCode: string; expectedAgeMonths: number; status: "PENDING" | "ACHIEVED" | "DELAYED" }>;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {milestones.map((m) => (
        <div
          key={m.milestoneCode}
          className={cn(
            "flex items-center gap-2 p-2 rounded-md text-xs",
            m.status === "ACHIEVED" && "bg-[var(--risk-normal)]/10 text-[var(--risk-normal)]",
            m.status === "DELAYED" && "bg-[var(--risk-high)]/10 text-[var(--risk-high)]",
            m.status === "PENDING" && "bg-slate-50 text-[var(--fg-muted)]",
          )}
        >
          {m.status === "ACHIEVED" ? <Check className="size-3" /> : <Clock className="size-3" />}
          <span>{m.milestoneCode.replaceAll("_", " ").toLowerCase()}</span>
        </div>
      ))}
    </div>
  );
}

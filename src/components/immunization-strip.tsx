import { cn } from "@/lib/utils";

export function ImmunizationStrip({
  immunizations,
}: {
  immunizations: Array<{ vaccineCode: string; status: string }>;
}) {
  const top = immunizations.slice(0, 8);
  return (
    <div className="flex gap-1 flex-wrap">
      {top.map((i) => (
        <span
          key={i.vaccineCode}
          className={cn(
            "text-[10px] px-1.5 py-0.5 rounded",
            i.status === "GIVEN" && "bg-[var(--risk-normal)]/10 text-[var(--risk-normal)]",
            i.status === "DUE" && "bg-[var(--risk-high)]/10 text-[var(--risk-high)]",
            i.status === "UPCOMING" && "bg-slate-50 text-[var(--fg-muted)]",
            i.status === "MISSED" && "bg-[var(--risk-critical)]/10 text-[var(--risk-critical)]",
          )}
        >
          {i.vaccineCode}
        </span>
      ))}
    </div>
  );
}

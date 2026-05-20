import { Card } from "@/components/ui/card";

export function KpiCard({
  label,
  value,
  suffix,
  tone = "default",
}: {
  label: string;
  value: number | string;
  suffix?: string;
  tone?: "default" | "alert";
}) {
  return (
    <Card className="p-4 space-y-1">
      <div className="text-xs text-[var(--fg-muted)] uppercase tracking-wide">
        {label}
      </div>
      <div
        className={
          "text-3xl font-semibold font-mono-num " +
          (tone === "alert" ? "text-[var(--risk-critical)]" : "text-[var(--fg)]")
        }
      >
        {value}
        {suffix && <span className="text-base ml-1">{suffix}</span>}
      </div>
    </Card>
  );
}

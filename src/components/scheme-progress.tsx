import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const SCHEME_INFO: Record<string, { name: string; totalInstallments: number }> = {
  PMMVY: { name: "PMMVY", totalInstallments: 3 },
  JSY: { name: "JSY", totalInstallments: 1 },
  JSSK: { name: "JSSK", totalInstallments: 1 },
  KASP: { name: "KASP", totalInstallments: 1 },
};

export function SchemeProgress({
  code,
  disbursed,
}: {
  code: keyof typeof SCHEME_INFO;
  disbursed: number;
}) {
  const info = SCHEME_INFO[code];
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{info.name}</span>
        <span className="text-[var(--fg-muted)] font-mono-num">
          {disbursed}/{info.totalInstallments}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: info.totalInstallments }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full flex items-center justify-center",
              i < disbursed ? "bg-[var(--accent)]" : "bg-[var(--border)]",
            )}
          >
            {i < disbursed && <Check className="size-2 text-white" />}
          </div>
        ))}
      </div>
    </div>
  );
}

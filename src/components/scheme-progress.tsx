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
    <div className="flex items-center gap-2.5">
      <div className="flex items-center gap-1">
        {Array.from({ length: info.totalInstallments }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className={cn(
              "size-2.5 rounded-full transition-colors",
              i < disbursed
                ? "bg-[var(--primary)] shadow-primary-sm"
                : "bg-[var(--surface-alt)] border border-[var(--border)]",
            )}
          />
        ))}
      </div>
      <span className="text-[11px] text-[var(--fg-muted)] font-mono-num">
        {disbursed}/{info.totalInstallments}
      </span>
    </div>
  );
}

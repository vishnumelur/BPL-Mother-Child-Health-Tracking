import { Check } from "lucide-react";

export function KbBadge({ kb, synced = true }: { kb: number; synced?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[var(--fg-muted)] font-mono-num">
      {synced && <Check className="size-3 text-[var(--risk-normal)]" />}
      {kb} KB
      {synced && <span>· synced</span>}
    </span>
  );
}

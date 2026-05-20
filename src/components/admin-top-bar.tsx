import { Shield } from "lucide-react";

export function AdminTopBar({ today }: { today: string }) {
  return (
    <header className="h-14 border-b bg-[var(--card)] flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <Shield className="size-5 text-[var(--primary)]" />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-[var(--primary)]">
            Kerala MCH Tracker
          </span>
          <span className="text-xs text-[var(--fg-muted)]">
            Palakkad District
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-[var(--fg-muted)] font-mono-num">{today}</span>
        <span className="font-medium text-[var(--fg)]">Dr. Suresh · CMO</span>
      </div>
    </header>
  );
}

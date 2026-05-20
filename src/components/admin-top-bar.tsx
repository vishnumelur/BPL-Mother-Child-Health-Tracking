"use client";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminTopBar({
  today,
  onMenuClick,
}: {
  today: string;
  onMenuClick?: () => void;
}) {
  return (
    <header className="h-14 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between px-3 sm:px-6 shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden -ml-1.5 size-9 p-0"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
        )}
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-lg bg-[var(--primary)] flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white tracking-tighter">
              MCH
            </span>
          </div>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-sm font-semibold text-[var(--fg)] truncate">
              Kerala MCH Tracker
            </span>
            <span className="text-[11px] text-[var(--fg-muted)] truncate">
              Palakkad District
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 text-sm shrink-0">
        <span className="hidden md:inline text-[var(--fg-muted)] font-mono-num text-xs">
          {today}
        </span>
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-full bg-[var(--primary-50)] flex items-center justify-center">
            <span className="text-[10px] font-semibold text-[var(--primary)]">
              S
            </span>
          </div>
          <span className="hidden sm:inline font-medium text-[var(--fg)] text-sm">
            Dr. Suresh
          </span>
        </div>
      </div>
    </header>
  );
}

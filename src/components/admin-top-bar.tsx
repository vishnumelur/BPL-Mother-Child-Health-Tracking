"use client";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminTopBar({
  today,
  onMenuClick,
}: {
  today: string;
  onMenuClick?: () => void;
}) {
  return (
    <header className="h-16 border-b border-[var(--border)] bg-white/80 backdrop-blur-md flex items-center justify-between px-3 sm:px-6 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-2 min-w-0">
        {onMenuClick && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden -ml-1.5 size-9 p-0 hover:bg-[var(--surface-alt)]"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
        )}
        <div className="flex items-center gap-2.5">
          <div
            className="size-8 rounded-xl flex items-center justify-center shadow-primary-sm"
            style={{ background: "var(--gradient-primary)" }}
          >
            <span className="text-[10px] font-bold text-white tracking-tighter">
              MCH
            </span>
          </div>
          <div className="hidden sm:flex flex-col leading-tight min-w-0">
            <span className="text-sm font-semibold text-[var(--fg)] truncate">
              Kerala MCH Tracker
            </span>
            <span className="text-[11px] text-[var(--fg-muted)] truncate">
              Palakkad District
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="hidden md:inline-flex h-9 px-3 text-[var(--fg-muted)] hover:bg-[var(--surface-alt)]"
        >
          <Search className="size-4" />
          <span className="text-xs">Search</span>
          <kbd className="hidden lg:inline px-1.5 py-0.5 rounded border border-[var(--border)] text-[10px] font-mono-num bg-white text-[var(--fg-subtle)]">
            ⌘K
          </kbd>
        </Button>
        <span className="hidden md:inline text-[var(--fg-muted)] font-mono-num text-xs">
          {today}
        </span>
        <div className="flex items-center gap-2">
          <div
            className="size-8 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shadow-primary-sm"
            style={{ background: "var(--gradient-primary)" }}
          >
            S
          </div>
          <span className="hidden sm:inline font-medium text-[var(--fg)] text-sm">
            Dr. Suresh
          </span>
        </div>
      </div>
    </header>
  );
}

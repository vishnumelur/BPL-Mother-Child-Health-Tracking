"use client";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortalSwitcher } from "@/components/portal-switcher";
import { PersonAvatar } from "@/components/person-avatar";

export function AdminTopBar({
  today,
  onMenuClick,
}: {
  today: string;
  onMenuClick?: () => void;
}) {
  return (
    <header className="h-16 border-b border-[var(--border)] bg-white/85 backdrop-blur-md flex items-center justify-between px-3 sm:px-6 shrink-0 sticky top-0 z-30">
      {/* Left — menu (mobile) + brand */}
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
        <Link
          href="/"
          prefetch
          aria-label="Kerala MCH Tracker — back to landing"
          className="flex items-center gap-2.5 min-w-0 rounded-xl -mx-1.5 px-1.5 py-1 hover:bg-[var(--surface-alt)] transition-colors active:scale-[0.98]"
        >
          <div
            className="size-9 rounded-xl flex items-center justify-center shadow-primary-sm shrink-0"
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
        </Link>
      </div>

      {/* Right — switcher (mobile only; desktop hosts it in the sidebar) + search + date + avatar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="lg:hidden">
          <PortalSwitcher variant="inline" showEyebrow={false} />
        </div>
        <button
          type="button"
          className="hidden md:inline-flex items-center gap-2 h-9 px-3 rounded-full border border-[var(--border)] bg-white hover:bg-[var(--surface-alt)] transition-colors text-[var(--fg-muted)]"
        >
          <Search className="size-3.5" />
          <span className="text-xs">Search beneficiaries…</span>
          <kbd className="hidden lg:inline px-1.5 py-0.5 rounded border border-[var(--border)] text-[10px] font-mono-num bg-white text-[var(--fg-subtle)]">
            ⌘K
          </kbd>
        </button>
        <span className="hidden xl:inline text-[var(--fg-muted)] font-mono-num text-xs whitespace-nowrap">
          {today}
        </span>
        <div className="flex items-center gap-2">
          <PersonAvatar
            name="Dr. Suresh"
            seed="admin-suresh"
            kind="man"
            className="size-9 text-[11px]"
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-medium text-[var(--fg)] text-sm">
              Dr. Suresh
            </span>
            <span className="text-[10px] text-[var(--fg-muted)] uppercase tracking-wider">
              Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

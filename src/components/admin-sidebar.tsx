"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Siren,
  ArrowRightLeft,
  Wallet,
  Stethoscope,
  Building2,
  Plug,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PortalSwitcher } from "@/components/portal-switcher";
import { PersonAvatar } from "@/components/person-avatar";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/people", label: "People", icon: Users },
  { href: "/admin/alerts", label: "Alerts", icon: Siren },
  { href: "/admin/referrals", label: "Referrals", icon: ArrowRightLeft },
  { href: "/admin/schemes", label: "Schemes", icon: Wallet },
  { href: "/admin/ashas", label: "ASHAs", icon: Stethoscope },
  { href: "/admin/facilities", label: "Facilities", icon: Building2 },
  { href: "/admin/integrations", label: "Integrations", icon: Plug },
];

export function AdminSidebar({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const path = usePathname();
  return (
    <nav className={cn("w-60 shrink-0 p-3 flex flex-col h-full", className)}>
      <div className="space-y-0.5 flex-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ? path === "/admin" : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                active
                  ? "text-white font-medium shadow-primary-sm"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-alt)]",
              )}
              style={
                active ? { background: "var(--gradient-primary)" } : undefined
              }
            >
              <Icon
                className={cn("size-4 shrink-0", active && "stroke-[2.2]")}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Account / portal-switcher card — login-style identity widget pinned to bottom */}
      <div className="mt-3 space-y-2">
        <div className="rounded-2xl border border-[var(--border)] bg-white shadow-card p-3 space-y-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <PersonAvatar
              name="Dr. Suresh"
              seed="admin-suresh"
              kind="man"
              className="size-9 text-[11px]"
            />
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-sm font-semibold text-[var(--fg)] truncate">
                Dr. Suresh
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--fg-muted)]">
                Admin · Palakkad
              </span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-subtle)] pl-0.5">
              Switch view
            </span>
            <PortalSwitcher variant="inline" showEyebrow={false} fullWidth />
          </div>
        </div>

        {/* Live status chip — slimmer, secondary */}
        <div className="rounded-xl bg-[var(--primary-50)] border border-[var(--primary)]/15 px-3 py-2 flex items-center gap-2">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inset-0 size-2 rounded-full bg-[var(--primary)] animate-ping opacity-60" />
            <span className="relative size-2 rounded-full bg-[var(--primary)]" />
          </span>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-[11px] font-semibold text-[var(--primary)]">
              Live · auto-refresh
            </span>
            <span className="text-[10px] text-[var(--fg-muted)]">
              Every 8 seconds
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

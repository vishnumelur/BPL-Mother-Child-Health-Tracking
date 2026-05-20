"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const PORTALS = [
  { id: "field", href: "/field", label: "ASHA", icon: Smartphone },
  { id: "admin", href: "/admin", label: "Admin", icon: LayoutDashboard },
] as const;

interface Props {
  /** floating = fixed at viewport top (for landing). inline = renders in flow (for chrome bars). */
  variant?: "floating" | "inline";
  /** Show the "VIEW" eyebrow (only on >= sm when there's room). */
  showEyebrow?: boolean;
  /** Stretch the pill to fill its container; each portal link splits the width. */
  fullWidth?: boolean;
  className?: string;
}

export function PortalSwitcher({
  variant = "floating",
  showEyebrow = true,
  fullWidth = false,
  className,
}: Props) {
  const pathname = usePathname() ?? "/";

  if (pathname.startsWith("/demo")) return null;

  const activeId =
    pathname.startsWith("/admin") ? "admin"
    : pathname.startsWith("/field") ? "field"
    : null;

  // Floating variant: hidden on /field and /admin (those portals embed the
  // inline variant in their own chrome). Visible on landing.
  if (variant === "floating" && activeId !== null) return null;

  const container =
    variant === "floating"
      ? "fixed top-3 left-1/2 -translate-x-1/2 z-50 print:hidden"
      : fullWidth
        ? "block w-full"
        : "inline-flex";

  return (
    <div className={cn(container, className)}>
      <div
        className={cn(
          "flex items-center gap-1 p-1 rounded-full bg-white/85 backdrop-blur-md border border-[var(--border)] shadow-card",
          fullWidth && "w-full",
        )}
        role="tablist"
        aria-label="Portal"
      >
        {showEyebrow && (
          <span className="hidden sm:inline-flex pl-2.5 pr-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
            View
          </span>
        )}
        {PORTALS.map((p) => {
          const Icon = p.icon;
          const isActive = activeId === p.id;
          return (
            <Link
              key={p.id}
              href={p.href}
              prefetch
              role="tab"
              aria-selected={isActive}
              className={cn(
                "inline-flex items-center justify-center gap-1.5 px-3 h-7 rounded-full text-[11px] font-semibold tracking-tight transition-all",
                "active:scale-[0.97]",
                fullWidth && "flex-1",
                isActive
                  ? "bg-gradient-primary text-white shadow-primary-sm"
                  : "text-[var(--fg-muted)] hover:bg-[var(--surface-alt)] hover:text-[var(--fg)]",
              )}
            >
              <Icon className="size-3.5" strokeWidth={2.2} />
              <span>{p.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

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
    <nav className={cn("w-60 shrink-0 p-3 space-y-1", className)}>
      {NAV.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/admin" ? path === "/admin" : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              active
                ? "bg-[var(--primary-50)] text-[var(--primary)] font-medium"
                : "text-[var(--fg)] hover:bg-[var(--surface-alt)]",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

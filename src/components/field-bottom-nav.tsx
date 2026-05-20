"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Bell, BookOpen, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/field", icon: Home, label: "Home", match: (p: string) => p === "/field" || p.startsWith("/field/b") },
  { href: "/field/reminders", icon: Bell, label: "Reminders", match: (p: string) => p.startsWith("/field/reminders") },
  { href: "/field/iec", icon: BookOpen, label: "Library", match: (p: string) => p.startsWith("/field/iec") },
  { href: "/field/sync", icon: Users, label: "Sync", match: (p: string) => p.startsWith("/field/sync") },
  { href: "/field/register", icon: Plus, label: "Add", match: (p: string) => p.startsWith("/field/register") },
];

export function FieldBottomNav() {
  const path = usePathname();
  return (
    <nav
      className="shrink-0 h-16 bg-[var(--card)] border-t border-[var(--border)] flex"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {ITEMS.map(({ href, icon: Icon, label, match }) => {
        const active = match(path);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors",
              active
                ? "text-[var(--primary)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            <Icon className={cn("size-5", active && "stroke-[2.2]")} />
            <span className="text-[10px] font-medium tracking-tight">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

import Link from "next/link";
import { Home, Users, Bell, BookOpen, User } from "lucide-react";
import { PhoneFrame } from "@/components/phone-frame";

export default function FieldLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-full">
        <div className="flex-1 pb-16">{children}</div>
        <nav className="fixed bottom-0 left-0 right-0 md:absolute md:left-0 md:right-0 h-14 bg-[var(--card)] border-t flex">
          {[
            { href: "/field", icon: Home, label: "Home" },
            { href: "/field/reminders", icon: Bell, label: "Reminders" },
            { href: "/field/iec", icon: BookOpen, label: "IEC" },
            { href: "/field/sync", icon: Users, label: "Sync" },
            { href: "/field/register", icon: User, label: "Add" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center text-xs text-[var(--fg-muted)] hover:text-[var(--primary)]"
            >
              <Icon className="size-5" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </PhoneFrame>
  );
}

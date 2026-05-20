import Link from "next/link";
import { cn } from "@/lib/utils";
import { PortalSwitcher } from "@/components/portal-switcher";

export function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="md:flex md:justify-center md:items-center md:h-[100dvh] md:bg-[var(--surface-alt)]">
      <div
        className={cn(
          // Mobile: locked to the real visible viewport. Outer must contain its
          // children — bottom-nav stays pinned to the visible bottom regardless
          // of URL-bar state.
          "h-[100dvh] flex flex-col bg-[var(--surface)] overflow-hidden",
          // Tablet+: physical phone bezel, sized to ALWAYS fit the viewport so
          // the bottom nav is permanently visible — only the inner content
          // scrolls, never the page.
          "md:max-w-[400px] md:w-full md:h-[min(840px,calc(100dvh-2rem))] md:rounded-[2.25rem]",
          "md:border md:border-[#111B21] md:bg-[var(--surface)]",
          "md:shadow-[0_30px_60px_-15px_rgba(17,27,33,0.25),0_0_0_8px_#111B21]",
          className,
        )}
      >
        {/* faux status bar — only visible on tablet+ */}
        <div className="hidden md:flex h-7 items-center justify-between px-6 text-[11px] font-medium text-[var(--fg)] bg-[var(--surface)] shrink-0">
          <span className="font-mono-num">9:41</span>
          <span className="flex items-center gap-1.5 text-[var(--fg-muted)]">
            <span className="size-1 rounded-full bg-[var(--primary)]" />
            <span>4G</span>
            <span>•</span>
            <span>87%</span>
          </span>
        </div>

        {/* Top app bar — left: home logo, center: portal switcher */}
        <div
          className="shrink-0 h-11 grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 border-b border-[var(--border)] bg-white/85 backdrop-blur-md"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <Link
            href="/"
            prefetch
            aria-label="Kerala MCH Tracker — back to landing"
            className="justify-self-start inline-flex items-center gap-1.5 rounded-lg px-1 py-0.5 hover:bg-[var(--surface-alt)] transition-colors active:scale-[0.97]"
          >
            <span
              className="size-6 rounded-lg flex items-center justify-center shadow-primary-sm"
              style={{ background: "var(--gradient-primary)" }}
              aria-hidden
            >
              <span className="text-[8px] font-bold text-white tracking-tighter">
                MCH
              </span>
            </span>
          </Link>
          <PortalSwitcher variant="inline" showEyebrow={false} />
          <span className="justify-self-end" aria-hidden />
        </div>

        {/* Children render directly as flex items — the field layout owns the
            scrollable content + bottom nav as siblings. */}
        {children}
      </div>
    </div>
  );
}

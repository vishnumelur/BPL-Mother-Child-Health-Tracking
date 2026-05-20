import { cn } from "@/lib/utils";

export function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="md:flex md:justify-center md:py-10 md:bg-[var(--surface-alt)] md:min-h-screen">
      <div
        className={cn(
          // Mobile: full-width app shell
          "min-h-screen flex flex-col bg-[var(--surface)]",
          // Tablet+: centered phone frame
          "md:max-w-[400px] md:w-full md:min-h-[820px] md:rounded-[2.25rem]",
          "md:border md:border-[#111B21] md:bg-[var(--surface)]",
          "md:shadow-[0_30px_60px_-15px_rgba(17,27,33,0.25),0_0_0_8px_#111B21]",
          "md:overflow-hidden",
          className,
        )}
      >
        {/* faux status bar — only visible on tablet+ */}
        <div className="hidden md:flex h-7 items-center justify-between px-6 text-[11px] font-medium text-[var(--fg)] bg-[var(--surface)]">
          <span className="font-mono-num">9:41</span>
          <span className="flex items-center gap-1.5 text-[var(--fg-muted)]">
            <span className="size-1 rounded-full bg-[var(--primary)]" />
            <span>4G</span>
            <span>•</span>
            <span>87%</span>
          </span>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

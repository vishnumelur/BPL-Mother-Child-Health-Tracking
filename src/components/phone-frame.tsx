import { cn } from "@/lib/utils";

export function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="md:flex md:justify-center md:py-8 md:bg-slate-100 md:min-h-screen">
      <div
        className={cn(
          "md:max-w-[414px] md:rounded-[2.5rem] md:border-[10px] md:border-slate-900",
          "md:shadow-2xl md:overflow-hidden bg-[var(--surface)]",
          "min-h-screen md:min-h-[820px] flex flex-col",
          className,
        )}
      >
        {/* faux status bar */}
        <div className="hidden md:flex h-7 bg-slate-900 text-white text-xs items-center justify-between px-6">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span>📶</span>
            <span>•</span>
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

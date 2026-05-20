import { cn } from "@/lib/utils";

export function DataTable({
  children,
  className,
  minWidth = 640,
}: {
  children: React.ReactNode;
  className?: string;
  /** Minimum table width — triggers horizontal scroll on narrower viewports */
  minWidth?: number;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-white overflow-hidden shadow-card",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table
          className="w-full text-sm"
          style={{ minWidth: `${minWidth}px` }}
        >
          {children}
        </table>
      </div>
    </div>
  );
}

export function DataTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-[var(--surface-alt)] border-b border-[var(--border)] text-[11px] uppercase tracking-[0.06em] text-[var(--fg-muted)]">
      {children}
    </thead>
  );
}

export function DataTableRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={cn(
        "border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-alt)] transition-colors",
        className,
      )}
    >
      {children}
    </tr>
  );
}

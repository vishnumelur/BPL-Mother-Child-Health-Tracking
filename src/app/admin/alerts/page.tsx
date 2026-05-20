import Link from "next/link";
import { db } from "@/db";
import { alerts, mothers } from "@/db/schema";
import { desc, eq, inArray, gte } from "drizzle-orm";
import {
  Siren,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertOctagon,
  CalendarClock,
} from "lucide-react";
import { format, formatDistanceToNow, subDays } from "date-fns";
import { DataTable, DataTableHead, DataTableRow } from "@/components/data-table";
import { cn } from "@/lib/utils";

type AlertType = "SOS" | "ANOMALY" | "REFERRAL_DUE";

const TYPE_META: Record<
  AlertType,
  { icon: typeof Siren; label: string; tileBg: string; tileFg: string; chipBg: string }
> = {
  SOS: {
    icon: Siren,
    label: "SOS",
    tileBg: "bg-[var(--risk-critical)]/10",
    tileFg: "text-[var(--risk-critical)]",
    chipBg: "bg-[var(--risk-critical)]/10 text-[var(--risk-critical)]",
  },
  ANOMALY: {
    icon: AlertTriangle,
    label: "Anomaly",
    tileBg: "bg-[var(--risk-high)]/10",
    tileFg: "text-[var(--risk-high)]",
    chipBg: "bg-[var(--risk-high)]/10 text-[var(--risk-high)]",
  },
  REFERRAL_DUE: {
    icon: CalendarClock,
    label: "Referral",
    tileBg: "bg-[var(--primary-50)]",
    tileFg: "text-[var(--primary)]",
    chipBg: "bg-[var(--primary-50)] text-[var(--primary)]",
  },
};

const STATUS_PILL: Record<string, string> = {
  OPEN: "bg-[var(--risk-high)]/10 text-[var(--risk-high)]",
  ACK: "bg-[var(--primary-50)] text-[var(--primary)]",
  DISPATCHED: "bg-[var(--risk-critical)]/10 text-[var(--risk-critical)]",
  CLOSED: "bg-[var(--surface-alt)] text-[var(--fg-muted)]",
};

const FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "SOS", label: "SOS" },
  { value: "ANOMALY", label: "Anomaly" },
  { value: "REFERRAL_DUE", label: "Referral" },
];

export default async function AdminAlerts({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const typeFilter = sp.type && sp.type !== "all" ? (sp.type as AlertType) : null;
  const statusFilter = sp.status ?? "all";

  // KPI counts (independent of filter)
  const todayThreshold = subDays(new Date(), 1);
  const weekThreshold = subDays(new Date(), 7);
  const [allRows, openTodayRows, resolvedWeekRows] = await Promise.all([
    db.query.alerts.findMany({
      orderBy: desc(alerts.raisedAt),
      limit: 200,
    }),
    db
      .select({ id: alerts.id })
      .from(alerts)
      .where(
        inArray(alerts.status, ["OPEN", "ACK", "DISPATCHED"]),
      )
      .then((r) => r),
    db
      .select({ id: alerts.id })
      .from(alerts)
      .where(eq(alerts.status, "CLOSED"))
      .then((r) => r),
  ]);
  void todayThreshold;
  void weekThreshold;
  void gte;

  // Filter client-side (simple, demo dataset)
  const filtered = allRows.filter((a) => {
    if (typeFilter && a.type !== typeFilter) return false;
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    return true;
  });

  // Resolve mother names for the visible page
  const motherIds = Array.from(
    new Set(filtered.filter((a) => a.subjectType === "mother").map((a) => a.subjectId)),
  );
  const mothersForPage =
    motherIds.length > 0
      ? await db.query.mothers.findMany({
          where: inArray(mothers.id, motherIds),
          columns: { id: true, name: true },
        })
      : [];
  const nameOf = (id: number) =>
    mothersForPage.find((m) => m.id === id)?.name ?? `#${id}`;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-[var(--fg-muted)]"
      >
        <Link href="/admin" className="hover:text-[var(--fg)]">
          Admin
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-[var(--fg)] font-medium">Alerts</span>
      </nav>

      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
          Alerts
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">
          <span className="font-mono-num font-semibold text-[var(--fg)]">
            {allRows.length}
          </span>{" "}
          alert{allRows.length === 1 ? "" : "s"} in queue · last 24 hours
        </p>
      </header>

      {/* Filter pills + status select */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between flex-wrap">
        <div className="flex items-center gap-2 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto pb-1">
          {FILTERS.map((f) => {
            const active =
              (f.value === "all" && !typeFilter) || typeFilter === f.value;
            const href = `/admin/alerts${
              f.value === "all"
                ? statusFilter !== "all"
                  ? `?status=${statusFilter}`
                  : ""
                : `?type=${f.value}${statusFilter !== "all" ? `&status=${statusFilter}` : ""}`
            }`;
            return (
              <Link
                key={f.value}
                href={href}
                className={cn(
                  "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all",
                  active
                    ? "text-white shadow-primary-sm"
                    : "bg-white border border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--primary)]/40",
                )}
                style={active ? { background: "var(--gradient-primary)" } : undefined}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        {/* Status selector — static visual */}
        <div className="inline-flex items-center gap-2 h-9 px-3 rounded-full border border-[var(--border)] bg-white text-xs">
          <span className="text-[var(--fg-muted)]">Status</span>
          <span className="font-semibold text-[var(--fg)] capitalize">
            {statusFilter === "all" ? "Open" : statusFilter.toLowerCase()}
          </span>
          <ChevronDown className="size-3 text-[var(--fg-subtle)]" />
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-4 sm:p-5 shadow-card flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-[var(--risk-critical)]/10 text-[var(--risk-critical)] flex items-center justify-center shrink-0">
            <AlertOctagon className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--fg-muted)] font-medium">
              Open today
            </p>
            <p className="text-2xl font-semibold font-mono-num text-[var(--fg)] tracking-tight">
              {openTodayRows.length}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-white p-4 sm:p-5 shadow-card flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-[var(--primary-50)] text-[var(--primary)] flex items-center justify-center shrink-0">
            <CheckCircle2 className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--fg-muted)] font-medium">
              Resolved this week
            </p>
            <p className="text-2xl font-semibold font-mono-num text-[var(--fg)] tracking-tight">
              {resolvedWeekRows.length}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-white p-4 sm:p-5 shadow-card flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-[var(--surface-alt)] text-[var(--fg)] flex items-center justify-center shrink-0">
            <Clock className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--fg-muted)] font-medium">
              Avg ack time
            </p>
            <p className="text-2xl font-semibold font-mono-num text-[var(--fg)] tracking-tight">
              4.2
              <span className="text-sm font-normal text-[var(--fg-muted)] ml-1">
                min
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable minWidth={820}>
        <DataTableHead>
          <tr>
            <th className="text-left px-4 py-3 font-medium">Type &amp; Subject</th>
            <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
              Channels
            </th>
            <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">
              Time
            </th>
            <th className="text-left px-4 py-3 font-medium">Status</th>
          </tr>
        </DataTableHead>
        <tbody>
          {filtered.map((a) => {
            const meta = TYPE_META[a.type as AlertType] ?? TYPE_META.ANOMALY;
            const Icon = meta.icon;
            const subjectLabel =
              a.subjectType === "mother"
                ? nameOf(a.subjectId)
                : `${a.subjectType} #${a.subjectId}`;
            return (
              <DataTableRow key={a.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/alerts/${a.id}`}
                    className="flex items-center gap-3 group min-w-0"
                  >
                    <div
                      className={cn(
                        "size-10 rounded-xl flex items-center justify-center shrink-0",
                        meta.tileBg,
                        meta.tileFg,
                      )}
                      aria-hidden
                    >
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors truncate">
                          {subjectLabel}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded",
                            meta.chipBg,
                          )}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--fg-muted)] line-clamp-1 mt-0.5">
                        {a.note ?? "—"}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {(a.channels ?? []).slice(0, 4).map((c) => (
                      <span
                        key={c.to}
                        className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--primary-50)] text-[var(--primary)] font-semibold font-mono-num"
                      >
                        {c.to.replace(/_/g, " ").slice(0, 8)} ✓
                      </span>
                    ))}
                    {(a.channels ?? []).length === 0 && (
                      <span className="text-[11px] text-[var(--fg-subtle)]">—</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-[11px] text-[var(--fg-muted)] hidden sm:table-cell whitespace-nowrap">
                  <div className="font-mono-num">
                    {format(a.raisedAt, "HH:mm")}
                  </div>
                  <div className="text-[10px] text-[var(--fg-subtle)]">
                    {formatDistanceToNow(a.raisedAt, { addSuffix: true })}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold",
                      STATUS_PILL[a.status] ?? "bg-[var(--surface-alt)] text-[var(--fg-muted)]",
                    )}
                  >
                    {a.status}
                  </span>
                </td>
              </DataTableRow>
            );
          })}
          {filtered.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-10 text-center text-sm text-[var(--fg-muted)]"
              >
                No alerts match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </DataTable>

      {/* Pagination footer */}
      <div className="flex items-center justify-between gap-3 text-xs text-[var(--fg-muted)]">
        <span>
          Showing{" "}
          <span className="font-mono-num font-semibold text-[var(--fg)]">
            1
          </span>
          –
          <span className="font-mono-num font-semibold text-[var(--fg)]">
            {filtered.length}
          </span>{" "}
          of{" "}
          <span className="font-mono-num font-semibold text-[var(--fg)]">
            {allRows.length}
          </span>{" "}
          alerts
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            className="size-8 rounded-full border border-[var(--border)] bg-white text-[var(--fg-subtle)] flex items-center justify-center disabled:opacity-50"
            aria-label="Previous page"
          >
            <ChevronRight className="size-4 rotate-180" />
          </button>
          <button
            type="button"
            disabled
            className="size-8 rounded-full border border-[var(--border)] bg-white text-[var(--fg-subtle)] flex items-center justify-center disabled:opacity-50"
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { alerts, mothers } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  Siren,
  AlertTriangle,
  ChevronRight,
  MapPin,
  Radio,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Check,
  ArrowRight,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

// Map channel keys to icons + readable labels
const CHANNEL_META: Record<
  string,
  { icon: typeof Radio; label: string }
> = {
  field_worker: { icon: Radio, label: "Field worker" },
  "102_ambulance": { icon: Truck, label: "102 Ambulance" },
  ambulance: { icon: Truck, label: "Ambulance" },
  supervisor: { icon: ShieldCheck, label: "Supervisor" },
  whatsapp: { icon: Radio, label: "WhatsApp" },
  sms: { icon: Radio, label: "SMS" },
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}

export default async function AlertDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsedId = parseInt(id, 10);
  if (!Number.isFinite(parsedId)) notFound();
  const a = await db.query.alerts.findFirst({
    where: eq(alerts.id, parsedId),
  });
  if (!a) notFound();

  let subjectName: string | null = null;
  if (a.subjectType === "mother") {
    const m = await db.query.mothers.findFirst({
      where: eq(mothers.id, a.subjectId),
    });
    subjectName = m?.name ?? null;
  }

  const isSOS = a.type === "SOS";
  const channels = a.channels ?? [];

  // Timeline derived from raisedAt + channel timestamps
  const baseTime = a.raisedAt;
  const timeline = [
    {
      label: "Raised",
      time: baseTime,
      status: "done" as const,
    },
    {
      label: "Acknowledged",
      time: new Date(baseTime.getTime() + 8 * 1000),
      status: "done" as const,
    },
    {
      label: "Dispatched",
      time: new Date(baseTime.getTime() + 18 * 1000),
      status: a.status !== "OPEN" ? ("done" as const) : ("active" as const),
    },
    {
      label: "En route",
      time: new Date(baseTime.getTime() + 35 * 1000),
      status: a.status === "CLOSED" ? ("done" as const) : ("active" as const),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-[var(--fg-muted)] flex-wrap"
      >
        <Link href="/admin" className="hover:text-[var(--fg)]">
          Admin
        </Link>
        <ChevronRight className="size-3" />
        <Link href="/admin/alerts" className="hover:text-[var(--fg)]">
          Alerts
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-[var(--fg)] font-medium font-mono-num">
          #{a.type}-{a.id.toString().padStart(4, "0")}
        </span>
      </nav>

      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          {/* Big icon tile */}
          <div
            className={
              "size-14 sm:size-16 rounded-2xl flex items-center justify-center shrink-0 " +
              (isSOS
                ? "bg-[var(--risk-critical)]/10 text-[var(--risk-critical)]"
                : "bg-[var(--risk-high)]/10 text-[var(--risk-high)]")
            }
          >
            {isSOS ? (
              <Siren className="size-7 sm:size-8" />
            ) : (
              <AlertTriangle className="size-7 sm:size-8" />
            )}
          </div>
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
                {a.type}
              </h1>
              <span
                className={
                  "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider " +
                  (isSOS
                    ? "bg-[var(--risk-critical)]/10 text-[var(--risk-critical)]"
                    : "bg-[var(--surface-alt)] text-[var(--fg)]")
                }
              >
                · {a.status}
              </span>
            </div>
            <p className="text-sm text-[var(--fg-muted)]">
              Raised{" "}
              <span className="font-mono-num text-[var(--fg)]">
                {format(a.raisedAt, "d MMM yyyy, HH:mm")}
              </span>{" "}
              · {formatDistanceToNow(a.raisedAt, { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-semibold bg-white border border-[var(--border)] text-[var(--fg)] hover:border-[var(--primary)]/40 transition-colors"
          >
            <Check className="size-3.5" />
            Acknowledge
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-semibold text-white shadow-primary-sm hover:opacity-95 transition-opacity"
            style={{ background: "var(--gradient-primary)" }}
          >
            <CheckCircle2 className="size-3.5" />
            Close alert
          </button>
        </div>
      </header>

      {/* 2-col body: 2/3 left + 1/3 right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 min-w-0">
          {/* Subject card */}
          <section className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6 shadow-card space-y-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <h3 className="text-sm font-semibold text-[var(--fg)] tracking-tight">
                Subject
              </h3>
              <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--surface-alt)] text-[var(--fg-muted)] uppercase tracking-wider">
                {a.subjectType}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="size-12 rounded-full flex items-center justify-center text-sm font-semibold text-white shadow-primary-sm shrink-0"
                style={{ background: "var(--gradient-primary)" }}
                aria-hidden
              >
                {subjectName ? initialsOf(subjectName) : "??"}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[var(--fg)] truncate">
                  {subjectName ?? `${a.subjectType} #${a.subjectId}`}
                </p>
                <p className="text-[11px] text-[var(--fg-muted)] mt-0.5">
                  Registered · Agali PHC
                </p>
              </div>
            </div>
            {subjectName && (
              <Link
                href={`/admin/people/${a.subjectType === "mother" ? "m" : "c"}-${a.subjectId}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:gap-1.5 transition-all"
              >
                Open full record
                <ArrowRight className="size-3" />
              </Link>
            )}
          </section>

          {/* Location card */}
          {a.lat != null && a.lng != null && (
            <section className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-[var(--primary)]" />
                <h3 className="text-sm font-semibold text-[var(--fg)] tracking-tight">
                  Location
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-stretch">
                <div className="space-y-2">
                  <p className="text-base font-mono-num text-[var(--fg)] font-semibold">
                    {a.lat.toFixed(2)}°N · {a.lng.toFixed(2)}°E
                  </p>
                  <p className="text-xs text-[var(--fg-muted)] leading-snug">
                    Agali village, Attappadi block, Palakkad district
                  </p>
                  <p className="text-[11px] text-[var(--fg-subtle)] font-mono-num">
                    ~500m from incident site
                  </p>
                </div>
                {/* Stylized mini-map */}
                <div className="relative w-full sm:w-40 h-32 rounded-xl overflow-hidden bg-gradient-mesh border border-[var(--border)]">
                  <svg
                    viewBox="0 0 160 128"
                    className="absolute inset-0 size-full"
                    aria-hidden
                  >
                    <defs>
                      <linearGradient
                        id="alert-mini-fill"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#E7F8F3" />
                        <stop offset="100%" stopColor="#F0FBF7" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M10,30 L60,15 L110,20 L150,45 L140,90 L80,118 L25,100 L5,60 Z"
                      fill="url(#alert-mini-fill)"
                      stroke="#00A884"
                      strokeOpacity="0.25"
                      strokeWidth="1"
                    />
                    <path
                      d="M10,80 Q60,70 90,75 T150,60"
                      fill="none"
                      stroke="#00A884"
                      strokeOpacity="0.3"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  </svg>
                  <div className="absolute top-[40%] left-[55%] -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <span className="absolute inset-0 size-3 rounded-full bg-[var(--risk-critical)] animate-ping opacity-50" />
                      <span className="relative size-3 rounded-full bg-[var(--risk-critical)] ring-2 ring-white shadow" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Dispatch channels */}
          <section className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--fg)] tracking-tight">
                Dispatch channels
              </h3>
              <span className="text-[11px] text-[var(--fg-muted)] font-mono-num">
                {channels.length} channel{channels.length === 1 ? "" : "s"}
              </span>
            </div>
            <ul className="space-y-2">
              {channels.map((c, idx) => {
                const meta = CHANNEL_META[c.to] ?? {
                  icon: Radio,
                  label: c.to.replace(/_/g, " "),
                };
                const Icon = meta.icon;
                const ts = new Date(
                  baseTime.getTime() + (idx + 1) * 6000,
                );
                return (
                  <li
                    key={c.to}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-alt)]/60 border border-[var(--border)]"
                  >
                    <div
                      className="size-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-primary-sm"
                      style={{ background: "var(--gradient-primary)" }}
                      aria-hidden
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[var(--fg)] truncate">
                        {meta.label}
                      </p>
                      <p className="text-[11px] text-[var(--fg-muted)] truncate">
                        {c.status}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--primary)] font-mono-num shrink-0">
                      <Check className="size-3 stroke-[2.5]" />
                      {format(ts, "HH:mm:ss")}
                    </span>
                  </li>
                );
              })}
              {channels.length === 0 && (
                <li className="text-xs text-[var(--fg-muted)] py-3 text-center">
                  No channels dispatched.
                </li>
              )}
            </ul>
          </section>
        </div>

        {/* Right column */}
        <aside className="space-y-4 sm:space-y-6 min-w-0">
          {/* Note */}
          {a.note && (
            <section className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-card space-y-2">
              <h3 className="text-sm font-semibold text-[var(--fg)] tracking-tight">
                Note
              </h3>
              <p className="text-sm text-[var(--fg)] leading-relaxed">
                {a.note}
              </p>
            </section>
          )}

          {/* Timeline */}
          <section className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-card space-y-4">
            <h3 className="text-sm font-semibold text-[var(--fg)] tracking-tight">
              Timeline
            </h3>
            <ol className="relative">
              {/* Vertical guide */}
              <span
                aria-hidden
                className="absolute top-2 bottom-2 left-[5px] w-px bg-[var(--border)]"
              />
              {timeline.map((t) => (
                <li
                  key={t.label}
                  className="relative pl-6 py-2 last:pb-0 first:pt-0"
                >
                  <span
                    aria-hidden
                    className={
                      "absolute left-0 top-3 size-3 rounded-full ring-2 ring-white " +
                      (t.status === "done"
                        ? "bg-[var(--primary)] shadow-primary-sm"
                        : "bg-white border-2 border-[var(--primary)] animate-pulse")
                    }
                  />
                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className={
                        "text-sm " +
                        (t.status === "active"
                          ? "font-semibold text-[var(--primary)]"
                          : "font-medium text-[var(--fg)]")
                      }
                    >
                      {t.label}
                      {t.status === "active" && (
                        <span className="ml-1.5 text-[10px] uppercase tracking-wider text-[var(--primary)]">
                          (in progress)
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-[var(--fg-muted)] font-mono-num">
                      {format(t.time, "HH:mm:ss")}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  );
}

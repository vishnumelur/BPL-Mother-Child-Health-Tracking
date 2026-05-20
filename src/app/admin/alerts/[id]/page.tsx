import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { alerts, mothers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { MapPin } from "lucide-react";
import { format } from "date-fns";

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
    const m = await db.query.mothers.findFirst({ where: eq(mothers.id, a.subjectId) });
    subjectName = m?.name ?? null;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
            {a.type}
          </h1>
          <span className="inline-flex px-2 py-0.5 rounded-full bg-[var(--surface-alt)] text-[var(--fg)] font-medium text-xs">
            {a.status}
          </span>
        </div>
        <p className="text-sm text-[var(--fg-muted)]">
          Raised {format(a.raisedAt, "d MMM yyyy, HH:mm")}
        </p>
      </header>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 space-y-2">
        <h3 className="text-sm font-semibold text-[var(--fg)]">Subject</h3>
        <p className="text-sm">
          {a.subjectType} {subjectName ? `· ${subjectName}` : `#${a.subjectId}`}
        </p>
        {subjectName && (
          <Link
            href={`/admin/people/${a.subjectType === "mother" ? "m" : "c"}-${a.subjectId}`}
            className="text-xs text-[var(--primary)] hover:underline inline-flex items-center"
          >
            Open full record →
          </Link>
        )}
      </div>

      {a.lat != null && a.lng != null && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-[var(--fg)]">
            <MapPin className="size-4" /> Location
          </h3>
          <p className="text-sm font-mono-num">
            {a.lat.toFixed(2)}°N · {a.lng.toFixed(2)}°E
          </p>
          <p className="text-xs text-[var(--fg-muted)]">
            Agali village, Attappadi block, Palakkad district
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 space-y-3">
        <h3 className="text-sm font-semibold text-[var(--fg)]">
          Dispatch channels
        </h3>
        <ul className="divide-y divide-[var(--border)]">
          {(a.channels ?? []).map((c) => (
            <li
              key={c.to}
              className="flex items-center justify-between text-sm py-2.5"
            >
              <span>{c.to}</span>
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[var(--primary-50)] text-[var(--primary)] font-medium">
                ✓ {c.status}
              </span>
            </li>
          ))}
          {(a.channels ?? []).length === 0 && (
            <li className="text-xs text-[var(--fg-muted)] py-2">
              No channels dispatched.
            </li>
          )}
        </ul>
      </div>

      {a.note && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 space-y-1">
          <h3 className="text-sm font-semibold text-[var(--fg)]">Note</h3>
          <p className="text-sm">{a.note}</p>
        </div>
      )}
    </div>
  );
}

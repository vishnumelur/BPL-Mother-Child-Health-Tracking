import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { alerts, mothers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card } from "@/components/ui/card";
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
    <div className="space-y-4 max-w-3xl">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--primary)]">
          {a.type} · {a.status}
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">
          Raised {format(a.raisedAt, "d MMM yyyy, HH:mm")}
        </p>
      </header>
      <Card className="p-4 space-y-2">
        <h3 className="text-sm font-semibold">Subject</h3>
        <p className="text-sm">
          {a.subjectType} {subjectName ? `· ${subjectName}` : `#${a.subjectId}`}
        </p>
        {subjectName && (
          <Link
            href={`/admin/people/${a.subjectType === "mother" ? "m" : "c"}-${a.subjectId}`}
            className="text-xs text-[var(--primary)] hover:underline"
          >
            Open full record →
          </Link>
        )}
      </Card>
      {a.lat != null && a.lng != null && (
        <Card className="p-4 space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="size-4" /> Location
          </h3>
          <p className="text-sm font-mono-num">
            {a.lat.toFixed(2)}°N · {a.lng.toFixed(2)}°E
          </p>
          <p className="text-xs text-[var(--fg-muted)]">
            Agali village, Attappadi block, Palakkad district
          </p>
        </Card>
      )}
      <Card className="p-4 space-y-3">
        <h3 className="text-sm font-semibold">Dispatch channels</h3>
        <ul className="space-y-1">
          {(a.channels ?? []).map((c) => (
            <li
              key={c.to}
              className="flex items-center justify-between text-sm py-2 border-b last:border-0"
            >
              <span>{c.to}</span>
              <span className="text-xs text-[var(--risk-normal)]">✓ {c.status}</span>
            </li>
          ))}
          {(a.channels ?? []).length === 0 && (
            <li className="text-xs text-[var(--fg-muted)]">No channels dispatched.</li>
          )}
        </ul>
      </Card>
      {a.note && (
        <Card className="p-4 space-y-1">
          <h3 className="text-sm font-semibold">Note</h3>
          <p className="text-sm">{a.note}</p>
        </Card>
      )}
    </div>
  );
}

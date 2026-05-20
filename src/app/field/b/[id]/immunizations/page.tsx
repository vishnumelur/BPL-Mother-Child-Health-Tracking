import { notFound } from "next/navigation";
import { parseBeneficiaryRouteId, loadChild } from "@/lib/queries/beneficiary";
import { Button } from "@/components/ui/button";
import { markVaccineGiven } from "@/actions/immunization";
import { format } from "date-fns";
import { Check, Clock, AlertCircle, Syringe } from "lucide-react";

export default async function ImmunizationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = parseBeneficiaryRouteId(id);
  if (!p || p.type !== "child") notFound();
  const child = await loadChild(p.id);
  if (!child) notFound();

  const sorted = [...child.immunizations].sort((a, b) =>
    a.scheduledDate.localeCompare(b.scheduledDate),
  );

  const counts = sorted.reduce(
    (acc, i) => {
      if (i.status === "GIVEN") acc.given++;
      else if (i.status === "DUE") acc.due++;
      else if (i.status === "MISSED") acc.missed++;
      else acc.upcoming++;
      return acc;
    },
    { given: 0, due: 0, missed: 0, upcoming: 0 },
  );

  return (
    <div className="px-4 py-5 sm:px-5 sm:py-6 space-y-5">
      <header className="space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="size-10 rounded-2xl bg-[var(--primary-50)] flex items-center justify-center shadow-primary-sm">
            <Syringe className="size-5 text-[var(--primary)]" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
              Immunisations
            </h1>
            <p className="text-xs text-[var(--fg-muted)]">
              WHO/UIP schedule · 0–24 months
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <SummaryPill
          label="Given"
          count={counts.given}
          cls="bg-[var(--primary-50)] text-[var(--primary)] ring-1 ring-[var(--primary)]/15"
        />
        <SummaryPill
          label="Due"
          count={counts.due}
          cls="bg-[var(--risk-high)]/10 text-[var(--risk-high)] ring-1 ring-[var(--risk-high)]/15"
        />
        <SummaryPill
          label="Upcoming"
          count={counts.upcoming}
          cls="bg-[var(--surface-alt)] text-[var(--fg-muted)] ring-1 ring-[var(--border)]"
        />
        {counts.missed > 0 && (
          <SummaryPill
            label="Missed"
            count={counts.missed}
            cls="bg-[var(--risk-critical)]/10 text-[var(--risk-critical)] ring-1 ring-[var(--risk-critical)]/15"
          />
        )}
      </div>

      <div className="space-y-2.5">
        {sorted.map((imm) => {
          const tileBg =
            imm.status === "GIVEN"
              ? "bg-[var(--primary-50)] text-[var(--primary)]"
              : imm.status === "DUE"
                ? "bg-[var(--risk-high)]/10 text-[var(--risk-high)]"
                : imm.status === "MISSED"
                  ? "bg-[var(--risk-critical)]/10 text-[var(--risk-critical)]"
                  : "bg-[var(--surface-alt)] text-[var(--fg-muted)]";
          return (
            <article
              key={imm.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-card flex items-center gap-3"
            >
              <div
                className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${tileBg}`}
              >
                <Syringe className="size-4" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-[var(--fg)]">
                  {imm.vaccineCode}
                </div>
                <div className="text-[11px] text-[var(--fg-muted)] font-mono-num truncate">
                  Scheduled{" "}
                  {format(new Date(imm.scheduledDate), "d MMM yyyy")}
                  {imm.givenDate &&
                    ` · Given ${format(new Date(imm.givenDate), "d MMM yyyy")}`}
                </div>
              </div>
              <div className="shrink-0">
                {imm.status === "GIVEN" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--primary-50)] text-[var(--primary)] ring-1 ring-[var(--primary)]/15">
                    <Check className="size-3" strokeWidth={2.6} />
                    Given
                  </span>
                )}
                {imm.status === "DUE" && (
                  <form
                    action={markVaccineGiven.bind(null, imm.id, child.id)}
                  >
                    <Button
                      size="sm"
                      className="h-8 rounded-full px-3 bg-gradient-primary text-white text-[11px] font-medium shadow-primary-sm hover:opacity-95"
                    >
                      Mark given
                    </Button>
                  </form>
                )}
                {imm.status === "UPCOMING" && (
                  <Clock
                    className="size-4 text-[var(--fg-subtle)]"
                    strokeWidth={2}
                  />
                )}
                {imm.status === "MISSED" && (
                  <AlertCircle className="size-5 text-[var(--risk-critical)]" />
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function SummaryPill({
  label,
  count,
  cls,
}: {
  label: string;
  count: number;
  cls: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${cls}`}
    >
      <span className="font-mono-num font-semibold">{count}</span>
      <span className="opacity-80">{label}</span>
    </span>
  );
}

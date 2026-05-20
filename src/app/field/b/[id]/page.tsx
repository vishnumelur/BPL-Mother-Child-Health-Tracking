// src/app/field/b/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskBadge } from "@/components/risk-badge";
import { formatBeneficiaryId } from "@/lib/beneficiary-id";
import { format, differenceInWeeks } from "date-fns";
import {
  parseBeneficiaryRouteId,
  loadMother,
  loadChild,
} from "@/lib/queries/beneficiary";
import { GrowthChart } from "@/components/growth-chart";
import { MilestoneStrip } from "@/components/milestone-strip";
import { ImmunizationStrip } from "@/components/immunization-strip";
import {
  CalendarPlus,
  Stethoscope,
  History,
  CircleCheck,
  Circle,
  Plus,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export default async function BeneficiaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsed = parseBeneficiaryRouteId(id);
  if (!parsed) notFound();

  if (parsed.type === "mother") {
    const m = await loadMother(parsed.id);
    if (!m) notFound();
    const weeksGa = m.lmp
      ? differenceInWeeks(new Date(), new Date(m.lmp))
      : null;
    const lastVisit = m.ancVisits[0];

    return (
      <div className="relative">
        {/* Ambient gradient backdrop */}
        <div
          className="absolute top-0 left-0 right-0 h-56 pointer-events-none"
          style={{ background: "var(--gradient-soft)" }}
          aria-hidden
        />

        <div className="relative px-4 py-6 sm:px-5 sm:py-7 space-y-5">
          {/* Header */}
          <header className="space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <h1 className="text-2xl font-semibold text-[var(--fg)] tracking-tight">
                  {m.name}
                </h1>
                <p className="text-[11px] font-mono-num text-[var(--fg-muted)]">
                  {formatBeneficiaryId(m.beneficiaryId12)}
                </p>
                <p className="text-xs text-[var(--fg-muted)]">
                  G{m.pregnancyNo}P{m.pregnancyNo - 1} · {weeksGa ?? "?"}w ·{" "}
                  {m.family.village}, {m.family.block}
                </p>
              </div>
              {lastVisit && <RiskBadge level={lastVisit.riskLevel} />}
            </div>
          </header>

          {/* Tabs */}
          <Tabs defaultValue="mother">
            <TabsList
              variant="line"
              className="w-full justify-start border-b border-[var(--border)] rounded-none h-auto pb-1.5"
            >
              <TabsTrigger value="mother" className="px-3">
                Mother
              </TabsTrigger>
              <TabsTrigger value="anc" className="px-3">
                Visits
              </TabsTrigger>
              <TabsTrigger value="family" className="px-3">
                Family
              </TabsTrigger>
            </TabsList>

            {/* Mother tab */}
            <TabsContent value="mother" className="space-y-4 pt-3">
              {/* Profile card with definition list */}
              <section className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-[var(--fg)]">
                    Profile
                  </h2>
                  <span className="text-[10px] uppercase tracking-wider text-[var(--fg-subtle)]">
                    Mother
                  </span>
                </div>
                <dl className="divide-y divide-[var(--border)]">
                  <DefRow label="Age" value={`${m.age} yrs`} />
                  <DefRow
                    label="LMP"
                    value={m.lmp ? format(new Date(m.lmp), "d MMM yyyy") : "—"}
                  />
                  <DefRow
                    label="EDD"
                    value={m.edd ? format(new Date(m.edd), "d MMM yyyy") : "—"}
                  />
                  <DefRow
                    label="Gestational age"
                    value={weeksGa != null ? `${weeksGa} weeks` : "—"}
                  />
                </dl>
              </section>

              {/* Visit CTAs side-by-side */}
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href={`/field/b/m-${m.id}/anc/new`}
                  className="group inline-flex items-center justify-center gap-2 px-4 h-12 rounded-2xl text-white text-sm font-semibold shadow-primary-sm hover:shadow-primary transition-all active:scale-[0.98]"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <CalendarPlus className="size-4" strokeWidth={2.2} />
                  ANC visit
                </Link>
                <Link
                  href={`/field/b/m-${m.id}/pnc/new`}
                  className="group inline-flex items-center justify-center gap-2 px-4 h-12 rounded-2xl bg-white border border-[var(--border)] text-[var(--fg)] text-sm font-semibold hover:border-[var(--primary)]/40 hover:shadow-card transition-all active:scale-[0.98]"
                >
                  <Stethoscope className="size-4 text-[var(--primary)]" strokeWidth={2.2} />
                  PNC visit
                </Link>
              </div>

              {/* Risk timeline card */}
              {m.ancVisits.length > 0 && (
                <section className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-card space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-xl bg-[var(--primary-50)] flex items-center justify-center">
                      <History className="size-4 text-[var(--primary)]" strokeWidth={2.2} />
                    </div>
                    <h2 className="text-sm font-semibold text-[var(--fg)]">
                      Risk timeline
                    </h2>
                  </div>
                  <ul className="space-y-2">
                    {m.ancVisits.slice(0, 4).map((v) => (
                      <li
                        key={v.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-alt)]"
                      >
                        <div className="flex flex-col items-center justify-center min-w-[3.25rem] py-0.5 rounded-lg bg-white border border-[var(--border)]">
                          <span className="text-[10px] uppercase tracking-wider text-[var(--fg-subtle)]">
                            ANC
                          </span>
                          <span className="text-sm font-mono-num font-semibold text-[var(--fg)]">
                            #{v.visitNo}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 justify-between">
                            <span className="text-xs text-[var(--fg-muted)] font-mono-num shrink-0">
                              {format(v.visitDate, "d MMM")}
                            </span>
                            <RiskBadge level={v.riskLevel} />
                          </div>
                          <div className="text-[11px] text-[var(--fg-muted)] mt-1 truncate">
                            BP {v.bpSystolic}/{v.bpDiastolic} · Hb {v.hbValue} · {v.weightKg} kg
                          </div>
                          {v.riskTriggers && v.riskTriggers.length > 0 && (
                            <div className="text-[11px] text-[var(--risk-critical)] mt-0.5 truncate">
                              {v.riskTriggers.join(", ")}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Schemes mini-card */}
              <section className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-[var(--fg)]">
                    Schemes
                  </h2>
                  <Link
                    href="/field/iec"
                    className="inline-flex items-center gap-1 text-[11px] text-[var(--primary)] hover:underline"
                  >
                    <BookOpen className="size-3" />
                    Library
                  </Link>
                </div>
                <div className="space-y-2.5">
                  <SchemeRow label="PMMVY" installments={[true, true, false]} status="2 / 3 disbursed" />
                  <SchemeRow label="JSY" installments={[true, false]} status="1 / 2 disbursed" />
                  <SchemeRow label="KASP" installments={[true]} status="Enrolled" />
                </div>
              </section>
            </TabsContent>

            {/* Visits tab */}
            <TabsContent value="anc" className="space-y-2.5 pt-3">
              {m.ancVisits.length === 0 && m.pncVisits.length === 0 && (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] p-8 text-center">
                  <p className="text-sm text-[var(--fg-muted)]">
                    No visits recorded yet.
                  </p>
                </div>
              )}
              {m.ancVisits.map((v) => (
                <div
                  key={v.id}
                  className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-card space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[var(--fg)]">
                      ANC #{v.visitNo}
                    </span>
                    <RiskBadge level={v.riskLevel} />
                  </div>
                  <div className="text-[11px] text-[var(--fg-muted)] font-mono-num">
                    {format(v.visitDate, "d MMM yyyy · HH:mm")}
                  </div>
                  <div className="text-xs text-[var(--fg)]">
                    BP {v.bpSystolic}/{v.bpDiastolic} · Hb {v.hbValue} ·{" "}
                    {v.weightKg} kg
                  </div>
                  {v.riskTriggers && v.riskTriggers.length > 0 && (
                    <div className="text-[11px] text-[var(--risk-critical)] mt-1">
                      {v.riskTriggers.join(", ")}
                    </div>
                  )}
                </div>
              ))}
              {m.pncVisits.map((v) => (
                <div
                  key={v.id}
                  className="rounded-2xl border border-[var(--border)] bg-white p-4 shadow-card space-y-1"
                >
                  <span className="text-sm font-semibold text-[var(--fg)]">
                    PNC · Day {v.visitDay}
                  </span>
                  <div className="text-[11px] text-[var(--fg-muted)] font-mono-num">
                    {format(v.visitDate, "d MMM yyyy · HH:mm")}
                  </div>
                </div>
              ))}
              <Link
                href={`/field/b/m-${m.id}/anc/new`}
                className="inline-flex items-center justify-center gap-1.5 w-full mt-2 h-11 rounded-xl border border-dashed border-[var(--border)] text-xs text-[var(--fg-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/40 transition-colors"
              >
                <Plus className="size-3.5" />
                Record visit
                <ArrowRight className="size-3" />
              </Link>
            </TabsContent>

            {/* Family tab */}
            <TabsContent value="family" className="space-y-3 pt-3">
              <section className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-card space-y-3">
                <h2 className="text-sm font-semibold text-[var(--fg)]">
                  Household
                </h2>
                <dl className="divide-y divide-[var(--border)]">
                  <DefRow label="Head" value={m.family.headOfFamily} />
                  <DefRow label="Village" value={m.family.village} />
                  <DefRow label="Block" value={m.family.block} />
                  <DefRow
                    label="BPL score"
                    value={`${m.family.bplScore} · Tier ${m.family.schemePriorityTier}`}
                  />
                  {m.family.asha && (
                    <DefRow label="ASHA" value={m.family.asha.name} />
                  )}
                </dl>
              </section>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Child branch (kept structurally similar; minor polish only)
  const c = await loadChild(parsed.id);
  if (!c) notFound();
  const lastGrowth = c.growthRecords[0];
  return (
    <div className="relative">
      <div
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: "var(--gradient-soft)" }}
        aria-hidden
      />
      <div className="relative px-4 py-6 sm:px-5 sm:py-7 space-y-5">
        <header className="space-y-1.5">
          <h1 className="text-2xl font-semibold text-[var(--fg)] tracking-tight">
            {c.name ?? "Baby " + c.beneficiaryId12.slice(-4)}
          </h1>
          <p className="text-[11px] text-[var(--fg-muted)] font-mono-num">
            {formatBeneficiaryId(c.beneficiaryId12)}
          </p>
          <p className="text-xs text-[var(--fg-muted)]">
            Child · DOB {format(new Date(c.dob), "d MMM yyyy")} ·{" "}
            {c.family.village}
          </p>
          {lastGrowth && (
            <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--risk-critical)]/10 text-[var(--risk-critical)]">
              {lastGrowth.classification}
            </span>
          )}
        </header>
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href={`/field/b/c-${c.id}/growth/new`}
            className="inline-flex items-center justify-center gap-2 px-4 h-12 rounded-2xl text-white text-sm font-semibold shadow-primary-sm hover:shadow-primary transition-all active:scale-[0.98]"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Plus className="size-4" strokeWidth={2.2} />
            Growth record
          </Link>
          <Link
            href={`/field/b/c-${c.id}/immunizations`}
            className="inline-flex items-center justify-center gap-2 px-4 h-12 rounded-2xl bg-white border border-[var(--border)] text-[var(--fg)] text-sm font-semibold hover:border-[var(--primary)]/40 hover:shadow-card transition-all active:scale-[0.98]"
          >
            Immunisations
          </Link>
        </div>
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-[var(--fg)]">Growth</h2>
          <GrowthChart
            records={c.growthRecords.map((g) => ({
              recordedAt: g.recordedAt,
              weightKg: g.weightKg,
            }))}
          />
        </section>
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-[var(--fg)]">
            Immunisations
          </h2>
          <ImmunizationStrip
            immunizations={c.immunizations.map((i) => ({
              vaccineCode: i.vaccineCode,
              status: i.status,
            }))}
          />
        </section>
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-[var(--fg)]">Milestones</h2>
          <MilestoneStrip
            milestones={c.milestones.map((mi) => ({
              milestoneCode: mi.milestoneCode,
              expectedAgeMonths: mi.expectedAgeMonths,
              status: mi.status,
            }))}
          />
        </section>
      </div>
    </div>
  );
}

function DefRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
      <dt className="text-xs text-[var(--fg-muted)]">{label}</dt>
      <dd className="text-sm font-medium text-[var(--fg)] text-right">{value}</dd>
    </div>
  );
}

function SchemeRow({
  label,
  installments,
  status,
}: {
  label: string;
  installments: boolean[];
  status: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs font-semibold text-[var(--fg)] font-mono-num shrink-0">
          {label}
        </span>
        <div className="flex items-center gap-1">
          {installments.map((done, i) =>
            done ? (
              <CircleCheck
                key={i}
                className="size-3.5 text-[var(--primary)]"
                strokeWidth={2.4}
              />
            ) : (
              <Circle
                key={i}
                className="size-3.5 text-[var(--fg-subtle)]"
                strokeWidth={1.8}
              />
            ),
          )}
        </div>
      </div>
      <span className="text-[11px] text-[var(--fg-muted)] shrink-0">
        {status}
      </span>
    </div>
  );
}

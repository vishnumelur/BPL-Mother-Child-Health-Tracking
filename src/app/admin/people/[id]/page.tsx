import { notFound } from "next/navigation";
import Link from "next/link";
import {
  parseBeneficiaryRouteId,
  loadMother,
  loadChild,
} from "@/lib/queries/beneficiary";
import { db } from "@/db";
import { alerts as alertsTable } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { RiskBadge } from "@/components/risk-badge";
import {
  DataTable,
  DataTableHead,
  DataTableRow,
} from "@/components/data-table";
import { formatBeneficiaryId } from "@/lib/beneficiary-id";
import { format, formatDistanceToNow } from "date-fns";
import {
  ChevronRight,
  ExternalLink,
  StickyNote,
  CircleCheck,
  Circle,
  AlertTriangle,
  Siren,
} from "lucide-react";

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (
    (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")
  ).toUpperCase();
}

export default async function AdminPeopleDetail({
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

    const recentAlerts = await db
      .select()
      .from(alertsTable)
      .where(
        and(
          eq(alertsTable.subjectType, "mother"),
          eq(alertsTable.subjectId, m.id),
        ),
      )
      .orderBy(desc(alertsTable.raisedAt))
      .limit(4);

    const latestRisk = m.ancVisits[0]?.riskLevel;
    const isCritical = latestRisk === "CRITICAL";
    const initials = initialsOf(m.name);

    return (
      <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-[var(--fg-muted)] flex-wrap"
        >
          <Link href="/admin" className="hover:text-[var(--fg)]">
            Admin
          </Link>
          <ChevronRight className="size-3" />
          <Link href="/admin/people" className="hover:text-[var(--fg)]">
            People
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-[var(--fg)] font-medium font-mono-num">
            {formatBeneficiaryId(m.beneficiaryId12)}
          </span>
        </nav>

        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <div
              className="size-14 sm:size-16 rounded-2xl flex items-center justify-center text-white text-base sm:text-lg font-semibold shrink-0 shadow-primary-sm tracking-tight"
              style={{ background: "var(--gradient-primary)" }}
            >
              {initials}
            </div>
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
                  {m.name}
                </h1>
                {isCritical && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[var(--risk-critical)]/10 text-[var(--risk-critical)] ring-1 ring-[var(--risk-critical)]/20">
                    <AlertTriangle className="size-3" />
                    Critical
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-mono-num text-[var(--fg-muted)]">
                {formatBeneficiaryId(m.beneficiaryId12)}
              </p>
              <p className="text-xs sm:text-sm text-[var(--fg-muted)]">
                Mother · G{m.pregnancyNo}P{m.pregnancyNo - 1} · {m.age}y ·{" "}
                {m.family.village}, {m.family.block}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <Link
              href={`/field/b/m-${m.id}`}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-semibold bg-white border border-[var(--border)] text-[var(--fg)] hover:border-[var(--primary)]/40 transition-colors"
            >
              <ExternalLink className="size-3.5" />
              Open in field app
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-semibold text-white shadow-primary-sm hover:opacity-95 transition-opacity"
              style={{ background: "var(--gradient-primary)" }}
            >
              <StickyNote className="size-3.5" />
              Add note
            </button>
          </div>
        </header>

        {/* Body: 3-col */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left: Profile + Family */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-5">
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--fg)]">
                  Profile
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-[var(--fg-subtle)]">
                  Mother
                </span>
              </div>
              <dl className="divide-y divide-[var(--border)]">
                <DefRow label="Age" value={`${m.age} yrs`} />
                <DefRow
                  label="LMP"
                  value={
                    m.lmp ? format(new Date(m.lmp), "d MMM yyyy") : "—"
                  }
                />
                <DefRow
                  label="EDD"
                  value={
                    m.edd ? format(new Date(m.edd), "d MMM yyyy") : "—"
                  }
                />
                <DefRow
                  label="BPL"
                  value={`${m.family.bplScore} · Tier ${m.family.schemePriorityTier}`}
                />
              </dl>
            </section>

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-card space-y-3">
              <h3 className="text-sm font-semibold text-[var(--fg)]">
                Family
              </h3>
              <dl className="divide-y divide-[var(--border)]">
                <DefRow label="Head" value={m.family.headOfFamily} />
                <DefRow label="Village" value={m.family.village} />
                <DefRow label="Block" value={m.family.block} />
                <DefRow
                  label="ASHA"
                  value={m.family.asha?.name ?? "—"}
                />
              </dl>
            </section>
          </div>

          {/* Right: Visit history + side cards */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-[var(--fg)] px-1">
                Visit history
              </h3>
              <DataTable minWidth={560}>
                <DataTableHead>
                  <tr>
                    <th className="text-left px-4 py-2.5 font-medium">
                      Type
                    </th>
                    <th className="text-left px-4 py-2.5 font-medium">
                      Date
                    </th>
                    <th className="text-left px-4 py-2.5 font-medium">
                      BP
                    </th>
                    <th className="text-left px-4 py-2.5 font-medium hidden sm:table-cell">
                      Hb
                    </th>
                    <th className="text-left px-4 py-2.5 font-medium">
                      Risk
                    </th>
                  </tr>
                </DataTableHead>
                <tbody>
                  {m.ancVisits.map((v) => (
                    <DataTableRow key={"anc-" + v.id}>
                      <td className="px-4 py-3 font-medium">
                        ANC #{v.visitNo}
                      </td>
                      <td className="px-4 py-3 text-[var(--fg-muted)] font-mono-num">
                        {format(v.visitDate, "d MMM")}
                      </td>
                      <td className="px-4 py-3 font-mono-num">
                        {v.bpSystolic}/{v.bpDiastolic}
                      </td>
                      <td className="px-4 py-3 font-mono-num hidden sm:table-cell">
                        {v.hbValue ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <RiskBadge level={v.riskLevel} />
                      </td>
                    </DataTableRow>
                  ))}
                  {m.pncVisits.map((v) => (
                    <DataTableRow key={"pnc-" + v.id}>
                      <td className="px-4 py-3 font-medium">
                        PNC D+{v.visitDay}
                      </td>
                      <td className="px-4 py-3 text-[var(--fg-muted)] font-mono-num">
                        {format(v.visitDate, "d MMM")}
                      </td>
                      <td className="px-4 py-3 font-mono-num">
                        {v.bpSystolic ?? "—"}/{v.bpDiastolic ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-mono-num hidden sm:table-cell">
                        {v.hbValue ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-[var(--fg-muted)]">
                        —
                      </td>
                    </DataTableRow>
                  ))}
                  {m.ancVisits.length === 0 &&
                    m.pncVisits.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-10 text-center text-sm text-[var(--fg-muted)]"
                        >
                          No visits recorded yet.
                        </td>
                      </tr>
                    )}
                </tbody>
              </DataTable>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Schemes mini-card */}
              <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-card space-y-3">
                <h3 className="text-sm font-semibold text-[var(--fg)]">
                  Schemes
                </h3>
                <div className="space-y-2.5">
                  <SchemeRow
                    label="PMMVY"
                    installments={[true, true, false]}
                    status="2 / 3"
                  />
                  <SchemeRow
                    label="JSY"
                    installments={[true, false]}
                    status="1 / 2"
                  />
                  <SchemeRow
                    label="KASP"
                    installments={[true]}
                    status="Enrolled"
                  />
                </div>
              </section>

              {/* Recent alerts mini-card */}
              <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--fg)]">
                    Recent alerts
                  </h3>
                  <Link
                    href="/admin/alerts"
                    className="text-[11px] text-[var(--primary)] hover:underline"
                  >
                    View all
                  </Link>
                </div>
                {recentAlerts.length === 0 ? (
                  <p className="text-[11px] text-[var(--fg-muted)] py-2">
                    No alerts raised.
                  </p>
                ) : (
                  <ul className="space-y-1.5">
                    {recentAlerts.map((a) => {
                      const isSOS = a.type === "SOS";
                      return (
                        <li key={a.id}>
                          <Link
                            href={`/admin/alerts/${a.id}`}
                            className="flex items-center gap-2.5 p-2 -mx-2 rounded-xl hover:bg-[var(--surface-alt)] transition-colors"
                          >
                            <div
                              className={
                                "size-7 rounded-lg flex items-center justify-center shrink-0 " +
                                (isSOS
                                  ? "bg-[var(--risk-critical)]/10 text-[var(--risk-critical)]"
                                  : "bg-[var(--risk-high)]/10 text-[var(--risk-high)]")
                              }
                            >
                              {isSOS ? (
                                <Siren className="size-3.5" />
                              ) : (
                                <AlertTriangle className="size-3.5" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-semibold text-[var(--fg)]">
                                {a.type}
                              </div>
                              <div className="text-[10px] text-[var(--fg-muted)] font-mono-num truncate">
                                {formatDistanceToNow(a.raisedAt, {
                                  addSuffix: true,
                                })}
                              </div>
                            </div>
                            <span className="text-[10px] uppercase tracking-wider text-[var(--fg-subtle)] shrink-0">
                              {a.status}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Child branch (kept; minor polish)
  const c = await loadChild(parsed.id);
  if (!c) notFound();
  const initials = initialsOf(c.name ?? "Baby");
  return (
    <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-[var(--fg-muted)] flex-wrap"
      >
        <Link href="/admin" className="hover:text-[var(--fg)]">
          Admin
        </Link>
        <ChevronRight className="size-3" />
        <Link href="/admin/people" className="hover:text-[var(--fg)]">
          People
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-[var(--fg)] font-medium font-mono-num">
          {formatBeneficiaryId(c.beneficiaryId12)}
        </span>
      </nav>

      <header className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div
            className="size-14 sm:size-16 rounded-2xl flex items-center justify-center text-white text-base sm:text-lg font-semibold shrink-0 shadow-primary-sm tracking-tight"
            style={{ background: "var(--gradient-primary)" }}
          >
            {initials}
          </div>
          <div className="space-y-1.5 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
              {c.name ?? "Baby " + c.beneficiaryId12.slice(-4)}
            </h1>
            <p className="text-xs sm:text-sm font-mono-num text-[var(--fg-muted)]">
              {formatBeneficiaryId(c.beneficiaryId12)}
            </p>
            <p className="text-xs sm:text-sm text-[var(--fg-muted)]">
              Child · DOB {format(new Date(c.dob), "d MMM yyyy")} ·{" "}
              {c.family.village}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <Link
            href={`/field/b/c-${c.id}`}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-semibold bg-white border border-[var(--border)] text-[var(--fg)] hover:border-[var(--primary)]/40 transition-colors"
          >
            <ExternalLink className="size-3.5" />
            Open in field app
          </Link>
        </div>
      </header>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[var(--fg)] px-1">
          Growth records
        </h3>
        <DataTable minWidth={560}>
          <DataTableHead>
            <tr>
              <th className="text-left px-4 py-2.5 font-medium">Date</th>
              <th className="text-left px-4 py-2.5 font-medium">Weight</th>
              <th className="text-left px-4 py-2.5 font-medium hidden sm:table-cell">
                MUAC
              </th>
              <th className="text-left px-4 py-2.5 font-medium">
                Z-score
              </th>
              <th className="text-left px-4 py-2.5 font-medium">Class</th>
            </tr>
          </DataTableHead>
          <tbody>
            {c.growthRecords.map((g) => (
              <DataTableRow key={g.id}>
                <td className="px-4 py-3 text-[var(--fg-muted)] font-mono-num">
                  {format(g.recordedAt, "d MMM")}
                </td>
                <td className="px-4 py-3 font-mono-num">{g.weightKg} kg</td>
                <td className="px-4 py-3 font-mono-num hidden sm:table-cell">
                  {g.muacCm} cm
                </td>
                <td className="px-4 py-3 font-mono-num">
                  {g.weightForHeightZ?.toFixed(2) ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-0.5 rounded-full bg-[var(--surface-alt)] text-[var(--fg)] font-medium text-xs">
                    {g.classification}
                  </span>
                </td>
              </DataTableRow>
            ))}
            {c.growthRecords.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-[var(--fg-muted)]"
                >
                  No growth records yet.
                </td>
              </tr>
            )}
          </tbody>
        </DataTable>
      </div>
    </div>
  );
}

function DefRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
      <dt className="text-xs text-[var(--fg-muted)]">{label}</dt>
      <dd className="text-sm font-medium text-[var(--fg)] text-right">
        {value}
      </dd>
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

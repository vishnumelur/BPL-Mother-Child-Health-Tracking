import { notFound } from "next/navigation";
import {
  parseBeneficiaryRouteId,
  loadMother,
  loadChild,
} from "@/lib/queries/beneficiary";
import { RiskBadge } from "@/components/risk-badge";
import { DataTable, DataTableHead, DataTableRow } from "@/components/data-table";
import { formatBeneficiaryId } from "@/lib/beneficiary-id";
import { format } from "date-fns";

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

    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
            {m.name}
          </h1>
          <p className="text-sm text-[var(--fg-muted)] font-mono-num">
            {formatBeneficiaryId(m.beneficiaryId12)}
          </p>
          <p className="text-sm text-[var(--fg-muted)]">
            G{m.pregnancyNo}P{m.pregnancyNo - 1} · {m.family.village},{" "}
            {m.family.block}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5 space-y-2 lg:col-span-1">
            <h3 className="text-sm font-semibold text-[var(--fg)]">Profile</h3>
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--fg-muted)]">Age</dt>
                <dd className="font-medium">{m.age}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--fg-muted)]">LMP</dt>
                <dd className="font-medium">
                  {m.lmp ? format(new Date(m.lmp), "d MMM yyyy") : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--fg-muted)]">EDD</dt>
                <dd className="font-medium">
                  {m.edd ? format(new Date(m.edd), "d MMM yyyy") : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--fg-muted)]">BPL</dt>
                <dd className="font-medium">
                  {m.family.bplScore} · Tier {m.family.schemePriorityTier}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--fg-muted)]">ASHA</dt>
                <dd className="font-medium">{m.family.asha?.name ?? "—"}</dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-semibold text-[var(--fg)] px-1">
              Visit history
            </h3>
            <DataTable minWidth={560}>
              <DataTableHead>
                <tr>
                  <th className="text-left px-4 py-2.5 font-medium">Type</th>
                  <th className="text-left px-4 py-2.5 font-medium">Date</th>
                  <th className="text-left px-4 py-2.5 font-medium">BP</th>
                  <th className="text-left px-4 py-2.5 font-medium hidden sm:table-cell">
                    Hb
                  </th>
                  <th className="text-left px-4 py-2.5 font-medium">Risk</th>
                </tr>
              </DataTableHead>
              <tbody>
                {m.ancVisits.map((v) => (
                  <DataTableRow key={"anc-" + v.id}>
                    <td className="px-4 py-3 font-medium">ANC #{v.visitNo}</td>
                    <td className="px-4 py-3 text-[var(--fg-muted)]">
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
                    <td className="px-4 py-3 font-medium">PNC D+{v.visitDay}</td>
                    <td className="px-4 py-3 text-[var(--fg-muted)]">
                      {format(v.visitDate, "d MMM")}
                    </td>
                    <td className="px-4 py-3 font-mono-num">
                      {v.bpSystolic ?? "—"}/{v.bpDiastolic ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-mono-num hidden sm:table-cell">
                      {v.hbValue ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[var(--fg-muted)]">—</td>
                  </DataTableRow>
                ))}
                {m.ancVisits.length === 0 && m.pncVisits.length === 0 && (
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
          </div>
        </div>
      </div>
    );
  }

  const c = await loadChild(parsed.id);
  if (!c) notFound();
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--fg)] tracking-tight">
          {c.name ?? "Baby " + c.beneficiaryId12.slice(-4)}
        </h1>
        <p className="text-sm font-mono-num text-[var(--fg-muted)]">
          {formatBeneficiaryId(c.beneficiaryId12)}
        </p>
        <p className="text-sm text-[var(--fg-muted)]">
          DOB {format(new Date(c.dob), "d MMM yyyy")} · {c.family.village}
        </p>
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
              <th className="text-left px-4 py-2.5 font-medium">Z-score</th>
              <th className="text-left px-4 py-2.5 font-medium">Class</th>
            </tr>
          </DataTableHead>
          <tbody>
            {c.growthRecords.map((g) => (
              <DataTableRow key={g.id}>
                <td className="px-4 py-3 text-[var(--fg-muted)]">
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

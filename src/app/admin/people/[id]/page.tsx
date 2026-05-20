import { notFound } from "next/navigation";
import {
  parseBeneficiaryRouteId,
  loadMother,
  loadChild,
} from "@/lib/queries/beneficiary";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/risk-badge";
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
      <div className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-[var(--primary)]">
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

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 space-y-2 col-span-1">
            <h3 className="text-sm font-semibold">Profile</h3>
            <p className="text-sm">Age: {m.age}</p>
            <p className="text-sm">
              LMP: {m.lmp ? format(new Date(m.lmp), "d MMM yyyy") : "—"}
            </p>
            <p className="text-sm">
              EDD: {m.edd ? format(new Date(m.edd), "d MMM yyyy") : "—"}
            </p>
            <p className="text-sm">
              BPL: {m.family.bplScore} · Tier {m.family.schemePriorityTier}
            </p>
            <p className="text-sm">ASHA: {m.family.asha?.name ?? "—"}</p>
          </Card>
          <Card className="p-4 space-y-3 col-span-2">
            <h3 className="text-sm font-semibold">Visit history</h3>
            <table className="w-full text-sm">
              <thead className="text-xs text-[var(--fg-muted)] border-b">
                <tr>
                  <th className="text-left py-1">Type</th>
                  <th className="text-left py-1">Date</th>
                  <th className="text-left py-1">BP</th>
                  <th className="text-left py-1">Hb</th>
                  <th className="text-left py-1">Risk</th>
                </tr>
              </thead>
              <tbody>
                {m.ancVisits.map((v) => (
                  <tr key={"anc-" + v.id} className="border-b">
                    <td className="py-2">ANC #{v.visitNo}</td>
                    <td className="py-2">{format(v.visitDate, "d MMM")}</td>
                    <td className="py-2">
                      {v.bpSystolic}/{v.bpDiastolic}
                    </td>
                    <td className="py-2">{v.hbValue ?? "—"}</td>
                    <td className="py-2">
                      <RiskBadge level={v.riskLevel} />
                    </td>
                  </tr>
                ))}
                {m.pncVisits.map((v) => (
                  <tr key={"pnc-" + v.id} className="border-b">
                    <td className="py-2">PNC D+{v.visitDay}</td>
                    <td className="py-2">{format(v.visitDate, "d MMM")}</td>
                    <td className="py-2">
                      {v.bpSystolic ?? "—"}/{v.bpDiastolic ?? "—"}
                    </td>
                    <td className="py-2">{v.hbValue ?? "—"}</td>
                    <td className="py-2">—</td>
                  </tr>
                ))}
                {m.ancVisits.length === 0 && m.pncVisits.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-xs text-[var(--fg-muted)]">
                      No visits recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    );
  }

  const c = await loadChild(parsed.id);
  if (!c) notFound();
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-[var(--primary)]">
          {c.name ?? "Baby " + c.beneficiaryId12.slice(-4)}
        </h1>
        <p className="text-sm font-mono-num text-[var(--fg-muted)]">
          {formatBeneficiaryId(c.beneficiaryId12)}
        </p>
        <p className="text-sm text-[var(--fg-muted)]">
          DOB {format(new Date(c.dob), "d MMM yyyy")} · {c.family.village}
        </p>
      </header>
      <Card className="p-4 space-y-3">
        <h3 className="text-sm font-semibold">Growth records</h3>
        <table className="w-full text-sm">
          <thead className="text-xs text-[var(--fg-muted)] border-b">
            <tr>
              <th className="text-left py-1">Date</th>
              <th className="text-left py-1">Weight</th>
              <th className="text-left py-1">MUAC</th>
              <th className="text-left py-1">Z-score</th>
              <th className="text-left py-1">Class</th>
            </tr>
          </thead>
          <tbody>
            {c.growthRecords.map((g) => (
              <tr key={g.id} className="border-b">
                <td className="py-2">{format(g.recordedAt, "d MMM")}</td>
                <td className="py-2">{g.weightKg} kg</td>
                <td className="py-2">{g.muacCm} cm</td>
                <td className="py-2 font-mono-num">
                  {g.weightForHeightZ?.toFixed(2) ?? "—"}
                </td>
                <td className="py-2">{g.classification}</td>
              </tr>
            ))}
            {c.growthRecords.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-xs text-[var(--fg-muted)]">
                  No growth records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

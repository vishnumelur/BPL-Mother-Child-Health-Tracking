// src/app/field/b/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/risk-badge";
import { formatBeneficiaryId } from "@/lib/beneficiary-id";
import { format, differenceInWeeks } from "date-fns";
import {
  parseBeneficiaryRouteId,
  loadMother,
  loadChild,
} from "@/lib/queries/beneficiary";

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
      <div className="p-4 space-y-4">
        <header className="space-y-1">
          <h1 className="text-lg font-semibold">{m.name}</h1>
          <p className="text-xs text-[var(--fg-muted)] font-mono-num">
            {formatBeneficiaryId(m.beneficiaryId12)}
          </p>
          <p className="text-xs text-[var(--fg-muted)]">
            G{m.pregnancyNo}P{m.pregnancyNo - 1} · {weeksGa ?? "?"}w ·{" "}
            {m.family.village}, {m.family.block}
          </p>
          {lastVisit && <RiskBadge level={lastVisit.riskLevel} />}
        </header>

        <Tabs defaultValue="mother">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="mother">Mother</TabsTrigger>
            <TabsTrigger value="anc">Visits</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
          </TabsList>
          <TabsContent value="mother" className="space-y-3">
            <Card className="p-3 space-y-2">
              <div className="text-sm">Age: {m.age}</div>
              <div className="text-sm">
                LMP: {m.lmp ? format(new Date(m.lmp), "d MMM yyyy") : "—"}
              </div>
              <div className="text-sm">
                EDD: {m.edd ? format(new Date(m.edd), "d MMM yyyy") : "—"}
              </div>
            </Card>
            <div className="grid grid-cols-2 gap-2">
              <Link href={`/field/b/m-${m.id}/anc/new`}>
                <Button className="w-full">+ ANC visit</Button>
              </Link>
              <Link href={`/field/b/m-${m.id}/pnc/new`}>
                <Button variant="outline" className="w-full">+ PNC visit</Button>
              </Link>
            </div>
          </TabsContent>
          <TabsContent value="anc" className="space-y-2">
            {m.ancVisits.length === 0 && (
              <p className="text-sm text-[var(--fg-muted)]">No visits yet</p>
            )}
            {m.ancVisits.map((v) => (
              <Card key={v.id} className="p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">ANC #{v.visitNo}</span>
                  <RiskBadge level={v.riskLevel} />
                </div>
                <div className="text-xs text-[var(--fg-muted)]">
                  {format(v.visitDate, "d MMM, HH:mm")}
                </div>
                <div className="text-xs">
                  BP {v.bpSystolic}/{v.bpDiastolic} · Hb {v.hbValue} ·{" "}
                  {v.weightKg} kg
                </div>
                {v.riskTriggers && v.riskTriggers.length > 0 && (
                  <div className="text-xs text-[var(--risk-critical)]">
                    {v.riskTriggers.join(", ")}
                  </div>
                )}
              </Card>
            ))}
            {m.pncVisits.map((v) => (
              <Card key={v.id} className="p-3 space-y-1">
                <div className="text-sm font-medium">PNC · Day {v.visitDay}</div>
                <div className="text-xs text-[var(--fg-muted)]">
                  {format(v.visitDate, "d MMM, HH:mm")}
                </div>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="family" className="space-y-2">
            <Card className="p-3 space-y-2">
              <div className="text-sm">Head: {m.family.headOfFamily}</div>
              <div className="text-sm">Village: {m.family.village}</div>
              <div className="text-sm">Block: {m.family.block}</div>
              <div className="text-sm font-medium">
                BPL Score: {m.family.bplScore} · Priority Tier{" "}
                {m.family.schemePriorityTier}
              </div>
              {m.family.asha && (
                <div className="text-sm">ASHA: {m.family.asha.name}</div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Child branch
  const c = await loadChild(parsed.id);
  if (!c) notFound();
  const lastGrowth = c.growthRecords[0];
  return (
    <div className="p-4 space-y-4">
      <header className="space-y-1">
        <h1 className="text-lg font-semibold">
          {c.name ?? "Baby " + c.beneficiaryId12.slice(-4)}
        </h1>
        <p className="text-xs text-[var(--fg-muted)] font-mono-num">
          {formatBeneficiaryId(c.beneficiaryId12)}
        </p>
        <p className="text-xs text-[var(--fg-muted)]">
          Child · DOB {format(new Date(c.dob), "d MMM yyyy")} · {c.family.village}
        </p>
        {lastGrowth && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--risk-critical)]/10 text-[var(--risk-critical)]">
            {lastGrowth.classification}
          </span>
        )}
      </header>
      <div className="grid grid-cols-2 gap-2">
        <Link href={`/field/b/c-${c.id}/growth/new`}>
          <Button className="w-full">+ Growth record</Button>
        </Link>
        <Link href={`/field/b/c-${c.id}/immunizations`}>
          <Button variant="outline" className="w-full">Immunisations</Button>
        </Link>
      </div>
      {/* growth + milestones rendered in subsequent phases */}
    </div>
  );
}

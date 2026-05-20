"use server";
import { db } from "@/db";
import { ancVisits, alerts, referrals, mothers, families, facilities } from "@/db/schema";
import { scoreAncRisk } from "@/lib/risk-scoring";
import { payloadKb } from "@/lib/kb-meter";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq, and } from "drizzle-orm";

const Schema = z.object({
  motherId: z.coerce.number(),
  bpSystolic: z.coerce.number().min(60).max(260).optional(),
  bpDiastolic: z.coerce.number().min(30).max(180).optional(),
  hbValue: z.coerce.number().min(2).max(20).optional(),
  weightKg: z.coerce.number().min(30).max(150).optional(),
  fetalHr: z.coerce.number().min(80).max(200).optional(),
  complaints: z.string().optional(),
  workerId: z.coerce.number().default(1),
});

export type AncInput = z.input<typeof Schema>;

export async function saveAncVisit(input: AncInput) {
  const data = Schema.parse(input);
  const kb = payloadKb(data);
  const risk = scoreAncRisk(data);

  // Count prior visits
  const prior = await db
    .select({ id: ancVisits.id })
    .from(ancVisits)
    .where(eq(ancVisits.motherId, data.motherId));
  const visitNo = prior.length + 1;

  const [row] = await db
    .insert(ancVisits)
    .values({
      motherId: data.motherId,
      visitNo,
      bpSystolic: data.bpSystolic,
      bpDiastolic: data.bpDiastolic,
      hbValue: data.hbValue,
      weightKg: data.weightKg,
      fetalHr: data.fetalHr,
      complaints: data.complaints,
      riskLevel: risk.level,
      riskTriggers: risk.triggers,
      recordedByWorkerId: data.workerId,
      kbUsed: kb,
    })
    .returning();

  // Auto-escalate on CRITICAL → SC→PHC referral + alert
  if (risk.level === "CRITICAL") {
    const mom = await db.query.mothers.findFirst({
      where: eq(mothers.id, data.motherId),
      with: { family: true },
    });

    // Find SC and PHC in the family's block
    const sc = await db.query.facilities.findFirst({
      where: and(eq(facilities.block, mom!.family.block), eq(facilities.type, "SC")),
    });
    const phc = await db.query.facilities.findFirst({
      where: and(eq(facilities.block, mom!.family.block), eq(facilities.type, "PHC")),
    });

    await db.insert(referrals).values({
      subjectType: "mother",
      subjectId: data.motherId,
      fromFacilityId: sc?.id,
      toFacilityId: phc?.id,
      tierFrom: "SC",
      tierTo: "PHC",
      reason: risk.triggers.join("; "),
      status: "PENDING",
    });

    await db.insert(alerts).values({
      type: "ANOMALY",
      status: "OPEN",
      subjectType: "mother",
      subjectId: data.motherId,
      raisedByWorkerId: data.workerId,
      note: risk.triggers.join("; "),
      channels: [
        { to: "field_worker", status: "delivered" },
        { to: "phc_mo", status: "delivered" },
        { to: "supervisor", status: "delivered" },
      ],
    });
  }

  revalidatePath("/field");
  revalidatePath(`/field/b/m-${data.motherId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/alerts");
  revalidatePath("/admin/referrals");

  return { visitId: row.id, riskLevel: risk.level, riskTriggers: risk.triggers, kbUsed: kb };
}

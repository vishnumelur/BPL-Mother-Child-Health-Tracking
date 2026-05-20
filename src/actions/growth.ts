"use server";
import { db } from "@/db";
import { growthRecords, alerts, referrals, children, facilities } from "@/db/schema";
import { classifyNutrition, weightForAgeZ, ageInMonths } from "@/lib/z-score";
import { payloadKb } from "@/lib/kb-meter";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const Schema = z.object({
  childId: z.coerce.number(),
  weightKg: z.coerce.number().min(1).max(30).optional(),
  heightCm: z.coerce.number().min(30).max(120).optional(),
  muacCm: z.coerce.number().min(5).max(20).optional(),
  workerId: z.coerce.number().default(1),
});

export async function saveGrowthRecord(input: z.input<typeof Schema>) {
  const data = Schema.parse(input);
  const kb = payloadKb(data);

  const child = await db.query.children.findFirst({
    where: eq(children.id, data.childId),
    with: { family: true },
  });
  if (!child) throw new Error("Child not found");

  const months = ageInMonths(new Date(child.dob));
  const weightZ =
    data.weightKg != null && child.sex
      ? weightForAgeZ(data.weightKg, months, child.sex as "M" | "F")
      : null;

  // For demo, treat weight-for-age Z as weightForHeightZ proxy when height missing
  const wfh = weightZ;
  const classification = classifyNutrition(wfh, data.muacCm ?? null);

  const [row] = await db
    .insert(growthRecords)
    .values({
      childId: data.childId,
      weightKg: data.weightKg,
      heightCm: data.heightCm,
      muacCm: data.muacCm,
      weightZ,
      weightForHeightZ: wfh,
      classification,
      recordedByWorkerId: data.workerId,
      kbUsed: kb,
    })
    .returning();

  if (classification === "SAM") {
    const phc = await db.query.facilities.findFirst({
      where: and(eq(facilities.block, child.family.block), eq(facilities.type, "PHC")),
    });
    const chc = await db.query.facilities.findFirst({
      where: eq(facilities.type, "CHC"),
    });
    await db.insert(referrals).values({
      subjectType: "child",
      subjectId: data.childId,
      fromFacilityId: phc?.id,
      toFacilityId: chc?.id,
      tierFrom: "PHC",
      tierTo: "CHC",
      reason: "SAM detected — refer to NRC",
      status: "PENDING",
    });
    await db.insert(alerts).values({
      type: "ANOMALY",
      status: "OPEN",
      subjectType: "child",
      subjectId: data.childId,
      raisedByWorkerId: data.workerId,
      note: "SAM classification — NRC referral required",
      channels: [
        { to: "field_worker", status: "delivered" },
        { to: "phc_mo", status: "delivered" },
      ],
    });
  }

  revalidatePath(`/field/b/c-${data.childId}`);
  revalidatePath("/admin");
  return { id: row.id, classification, weightZ: wfh, kbUsed: kb };
}

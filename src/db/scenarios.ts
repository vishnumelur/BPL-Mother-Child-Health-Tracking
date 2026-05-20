// src/db/scenarios.ts
import { db } from ".";
import { ancVisits, alerts, mothers } from "./schema";
import { eq, desc, sql } from "drizzle-orm";

async function findSreelakshmi() {
  return db.query.mothers.findFirst({
    where: eq(mothers.name, "Sreelakshmi M."),
  });
}

export async function jumpScenario(arc: string, checkpoint: string) {
  if (arc !== "sreelakshmi") return;

  const sre = await findSreelakshmi();
  if (!sre) throw new Error("Seed not present — run /demo/seed first");

  switch (checkpoint) {
    case "pre-anc":
      // Remove the CRITICAL ANC visit so the next demo entry creates it fresh
      await db
        .delete(ancVisits)
        .where(
          sql`mother_id = ${sre.id} AND risk_level = 'CRITICAL'`,
        );
      break;

    case "post-anc": {
      // Ensure CRITICAL ANC exists (re-add if missing)
      const recent = await db.query.ancVisits.findFirst({
        where: eq(ancVisits.motherId, sre.id),
        orderBy: desc(ancVisits.visitDate),
      });
      if (!recent || recent.riskLevel !== "CRITICAL") {
        await db.insert(ancVisits).values({
          motherId: sre.id, visitNo: 3,
          bpSystolic: 162, bpDiastolic: 108, hbValue: 6.8,
          weightKg: 53.5, fetalHr: 134,
          riskLevel: "CRITICAL",
          riskTriggers: ["Severe anaemia (Hb<7)", "Severe hypertension"],
          kbUsed: 38,
        });
      }
      break;
    }

    case "post-sos": {
      // Ensure SOS alert exists
      const sos = await db.query.alerts.findFirst({
        where: sql`subject_id = ${sre.id} AND type = 'SOS'`,
      });
      if (!sos) {
        await db.insert(alerts).values({
          type: "SOS", status: "DISPATCHED",
          subjectType: "mother", subjectId: sre.id,
          lat: 11.18, lng: 76.72,
          note: "Bleeding at home — Week 30",
          channels: [
            { to: "field_worker", status: "delivered" },
            { to: "102_ambulance", status: "dispatched" },
            { to: "supervisor", status: "delivered" },
          ],
        });
      }
      break;
    }

    case "post-delivery":
    case "post-sam":
      // No-op — baby Anu is always present from seed
      break;
  }
}

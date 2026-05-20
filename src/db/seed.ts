// src/db/seed.ts
import { config } from "dotenv";
config({ path: ".env.local" });
import { db } from ".";
import {
  facilities, fieldWorkers, families, mothers, children, ancVisits,
  growthRecords, immunizations, milestones, alerts, referrals,
  schemeEnrollments, iecContent, reminders,
} from "./schema";
import { sql } from "drizzle-orm";
import { FACILITIES } from "@/data/kerala-places";
import { VACCINES_0_TO_24M } from "@/data/vaccines";
import { MILESTONES_0_TO_24M } from "@/data/milestones";
import { IEC_LIBRARY } from "@/data/iec-content";
import { generateBeneficiaryId12 } from "@/lib/beneficiary-id";
import { fileURLToPath } from "node:url";

export async function runSeed() {
  // Wipe
  await db.execute(sql`
    truncate table sync_events, sms_log, reminders, iec_content,
    scheme_enrollments, referrals, alerts, milestones, growth_records,
    immunizations, pnc_visits, anc_visits, children, mothers, families,
    field_workers, facilities restart identity cascade
  `);

  // Facilities
  const insertedFacilities = await db
    .insert(facilities)
    .values(
      FACILITIES.map((f) => ({
        name: f.name,
        type: f.type,
        block: f.block,
        district: "Palakkad",
        lat: f.lat,
        lng: f.lng,
      })),
    )
    .returning();
  const agaliSC = insertedFacilities.find((f) => f.name === "Agali Sub-Centre")!;
  const agaliPHC = insertedFacilities.find((f) => f.name === "Agali PHC")!;
  const mannarkkadCHC = insertedFacilities.find((f) => f.name === "Mannarkkad CHC")!;

  // Workers
  const workers = await db
    .insert(fieldWorkers)
    .values([
      { name: "Lakshmi K.", role: "ASHA", facilityId: agaliSC.id, phone: "+919876543210" },
      { name: "Priya R.", role: "ASHA", facilityId: agaliSC.id, phone: "+919876543211" },
      { name: "Anu M.", role: "ANM", facilityId: agaliSC.id, phone: "+919876543212" },
      { name: "Dr. Priya Nair", role: "MO", facilityId: agaliPHC.id, phone: "+919876543213" },
      { name: "Ramesh Pillai", role: "SUPERVISOR", facilityId: mannarkkadCHC.id, phone: "+919876543214" },
      { name: "Dr. Suresh", role: "ADMIN", facilityId: null, phone: "+919876543215" },
    ])
    .returning();
  void workers;

  // IEC library
  await db.insert(iecContent).values(
    IEC_LIBRARY.map((i) => ({
      category: i.category,
      titleEn: i.titleEn,
      titleMl: i.titleMl,
      summary: i.summary,
      language: "ml",
    })),
  );

  return seedSreelakshmiArc(workers, insertedFacilities);
}

async function seedSreelakshmiArc(
  workers: typeof fieldWorkers.$inferSelect[],
  facList: typeof facilities.$inferSelect[],
) {
  const lakshmi = workers.find((w) => w.name === "Lakshmi K.")!;
  const agaliSC = facList.find((f) => f.name === "Agali Sub-Centre")!;
  const agaliPHC = facList.find((f) => f.name === "Agali PHC")!;
  const mannarkkadCHC = facList.find((f) => f.name === "Mannarkkad CHC")!;
  void mannarkkadCHC;

  // === Protagonist family ===
  const [sreFamily] = await db
    .insert(families)
    .values({
      headOfFamily: "Ramesh M.",
      village: "Agali",
      block: "Agali",
      district: "Palakkad",
      bplScore: 8,
      schemePriorityTier: 1,
      ashaId: lakshmi.id,
    })
    .returning();

  // Mother — Sreelakshmi, LMP ~30 weeks ago, G2P1
  const lmp = new Date();
  lmp.setDate(lmp.getDate() - 210); // 30 weeks
  const edd = new Date(lmp);
  edd.setDate(edd.getDate() + 280);

  const [sre] = await db
    .insert(mothers)
    .values({
      familyId: sreFamily.id,
      beneficiaryId12: generateBeneficiaryId12(),
      name: "Sreelakshmi M.",
      age: 24,
      lmp: lmp.toISOString().slice(0, 10),
      edd: edd.toISOString().slice(0, 10),
      pregnancyNo: 2,
    })
    .returning();

  // ANC visit history — last visit CRITICAL
  await db.insert(ancVisits).values([
    {
      motherId: sre.id, visitNo: 1, bpSystolic: 118, bpDiastolic: 76,
      hbValue: 11.2, weightKg: 52, fetalHr: 142,
      riskLevel: "NORMAL", recordedByWorkerId: lakshmi.id, kbUsed: 38,
    },
    {
      motherId: sre.id, visitNo: 2, bpSystolic: 130, bpDiastolic: 84,
      hbValue: 10.1, weightKg: 54, fetalHr: 138,
      riskLevel: "NORMAL", recordedByWorkerId: lakshmi.id, kbUsed: 38,
    },
    {
      motherId: sre.id, visitNo: 3, bpSystolic: 162, bpDiastolic: 108,
      hbValue: 6.8, weightKg: 53.5, fetalHr: 134,
      riskLevel: "CRITICAL",
      riskTriggers: ["Severe anaemia (Hb<7)", "Severe hypertension (BP ≥ 160/110)"],
      recordedByWorkerId: lakshmi.id, kbUsed: 38,
    },
  ]);

  // Auto-generated referral SC→PHC
  await db.insert(referrals).values({
    subjectType: "mother", subjectId: sre.id,
    fromFacilityId: agaliSC.id, toFacilityId: agaliPHC.id,
    tierFrom: "SC", tierTo: "PHC",
    reason: "Severe anaemia (Hb<7); Severe hypertension",
    status: "ACK",
  });

  // SOS alert (Act 3)
  await db.insert(alerts).values({
    type: "SOS", status: "DISPATCHED",
    subjectType: "mother", subjectId: sre.id,
    lat: 11.18, lng: 76.72, raisedByWorkerId: lakshmi.id,
    note: "Bleeding at home — Week 30",
    channels: [
      { to: "field_worker", status: "delivered" },
      { to: "102_ambulance", status: "dispatched" },
      { to: "supervisor", status: "delivered" },
    ],
  });

  // Schemes
  await db.insert(schemeEnrollments).values([
    { beneficiaryType: "mother", beneficiaryId: sre.id, schemeCode: "PMMVY", installmentNo: 1, expectedDate: "2025-10-01", disbursedDate: "2025-10-05", amount: 1000, status: "DISBURSED" },
    { beneficiaryType: "mother", beneficiaryId: sre.id, schemeCode: "PMMVY", installmentNo: 2, expectedDate: "2026-01-15", disbursedDate: "2026-01-20", amount: 2000, status: "DISBURSED" },
    { beneficiaryType: "mother", beneficiaryId: sre.id, schemeCode: "PMMVY", installmentNo: 3, expectedDate: "2026-05-15", amount: 2000, status: "ELIGIBLE" },
    { beneficiaryType: "mother", beneficiaryId: sre.id, schemeCode: "JSY", installmentNo: 1, expectedDate: "2026-06-01", amount: 700, status: "ELIGIBLE" },
    { beneficiaryType: "mother", beneficiaryId: sre.id, schemeCode: "KASP", installmentNo: 1, expectedDate: "2026-06-15", status: "ELIGIBLE" },
  ]);

  // Reminders due today
  const today = new Date().toISOString().slice(0, 10);
  await db.insert(reminders).values([
    { beneficiaryType: "mother", beneficiaryId: sre.id, type: "ANC_VISIT", dueDate: today, channel: "APP" },
    { beneficiaryType: "mother", beneficiaryId: sre.id, type: "PNC_FOLLOWUP", dueDate: today, channel: "SMS" },
  ]);

  // Touch unused imports until Task 11.2 introduces baby Anu
  void children;
  void growthRecords;
  void immunizations;
  void milestones;
  void VACCINES_0_TO_24M;
  void MILESTONES_0_TO_24M;

  return seedBackgroundCohort(workers, facList, sre.id);
}

async function seedBackgroundCohort(
  workers: typeof fieldWorkers.$inferSelect[],
  facList: typeof facilities.$inferSelect[],
  protagonistMotherId: number,
) {
  void facList;
  const ashas = workers.filter((w) => w.role === "ASHA");
  const blocks = ["Agali", "Sholayur", "Pudur", "Mannarkkad", "Attappadi"];

  // 60 background mothers across blocks
  for (let i = 0; i < 60; i++) {
    const block = blocks[i % blocks.length]!;
    const ashaId = ashas[i % ashas.length]!.id;
    const [fam] = await db
      .insert(families)
      .values({
        headOfFamily: `Family ${i + 1}`,
        village: block,
        block,
        district: "Palakkad",
        bplScore: 5 + Math.floor(Math.random() * 25),
        schemePriorityTier: 1 + (i % 3),
        ashaId,
      })
      .returning();

    const lmpDays = 60 + Math.floor(Math.random() * 220);
    const lmp = new Date();
    lmp.setDate(lmp.getDate() - lmpDays);
    const edd = new Date(lmp);
    edd.setDate(edd.getDate() + 280);
    const [m] = await db
      .insert(mothers)
      .values({
        familyId: fam.id,
        beneficiaryId12: generateBeneficiaryId12(),
        name: `Mother ${i + 1}`,
        age: 20 + Math.floor(Math.random() * 15),
        lmp: lmp.toISOString().slice(0, 10),
        edd: edd.toISOString().slice(0, 10),
        pregnancyNo: 1 + (i % 3),
      })
      .returning();

    // 1-3 ANC visits per mother
    const visits = 1 + Math.floor(Math.random() * 3);
    for (let v = 0; v < visits; v++) {
      const isHigh = Math.random() < 0.15;
      const isCritical = Math.random() < 0.04;
      const level = isCritical ? "CRITICAL" : isHigh ? "HIGH" : "NORMAL";
      await db.insert(ancVisits).values({
        motherId: m.id,
        visitNo: v + 1,
        bpSystolic: 110 + Math.floor(Math.random() * 50),
        bpDiastolic: 70 + Math.floor(Math.random() * 30),
        hbValue: 8 + Math.random() * 5,
        weightKg: 50 + Math.random() * 20,
        fetalHr: 130 + Math.floor(Math.random() * 25),
        riskLevel: level,
        recordedByWorkerId: ashaId,
        kbUsed: 30 + Math.floor(Math.random() * 15),
      });
    }

    // Random scheme
    await db.insert(schemeEnrollments).values({
      beneficiaryType: "mother", beneficiaryId: m.id,
      schemeCode: "PMMVY",
      installmentNo: 1, amount: 1000,
      expectedDate: today(),
      disbursedDate: Math.random() < 0.7 ? today() : null,
      status: Math.random() < 0.7 ? "DISBURSED" : "ELIGIBLE",
    });
  }

  return {
    seedVersion: "sreelakshmi-v1",
    protagonistMotherId,
    backgroundCount: 60,
  };
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// Allow `pnpm db:seed` — ESM-compatible main module check
const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  runSeed()
    .then((m) => {
      console.log("Seed complete:", m);
      process.exit(0);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

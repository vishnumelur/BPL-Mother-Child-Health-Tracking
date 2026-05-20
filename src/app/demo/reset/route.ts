import { db } from "@/db";
import {
  syncEvents, smsLog, reminders, iecContent, schemeEnrollments,
  referrals, alerts, milestones, growthRecords, immunizations,
  pncVisits, ancVisits, children, mothers, families, fieldWorkers, facilities,
} from "@/db/schema";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
  // Truncate in reverse FK order
  await db.execute(sql`
    truncate table sync_events, sms_log, reminders, iec_content,
    scheme_enrollments, referrals, alerts, milestones, growth_records,
    immunizations, pnc_visits, anc_visits, children, mothers, families,
    field_workers, facilities restart identity cascade
  `);
  return NextResponse.json({ ok: true });
}

export async function GET() {
  return POST();
}

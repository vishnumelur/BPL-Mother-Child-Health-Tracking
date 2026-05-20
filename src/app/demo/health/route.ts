import { db } from "@/db";
import { mothers, alerts, syncEvents } from "@/db/schema";
import { sql } from "drizzle-orm";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const [{ n: mothersN }] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(mothers);
  const lastAlert = await db.query.alerts.findFirst({
    orderBy: desc(alerts.raisedAt),
  });
  const lastSync = await db.query.syncEvents.findFirst({
    orderBy: desc(syncEvents.queuedAt),
  });
  return NextResponse.json({
    db: "ok",
    mothers: mothersN,
    lastAlertAt: lastAlert?.raisedAt ?? null,
    lastSyncAt: lastSync?.queuedAt ?? null,
    seedVersion: "sreelakshmi-v1",
  });
}

import { db } from "@/db";
import { facilities } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const rows = await db.select().from(facilities).limit(1);
  return NextResponse.json({ warm: true, sampleRows: rows.length });
}

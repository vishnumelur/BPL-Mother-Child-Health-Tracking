import { NextResponse } from "next/server";
import { runSeed } from "@/db/seed";

export async function POST() {
  const meta = await runSeed();
  return NextResponse.json({ ok: true, meta });
}

export async function GET() {
  return POST();
}

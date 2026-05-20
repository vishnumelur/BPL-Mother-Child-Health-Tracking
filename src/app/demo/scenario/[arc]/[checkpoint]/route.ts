import { NextRequest, NextResponse } from "next/server";
import { jumpScenario } from "@/db/scenarios";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ arc: string; checkpoint: string }> },
) {
  const { arc, checkpoint } = await params;
  await jumpScenario(arc, checkpoint);
  return NextResponse.json({ arc, checkpoint, status: "applied" });
}

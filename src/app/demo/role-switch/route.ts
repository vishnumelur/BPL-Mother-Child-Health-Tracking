import { NextRequest, NextResponse } from "next/server";
import { setSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const role = req.nextUrl.searchParams.get("role") ?? "ASHA";
  const validRoles = ["ASHA", "ANM", "MO", "SUPERVISOR", "ADMIN"] as const;
  type Role = (typeof validRoles)[number];
  const r = (validRoles as readonly string[]).includes(role) ? (role as Role) : "ASHA";
  await setSession({ workerId: 1, role: r });
  const back = req.nextUrl.searchParams.get("back") ?? "/";
  return NextResponse.redirect(new URL(back, req.url));
}

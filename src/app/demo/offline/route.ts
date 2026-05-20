import { NextRequest, NextResponse } from "next/server";
import { setOfflineMode } from "@/lib/session";

export async function GET(req: NextRequest) {
  const on = req.nextUrl.searchParams.get("on") === "true";
  await setOfflineMode(on);
  const res = NextResponse.json({ offline: on });
  res.cookies.set("mch_offline", on ? "1" : "0", { path: "/" });
  return res;
}

"use client";
import { saveAncVisit } from "@/actions/anc";
import { savePncVisit } from "@/actions/pnc";
import { saveGrowthRecord } from "@/actions/growth";

export async function runActionByName(name: string, args: unknown) {
  switch (name) {
    case "saveAncVisit":
      return saveAncVisit(args as Parameters<typeof saveAncVisit>[0]);
    case "savePncVisit":
      return savePncVisit(args as Parameters<typeof savePncVisit>[0]);
    case "saveGrowthRecord":
      return saveGrowthRecord(args as Parameters<typeof saveGrowthRecord>[0]);
    default:
      throw new Error("Unknown action: " + name);
  }
}

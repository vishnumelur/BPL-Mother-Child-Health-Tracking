"use server";
import { db } from "@/db";
import { immunizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function markVaccineGiven(immunizationId: number, childId: number) {
  await db
    .update(immunizations)
    .set({ givenDate: new Date().toISOString().slice(0, 10), status: "GIVEN" })
    .where(eq(immunizations.id, immunizationId));
  revalidatePath(`/field/b/c-${childId}`);
  revalidatePath(`/field/b/c-${childId}/immunizations`);
  revalidatePath("/admin");
}

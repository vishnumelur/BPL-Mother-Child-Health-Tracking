"use server";
import { db } from "@/db";
import { pncVisits } from "@/db/schema";
import { payloadKb } from "@/lib/kb-meter";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const Schema = z.object({
  motherId: z.coerce.number(),
  visitDay: z.coerce.number().min(0).max(60),
  bpSystolic: z.coerce.number().optional(),
  bpDiastolic: z.coerce.number().optional(),
  hbValue: z.coerce.number().optional(),
  complications: z.string().optional(),
  workerId: z.coerce.number().default(1),
});

export async function savePncVisit(input: z.input<typeof Schema>) {
  const data = Schema.parse(input);
  const kb = payloadKb(data);
  const [row] = await db
    .insert(pncVisits)
    .values({
      motherId: data.motherId,
      visitDay: data.visitDay,
      bpSystolic: data.bpSystolic,
      bpDiastolic: data.bpDiastolic,
      hbValue: data.hbValue,
      complications: data.complications,
      recordedByWorkerId: data.workerId,
      kbUsed: kb,
    })
    .returning();
  revalidatePath(`/field/b/m-${data.motherId}`);
  revalidatePath("/admin");
  return { visitId: row.id, kbUsed: kb };
}

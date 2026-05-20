"use server";
import { db } from "@/db";
import { alerts } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const Schema = z.object({
  subjectType: z.enum(["mother", "child"]),
  subjectId: z.coerce.number(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  workerId: z.coerce.number().default(1),
  note: z.string().optional(),
});

export async function raiseSos(input: z.input<typeof Schema>) {
  const d = Schema.parse(input);
  const [row] = await db
    .insert(alerts)
    .values({
      type: "SOS",
      status: "DISPATCHED",
      subjectType: d.subjectType,
      subjectId: d.subjectId,
      lat: d.lat,
      lng: d.lng,
      raisedByWorkerId: d.workerId,
      note: d.note,
      channels: [
        { to: "field_worker", status: "delivered", at: new Date().toISOString() },
        { to: "102_ambulance", status: "dispatched", at: new Date().toISOString() },
        { to: "supervisor", status: "delivered", at: new Date().toISOString() },
      ],
    })
    .returning();
  revalidatePath("/admin");
  revalidatePath("/admin/alerts");
  revalidatePath("/field/sos");
  return { alertId: row.id };
}

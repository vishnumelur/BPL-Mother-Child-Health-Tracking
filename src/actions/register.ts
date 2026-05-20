"use server";
import { db } from "@/db";
import { families, mothers, children } from "@/db/schema";
import { generateBeneficiaryId12 } from "@/lib/beneficiary-id";
import { payloadKb } from "@/lib/kb-meter";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const Schema = z.object({
  headOfFamily: z.string().min(2),
  village: z.string().min(2),
  block: z.string().min(2),
  bplScore: z.coerce.number().min(0).max(50),
  motherName: z.string().min(2),
  motherAge: z.coerce.number().min(14).max(50),
  lmp: z.string().optional(),
  pregnancyNo: z.coerce.number().min(1).max(10),
  childDob: z.string().optional(),
  childSex: z.enum(["M", "F"]).optional(),
});

export type RegisterInput = z.infer<typeof Schema>;

export async function registerBeneficiary(input: RegisterInput) {
  const data = Schema.parse(input);
  const kb = payloadKb(data);

  const motherBeneficiaryId = generateBeneficiaryId12();
  const childBeneficiaryId = data.childDob ? generateBeneficiaryId12() : null;

  // Calculate priority tier from BPL score: <=10 Tier 1, 11-25 Tier 2, else Tier 3
  const tier = data.bplScore <= 10 ? 1 : data.bplScore <= 25 ? 2 : 3;

  // EDD = LMP + 280 days
  let edd: string | null = null;
  if (data.lmp) {
    const d = new Date(data.lmp);
    d.setDate(d.getDate() + 280);
    edd = d.toISOString().slice(0, 10);
  }

  const [fam] = await db
    .insert(families)
    .values({
      headOfFamily: data.headOfFamily,
      village: data.village,
      block: data.block,
      district: "Palakkad",
      bplScore: data.bplScore,
      schemePriorityTier: tier,
      ashaId: 1,
    })
    .returning();

  const [mom] = await db
    .insert(mothers)
    .values({
      familyId: fam.id,
      beneficiaryId12: motherBeneficiaryId,
      name: data.motherName,
      age: data.motherAge,
      lmp: data.lmp || null,
      edd,
      pregnancyNo: data.pregnancyNo,
    })
    .returning();

  if (data.childDob && childBeneficiaryId) {
    await db.insert(children).values({
      familyId: fam.id,
      motherId: mom.id,
      beneficiaryId12: childBeneficiaryId,
      dob: data.childDob,
      sex: data.childSex,
    });
  }

  revalidatePath("/field");
  revalidatePath("/admin");

  return {
    familyId: fam.id,
    motherId: mom.id,
    motherBeneficiaryId,
    childBeneficiaryId,
    bplTier: tier,
    kbUsed: kb,
  };
}

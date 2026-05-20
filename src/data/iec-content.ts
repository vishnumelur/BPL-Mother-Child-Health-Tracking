export interface IecItem {
  category: "NUTRITION" | "SAFE_DELIVERY" | "NEWBORN_CARE";
  titleEn: string;
  titleMl: string;
  summary: string;
}

export const IEC_LIBRARY: IecItem[] = [
  {
    category: "NUTRITION",
    titleEn: "Iron-rich foods for pregnancy",
    titleMl: "ഗർഭകാലത്തേക്കുള്ള ഇരുമ്പ് നിറഞ്ഞ ഭക്ഷണം",
    summary:
      "Locally available iron sources: ragi, drumstick leaves, jaggery, dates, leafy greens. Combine with vitamin C for absorption.",
  },
  {
    category: "NUTRITION",
    titleEn: "Exclusive breastfeeding 0–6 months",
    titleMl: "ജനനത്തിനുശേഷം ആറുമാസം മാത്രം മുലപ്പാൽ",
    summary:
      "No water, no other food — only breastmilk for the first 6 months. Reduces infant mortality and supports growth.",
  },
  {
    category: "SAFE_DELIVERY",
    titleEn: "Five danger signs in pregnancy",
    titleMl: "ഗർഭകാലത്തെ അഞ്ച് അപായ സൂചനകൾ",
    summary:
      "Bleeding, severe headache, blurred vision, swelling of face/hands, reduced fetal movement — go to PHC immediately.",
  },
  {
    category: "SAFE_DELIVERY",
    titleEn: "Birth preparedness checklist",
    titleMl: "പ്രസവ തയ്യാറെടുപ്പ് പട്ടിക",
    summary:
      "Hospital identified, transport arranged, blood donor known, clean cloth and clothes ready, ID and JSY documents.",
  },
  {
    category: "NEWBORN_CARE",
    titleEn: "Warmth, breathing, breastfeeding",
    titleMl: "ചൂട്, ശ്വാസം, മുലയൂട്ടൽ",
    summary:
      "First hour of life: dry the baby, skin-to-skin, initiate breastfeeding within 30 minutes, delay first bath.",
  },
  {
    category: "NEWBORN_CARE",
    titleEn: "Recognising newborn danger signs",
    titleMl: "നവജാത ശിശുവിന്റെ അപായ സൂചനകൾ",
    summary:
      "Not feeding, lethargy, fast breathing, jaundice spreading to soles, fever or low temperature — referral.",
  },
];

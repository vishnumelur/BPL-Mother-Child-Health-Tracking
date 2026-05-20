// Curated Malayalam strings. Adding new strings requires confirmation with a
// native speaker — these have been validated for the EOI demo.
export const ml = {
  greeting: "നമസ്കാരം",
  // Form labels
  hemoglobin: "ഹീമോഗ്ലോബിൻ",
  bloodPressure: "രക്തസമ്മർദ്ദം",
  weight: "ഭാരം",
  height: "ഉയരം",
  muac: "കൈച്ചുറ്റളവ്",
  fetalHeartRate: "ഗർഭസ്ഥ ശിശുവിന്റെ ഹൃദയമിടിപ്പ്",
  // Status
  normal: "സാധാരണ",
  high: "ഉയർന്ന",
  critical: "ഗുരുതരം",
  // SMS templates
  ancReminder: (name: string, when: string) =>
    `പ്രിയ ${name}, താങ്കളുടെ അടുത്ത ANC പരിശോധന ${when} ന് നിശ്ചയിച്ചിരിക്കുന്നു. അങ്കണവാടിയിലോ സബ്സെന്ററിലോ എത്തുക. -കേരള ആരോഗ്യ വകുപ്പ്`,
  immReminder: (childName: string, vaccine: string, when: string) =>
    `പ്രിയ രക്ഷിതാവേ, ${childName}-യ്ക്ക് ${vaccine} വാക്സിൻ ${when} ന് നൽകേണ്ടതാണ്. ദയവായി പ്രാദേശിക PHC-യിൽ എത്തിക്കുക. -കേരള ആരോഗ്യ വകുപ്പ്`,
  pncReminder: (name: string) =>
    `പ്രിയ ${name}, പ്രസവശേഷം മൂന്നാം ദിവസത്തെ പരിശോധന ഇന്ന് ആവശ്യമാണ്. ASHA പ്രവർത്തക സന്ദർശിക്കും. -കേരള ആരോഗ്യ വകുപ്പ്`,
} as const;

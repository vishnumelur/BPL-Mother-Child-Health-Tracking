"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

const STEPS = [
  { title: "Act 1 · Registration", text: "Lakshmi (ASHA) registers Sreelakshmi's BPL family in Agali village. ABHA-aligned 12-digit ID generated, OTP verified, BPL Priority Tier 1 calculated." },
  { title: "Act 2 · Week 28 ANC visit", text: "BP 162/108, Hb 6.8. System flags CRITICAL — severe anaemia + hypertension. Auto-referral SC→PHC. Visit synced offline at 38 KB." },
  { title: "Act 3 · Week 30 emergency", text: "SOS raised. GPS captured. 102 ambulance dispatched, supervisor notified. District admin sees alert within seconds." },
  { title: "Act 4 · Day +90 growth", text: "Baby Anu's MUAC 11.2 cm → SAM. Auto NRC referral. Immunisation strip shows BCG ✓ Penta-1 ✓ Penta-2 due." },
  { title: "Act 5 · Compliance picture", text: "PMMVY 2/3 disbursed. JSY ✓. KASP claim filed. One mother, one record, every program." },
];

export default function DemoPlay() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % STEPS.length), 5000);
    return () => clearInterval(id);
  }, []);
  const step = STEPS[i];
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--primary-50)]">
      <Card className="max-w-2xl w-full p-8 space-y-4">
        <p className="text-xs text-[var(--fg-muted)]">Scripted walkthrough · auto-advance</p>
        <h1 className="text-2xl font-semibold text-[var(--primary)]">{step.title}</h1>
        <p className="text-sm text-[var(--fg)] leading-relaxed">{step.text}</p>
        <div className="flex gap-1 pt-2">
          {STEPS.map((_, k) => (
            <div
              key={k}
              className={`h-1 flex-1 rounded-full ${
                k === i ? "bg-[var(--primary)]" : "bg-[var(--border)]"
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

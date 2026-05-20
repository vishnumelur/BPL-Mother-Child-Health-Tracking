"use client";
import { useEffect, useState } from "react";

const STEPS = [
  {
    act: "Act 1",
    title: "Registration",
    text: "Lakshmi (ASHA) registers Sreelakshmi's BPL family in Agali village. ABHA-aligned 12-digit ID generated, OTP verified, BPL Priority Tier 1 calculated.",
  },
  {
    act: "Act 2",
    title: "Week 28 ANC visit",
    text: "BP 162/108, Hb 6.8. System flags CRITICAL — severe anaemia + hypertension. Auto-referral SC→PHC. Visit synced offline at 38 KB.",
  },
  {
    act: "Act 3",
    title: "Week 30 emergency",
    text: "SOS raised. GPS captured. 102 ambulance dispatched, supervisor notified. District admin sees alert within seconds.",
  },
  {
    act: "Act 4",
    title: "Day +90 growth",
    text: "Baby Anu's MUAC 11.2 cm → SAM. Auto NRC referral. Immunisation strip shows BCG ✓ Penta-1 ✓ Penta-2 due.",
  },
  {
    act: "Act 5",
    title: "Compliance picture",
    text: "PMMVY 2/3 disbursed. JSY ✓. KASP claim filed. One mother, one record, every program.",
  },
];

export default function DemoPlay() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % STEPS.length), 5000);
    return () => clearInterval(id);
  }, []);
  const step = STEPS[i];
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[var(--surface)]">
      <div className="max-w-2xl w-full rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-10 space-y-5">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-[var(--fg-muted)] font-medium">
          <span>Scripted walkthrough</span>
          <span>Auto-advance · 5s</span>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-mono-num font-semibold text-[var(--primary)]">
            {step.act}
          </p>
          <h1 className="text-2xl sm:text-4xl font-semibold text-[var(--fg)] tracking-tight leading-tight">
            {step.title}
          </h1>
        </div>
        <p className="text-sm sm:text-base text-[var(--fg-muted)] leading-relaxed">
          {step.text}
        </p>
        <div className="flex gap-1.5 pt-3">
          {STEPS.map((_, k) => (
            <div
              key={k}
              className={`h-1 flex-1 rounded-full transition-colors ${
                k === i ? "bg-[var(--primary)]" : "bg-[var(--border)]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

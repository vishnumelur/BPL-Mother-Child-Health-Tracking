"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

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
    const id = setInterval(
      () => setI((x) => (x + 1) % STEPS.length),
      5000,
    );
    return () => clearInterval(id);
  }, []);
  const step = STEPS[i];
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-8 overflow-hidden">
      {/* Ambient gradient backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{ background: "var(--gradient-mesh)" }}
        aria-hidden
      />
      <div className="relative w-full max-w-2xl">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-10 space-y-5 sm:space-y-6 shadow-card">
          {/* Top labels */}
          <div className="flex items-center justify-between gap-3 text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-[var(--fg-muted)] font-medium">
            <span>Scripted walkthrough</span>
            <span className="font-mono-num">Auto-advance · 5s</span>
          </div>

          {/* Body — animates between steps */}
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="space-y-4 sm:space-y-5"
            >
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono-num font-semibold tracking-[0.1em] text-white shadow-primary-sm"
                style={{ background: "var(--gradient-primary)" }}
              >
                {step.act.toUpperCase()}
              </span>
              <h1 className="text-3xl sm:text-5xl font-semibold text-[var(--fg)] tracking-tight leading-[1.05]">
                {step.title}
              </h1>
              <p className="text-sm sm:text-base text-[var(--fg-muted)] leading-relaxed max-w-prose">
                {step.text}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 pt-3">
            {STEPS.map((_, k) => (
              <div
                key={k}
                className={
                  k === i
                    ? "h-1.5 flex-1 rounded-full bg-gradient-primary shadow-primary-sm transition-all"
                    : k < i
                      ? "h-1.5 flex-1 rounded-full bg-[var(--primary)]/30 transition-all"
                      : "h-1.5 flex-1 rounded-full bg-[var(--border)] transition-all"
                }
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-[var(--fg-subtle)] font-medium">
            <span className="font-mono-num">
              {String(i + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
            </span>
            <span>BPL · MCH · Kerala</span>
          </div>
        </div>
      </div>
    </div>
  );
}

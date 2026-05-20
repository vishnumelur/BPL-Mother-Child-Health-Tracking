"use client";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useState } from "react";

export function KpiCard({
  label,
  value,
  suffix,
  tone = "default",
  variant = "default",
}: {
  label: string;
  value: number | string;
  suffix?: string;
  tone?: "default" | "alert";
  variant?: "default" | "primary";
}) {
  const numeric = typeof value === "number" ? value : null;
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const [display, setDisplay] = useState<number | string>(value);

  useEffect(() => {
    if (numeric == null) {
      setDisplay(value);
      return;
    }
    const controls = animate(mv, numeric, { duration: 0.6 });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [numeric, mv, rounded, value]);

  if (variant === "primary") {
    return (
      <div
        className="relative overflow-hidden rounded-2xl p-4 sm:p-5 space-y-2 text-white shadow-primary-sm"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div
          className="absolute -right-6 -top-6 size-28 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div className="relative">
          <div className="text-[11px] sm:text-xs uppercase tracking-[0.08em] font-medium opacity-85">
            {label}
          </div>
          <motion.div
            key={String(value)}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 0.4 }}
            className="text-3xl sm:text-4xl font-semibold font-mono-num tracking-tight mt-1"
          >
            {display}
            {suffix && (
              <span className="text-base font-normal opacity-80 ml-1">
                {suffix}
              </span>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 sm:p-5 space-y-2 shadow-card hover:shadow-elevated transition-shadow">
      <div className="text-[11px] sm:text-xs text-[var(--fg-muted)] uppercase tracking-[0.08em] font-medium">
        {label}
      </div>
      <motion.div
        key={String(value)}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 0.4 }}
        className={
          "text-2xl sm:text-3xl font-semibold font-mono-num tracking-tight " +
          (tone === "alert"
            ? "text-[var(--risk-critical)]"
            : "text-[var(--fg)]")
        }
      >
        {display}
        {suffix && (
          <span className="text-base font-normal text-[var(--fg-muted)] ml-1">
            {suffix}
          </span>
        )}
      </motion.div>
    </div>
  );
}

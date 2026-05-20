"use client";
import { Card } from "@/components/ui/card";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useState } from "react";

export function KpiCard({
  label,
  value,
  suffix,
  tone = "default",
}: {
  label: string;
  value: number | string;
  suffix?: string;
  tone?: "default" | "alert";
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

  return (
    <Card className="p-4 space-y-1">
      <div className="text-xs text-[var(--fg-muted)] uppercase tracking-wide">
        {label}
      </div>
      <motion.div
        key={String(value)}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 0.4 }}
        className={
          "text-3xl font-semibold font-mono-num " +
          (tone === "alert" ? "text-[var(--risk-critical)]" : "text-[var(--fg)]")
        }
      >
        {display}
        {suffix && <span className="text-base ml-1">{suffix}</span>}
      </motion.div>
    </Card>
  );
}

"use client";
import { motion, AnimatePresence } from "motion/react";
import { Check, Loader2, Radio, Ambulance, ShieldCheck } from "lucide-react";

const ICONS: Record<string, typeof Check> = {
  field_worker: Radio,
  "102_ambulance": Ambulance,
  supervisor: ShieldCheck,
};

const LABELS: Record<string, string> = {
  field_worker: "Field worker (you)",
  "102_ambulance": "102 Ambulance Service",
  supervisor: "Block Supervisor",
};

export function SosChannelList({
  channels,
}: {
  channels: Array<{ to: string; status: string }>;
}) {
  return (
    <ul className="space-y-2">
      <AnimatePresence initial={false}>
        {channels.map((c, i) => {
          const Icon = ICONS[c.to] ?? Check;
          const done = c.status === "delivered" || c.status === "dispatched";
          return (
            <motion.li
              key={c.to}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.25, duration: 0.3 }}
              className="flex items-center justify-between p-3 rounded-lg border bg-[var(--card)]"
            >
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-[var(--primary)]" />
                <span className="text-sm">{LABELS[c.to] ?? c.to}</span>
              </div>
              {done ? (
                <span className="flex items-center gap-1 text-xs text-[var(--risk-normal)]">
                  <Check className="size-3" /> {c.status}
                </span>
              ) : (
                <Loader2 className="size-4 animate-spin text-[var(--fg-muted)]" />
              )}
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}

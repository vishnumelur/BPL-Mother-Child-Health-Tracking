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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.3 }}
              className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-8 rounded-lg bg-[var(--primary-50)] flex items-center justify-center shrink-0">
                  <Icon className="size-4 text-[var(--primary)]" />
                </div>
                <span className="text-sm font-medium text-[var(--fg)] truncate">
                  {LABELS[c.to] ?? c.to}
                </span>
              </div>
              {done ? (
                <span className="flex items-center gap-1 text-xs text-[var(--primary)] font-medium shrink-0">
                  <Check className="size-3.5" strokeWidth={2.5} />
                  {c.status}
                </span>
              ) : (
                <Loader2 className="size-4 animate-spin text-[var(--fg-muted)] shrink-0" />
              )}
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}

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

const STATUS_LABELS: Record<string, string> = {
  field_worker: "Transmission active",
  "102_ambulance": "Nearest unit · 4.2 km",
  supervisor: "Real-time monitoring",
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
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="flex items-center gap-3 p-3.5 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-card"
            >
              <div className="size-10 rounded-xl bg-[var(--primary-50)] flex items-center justify-center shrink-0">
                <Icon className="size-5 text-[var(--primary)]" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-[var(--fg)] truncate">
                  {LABELS[c.to] ?? c.to}
                </div>
                <div className="text-[11px] text-[var(--fg-muted)] truncate">
                  {STATUS_LABELS[c.to] ?? c.status}
                </div>
              </div>
              {done ? (
                <span className="flex items-center gap-1 text-[11px] text-[var(--primary)] font-medium shrink-0 bg-[var(--primary-50)] px-2 py-1 rounded-full">
                  <Check className="size-3" strokeWidth={2.6} />
                  <span className="capitalize">{c.status}</span>
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

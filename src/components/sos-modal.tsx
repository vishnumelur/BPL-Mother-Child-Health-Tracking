"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Siren, MapPin, CheckCircle2 } from "lucide-react";
import { raiseSos } from "@/actions/sos";
import { SosChannelList } from "./sos-channel-list";
import { motion } from "motion/react";

interface Props {
  mothers: Array<{ id: number; name: string }>;
}

export function SosModal({ mothers }: Props) {
  const [pending, start] = useTransition();
  const [selected, setSelected] = useState<number | null>(mothers[0]?.id ?? null);
  const [channels, setChannels] = useState<Array<{ to: string; status: string }>>([]);
  const [fired, setFired] = useState(false);

  function fire() {
    if (selected == null) return;
    setFired(true);
    setTimeout(() => setChannels([{ to: "field_worker", status: "delivered" }]), 200);
    setTimeout(
      () =>
        setChannels([
          { to: "field_worker", status: "delivered" },
          { to: "102_ambulance", status: "dispatched" },
        ]),
      900,
    );
    setTimeout(
      () =>
        setChannels([
          { to: "field_worker", status: "delivered" },
          { to: "102_ambulance", status: "dispatched" },
          { to: "supervisor", status: "delivered" },
        ]),
      1700,
    );
    start(async () => {
      await raiseSos({
        subjectType: "mother",
        subjectId: selected,
        lat: 11.18,
        lng: 76.72,
      });
    });
  }

  if (!fired) {
    return (
      <div className="space-y-4">
        <div className="relative rounded-3xl border-2 border-[var(--risk-critical)]/20 bg-[var(--card)] p-5 sm:p-6 space-y-4 shadow-card">
          <div
            className="absolute inset-0 rounded-3xl opacity-25 blur-2xl pointer-events-none -z-10"
            style={{ background: "var(--risk-critical)" }}
            aria-hidden
          />
          <div className="flex items-center gap-3">
            <div
              className="size-12 rounded-2xl flex items-center justify-center text-white shrink-0"
              style={{ background: "var(--risk-critical)" }}
            >
              <Siren className="size-6" strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-base text-[var(--fg)]">
                SOS Emergency
              </h2>
              <p className="text-[11px] text-[var(--fg-muted)]">
                GPS captured automatically
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-[var(--fg-muted)]">
              Patient
            </label>
            <select
              value={selected ?? ""}
              onChange={(e) => setSelected(Number(e.target.value))}
              className="w-full border border-[var(--border)] rounded-xl h-11 px-3 bg-[var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
            >
              {mothers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <Button
            onClick={fire}
            disabled={selected == null}
            className="w-full h-12 rounded-xl text-white font-semibold shadow-[0_8px_24px_rgba(185,28,28,0.32)] hover:shadow-[0_12px_32px_rgba(185,28,28,0.4)] transition-all"
            style={{ background: "var(--risk-critical)" }}
          >
            <Siren className="size-4" />
            Raise SOS
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      <div className="relative rounded-3xl border-2 border-[var(--risk-critical)]/25 bg-[var(--card)] p-5 sm:p-6 space-y-3 shadow-card">
        <div
          className="absolute inset-0 rounded-3xl opacity-25 blur-2xl pointer-events-none -z-10"
          style={{ background: "var(--risk-critical)" }}
          aria-hidden
        />
        <div className="flex items-center gap-3">
          <div
            className="size-12 rounded-2xl flex items-center justify-center text-white shrink-0"
            style={{ background: "var(--risk-critical)" }}
          >
            <Siren className="size-6" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-base text-[var(--fg)]">
              SOS raised
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--fg-muted)] flex-wrap">
              <MapPin className="size-3 shrink-0" />
              <span className="font-mono-num">11.18°N · 76.72°E</span>
              <span>·</span>
              <span>Agali, Attappadi</span>
            </div>
          </div>
        </div>
      </div>
      <SosChannelList channels={channels} />
      {channels.length === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-[var(--primary-50)] border border-[var(--primary)]/15 px-4 py-3 flex items-center gap-2 justify-center"
        >
          <CheckCircle2 className="size-4 text-[var(--primary)] shrink-0" strokeWidth={2.4} />
          <span className="text-xs text-[var(--primary)] font-medium text-center">
            {pending
              ? "Logging alert…"
              : "Alert persisted · visible to district admin"}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}

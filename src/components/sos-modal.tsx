"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Siren, MapPin } from "lucide-react";
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
      <div className="rounded-2xl border-2 border-[var(--risk-critical)]/30 bg-[var(--card)] p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-[var(--risk-critical)]/10 flex items-center justify-center">
            <Siren className="size-5 text-[var(--risk-critical)]" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--fg)]">SOS Emergency</h2>
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
          className="w-full h-12 rounded-xl bg-[var(--risk-critical)] hover:bg-[var(--risk-critical)]/90 text-white font-semibold"
        >
          <Siren className="size-4" />
          Raise SOS
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      <div className="rounded-2xl border-2 border-[var(--risk-critical)]/30 bg-[var(--card)] p-5 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-[var(--risk-critical)]/10 flex items-center justify-center">
            <Siren className="size-5 text-[var(--risk-critical)]" />
          </div>
          <div>
            <h2 className="font-semibold text-[var(--fg)]">SOS raised</h2>
            <div className="flex items-center gap-1 text-[11px] text-[var(--fg-muted)]">
              <MapPin className="size-3" />
              <span className="font-mono-num">11.18°N · 76.72°E</span>
              <span>·</span>
              <span>Agali, Attappadi</span>
            </div>
          </div>
        </div>
      </div>
      <SosChannelList channels={channels} />
      {channels.length === 3 && (
        <div className="rounded-xl bg-[var(--primary-50)] px-4 py-3 text-xs text-[var(--primary)] text-center font-medium">
          {pending
            ? "Logging alert…"
            : "Alert persisted · visible to district admin"}
        </div>
      )}
    </motion.div>
  );
}

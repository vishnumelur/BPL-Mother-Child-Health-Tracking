"use client";
import { useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
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
    // Simulate fan-out: stagger channels
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
    // Persist in background
    start(async () => {
      // demo GPS for Agali
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
      <Card className="p-4 space-y-4 border-[var(--risk-critical)]/40">
        <div className="flex items-center gap-2 text-[var(--risk-critical)]">
          <Siren className="size-5" />
          <h2 className="font-semibold">SOS Emergency</h2>
        </div>
        <p className="text-sm text-[var(--fg-muted)]">
          Confirm the patient. GPS location will be captured automatically.
        </p>
        <select
          value={selected ?? ""}
          onChange={(e) => setSelected(Number(e.target.value))}
          className="w-full border rounded-md h-9 px-3 bg-white"
        >
          {mothers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <Button
          onClick={fire}
          disabled={selected == null}
          className="w-full bg-[var(--risk-critical)] hover:bg-[var(--risk-critical)]/90"
        >
          <Siren className="size-4" /> Raise SOS
        </Button>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <Card className="p-4 space-y-2 border-[var(--risk-critical)]/40">
        <div className="flex items-center gap-2 text-[var(--risk-critical)]">
          <Siren className="size-5" />
          <h2 className="font-semibold">SOS raised</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--fg-muted)]">
          <MapPin className="size-3" />
          11.18°N, 76.72°E · Agali, Attappadi
        </div>
      </Card>
      <SosChannelList channels={channels} />
      {channels.length === 3 && (
        <Card className="p-3 text-xs text-[var(--fg-muted)] text-center">
          {pending ? "Logging alert…" : "Alert persisted. Visible to district admin in real time."}
        </Card>
      )}
    </motion.div>
  );
}

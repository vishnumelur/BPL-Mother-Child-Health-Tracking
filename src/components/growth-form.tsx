"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MalayalamLabel } from "@/components/malayalam-label";
import { ml } from "@/lib/malayalam";
import { saveGrowthRecord } from "@/actions/growth";
import { motion } from "motion/react";
import { toast } from "sonner";
import { enqueue } from "@/lib/offline-queue";

export function GrowthForm({ childId }: { childId: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [result, setResult] = useState<Awaited<ReturnType<typeof saveGrowthRecord>> | null>(null);
  const [f, setF] = useState({ weightKg: 7.5, heightCm: 67, muacCm: 13.5 });

  function submit() {
    const cookie = typeof document !== "undefined"
      ? document.cookie.includes("mch_offline=1")
      : false;
    if (cookie || (typeof navigator !== "undefined" && !navigator.onLine)) {
      const item = enqueue("saveGrowthRecord", { ...f, childId });
      toast.info(`Queued offline · ${item.payloadKb} KB`);
      return;
    }
    start(async () => {
      const r = await saveGrowthRecord({ ...f, childId });
      setResult(r);
      toast.success(`Saved · ${r.kbUsed} KB · ${r.classification}`);
    });
  }

  if (result) {
    const colorClass =
      result.classification === "SAM"
        ? "bg-[var(--risk-critical)]/10 text-[var(--risk-critical)]"
        : result.classification === "MAM"
          ? "bg-[var(--risk-high)]/10 text-[var(--risk-high)]"
          : "bg-[var(--risk-normal)]/10 text-[var(--risk-normal)]";
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
        <Card className="p-6 space-y-3 text-center">
          <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
            {result.classification}
          </div>
          <div className="text-xs text-[var(--fg-muted)]">
            Weight-for-height Z: {result.weightZ?.toFixed(2) ?? "—"}
          </div>
          {result.classification === "SAM" && (
            <p className="text-sm font-medium text-[var(--risk-critical)]">
              Refer to nearest NRC. Alert raised to PHC MO.
            </p>
          )}
          <Button onClick={() => router.push(`/field/b/c-${childId}`)} className="w-full">
            Back to child profile
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">Growth record</h1>
      <Card className="p-4 space-y-3">
        <div>
          <MalayalamLabel en="Weight (kg)" ml={ml.weight} />
          <Input type="number" step="0.01" value={f.weightKg} onChange={(e) => setF({ ...f, weightKg: Number(e.target.value) })} className="mt-1" />
        </div>
        <div>
          <MalayalamLabel en="Height (cm)" ml={ml.height} />
          <Input type="number" step="0.1" value={f.heightCm} onChange={(e) => setF({ ...f, heightCm: Number(e.target.value) })} className="mt-1" />
        </div>
        <div>
          <MalayalamLabel en="MUAC (cm)" ml={ml.muac} />
          <Input type="number" step="0.1" value={f.muacCm} onChange={(e) => setF({ ...f, muacCm: Number(e.target.value) })} className="mt-1" />
        </div>
        <Button onClick={submit} disabled={pending} className="w-full">
          {pending ? "Saving…" : "Save growth record"}
        </Button>
      </Card>
    </div>
  );
}

"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MalayalamLabel } from "@/components/malayalam-label";
import { ml } from "@/lib/malayalam";
import { motion } from "motion/react";
import { saveAncVisit } from "@/actions/anc";
import { RiskBadge } from "@/components/risk-badge";
import { toast } from "sonner";
import { enqueue } from "@/lib/offline-queue";

export function AncForm({ motherId }: { motherId: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<Awaited<ReturnType<typeof saveAncVisit>> | null>(null);
  const [form, setForm] = useState({
    bpSystolic: 120,
    bpDiastolic: 80,
    hbValue: 11.0,
    weightKg: 55,
    fetalHr: 140,
    complaints: "",
  });

  function submit() {
    const cookie = typeof document !== "undefined"
      ? document.cookie.includes("mch_offline=1")
      : false;
    if (cookie || (typeof navigator !== "undefined" && !navigator.onLine)) {
      const item = enqueue("saveAncVisit", { ...form, motherId });
      toast.info(`Queued offline · ${item.payloadKb} KB`);
      return;
    }
    startTransition(async () => {
      try {
        const r = await saveAncVisit({ ...form, motherId });
        setResult(r);
        toast.success(`Saved · ${r.kbUsed} KB · risk ${r.riskLevel}`);
      } catch (e) {
        toast.error("Save failed");
      }
    });
  }

  if (result) {
    return (
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="p-4 space-y-4"
      >
        <motion.div
          initial={{ scale: 0.98 }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-6 space-y-3 text-center">
            <RiskBadge level={result.riskLevel} />
            <h2 className="font-semibold">Visit saved</h2>
            {result.riskTriggers.length > 0 && (
              <ul className="text-sm text-[var(--risk-critical)] space-y-0.5">
                {result.riskTriggers.map((t) => (
                  <li key={t}>• {t}</li>
                ))}
              </ul>
            )}
            {result.riskLevel === "CRITICAL" && (
              <p className="text-sm font-medium text-[var(--risk-critical)]">
                Immediate referral to PHC raised. MO and supervisor notified.
              </p>
            )}
            <p className="text-xs text-[var(--fg-muted)]">
              Data: {result.kbUsed} KB
            </p>
            <Button
              onClick={() => router.push(`/field/b/m-${motherId}`)}
              className="w-full"
            >
              Back to mother profile
            </Button>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">New ANC visit</h1>
      <Card className="p-4 space-y-3">
        <div>
          <MalayalamLabel en="Blood pressure (systolic / diastolic)" ml={ml.bloodPressure} />
          <div className="flex gap-2 mt-1">
            <Input
              type="number"
              value={form.bpSystolic}
              onChange={(e) => setForm({ ...form, bpSystolic: Number(e.target.value) })}
            />
            <span className="self-center">/</span>
            <Input
              type="number"
              value={form.bpDiastolic}
              onChange={(e) => setForm({ ...form, bpDiastolic: Number(e.target.value) })}
            />
          </div>
        </div>
        <div>
          <MalayalamLabel en="Hemoglobin (g/dL)" ml={ml.hemoglobin} />
          <Input
            type="number"
            step="0.1"
            value={form.hbValue}
            onChange={(e) => setForm({ ...form, hbValue: Number(e.target.value) })}
            className="mt-1"
          />
        </div>
        <div>
          <MalayalamLabel en="Weight (kg)" ml={ml.weight} />
          <Input
            type="number"
            step="0.1"
            value={form.weightKg}
            onChange={(e) => setForm({ ...form, weightKg: Number(e.target.value) })}
            className="mt-1"
          />
        </div>
        <div>
          <MalayalamLabel en="Fetal heart rate (bpm)" ml={ml.fetalHeartRate} />
          <Input
            type="number"
            value={form.fetalHr}
            onChange={(e) => setForm({ ...form, fetalHr: Number(e.target.value) })}
            className="mt-1"
          />
        </div>
        <Button onClick={submit} disabled={pending} className="w-full">
          {pending ? "Saving…" : "Save visit"}
        </Button>
      </Card>
    </div>
  );
}

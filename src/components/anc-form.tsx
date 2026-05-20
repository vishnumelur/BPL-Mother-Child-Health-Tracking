"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MalayalamLabel } from "@/components/malayalam-label";
import { ml } from "@/lib/malayalam";
import { motion } from "motion/react";
import { saveAncVisit } from "@/actions/anc";
import { RiskBadge } from "@/components/risk-badge";
import { toast } from "sonner";
import { enqueue } from "@/lib/offline-queue";
import { AlertTriangle, Activity, ArrowRight, Stethoscope } from "lucide-react";

const inputCls =
  "h-11 w-full min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-3.5 text-sm text-[var(--fg)] font-mono-num transition outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/25 placeholder:text-[var(--fg-subtle)]";

export function AncForm({ motherId }: { motherId: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof saveAncVisit>
  > | null>(null);
  const [form, setForm] = useState({
    bpSystolic: 120,
    bpDiastolic: 80,
    hbValue: 11.0,
    weightKg: 55,
    fetalHr: 140,
    complaints: "",
  });

  function submit() {
    const cookie =
      typeof document !== "undefined"
        ? document.cookie.includes("mch_offline=1")
        : false;
    if (
      cookie ||
      (typeof navigator !== "undefined" && !navigator.onLine)
    ) {
      const item = enqueue("saveAncVisit", { ...form, motherId });
      toast.info(`Queued offline · ${item.payloadKb} KB`);
      return;
    }
    startTransition(async () => {
      try {
        const r = await saveAncVisit({ ...form, motherId });
        setResult(r);
        toast.success(`Saved · ${r.kbUsed} KB · risk ${r.riskLevel}`);
      } catch {
        toast.error("Save failed");
      }
    });
  }

  if (result) {
    const isCritical = result.riskLevel === "CRITICAL";
    return (
      <div className="px-4 py-6 sm:px-5 sm:py-7 space-y-5">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div
            className={
              isCritical
                ? "relative rounded-3xl border-2 border-[var(--risk-critical)]/20 bg-[var(--card)] p-5 sm:p-6 space-y-4 shadow-card"
                : "relative rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 space-y-4 shadow-card"
            }
          >
            {isCritical && (
              <div
                className="absolute inset-0 rounded-3xl opacity-20 blur-2xl pointer-events-none -z-10"
                style={{ background: "var(--risk-critical)" }}
                aria-hidden
              />
            )}
            <div className="flex items-center gap-3">
              <div
                className="size-12 rounded-2xl flex items-center justify-center text-white shrink-0"
                style={{
                  background: isCritical
                    ? "var(--risk-critical)"
                    : "var(--gradient-primary)",
                }}
              >
                {isCritical ? (
                  <AlertTriangle
                    className="size-6"
                    strokeWidth={2.2}
                  />
                ) : (
                  <Stethoscope
                    className="size-6"
                    strokeWidth={2.2}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-semibold text-base text-[var(--fg)]">
                    Visit saved
                  </h2>
                  <RiskBadge level={result.riskLevel} />
                </div>
                <p className="text-[11px] text-[var(--fg-muted)] font-mono-num">
                  {result.kbUsed} KB synced
                </p>
              </div>
            </div>
            {result.riskTriggers.length > 0 && (
              <ul className="space-y-1.5">
                {result.riskTriggers.map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-2 text-sm text-[var(--risk-critical)]"
                  >
                    <span className="mt-1.5 size-1.5 rounded-full bg-[var(--risk-critical)] shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {isCritical && (
            <div className="rounded-2xl border border-[var(--risk-critical)]/20 bg-[var(--risk-critical)]/5 p-4 flex items-start gap-3">
              <ArrowRight
                className="size-4 text-[var(--risk-critical)] mt-0.5 shrink-0"
                strokeWidth={2.2}
              />
              <p className="text-sm font-medium text-[var(--risk-critical)] leading-snug">
                Immediate referral to PHC raised. MO and supervisor
                notified.
              </p>
            </div>
          )}

          <Button
            onClick={() => router.push(`/field/b/m-${motherId}`)}
            className="w-full h-12 rounded-2xl bg-gradient-primary text-white font-medium shadow-primary-sm hover:opacity-95"
          >
            Back to mother profile
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 sm:px-5 sm:py-6 space-y-5">
      <header className="space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="size-10 rounded-2xl bg-[var(--primary-50)] flex items-center justify-center shadow-primary-sm">
            <Activity className="size-5 text-[var(--primary)]" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
              New ANC visit
            </h1>
            <p className="text-xs text-[var(--fg-muted)]">
              Capture vitals · auto risk-scored
            </p>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4 shadow-card">
        <div>
          <MalayalamLabel
            en="Blood pressure (systolic / diastolic)"
            ml={ml.bloodPressure}
          />
          <div className="flex items-center gap-2 mt-1.5">
            <Input
              type="number"
              className={inputCls}
              value={form.bpSystolic}
              onChange={(e) =>
                setForm({
                  ...form,
                  bpSystolic: Number(e.target.value),
                })
              }
            />
            <span className="text-[var(--fg-muted)] font-medium">/</span>
            <Input
              type="number"
              className={inputCls}
              value={form.bpDiastolic}
              onChange={(e) =>
                setForm({
                  ...form,
                  bpDiastolic: Number(e.target.value),
                })
              }
            />
          </div>
        </div>
        <div>
          <MalayalamLabel en="Hemoglobin (g/dL)" ml={ml.hemoglobin} />
          <Input
            type="number"
            step="0.1"
            value={form.hbValue}
            onChange={(e) =>
              setForm({ ...form, hbValue: Number(e.target.value) })
            }
            className={`${inputCls} mt-1.5`}
          />
        </div>
        <div>
          <MalayalamLabel en="Weight (kg)" ml={ml.weight} />
          <Input
            type="number"
            step="0.1"
            value={form.weightKg}
            onChange={(e) =>
              setForm({ ...form, weightKg: Number(e.target.value) })
            }
            className={`${inputCls} mt-1.5`}
          />
        </div>
        <div>
          <MalayalamLabel
            en="Fetal heart rate (bpm)"
            ml={ml.fetalHeartRate}
          />
          <Input
            type="number"
            value={form.fetalHr}
            onChange={(e) =>
              setForm({ ...form, fetalHr: Number(e.target.value) })
            }
            className={`${inputCls} mt-1.5`}
          />
        </div>
        <Button
          onClick={submit}
          disabled={pending}
          className="w-full h-12 rounded-2xl bg-gradient-primary text-white font-medium shadow-primary-sm hover:opacity-95 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save visit"}
        </Button>
      </section>
    </div>
  );
}

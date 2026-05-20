"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MalayalamLabel } from "@/components/malayalam-label";
import { ml } from "@/lib/malayalam";
import { saveGrowthRecord } from "@/actions/growth";
import { motion } from "motion/react";
import { toast } from "sonner";
import { enqueue } from "@/lib/offline-queue";
import { AlertTriangle, ArrowRight, Baby, Ruler } from "lucide-react";

const inputCls =
  "h-11 w-full min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-3.5 text-sm text-[var(--fg)] font-mono-num transition outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/25 placeholder:text-[var(--fg-subtle)]";

export function GrowthForm({ childId }: { childId: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof saveGrowthRecord>
  > | null>(null);
  const [f, setF] = useState({ weightKg: 7.5, heightCm: 67, muacCm: 13.5 });

  function submit() {
    const cookie =
      typeof document !== "undefined"
        ? document.cookie.includes("mch_offline=1")
        : false;
    if (
      cookie ||
      (typeof navigator !== "undefined" && !navigator.onLine)
    ) {
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
    const isSAM = result.classification === "SAM";
    const isMAM = result.classification === "MAM";
    const isCritical = isSAM || isMAM;
    const accentBg = isSAM
      ? "var(--risk-critical)"
      : isMAM
        ? "var(--risk-high)"
        : "var(--gradient-primary)";
    const pillCls = isSAM
      ? "bg-[var(--risk-critical)]/10 text-[var(--risk-critical)] ring-1 ring-[var(--risk-critical)]/20"
      : isMAM
        ? "bg-[var(--risk-high)]/10 text-[var(--risk-high)] ring-1 ring-[var(--risk-high)]/20"
        : "bg-[var(--primary-50)] text-[var(--primary)] ring-1 ring-[var(--primary)]/20";
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
                style={{ background: accentBg }}
              >
                {isCritical ? (
                  <AlertTriangle
                    className="size-6"
                    strokeWidth={2.2}
                  />
                ) : (
                  <Baby className="size-6" strokeWidth={2.2} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-semibold text-base text-[var(--fg)]">
                    Growth recorded
                  </h2>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${pillCls}`}
                  >
                    {result.classification}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--fg-muted)]">
                  Weight-for-height Z ·{" "}
                  <span className="font-mono-num text-[var(--fg)]">
                    {result.weightZ?.toFixed(2) ?? "—"}
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <StatPill label="Weight" value={`${f.weightKg} kg`} />
              <StatPill label="Height" value={`${f.heightCm} cm`} />
              <StatPill label="MUAC" value={`${f.muacCm} cm`} />
              <StatPill
                label="Z-score"
                value={result.weightZ?.toFixed(2) ?? "—"}
              />
            </div>
          </div>

          {isSAM && (
            <div className="rounded-2xl border border-[var(--risk-critical)]/20 bg-[var(--risk-critical)]/5 p-4 flex items-start gap-3">
              <ArrowRight
                className="size-4 text-[var(--risk-critical)] mt-0.5 shrink-0"
                strokeWidth={2.2}
              />
              <p className="text-sm font-medium text-[var(--risk-critical)] leading-snug">
                Refer to nearest NRC. Alert raised to PHC MO.
              </p>
            </div>
          )}

          <Button
            onClick={() => router.push(`/field/b/c-${childId}`)}
            className="w-full h-12 rounded-2xl bg-gradient-primary text-white font-medium shadow-primary-sm hover:opacity-95"
          >
            Back to child profile
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
            <Ruler className="size-5 text-[var(--primary)]" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
              Growth record
            </h1>
            <p className="text-xs text-[var(--fg-muted)]">
              Anthropometry · auto-classified (SAM/MAM/Normal)
            </p>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-4 shadow-card">
        <div>
          <MalayalamLabel en="Weight (kg)" ml={ml.weight} />
          <Input
            type="number"
            step="0.01"
            value={f.weightKg}
            onChange={(e) =>
              setF({ ...f, weightKg: Number(e.target.value) })
            }
            className={`${inputCls} mt-1.5`}
          />
        </div>
        <div>
          <MalayalamLabel en="Height (cm)" ml={ml.height} />
          <Input
            type="number"
            step="0.1"
            value={f.heightCm}
            onChange={(e) =>
              setF({ ...f, heightCm: Number(e.target.value) })
            }
            className={`${inputCls} mt-1.5`}
          />
        </div>
        <div>
          <MalayalamLabel en="MUAC (cm)" ml={ml.muac} />
          <Input
            type="number"
            step="0.1"
            value={f.muacCm}
            onChange={(e) =>
              setF({ ...f, muacCm: Number(e.target.value) })
            }
            className={`${inputCls} mt-1.5`}
          />
        </div>
        <Button
          onClick={submit}
          disabled={pending}
          className="w-full h-12 rounded-2xl bg-gradient-primary text-white font-medium shadow-primary-sm hover:opacity-95 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save growth record"}
        </Button>
      </section>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--surface-alt)] px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-[var(--fg-subtle)]">
        {label}
      </div>
      <div className="text-sm font-mono-num font-semibold text-[var(--fg)]">
        {value}
      </div>
    </div>
  );
}

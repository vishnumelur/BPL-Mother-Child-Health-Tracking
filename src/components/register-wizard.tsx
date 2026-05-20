// src/components/register-wizard.tsx
"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Check, Sparkles, UserPlus } from "lucide-react";
import { registerBeneficiary } from "@/actions/register";
import { formatBeneficiaryId } from "@/lib/beneficiary-id";
import { BLOCKS, VILLAGES_BY_BLOCK } from "@/data/kerala-places";

type Step = "family" | "mother" | "child" | "otp" | "success";

const inputCls =
  "h-11 w-full min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-3.5 text-sm text-[var(--fg)] transition outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/25 placeholder:text-[var(--fg-subtle)]";

const selectCls =
  "h-11 w-full min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-3.5 text-sm text-[var(--fg)] transition outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/25 disabled:opacity-50 disabled:bg-[var(--surface-alt)]";

export function RegisterWizard() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>("family");
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({
    headOfFamily: "",
    village: "",
    block: "",
    bplScore: 12,
    motherName: "",
    motherAge: 24,
    lmp: "",
    pregnancyNo: 1,
    childDob: "",
    childSex: "F" as "M" | "F",
  });
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof registerBeneficiary>
  > | null>(null);

  function next() {
    if (step === "family") setStep("mother");
    else if (step === "mother") setStep("otp");
  }

  function submitOtp() {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    startTransition(async () => {
      const r = await registerBeneficiary(form);
      setResult(r);
      setStep("success");
      toast.success("Beneficiary registered · " + r.kbUsed + " KB");
    });
  }

  const stepIndex =
    step === "success" ? 4 : ["family", "mother", "otp"].indexOf(step) + 1;
  const totalSteps = 4;

  return (
    <div className="px-4 py-5 sm:px-5 sm:py-6 space-y-5">
      {step !== "success" && (
        <header className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-2xl bg-[var(--primary-50)] flex items-center justify-center shadow-primary-sm">
              <UserPlus className="size-5 text-[var(--primary)]" />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
                New beneficiary
              </h1>
              <p className="text-xs text-[var(--fg-muted)]">
                Step {stepIndex} of {totalSteps} · ABHA-aligned registration
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={
                  i < stepIndex
                    ? "h-1.5 flex-1 rounded-full bg-gradient-primary"
                    : "h-1.5 flex-1 rounded-full bg-[var(--border)]"
                }
              />
            ))}
          </div>
        </header>
      )}

      <AnimatePresence mode="wait">
        {step === "family" && (
          <motion.div
            key="family"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3.5 shadow-card">
              <h2 className="text-sm font-semibold text-[var(--fg)] tracking-tight">
                Family details
              </h2>
              <Input
                placeholder="Head of family"
                className={inputCls}
                value={form.headOfFamily}
                onChange={(e) =>
                  setForm({ ...form, headOfFamily: e.target.value })
                }
              />
              <select
                className={selectCls}
                value={form.block}
                onChange={(e) =>
                  setForm({ ...form, block: e.target.value, village: "" })
                }
              >
                <option value="">Select block</option>
                {BLOCKS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <select
                className={selectCls}
                value={form.village}
                onChange={(e) =>
                  setForm({ ...form, village: e.target.value })
                }
                disabled={!form.block}
              >
                <option value="">Select village</option>
                {(VILLAGES_BY_BLOCK[form.block] ?? []).map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                placeholder="BPL score (lower = poorer)"
                className={inputCls}
                value={form.bplScore}
                onChange={(e) =>
                  setForm({ ...form, bplScore: Number(e.target.value) })
                }
              />
              <Button
                onClick={next}
                disabled={
                  !form.headOfFamily || !form.village || !form.block
                }
                className="w-full h-11 rounded-2xl bg-gradient-primary text-white font-medium shadow-primary-sm hover:opacity-95 disabled:opacity-50"
              >
                Continue
              </Button>
            </section>
          </motion.div>
        )}

        {step === "mother" && (
          <motion.div
            key="mother"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3.5 shadow-card">
              <h2 className="text-sm font-semibold text-[var(--fg)] tracking-tight">
                Mother details
              </h2>
              <Input
                placeholder="Mother's name"
                className={inputCls}
                value={form.motherName}
                onChange={(e) =>
                  setForm({ ...form, motherName: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Age"
                className={inputCls}
                value={form.motherAge}
                onChange={(e) =>
                  setForm({ ...form, motherAge: Number(e.target.value) })
                }
              />
              <Input
                type="date"
                placeholder="LMP"
                className={inputCls}
                value={form.lmp}
                onChange={(e) => setForm({ ...form, lmp: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Pregnancy number (G)"
                className={inputCls}
                value={form.pregnancyNo}
                onChange={(e) =>
                  setForm({ ...form, pregnancyNo: Number(e.target.value) })
                }
              />
              <Button
                onClick={next}
                disabled={!form.motherName}
                className="w-full h-11 rounded-2xl bg-gradient-primary text-white font-medium shadow-primary-sm hover:opacity-95 disabled:opacity-50"
              >
                Continue
              </Button>
            </section>
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 space-y-3.5 shadow-card text-center">
              <h2 className="text-sm font-semibold text-[var(--fg)] tracking-tight">
                Verify OTP
              </h2>
              <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                A 6-digit code has been sent to the registered mobile.
                <br />
                (Demo: any 6 digits work.)
              </p>
              <Input
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                className={`${inputCls} h-14 text-center text-3xl tracking-[0.4em] font-mono-num font-semibold`}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
              />
              <Button
                onClick={submitOtp}
                disabled={otp.length !== 6 || pending}
                className="w-full h-11 rounded-2xl bg-gradient-primary text-white font-medium shadow-primary-sm hover:opacity-95 disabled:opacity-50"
              >
                {pending ? "Registering…" : "Verify & Register"}
              </Button>
            </section>
          </motion.div>
        )}

        {step === "success" && result && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-5"
          >
            <section className="relative rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-7 shadow-card overflow-hidden">
              <div className="absolute inset-0 bg-gradient-soft opacity-60 pointer-events-none" />
              <div className="relative flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[var(--primary)]/25 blur-2xl scale-150" />
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 220,
                      damping: 16,
                    }}
                    className="relative size-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-primary-sm"
                  >
                    <Check
                      className="size-8 text-white"
                      strokeWidth={2.5}
                    />
                  </motion.div>
                </div>
                <div className="space-y-1.5">
                  <h2 className="text-xl font-semibold text-[var(--fg)] tracking-tight">
                    Beneficiary registered
                  </h2>
                  <p className="text-xs text-[var(--fg-muted)]">
                    ABHA-aligned beneficiary ID
                  </p>
                </div>
                <div className="font-mono-num text-2xl sm:text-3xl font-semibold tracking-[0.12em] text-[var(--fg)] flex justify-center">
                  {formatBeneficiaryId(result.motherBeneficiaryId)
                    .split("")
                    .map((ch, i) => (
                      <motion.span
                        key={i}
                        initial={{ y: -16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                      >
                        {ch}
                      </motion.span>
                    ))}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary-50)] text-[var(--primary)] px-2.5 py-1 text-[11px] font-medium tracking-tight">
                    <Sparkles className="size-3" />
                    BPL Tier {result.bplTier}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-[var(--surface-alt)] text-[var(--fg-muted)] px-2.5 py-1 text-[11px] font-medium tracking-tight font-mono-num">
                    {result.kbUsed} KB used
                  </span>
                </div>
              </div>
            </section>
            <Button
              onClick={() =>
                router.push(`/field/b/m-${result.motherId}`)
              }
              className="w-full h-12 rounded-2xl bg-gradient-primary text-white font-medium shadow-primary-sm hover:opacity-95"
            >
              Open mother profile
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

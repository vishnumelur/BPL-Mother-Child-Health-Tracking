// src/components/register-wizard.tsx
"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, HeartPulse, Plus, UserPlus } from "lucide-react";
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
      {step !== "success" ? (
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
      ) : (
        <div className="flex justify-center items-center gap-3 pt-1 pb-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-gradient-primary shadow-primary-sm"
            />
          ))}
        </div>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-8 shadow-elevated overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-soft opacity-70 pointer-events-none" />
              <div className="relative flex flex-col items-center text-center">
                {/* Pulsing halo + check */}
                <div className="mb-6 flex justify-center">
                  <div className="size-20 rounded-full bg-[var(--primary-50)] flex items-center justify-center glow-pulse">
                    <Check
                      className="size-10 text-[var(--primary)]"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>

                {/* Eyebrow + shimmer ID */}
                <div className="mb-6 space-y-1.5">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-[var(--fg-subtle)]">
                    ABHA-ALIGNED ID
                  </p>
                  <h2 className="font-mono-num text-3xl sm:text-[2rem] font-semibold tracking-tight shimmer-text">
                    {formatBeneficiaryId(result.motherBeneficiaryId)}
                  </h2>
                </div>

                {/* Headline + subtitle */}
                <div className="mb-7 space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--fg)]">
                    Beneficiary registered
                  </h3>
                  <p className="text-sm text-[var(--fg-muted)]">
                    Mother profile created for{" "}
                    <span className="font-medium text-[var(--fg)]">
                      {form.motherName}
                    </span>
                  </p>
                </div>

                {/* Metadata pills */}
                <div className="mb-7 flex flex-wrap items-center justify-center gap-2">
                  <span className="rounded-full bg-[var(--primary-50)] text-[var(--primary)] px-3.5 py-1.5 text-xs font-semibold tracking-tight">
                    BPL Priority Tier {result.bplTier}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-alt)] border border-[var(--border)] text-[var(--fg-muted)] px-3.5 py-1.5 text-xs font-medium tracking-tight">
                    <Check className="size-3 text-[var(--primary)]" strokeWidth={3} />
                    <span className="font-mono-num">Data used: {result.kbUsed} KB</span>
                  </span>
                </div>

                {/* CTAs */}
                <div className="w-full flex flex-col gap-3">
                  <Button
                    onClick={() => router.push(`/field/b/m-${result.motherId}`)}
                    className="w-full h-14 rounded-full bg-gradient-primary text-white font-semibold shadow-primary hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    Open mother profile
                    <ArrowRight className="size-4" />
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setResult(null);
                      setOtp("");
                      setForm({
                        headOfFamily: "",
                        village: "",
                        block: "",
                        bplScore: 12,
                        motherName: "",
                        motherAge: 24,
                        lmp: "",
                        pregnancyNo: 1,
                        childDob: "",
                        childSex: "F",
                      });
                      setStep("family");
                    }}
                    className="w-full py-2 text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] active:scale-95 transition-all flex items-center justify-center gap-1"
                  >
                    <Plus className="size-3.5" strokeWidth={2.5} />
                    Register another beneficiary
                  </button>
                </div>
              </div>
            </motion.section>

            {/* Next-step bento */}
            <motion.button
              type="button"
              onClick={() => router.push(`/field/b/m-${result.motherId}`)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full text-left p-5 rounded-2xl bg-[var(--surface-alt)] border border-[var(--border)] flex items-start gap-4 active:scale-[0.99] transition-transform"
            >
              <div className="p-2.5 rounded-xl bg-[var(--card)] shadow-card ring-1 ring-[var(--primary)]/10 shrink-0">
                <HeartPulse className="size-5 text-[var(--primary)]" />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-sm text-[var(--fg)] tracking-tight">
                  Next step: schedule first ANC
                </h4>
                <p className="text-xs text-[var(--fg-muted)] mt-1 leading-relaxed">
                  Book the first prenatal checkup and tetanus toxoid vaccination
                  within 7 days of registration.
                </p>
              </div>
              <ArrowRight className="size-4 text-[var(--fg-subtle)] mt-2 shrink-0" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

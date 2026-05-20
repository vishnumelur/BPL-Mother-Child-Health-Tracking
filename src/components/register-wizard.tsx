// src/components/register-wizard.tsx
"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { registerBeneficiary } from "@/actions/register";
import { formatBeneficiaryId } from "@/lib/beneficiary-id";
import { BLOCKS, VILLAGES_BY_BLOCK } from "@/data/kerala-places";

type Step = "family" | "mother" | "child" | "otp" | "success";

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
  const [result, setResult] = useState<Awaited<ReturnType<typeof registerBeneficiary>> | null>(null);

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

  const stepIndex = ["family", "mother", "otp", "success"].indexOf(step) + 1;

  return (
    <div className="p-4 space-y-4">
      <header>
        <h1 className="text-lg font-semibold">New beneficiary</h1>
        <Progress value={(stepIndex / 4) * 100} className="mt-2" />
      </header>

      <AnimatePresence mode="wait">
        {step === "family" && (
          <motion.div
            key="family"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-4 space-y-3">
              <h2 className="font-medium">Family details</h2>
              <Input
                placeholder="Head of family"
                value={form.headOfFamily}
                onChange={(e) =>
                  setForm({ ...form, headOfFamily: e.target.value })
                }
              />
              <select
                className="w-full border rounded-md h-9 px-3 bg-white"
                value={form.block}
                onChange={(e) => setForm({ ...form, block: e.target.value, village: "" })}
              >
                <option value="">Select block</option>
                {BLOCKS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <select
                className="w-full border rounded-md h-9 px-3 bg-white"
                value={form.village}
                onChange={(e) => setForm({ ...form, village: e.target.value })}
                disabled={!form.block}
              >
                <option value="">Select village</option>
                {(VILLAGES_BY_BLOCK[form.block] ?? []).map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <Input
                type="number"
                placeholder="BPL score (lower = poorer)"
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
                className="w-full"
              >
                Continue
              </Button>
            </Card>
          </motion.div>
        )}

        {step === "mother" && (
          <motion.div
            key="mother"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-4 space-y-3">
              <h2 className="font-medium">Mother details</h2>
              <Input
                placeholder="Mother's name"
                value={form.motherName}
                onChange={(e) =>
                  setForm({ ...form, motherName: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Age"
                value={form.motherAge}
                onChange={(e) =>
                  setForm({ ...form, motherAge: Number(e.target.value) })
                }
              />
              <Input
                type="date"
                placeholder="LMP"
                value={form.lmp}
                onChange={(e) => setForm({ ...form, lmp: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Pregnancy number (G)"
                value={form.pregnancyNo}
                onChange={(e) =>
                  setForm({ ...form, pregnancyNo: Number(e.target.value) })
                }
              />
              <Button
                onClick={next}
                disabled={!form.motherName}
                className="w-full"
              >
                Continue
              </Button>
            </Card>
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-4 space-y-3 text-center">
              <h2 className="font-medium">Verify OTP</h2>
              <p className="text-xs text-[var(--fg-muted)]">
                A 6-digit code has been sent to the registered mobile. (Demo:
                any 6 digits work.)
              </p>
              <Input
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                className="text-center text-2xl tracking-widest font-mono-num"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
              <Button
                onClick={submitOtp}
                disabled={otp.length !== 6 || pending}
                className="w-full"
              >
                {pending ? "Registering…" : "Verify & Register"}
              </Button>
            </Card>
          </motion.div>
        )}

        {step === "success" && result && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-6 space-y-4 text-center">
              <div className="text-[var(--accent)] text-4xl">✓</div>
              <h2 className="font-semibold">Beneficiary registered</h2>
              <div className="space-y-1">
                <p className="text-xs text-[var(--fg-muted)]">
                  ABHA-aligned beneficiary ID
                </p>
                <p className="font-mono-num text-xl font-medium tracking-wide">
                  {formatBeneficiaryId(result.motherBeneficiaryId)}
                </p>
              </div>
              <div className="text-xs text-[var(--fg-muted)] space-y-0.5">
                <p>
                  BPL Priority Tier: <strong>{result.bplTier}</strong>
                </p>
                <p>Data used: {result.kbUsed} KB</p>
              </div>
              <Button
                onClick={() => router.push(`/field/b/m-${result.motherId}`)}
                className="w-full"
              >
                Open mother profile
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

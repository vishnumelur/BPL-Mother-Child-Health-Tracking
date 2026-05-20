"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MalayalamLabel } from "@/components/malayalam-label";
import { ml } from "@/lib/malayalam";
import { savePncVisit } from "@/actions/pnc";
import { toast } from "sonner";
import { enqueue } from "@/lib/offline-queue";

export function PncForm({ motherId }: { motherId: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [f, setF] = useState({
    visitDay: 7,
    bpSystolic: 118,
    bpDiastolic: 78,
    hbValue: 10.5,
    complications: "",
  });

  function submit() {
    const cookie = typeof document !== "undefined"
      ? document.cookie.includes("mch_offline=1")
      : false;
    if (cookie || (typeof navigator !== "undefined" && !navigator.onLine)) {
      const item = enqueue("savePncVisit", { ...f, motherId });
      toast.info(`Queued offline · ${item.payloadKb} KB`);
      return;
    }
    start(async () => {
      const r = await savePncVisit({ ...f, motherId });
      toast.success(`PNC saved · ${r.kbUsed} KB`);
      router.push(`/field/b/m-${motherId}`);
    });
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-semibold">New PNC visit</h1>
      <Card className="p-4 space-y-3">
        <div>
          <MalayalamLabel en="Day post-delivery" ml="പ്രസവ ശേഷം ദിവസം" />
          <Input
            type="number"
            value={f.visitDay}
            onChange={(e) => setF({ ...f, visitDay: Number(e.target.value) })}
            className="mt-1"
          />
        </div>
        <div>
          <MalayalamLabel en="Blood pressure" ml={ml.bloodPressure} />
          <div className="flex gap-2 mt-1">
            <Input type="number" value={f.bpSystolic} onChange={(e) => setF({ ...f, bpSystolic: Number(e.target.value) })} />
            <span className="self-center">/</span>
            <Input type="number" value={f.bpDiastolic} onChange={(e) => setF({ ...f, bpDiastolic: Number(e.target.value) })} />
          </div>
        </div>
        <div>
          <MalayalamLabel en="Hemoglobin (g/dL)" ml={ml.hemoglobin} />
          <Input type="number" step="0.1" value={f.hbValue} onChange={(e) => setF({ ...f, hbValue: Number(e.target.value) })} className="mt-1" />
        </div>
        <Button onClick={submit} disabled={pending} className="w-full">
          {pending ? "Saving…" : "Save PNC visit"}
        </Button>
      </Card>
    </div>
  );
}

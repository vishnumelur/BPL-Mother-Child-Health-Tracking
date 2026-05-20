"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SmsPreviewModal } from "@/components/sms-preview-modal";
import { ml as MLT } from "@/lib/malayalam";
import { Smartphone, Calendar } from "lucide-react";
import { format } from "date-fns";

export interface ReminderRowData {
  id: number;
  type: string;
  dueDate: string;
  beneficiaryName: string;
  vaccine?: string;
}

export function ReminderRow({ r }: { r: ReminderRowData }) {
  const [open, setOpen] = useState(false);
  const body =
    r.type === "ANC_VISIT"
      ? MLT.ancReminder(r.beneficiaryName, format(new Date(r.dueDate), "d MMM"))
      : r.type === "IMMUNIZATION"
        ? MLT.immReminder(
            r.beneficiaryName,
            r.vaccine ?? "Pentavalent",
            format(new Date(r.dueDate), "d MMM"),
          )
        : MLT.pncReminder(r.beneficiaryName);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="size-9 rounded-xl bg-[var(--primary-50)] flex items-center justify-center shrink-0">
          <Calendar className="size-4 text-[var(--primary)]" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[var(--fg)] truncate">
            {r.type.replace(/_/g, " ")}
          </div>
          <div className="text-[11px] text-[var(--fg-muted)] truncate">
            {r.beneficiaryName} · due {format(new Date(r.dueDate), "d MMM")}
          </div>
        </div>
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        className="rounded-full border-[var(--border)] text-[var(--fg)] hover:border-[var(--primary)]/40 shrink-0"
      >
        <Smartphone className="size-3.5" />
        SMS
      </Button>
      <SmsPreviewModal
        open={open}
        onOpenChange={setOpen}
        beneficiaryName={r.beneficiaryName}
        bodyText={body}
      />
    </div>
  );
}

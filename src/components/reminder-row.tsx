"use client";
import { useState } from "react";
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

const TYPE_LABELS: Record<string, string> = {
  ANC_VISIT: "ANC checkup",
  IMMUNIZATION: "Immunisation",
  PNC_VISIT: "Postpartum follow-up",
};

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
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 flex items-center justify-between gap-3 shadow-card hover:shadow-elevated transition-shadow">
      <div className="flex items-center gap-3 min-w-0">
        <div className="size-11 rounded-2xl bg-[var(--primary-50)] flex items-center justify-center shrink-0">
          <Calendar className="size-5 text-[var(--primary)]" strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[var(--fg)] truncate">
            {TYPE_LABELS[r.type] ?? r.type.replace(/_/g, " ")}
          </div>
          <div className="text-[11px] text-[var(--fg-muted)] truncate">
            {r.beneficiaryName} · due{" "}
            <span className="font-mono-num">
              {format(new Date(r.dueDate), "d MMM")}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full border border-[var(--border)] bg-white text-xs font-medium text-[var(--fg)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)] transition-colors shrink-0"
      >
        <Smartphone className="size-3.5" strokeWidth={2.2} />
        SMS
      </button>
      <SmsPreviewModal
        open={open}
        onOpenChange={setOpen}
        beneficiaryName={r.beneficiaryName}
        bodyText={body}
      />
    </div>
  );
}

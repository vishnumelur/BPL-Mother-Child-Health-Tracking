"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SmsPreviewModal } from "@/components/sms-preview-modal";
import { ml as MLT } from "@/lib/malayalam";
import { Smartphone } from "lucide-react";
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
    <Card className="p-3 flex items-center justify-between">
      <div>
        <div className="text-sm font-medium">{r.type.replace("_", " ")}</div>
        <div className="text-xs text-[var(--fg-muted)]">
          {r.beneficiaryName} · due {format(new Date(r.dueDate), "d MMM")}
        </div>
      </div>
      <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
        <Smartphone className="size-3" />
        Preview SMS
      </Button>
      <SmsPreviewModal
        open={open}
        onOpenChange={setOpen}
        beneficiaryName={r.beneficiaryName}
        bodyText={body}
      />
    </Card>
  );
}

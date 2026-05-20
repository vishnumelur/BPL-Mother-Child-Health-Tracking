"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Smartphone, Check } from "lucide-react";

export interface SmsPreview {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  beneficiaryName: string;
  bodyText: string;
  senderId?: string;
  sentAt?: Date;
}

export function SmsPreviewModal({
  open,
  onOpenChange,
  beneficiaryName,
  bodyText,
  senderId = "KLNHM-MCH",
  sentAt = new Date(),
}: SmsPreview) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <div className="size-7 rounded-lg bg-[var(--primary-50)] flex items-center justify-center">
              <Smartphone className="size-4 text-[var(--primary)]" />
            </div>
            SMS Preview
          </DialogTitle>
          <DialogDescription className="text-xs">
            Outbound vernacular SMS · would be dispatched via DLT-registered
            gateway in production
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-2xl bg-[var(--primary-50)] p-4 space-y-3">
          <div className="flex justify-between items-center text-[11px] text-[var(--fg-muted)]">
            <span className="font-mono-num font-medium">{senderId}</span>
            <span className="font-mono-num">
              {sentAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="text-[11px] text-[var(--fg-muted)]">
            To: <span className="text-[var(--fg)] font-medium">{beneficiaryName}</span>
          </div>
          <div className="rounded-xl bg-[var(--card)] p-3.5">
            <p className="font-malayalam text-[var(--fg)] leading-relaxed">
              {bodyText}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--primary)] font-medium">
          <Check className="size-3" strokeWidth={2.5} />
          Delivered · 1 SMS · ~70 bytes
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Smartphone } from "lucide-react";

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="size-4" />
            SMS Preview
          </DialogTitle>
          <DialogDescription>
            Outbound vernacular SMS · would be dispatched via DLT-registered
            gateway in production
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border bg-slate-50 p-4 space-y-3">
          <div className="text-xs text-[var(--fg-muted)] flex justify-between">
            <span>From: {senderId}</span>
            <span className="font-mono-num">
              {sentAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="text-xs text-[var(--fg-muted)]">
            To: {beneficiaryName}
          </div>
          <div className="font-malayalam text-[var(--fg)] leading-relaxed">
            {bodyText}
          </div>
        </div>
        <div className="text-xs text-[var(--fg-muted)]">
          Status: delivered · 1 SMS · ~70 bytes
        </div>
      </DialogContent>
    </Dialog>
  );
}

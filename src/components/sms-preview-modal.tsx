"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Smartphone, CheckCircle2, Send } from "lucide-react";

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
      <DialogContent className="max-w-md rounded-3xl p-5 sm:p-6 gap-4">
        <DialogHeader className="space-y-1.5">
          <DialogTitle className="flex items-center gap-2.5 text-base">
            <div className="size-8 rounded-xl bg-[var(--primary-50)] flex items-center justify-center">
              <Smartphone className="size-4 text-[var(--primary)]" strokeWidth={2.2} />
            </div>
            SMS preview
          </DialogTitle>
          <DialogDescription className="text-xs">
            Outbound vernacular SMS · would be dispatched via DLT-registered
            gateway in production
          </DialogDescription>
        </DialogHeader>

        {/* WhatsApp-style preview: green outer wrapper + white inner bubble */}
        <div className="rounded-2xl bg-[var(--primary-50)] p-4 space-y-3">
          <div className="flex justify-between items-center text-[11px] text-[var(--fg-muted)]">
            <span className="font-mono-num font-semibold">{senderId}</span>
            <span className="font-mono-num">
              {sentAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="text-[11px] text-[var(--fg-muted)]">
            To:{" "}
            <span className="text-[var(--fg)] font-medium">
              {beneficiaryName}
            </span>
          </div>
          <div className="rounded-2xl bg-[var(--card)] p-4 shadow-[0_1px_2px_rgba(11,20,26,0.06)]">
            <p className="font-malayalam text-sm text-[var(--fg)] leading-relaxed">
              {bodyText}
            </p>
          </div>
        </div>

        {/* Footer status + send CTA */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--primary)] font-medium">
            <CheckCircle2 className="size-3.5" strokeWidth={2.4} />
            Delivered · 1 SMS · ~70 bytes
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs font-semibold text-white shadow-primary-sm hover:shadow-primary transition-shadow"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Send className="size-3.5" strokeWidth={2.4} />
            Send now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

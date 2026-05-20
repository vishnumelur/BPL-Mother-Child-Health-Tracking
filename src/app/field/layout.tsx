import { PhoneFrame } from "@/components/phone-frame";
import { FieldBottomNav } from "@/components/field-bottom-nav";

export default function FieldLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhoneFrame>
      <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
      <FieldBottomNav />
    </PhoneFrame>
  );
}

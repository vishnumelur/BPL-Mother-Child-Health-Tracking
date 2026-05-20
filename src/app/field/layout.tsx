import { PhoneFrame } from "@/components/phone-frame";
import { FieldBottomNav } from "@/components/field-bottom-nav";

export default function FieldLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhoneFrame>
      <div className="relative flex flex-col min-h-full">
        <div className="flex-1 pb-20">{children}</div>
        <FieldBottomNav />
      </div>
    </PhoneFrame>
  );
}

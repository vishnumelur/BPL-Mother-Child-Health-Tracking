import { Card } from "@/components/ui/card";
import { IEC_LIBRARY } from "@/data/iec-content";
import { Apple, Heart, Baby } from "lucide-react";

const ICONS = {
  NUTRITION: Apple,
  SAFE_DELIVERY: Heart,
  NEWBORN_CARE: Baby,
};

export default function IecPage() {
  return (
    <div className="p-4 space-y-4">
      <header>
        <h1 className="text-lg font-semibold">IEC library</h1>
        <p className="text-xs text-[var(--fg-muted)]">
          Information · Education · Communication
        </p>
      </header>
      <div className="grid grid-cols-1 gap-3">
        {IEC_LIBRARY.map((item, i) => {
          const Icon = ICONS[item.category];
          return (
            <Card key={i} className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-[var(--primary)]" />
                <span className="text-xs uppercase tracking-wide text-[var(--fg-muted)]">
                  {item.category.replace("_", " ").toLowerCase()}
                </span>
              </div>
              <h3 className="font-malayalam font-medium">{item.titleMl}</h3>
              <p className="text-sm text-[var(--fg-muted)]">{item.titleEn}</p>
              <p className="text-xs">{item.summary}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

import { IEC_LIBRARY } from "@/data/iec-content";
import { Apple, Heart, Baby } from "lucide-react";

const ICONS = {
  NUTRITION: Apple,
  SAFE_DELIVERY: Heart,
  NEWBORN_CARE: Baby,
};

const CATEGORY_LABEL = {
  NUTRITION: "Nutrition",
  SAFE_DELIVERY: "Safe delivery",
  NEWBORN_CARE: "Newborn care",
};

export default function IecPage() {
  return (
    <div className="px-4 py-5 sm:px-5 sm:py-6 space-y-5">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-[var(--fg)] tracking-tight">
          Library
        </h1>
        <p className="text-xs text-[var(--fg-muted)]">
          Information · Education · Communication
        </p>
      </header>
      <div className="space-y-3">
        {IEC_LIBRARY.map((item, i) => {
          const Icon = ICONS[item.category];
          return (
            <article
              key={i}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-2.5"
            >
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-[var(--primary-50)] flex items-center justify-center">
                  <Icon className="size-3.5 text-[var(--primary)]" />
                </div>
                <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--fg-muted)] font-medium">
                  {CATEGORY_LABEL[item.category]}
                </span>
              </div>
              <h3 className="font-malayalam font-semibold text-base text-[var(--fg)] leading-snug">
                {item.titleMl}
              </h3>
              <p className="text-sm font-medium text-[var(--fg)]">
                {item.titleEn}
              </p>
              <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
                {item.summary}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

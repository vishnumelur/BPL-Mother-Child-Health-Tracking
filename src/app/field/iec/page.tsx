"use client";
import { useMemo, useState } from "react";
import { IEC_LIBRARY, type IecItem } from "@/data/iec-content";
import { Apple, Heart, Baby, BookOpen } from "lucide-react";

const ICONS = {
  NUTRITION: Apple,
  SAFE_DELIVERY: Heart,
  NEWBORN_CARE: Baby,
};

const CATEGORY_LABEL: Record<IecItem["category"], string> = {
  NUTRITION: "Nutrition",
  SAFE_DELIVERY: "Safe delivery",
  NEWBORN_CARE: "Newborn care",
};

type Filter = "ALL" | IecItem["category"];

const FILTERS: { key: Filter; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "NUTRITION", label: "Nutrition" },
  { key: "SAFE_DELIVERY", label: "Safe delivery" },
  { key: "NEWBORN_CARE", label: "Newborn care" },
];

export default function IecPage() {
  const [active, setActive] = useState<Filter>("ALL");

  const items = useMemo(
    () =>
      active === "ALL"
        ? IEC_LIBRARY
        : IEC_LIBRARY.filter((i) => i.category === active),
    [active],
  );

  return (
    <div className="px-4 py-5 sm:px-5 sm:py-6 space-y-5">
      <header className="space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="size-10 rounded-2xl bg-[var(--primary-50)] flex items-center justify-center shadow-primary-sm">
            <BookOpen className="size-5 text-[var(--primary)]" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
              Library
            </h1>
            <p className="text-xs text-[var(--fg-muted)]">
              Information · Education · Communication
            </p>
          </div>
        </div>
        <p className="text-sm text-[var(--fg-muted)] leading-relaxed max-w-xl">
          Bilingual counselling cards ASHAs read aloud during home visits. Tap a
          category to filter.
        </p>
      </header>

      <div
        className="-mx-4 sm:-mx-5 px-4 sm:px-5 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex gap-2 pb-1 min-w-min">
          {FILTERS.map((f) => {
            const isActive = active === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={
                  isActive
                    ? "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-tight text-white bg-gradient-primary shadow-primary-sm"
                    : "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-tight text-[var(--fg)] bg-[var(--card)] border border-[var(--border)] hover:bg-[var(--surface-alt)] transition"
                }
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => {
          const Icon = ICONS[item.category];
          return (
            <article
              key={i}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-2.5 shadow-card"
            >
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-xl bg-[var(--primary-50)] flex items-center justify-center">
                  <Icon className="size-4 text-[var(--primary)]" />
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

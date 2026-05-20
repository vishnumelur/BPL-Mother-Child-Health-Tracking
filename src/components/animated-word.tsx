"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Rotates through a list of words in place, sliding the old one up and the
 * new one in from below. The container reserves the width of the *longest*
 * word so the line never shifts mid-animation. Use inside an inline phrase
 * like:  `Every <AnimatedWord words={["mother.", "village.", "visit."]} />`
 */
export function AnimatedWord({
  words,
  intervalMs = 2400,
  className,
}: {
  words: string[];
  intervalMs?: number;
  className?: string;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    const id = setInterval(
      () => setIdx((i) => (i + 1) % words.length),
      intervalMs,
    );
    return () => clearInterval(id);
  }, [words.length, intervalMs]);

  // The widest word holds the slot open so the line above/below doesn't reflow.
  const longest = words.reduce((a, b) => (a.length >= b.length ? a : b));

  return (
    <span className="relative inline-block whitespace-nowrap align-baseline">
      {/* invisible spacer = longest word; reserves the layout slot */}
      <span aria-hidden className="invisible">
        {longest}
      </span>
      <span className="absolute inset-0 inline-block">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[idx]}
            initial={{ y: "0.5em", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-0.5em", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={cn("inline-block whitespace-nowrap", className)}
          >
            {words[idx]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

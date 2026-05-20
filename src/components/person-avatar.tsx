"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { avatarUrl, type AvatarKind } from "@/lib/avatar";

interface Props {
  /** Display name — used only for accessibility (aria-label). */
  name: string;
  /** Optional explicit seed; defaults to name. */
  seed?: string | number;
  /** woman / man / child gallery selector. */
  kind?: AvatarKind;
  /** Sizing utilities applied to the round container. */
  className?: string;
  /** Optional inline style override. */
  style?: React.CSSProperties;
}

// Renders a curated Pexels portrait from /public/avatars/, full-cover.
// On error (or for child records that have no photo), falls back to a
// neutral User icon on the gradient tile — never initials.
export function PersonAvatar({
  name,
  seed,
  kind = "woman",
  className,
  style,
}: Props) {
  const [errored, setErrored] = useState(false);
  const url = avatarUrl(seed ?? name, kind);
  const showPhoto = !!url && !errored;

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-primary-sm select-none",
        className,
      )}
      style={{ background: "var(--gradient-primary)", ...style }}
      aria-label={name}
      role="img"
    >
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <User
          aria-hidden
          className="size-[55%] text-white/85"
          strokeWidth={2}
        />
      )}
    </div>
  );
}

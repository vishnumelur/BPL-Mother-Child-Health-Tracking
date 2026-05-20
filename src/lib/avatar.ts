// Local-only stock-portrait helper.
//
// Photos live in /public/avatars/. We curated Pexels portraits of Indian
// women and an Indian male doctor (10 + 1) and serve them from the same
// origin — no external CDN, no API key, no cultural mismatch.
//
// A simple string hash maps each seed → a stable index so the same person
// always shows the same photo.

const WOMAN_COUNT = 10;
const MAN_COUNT = 1;

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export type AvatarKind = "woman" | "man" | "child";

export function avatarUrl(seed: string | number, kind: AvatarKind = "woman"): string | null {
  const h = hashCode(String(seed));
  if (kind === "child") return null; // children render the neutral fallback
  if (kind === "man") return `/avatars/man-${(h % MAN_COUNT) + 1}.jpg`;
  return `/avatars/woman-${(h % WOMAN_COUNT) + 1}.jpg`;
}

// Kept for callers that still import this; never rendered as initials anymore.
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (
    (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")
  ).toUpperCase();
}

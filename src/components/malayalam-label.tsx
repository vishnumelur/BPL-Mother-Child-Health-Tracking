export function MalayalamLabel({
  en,
  ml,
  htmlFor,
}: {
  en: string;
  ml: string;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium space-y-0.5">
      <span className="text-[var(--fg)]">{en}</span>
      <span className="block font-malayalam text-xs text-[var(--fg-muted)]">
        {ml}
      </span>
    </label>
  );
}

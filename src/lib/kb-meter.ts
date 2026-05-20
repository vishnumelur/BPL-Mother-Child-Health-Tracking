export function payloadKb(payload: unknown): number {
  const bytes = new Blob([JSON.stringify(payload)]).size;
  return Math.max(1, Math.round(bytes / 1024));
}

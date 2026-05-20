const KEY = "mch_offline_queue_v1";

export interface QueueItem {
  id: string;
  actionName: string;
  args: unknown;
  payloadKb: number;
  queuedAt: number;
  status: "PENDING" | "SYNCING" | "SYNCED" | "FAILED";
}

export function readQueue(): QueueItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as QueueItem[];
  } catch {
    return [];
  }
}

export function writeQueue(items: QueueItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function enqueue(actionName: string, args: unknown): QueueItem {
  const payloadKb = Math.max(
    1,
    Math.round(new Blob([JSON.stringify(args)]).size / 1024),
  );
  const item: QueueItem = {
    id: crypto.randomUUID(),
    actionName,
    args,
    payloadKb,
    queuedAt: Date.now(),
    status: "PENDING",
  };
  const cur = readQueue();
  writeQueue([...cur, item]);
  window.dispatchEvent(new Event("offline-queue-changed"));
  return item;
}

export function markStatus(id: string, status: QueueItem["status"]) {
  const cur = readQueue();
  const next = cur.map((q) => (q.id === id ? { ...q, status } : q));
  writeQueue(next);
  window.dispatchEvent(new Event("offline-queue-changed"));
}

export function clearSynced() {
  writeQueue(readQueue().filter((q) => q.status !== "SYNCED"));
  window.dispatchEvent(new Event("offline-queue-changed"));
}

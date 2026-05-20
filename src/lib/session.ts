import { cookies } from "next/headers";

export type AppRole = "ASHA" | "ANM" | "MO" | "SUPERVISOR" | "ADMIN";

const COOKIE_NAME = "mch_session";
const OFFLINE_COOKIE = "mch_offline";

interface Session {
  workerId: number;
  role: AppRole;
}

const DEFAULT_SESSION: Session = { workerId: 1, role: "ASHA" };

export async function getSession(): Promise<Session> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return DEFAULT_SESSION;
  try {
    const parsed = JSON.parse(raw) as Session;
    return parsed;
  } catch {
    return DEFAULT_SESSION;
  }
}

export async function setSession(session: Session): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, JSON.stringify(session), {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getOfflineMode(): Promise<boolean> {
  const store = await cookies();
  return store.get(OFFLINE_COOKIE)?.value === "1";
}

export async function setOfflineMode(on: boolean): Promise<void> {
  const store = await cookies();
  store.set(OFFLINE_COOKIE, on ? "1" : "0", {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });
}

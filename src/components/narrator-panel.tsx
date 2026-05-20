"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useNarratorShortcut } from "@/hooks/use-narrator-shortcut";

export function NarratorPanel() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  useNarratorShortcut(() => setOpen(true));

  async function call(url: string) {
    await fetch(url, { method: "POST" });
    router.refresh();
  }

  async function go(url: string) {
    await fetch(url);
    router.refresh();
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-96 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Narrator controls</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
              Database
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => call("/demo/reset")}>
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={() => call("/demo/seed")}>
                Seed
              </Button>
              <Button variant="outline" size="sm" onClick={() => go("/demo/warmup")}>
                Warmup
              </Button>
              <Button variant="outline" size="sm" onClick={() => go("/demo/health")}>
                Health
              </Button>
            </div>
          </section>
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
              Scenario checkpoints
            </h3>
            <div className="space-y-1">
              {["pre-anc", "post-anc", "post-sos", "post-delivery", "post-sam"].map((c) => (
                <Button
                  key={c}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => go(`/demo/scenario/sreelakshmi/${c}`)}
                >
                  → {c}
                </Button>
              ))}
            </div>
          </section>
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
              Role
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(["ASHA", "ANM", "MO", "SUPERVISOR", "ADMIN"] as const).map((r) => (
                <Button
                  key={r}
                  variant="outline"
                  size="sm"
                  onClick={() => go(`/demo/role-switch?role=${r}`)}
                >
                  {r}
                </Button>
              ))}
            </div>
          </section>
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
              Offline mode
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => go("/demo/offline?on=true")}>
                Offline ON
              </Button>
              <Button variant="outline" size="sm" onClick={() => go("/demo/offline?on=false")}>
                Offline OFF
              </Button>
            </div>
          </section>
          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--fg-muted)]">
              Fallback
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => router.push("/demo/play")}
            >
              Open scripted walkthrough
            </Button>
          </section>
          <p className="text-xs text-[var(--fg-muted)]">
            Press <kbd className="px-1 border rounded">Ctrl</kbd>+
            <kbd className="px-1 border rounded">Shift</kbd>+
            <kbd className="px-1 border rounded">D</kbd> to reopen.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

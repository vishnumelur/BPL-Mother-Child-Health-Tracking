import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BeneficiaryNotFound() {
  return (
    <div className="p-6 space-y-3 text-center">
      <p className="text-sm text-[var(--fg-muted)]">Beneficiary not found.</p>
      <Link href="/field">
        <Button variant="outline">Back to home</Button>
      </Link>
    </div>
  );
}

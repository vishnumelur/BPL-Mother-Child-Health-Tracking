import { AdminShell } from "@/components/admin-shell";
import { format } from "date-fns";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell today={format(new Date(), "d MMM yyyy")}>{children}</AdminShell>;
}

import type { Metadata } from "next";
import { AdminShell } from "@/features/admin/AdminShell";

export const metadata: Metadata = {
  title: {
    template: "%s · Vybe Admin",
    default: "Admin",
  },
  description: "Vybe admin console for Spaces, library, and system activity.",
};

export default function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}

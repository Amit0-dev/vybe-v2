import type { Metadata } from "next";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { AdminLoginForm } from "@/features/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin sign in",
  description: "Sign in to the Vybe admin console with Google or a magic email link.",
};

export default function AdminLoginPage() {
  return (
    <div className="vybe-stage flex min-h-dvh flex-col">
      <div className="flex justify-end px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
        <ThemeToggle />
      </div>
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <AdminLoginForm />
      </main>
    </div>
  );
}

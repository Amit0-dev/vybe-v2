import type { Metadata } from "next";
import { AdminLibraryView } from "@/features/admin/AdminLibraryView";

export const metadata: Metadata = {
  title: "Library",
  description: "Upload and manage Vybe’s shared custom music library.",
};

export default function AdminLibraryPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Music library
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Browse everything you’ve uploaded, then add more when you need it.
        </p>
      </header>

      <AdminLibraryView />
    </div>
  );
}

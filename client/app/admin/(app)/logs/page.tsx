import type { Metadata } from "next";
import {
  AdminLogsTable,
  type AdminLogRow,
} from "@/features/admin/AdminLogsTable";

export const metadata: Metadata = {
  title: "Logs",
  description: "System and activity logs for the Vybe admin console.",
};

/** Placeholder logs — remove this page later if unused */
const DEMO_LOGS: AdminLogRow[] = [
  {
    id: "l1",
    time: "13:42:08",
    level: "info",
    source: "spaces",
    message: "Space “Friday Night” marked ACTIVE",
  },
  {
    id: "l2",
    time: "13:38:51",
    level: "info",
    source: "auth",
    message: "Admin magic link requested for you@gmail.com",
  },
  {
    id: "l3",
    time: "13:21:04",
    level: "warn",
    source: "playback",
    message: "Host browser disconnected for Space “Study Session”",
  },
  {
    id: "l4",
    time: "12:58:19",
    level: "info",
    source: "library",
    message: "Track “Soft Focus” added to shared library",
  },
  {
    id: "l5",
    time: "12:44:02",
    level: "error",
    source: "storage",
    message: "Upload failed for track “Untitled” (file too large)",
  },
  {
    id: "l6",
    time: "11:09:33",
    level: "info",
    source: "spaces",
    message: "Space “Road Trip” closed by host",
  },
];

export default function AdminLogsPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Logs
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Recent admin and system events. Keep or remove this page once you
          decide if operational logs belong in the console.
        </p>
      </header>

      <AdminLogsTable logs={DEMO_LOGS} />
    </div>
  );
}

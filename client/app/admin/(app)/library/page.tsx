import type { Metadata } from "next";
import { AdminLibraryView } from "@/features/admin/AdminLibraryView";
import type { AdminLibraryTrack } from "@/features/admin/AdminLibraryTable";

export const metadata: Metadata = {
  title: "Library",
  description: "Upload and manage Vybe’s shared custom music library.",
};

/** Placeholder library — replace with storage + API when wiring */
const DEMO_TRACKS: AdminLibraryTrack[] = [
  {
    id: "lib-a1",
    title: "Midnight Drift",
    artist: "Vybe Sessions",
    durationSec: 214,
    uploadedAt: "2d ago",
  },
  {
    id: "lib-a2",
    title: "Soft Focus",
    artist: "Room Tone",
    durationSec: 198,
    uploadedAt: "5d ago",
  },
  {
    id: "lib-a3",
    title: "Late Checkout",
    artist: "Lobby Band",
    durationSec: 241,
    uploadedAt: "1w ago",
  },
  {
    id: "lib-a4",
    title: "Window Seat",
    artist: "Cabin Noise",
    durationSec: 186,
    uploadedAt: "1w ago",
  },
  {
    id: "lib-a5",
    title: "Greenroom Warmup",
    artist: "Vybe Sessions",
    durationSec: 203,
    uploadedAt: "2w ago",
  },
  {
    id: "lib-a6",
    title: "Slow Pour",
    artist: "After Hours",
    durationSec: 227,
    uploadedAt: "2w ago",
  },
  {
    id: "lib-a7",
    title: "Corridor Echo",
    artist: "Room Tone",
    durationSec: 175,
    uploadedAt: "3w ago",
  },
  {
    id: "lib-a8",
    title: "Golden Hour Loop",
    artist: "Lobby Band",
    durationSec: 256,
    uploadedAt: "3w ago",
  },
  {
    id: "lib-a9",
    title: "Rain Check",
    artist: "Cabin Noise",
    durationSec: 192,
    uploadedAt: "1mo ago",
  },
  {
    id: "lib-a10",
    title: "Last Call Soft",
    artist: "After Hours",
    durationSec: 218,
    uploadedAt: "1mo ago",
  },
];

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

      <AdminLibraryView tracks={DEMO_TRACKS} />
    </div>
  );
}

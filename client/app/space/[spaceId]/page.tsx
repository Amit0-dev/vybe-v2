import { SpaceDemoRoom } from "@/features/space/SpaceDemoRoom";
import type { LibraryTrack, QueueItem } from "@/lib/types";

interface SpacePageProps {
  params: Promise<{ spaceId: string }>;
  searchParams: Promise<{ role?: string }>;
}

/** UI placeholders — replace with API/WebSocket data later */
const PLACEHOLDER_QUEUE: QueueItem[] = [
  {
    id: "q1",
    status: "QUEUED",
    score: 12,
    userVote: 1,
    track: {
      id: "t1",
      title: "Midnight City",
      artist: "M83",
      durationSec: 244,
    },
  },
  {
    id: "q2",
    status: "QUEUED",
    score: 12,
    userVote: null,
    track: {
      id: "t2",
      title: "After Dark",
      artist: "Mr.Kitty",
      durationSec: 259,
    },
  },
  {
    id: "q3",
    status: "QUEUED",
    score: 3,
    userVote: -1,
    track: {
      id: "t3",
      title: "Borderline",
      artist: "Tame Impala",
      durationSec: 238,
    },
  },
  {
    id: "q4",
    status: "QUEUED",
    score: 5,
    userVote: null,
    track: {
      id: "t4",
      title: "Instant Crush",
      artist: "Daft Punk",
      durationSec: 337,
    },
  },
  {
    id: "q5",
    status: "QUEUED",
    score: 2,
    userVote: null,
    track: {
      id: "t5",
      title: "The Less I Know The Better",
      artist: "Tame Impala",
      durationSec: 216,
    },
  },
  {
    id: "q6",
    status: "QUEUED",
    score: 1,
    userVote: null,
    track: {
      id: "t6",
      title: "Nightcall",
      artist: "Kavinsky",
      durationSec: 255,
    },
  },
  {
    id: "q7",
    status: "QUEUED",
    score: 0,
    userVote: null,
    track: {
      id: "t7",
      title: "Sunset",
      artist: "The Weeknd",
      durationSec: 262,
    },
  },
];

const PLACEHOLDER_LIBRARY: LibraryTrack[] = [
  {
    id: "lib1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    durationSec: 200,
    artworkUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=160&h=160&fit=crop",
  },
  {
    id: "lib2",
    title: "Electric Feel",
    artist: "MGMT",
    durationSec: 229,
    artworkUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=160&h=160&fit=crop",
  },
  {
    id: "lib3",
    title: "Redbone",
    artist: "Childish Gambino",
    durationSec: 326,
    artworkUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=160&h=160&fit=crop",
  },
  {
    id: "lib4",
    title: "Do I Wanna Know?",
    artist: "Arctic Monkeys",
    durationSec: 272,
    artworkUrl:
      "https://images.unsplash.com/photo-1459749411175-0471761750d6?w=160&h=160&fit=crop",
  },
  {
    id: "lib5",
    title: "Levitating",
    artist: "Dua Lipa",
    durationSec: 203,
    artworkUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=160&h=160&fit=crop",
  },
  {
    id: "lib6",
    title: "Sunset Lover",
    artist: "Petit Biscuit",
    durationSec: 238,
    artworkUrl:
      "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=160&h=160&fit=crop",
  },
];

export default async function SpacePage({
  params,
  searchParams,
}: SpacePageProps) {
  const { spaceId } = await params;
  const { role } = await searchParams;

  // Wire real auth/membership using spaceId when connecting the backend.
  // Temporary UI toggle: /space/[id]?role=owner | ?role=member
  void spaceId;
  const isOwner = role === "owner";

  return (
    <SpaceDemoRoom
      spaceName="Friday Night"
      isOwner={isOwner}
      isOwnerOnline
      ownerName="Host"
      initialQueue={PLACEHOLDER_QUEUE}
      libraryTracks={PLACEHOLDER_LIBRARY}
      track={null}
    />
  );
}

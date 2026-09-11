import { SpaceRoom } from "@/features/space/SpaceRoom";

interface SpacePageProps {
  params: Promise<{ spaceId: string }>;
  searchParams: Promise<{ role?: string }>;
}

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

  // Pass tracks from your storage API into libraryTracks
  return (
    <SpaceRoom
      spaceName="Friday Night"
      members={[]}
      isOwner={isOwner}
      isOwnerOnline
      ownerName="Host"
      spaceStatus="ACTIVE"
      track={null}
      queue={[]}
      libraryTracks={[]}
    />
  );
}

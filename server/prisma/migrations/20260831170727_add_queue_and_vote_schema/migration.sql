-- CreateEnum
CREATE TYPE "QueueItemStatus" AS ENUM ('QUEUED', 'PLAYING', 'PLAYED', 'SKIPPED');

-- CreateTable
CREATE TABLE "QueueItem" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "status" "QueueItemStatus" NOT NULL DEFAULT 'QUEUED',
    "score" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QueueItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueItemVote" (
    "id" TEXT NOT NULL,
    "queueItemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QueueItemVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QueueItem_spaceId_status_idx" ON "QueueItem"("spaceId", "status");

-- CreateIndex
CREATE INDEX "QueueItem_trackId_idx" ON "QueueItem"("trackId");

-- CreateIndex
CREATE INDEX "QueueItemVote_userId_idx" ON "QueueItemVote"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "QueueItemVote_queueItemId_userId_key" ON "QueueItemVote"("queueItemId", "userId");

-- AddForeignKey
ALTER TABLE "QueueItem" ADD CONSTRAINT "QueueItem_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueItem" ADD CONSTRAINT "QueueItem_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueItemVote" ADD CONSTRAINT "QueueItemVote_queueItemId_fkey" FOREIGN KEY ("queueItemId") REFERENCES "QueueItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueItemVote" ADD CONSTRAINT "QueueItemVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

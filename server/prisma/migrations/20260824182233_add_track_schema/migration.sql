-- CreateEnum
CREATE TYPE "TrackSource" AS ENUM ('YOUTUBE', 'CUSTOM');

-- CreateTable
CREATE TABLE "Track" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT,
    "durationSec" INTEGER NOT NULL,
    "source" "TrackSource" NOT NULL,
    "sourceId" TEXT,
    "storageKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Track_source_idx" ON "Track"("source");

-- CreateIndex
CREATE UNIQUE INDEX "Track_source_sourceId_key" ON "Track"("source", "sourceId");

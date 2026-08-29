/*
  Warnings:

  - A unique constraint covering the columns `[storageKey]` on the table `Track` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "CustomTrackUpload" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT,
    "storageKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomTrackUpload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomTrackUpload_storageKey_key" ON "CustomTrackUpload"("storageKey");

-- CreateIndex
CREATE UNIQUE INDEX "Track_storageKey_key" ON "Track"("storageKey");

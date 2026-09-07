CREATE UNIQUE INDEX "QueueItem_active_space_track_unique"
ON "QueueItem" ("spaceId", "trackId")
WHERE "status" IN ('QUEUED', 'PLAYING');
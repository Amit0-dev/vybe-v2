CREATE UNIQUE INDEX "QueueItem_one_playing_per_space"
ON "QueueItem" ("spaceId")
WHERE "status" = 'PLAYING';
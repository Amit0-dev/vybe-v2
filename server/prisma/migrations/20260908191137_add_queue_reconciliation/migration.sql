-- CreateTable
CREATE TABLE "QueueReconciliation" (
    "spaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QueueReconciliation_pkey" PRIMARY KEY ("spaceId")
);

-- AddForeignKey
ALTER TABLE "QueueReconciliation" ADD CONSTRAINT "QueueReconciliation_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

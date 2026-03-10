-- CreateTable
CREATE TABLE "online_matches" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "playerXId" TEXT NOT NULL,
    "playerOId" TEXT NOT NULL,
    "winnerId" TEXT,
    "status" TEXT NOT NULL,
    "finalState" JSONB NOT NULL,
    "finishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "online_matches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "online_matches_gameId_key" ON "online_matches"("gameId");

-- AddForeignKey
ALTER TABLE "online_matches" ADD CONSTRAINT "online_matches_playerXId_fkey" FOREIGN KEY ("playerXId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_matches" ADD CONSTRAINT "online_matches_playerOId_fkey" FOREIGN KEY ("playerOId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "online_matches" ADD CONSTRAINT "online_matches_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

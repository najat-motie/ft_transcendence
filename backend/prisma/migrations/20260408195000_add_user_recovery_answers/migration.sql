-- CreateTable
CREATE TABLE "user_recovery_answers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "answerHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_recovery_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_recovery_answers_userId_key" ON "user_recovery_answers"("userId");

-- AddForeignKey
ALTER TABLE "user_recovery_answers" ADD CONSTRAINT "user_recovery_answers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

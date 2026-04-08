require('dotenv').config();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['error'],
});

const normalizeSecretAnswer = (answer) => String(answer || '')
  .trim()
  .toLowerCase()
  .replace(/\s+/g, ' ');

const shutdown = async (code = 0) => {
  await prisma.$disconnect().catch(() => {});
  process.exit(code);
};

process.on('message', async (payload) => {
  try {
    const userId = payload?.userId;
    const normalizedAnswer = normalizeSecretAnswer(payload?.secretAnswer);

    if (!userId || !normalizedAnswer) {
      await shutdown(0);
      return;
    }

    const existingRecord = await prisma.userRecoveryAnswer.findUnique({
      where: { userId },
    });

    if (!existingRecord) {
      const answerHash = await bcrypt.hash(normalizedAnswer, 10);
      await prisma.userRecoveryAnswer.create({
        data: {
          userId,
          answerHash,
        },
      });
    }

    await shutdown(0);
  } catch (error) {
    console.error('Recovery-answer worker failed:', error);
    await shutdown(1);
  }
});

process.on('disconnect', () => {
  shutdown(0);
});

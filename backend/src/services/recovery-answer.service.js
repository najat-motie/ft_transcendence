const bcrypt = require('bcrypt');
const path = require('path');
const { fork } = require('child_process');
const prisma = require('../config/database');

const SECRET_RECOVERY_PROMPT = 'What is your favorite book?';

const normalizeSecretAnswer = (answer) => String(answer || '')
  .trim()
  .toLowerCase()
  .replace(/\s+/g, ' ');

const ensureSecretAnswerRecord = async ({ userId, secretAnswer, client = prisma }) => {
  const normalizedAnswer = normalizeSecretAnswer(secretAnswer);

  if (!userId || !normalizedAnswer) {
    return null;
  }

  const existingRecord = await client.userRecoveryAnswer.findUnique({
    where: { userId },
  });

  if (existingRecord) {
    return existingRecord;
  }

  const answerHash = await bcrypt.hash(normalizedAnswer, 10);

  return client.userRecoveryAnswer.create({
    data: {
      userId,
      answerHash,
    },
  });
};

const verifySecretAnswer = async (secretAnswer, answerHash) => {
  const normalizedAnswer = normalizeSecretAnswer(secretAnswer);

  if (!normalizedAnswer || !answerHash) {
    return false;
  }

  return bcrypt.compare(normalizedAnswer, answerHash);
};

const spawnSecretAnswerSyncProcess = ({ userId, secretAnswer }) => {
  const normalizedAnswer = normalizeSecretAnswer(secretAnswer);

  if (!userId || !normalizedAnswer) {
    return null;
  }

  const workerPath = path.join(__dirname, '..', 'workers', 'recovery-answer.worker.js');
  const worker = fork(workerPath, [], {
    stdio: ['ignore', 'ignore', 'ignore', 'ipc'],
  });

  worker.on('error', (error) => {
    console.error('Failed to spawn recovery-answer worker:', error);
  });

  worker.send({ userId, secretAnswer: normalizedAnswer }, (error) => {
    if (error) {
      console.error('Failed to send recovery-answer payload to worker:', error);
    }
  });

  worker.unref();
  return worker;
};

module.exports = {
  SECRET_RECOVERY_PROMPT,
  ensureSecretAnswerRecord,
  normalizeSecretAnswer,
  spawnSecretAnswerSyncProcess,
  verifySecretAnswer,
};

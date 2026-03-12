const axios = require('axios');
const https = require('https');
const axiosClient = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
  headers: {
    'x-api-key': process.env.SERVICE_API_KEY || 'super_secret_internal_key'
  }
});
const { randomUUID } = require('crypto');

const GAME_SERVICE_URL = process.env.GAME_SERVICE_URL || 'https://localhost:8443';
const activeAiGames = new Map();

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const gameServiceError = (error, fallbackMessage) => {
  return (
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage
  );
};

const withSessionLock = async (session, callback) => {
  const previousLock = session.lock;
  let release;

  session.lock = new Promise((resolve) => {
    release = resolve;
  });

  await previousLock;

  try {
    return await callback();
  } finally {
    release();
  }
};

const createSession = async () => {
  const gameId = randomUUID();
  const playerId = randomUUID();

  try {
    await axiosClient.post(`${GAME_SERVICE_URL}/ai`, {
      game_id: gameId,
      player_id: playerId,
    });
  } catch (error) {
    throw createHttpError(502, gameServiceError(error, 'Failed to create AI game'));
  }

  const session = {
    gameId,
    playerId,
    wsPath: `/ws/ai/${gameId}`,
    playerChoice: 'X',
    aiChoice: 'O',
    socket: null,
    finished: false,
    closing: false,
    lock: Promise.resolve(),
  };

  activeAiGames.set(gameId, session);

  return {
    success: true,
    game_id: gameId,
    ws_path: session.wsPath,
    player_id: playerId,
    player_choice: session.playerChoice,
    ai_choice: session.aiChoice,
  };
};

const getSession = (gameId) => {
  return activeAiGames.get(gameId) || null;
};

const fetchState = async (gameId) => {
  const { data } = await axiosClient.get(`${GAME_SERVICE_URL}/ai/${gameId}/state`);
  return data;
};

const submitMove = async (gameId, payload) => {
  const { data } = await axiosClient.post(`${GAME_SERVICE_URL}/ai/${gameId}/move`, payload);
  return data;
};

const destroySession = async (gameId) => {
  try {
    await axiosClient.delete(`${GAME_SERVICE_URL}/ai/${gameId}`);
  } catch (error) {
    if (error?.response?.status !== 404) {
      throw error;
    }
  }
};

const releaseSession = async (gameId) => {
  const session = activeAiGames.get(gameId);

  if (!session) {
    return;
  }

  activeAiGames.delete(gameId);
  await destroySession(gameId);
};

module.exports = {
  createSession,
  fetchState,
  gameServiceError,
  getSession,
  releaseSession,
  submitMove,
  withSessionLock,
};

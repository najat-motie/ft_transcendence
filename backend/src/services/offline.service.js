const axios = require('axios');
const { randomUUID } = require('crypto');

const GAME_SERVICE_URL = process.env.GAME_SERVICE_URL || 'http://localhost:8000';
const activeOfflineGames = new Map();

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
    await axios.post(`${GAME_SERVICE_URL}/offline`, {
      game_id: gameId,
      player_id: playerId,
      player_choice: 'X',
      starting_player: 'X',
    });
  } catch (error) {
    throw createHttpError(502, gameServiceError(error, 'Failed to create offline game'));
  }

  const session = {
    gameId,
    playerId,
    wsPath: `/ws/offline/${gameId}`,
    playerChoice: 'X',
    startingPlayer: 'X',
    socket: null,
    finished: false,
    closing: false,
    lock: Promise.resolve(),
  };

  activeOfflineGames.set(gameId, session);

  return {
    success: true,
    game_id: gameId,
    ws_path: session.wsPath,
    player_id: playerId,
    player_choice: session.playerChoice,
    starting_player: session.startingPlayer,
  };
};

const getSession = (gameId) => {
  return activeOfflineGames.get(gameId) || null;
};

const fetchState = async (gameId) => {
  const { data } = await axios.get(`${GAME_SERVICE_URL}/offline/${gameId}/state`);
  return data;
};

const submitMove = async (gameId, payload) => {
  const { data } = await axios.post(`${GAME_SERVICE_URL}/offline/${gameId}/move`, payload);
  return data;
};

const destroySession = async (gameId) => {
  try {
    await axios.delete(`${GAME_SERVICE_URL}/offline/${gameId}`);
  } catch (error) {
    if (error?.response?.status !== 404) {
      throw error;
    }
  }
};

const releaseSession = async (gameId) => {
  const session = activeOfflineGames.get(gameId);

  if (!session) {
    return;
  }

  activeOfflineGames.delete(gameId);
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

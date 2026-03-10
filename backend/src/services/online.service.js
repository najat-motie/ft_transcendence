const axios = require('axios');
const { randomUUID } = require('crypto');
const matchService = require('./match.service');

const GAME_SERVICE_URL = process.env.GAME_SERVICE_URL || 'http://localhost:8000';

const matchmakingQueue = [];
const queuedPlayers = new Set();
const activePlayers = new Set();
const activeGames = new Map();

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const createDeferred = () => {
  let resolve;
  let reject;

  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

const gameServiceError = (error, fallbackMessage) => {
  return (
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage
  );
};

const buildPlayersPayload = (room) => {
  return room.players.map((player) => ({
    id: player.id,
    username: player.username,
    avatar: player.avatar,
    role: room.roles[player.id],
  }));
};

const buildMatchPayload = (room, playerId) => {
  return {
    success: true,
    game_id: room.gameId,
    ws_path: room.wsPath,
    role: room.roles[playerId],
    players: buildPlayersPayload(room),
  };
};

const withRoomLock = async (room, callback) => {
  const previousLock = room.lock;
  let release;

  room.lock = new Promise((resolve) => {
    release = resolve;
  });

  await previousLock;

  try {
    return await callback();
  } finally {
    release();
  }
};

const initializeGameRoom = async (playerX, playerO) => {
  const gameId = randomUUID();

  const { data } = await axios.post(`${GAME_SERVICE_URL}/online`, {
    game_id: gameId,
    player_x: playerX.id,
    player_o: playerO.id,
  });

  const room = {
    gameId,
    playerXId: playerX.id,
    playerOId: playerO.id,
    wsPath: data?.ws_path || `/ws/online/${gameId}`,
    players: [playerX, playerO],
    roles: {
      [playerX.id]: 'X',
      [playerO.id]: 'O',
    },
    sockets: new Map(),
    started: false,
    finished: false,
    persisted: false,
    closing: false,
    turn: 'X',
    finalState: null,
    lock: Promise.resolve(),
  };

  activeGames.set(gameId, room);
  activePlayers.add(playerX.id);
  activePlayers.add(playerO.id);

  return room;
};

const pairQueuedPlayers = async () => {
  while (matchmakingQueue.length >= 2) {
    const playerXEntry = matchmakingQueue.shift();
    const playerOEntry = matchmakingQueue.shift();

    queuedPlayers.delete(playerXEntry.player.id);
    queuedPlayers.delete(playerOEntry.player.id);

    try {
      const room = await initializeGameRoom(playerXEntry.player, playerOEntry.player);
      playerXEntry.deferred.resolve(buildMatchPayload(room, playerXEntry.player.id));
      playerOEntry.deferred.resolve(buildMatchPayload(room, playerOEntry.player.id));
    } catch (error) {
      const matchError = createHttpError(
        502,
        gameServiceError(error, 'Failed to create online game')
      );
      playerXEntry.deferred.reject(matchError);
      playerOEntry.deferred.reject(matchError);
    }
  }
};

const enqueuePlayer = (player) => {
  if (queuedPlayers.has(player.id)) {
    throw createHttpError(409, 'Player is already waiting in the matchmaking queue');
  }

  if (activePlayers.has(player.id)) {
    throw createHttpError(409, 'Player is already in an active online game');
  }

  const deferred = createDeferred();
  const queueEntry = { player, deferred };

  matchmakingQueue.push(queueEntry);
  queuedPlayers.add(player.id);

  pairQueuedPlayers().catch((error) => {
    queueEntry.deferred.reject(
      createHttpError(500, error.message || 'Matchmaking failed unexpectedly')
    );
  });

  return {
    promise: deferred.promise,
    cancel: () => cancelQueuedPlayer(player.id),
  };
};

const cancelQueuedPlayer = (playerId) => {
  const queueIndex = matchmakingQueue.findIndex((entry) => entry.player.id === playerId);

  if (queueIndex === -1) {
    return false;
  }

  const [queueEntry] = matchmakingQueue.splice(queueIndex, 1);
  queuedPlayers.delete(playerId);

  queueEntry.deferred.reject(createHttpError(499, 'Matchmaking request cancelled'));
  return true;
};

const getRoom = (gameId) => {
  return activeGames.get(gameId) || null;
};

const getPlayersPayload = (room) => {
  return buildPlayersPayload(room);
};

const getTurnForPlayer = (room, playerId) => {
  return room.roles[playerId];
};

const fetchGameState = async (gameId) => {
  const { data } = await axios.get(`${GAME_SERVICE_URL}/online/${gameId}/state`);
  return data;
};

const submitMove = async (gameId, payload) => {
  const { data } = await axios.post(`${GAME_SERVICE_URL}/online/${gameId}/move`, payload);
  return data;
};

const destroyGame = async (gameId) => {
  try {
    await axios.delete(`${GAME_SERVICE_URL}/online/${gameId}`);
  } catch (error) {
    if (error?.response?.status !== 404) {
      throw error;
    }
  }
};

const releaseRoom = async (gameId) => {
  const room = activeGames.get(gameId);

  if (!room) {
    return;
  }

  activeGames.delete(gameId);
  room.players.forEach((player) => activePlayers.delete(player.id));
  await destroyGame(gameId);
};

const persistFinishedRoom = async (room, finalState) => {
  if (!room || room.persisted) {
    return { persisted: false };
  }

  if (!finalState || !['win', 'tie'].includes(finalState.game_status)) {
    return { persisted: false };
  }

  const result = await matchService.persistCompletedOnlineMatch({
    gameId: room.gameId,
    playerXId: room.playerXId,
    playerOId: room.playerOId,
    finalState,
  });

  room.persisted = true;
  room.finalState = finalState;

  return result;
};

module.exports = {
  enqueuePlayer,
  fetchGameState,
  gameServiceError,
  persistFinishedRoom,
  getPlayersPayload,
  getRoom,
  getTurnForPlayer,
  releaseRoom,
  submitMove,
  withRoomLock,
};

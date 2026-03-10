const onlineService = require('../services/online.service');
const { buildPlayerSummary } = require('../services/player.service');

const ROOM_CODE_REGEX = /^[A-Z0-9]{6}$/;

const normalizeRoomCode = (value) => {
  if (typeof value !== 'string') {
    const error = new Error('room_code is required');
    error.status = 400;
    throw error;
  }

  const normalized = value.trim().toUpperCase();

  if (!ROOM_CODE_REGEX.test(normalized)) {
    const error = new Error('Room code must be 6 uppercase letters or numbers');
    error.status = 400;
    throw error;
  }

  return normalized;
};

const createRoom = async (req, res, next) => {
  try {
    const player = await buildPlayerSummary(req.user.userId);
    const room = await onlineService.createPrivateRoom(player);
    return res.status(200).json(room);
  } catch (error) {
    return next(error);
  }
};

const joinRoom = async (req, res, next) => {
  try {
    const player = await buildPlayerSummary(req.user.userId);
    const roomCode = normalizeRoomCode(req.body.room_code);
    const match = await onlineService.joinPrivateRoom(player, roomCode);
    return res.status(200).json(match);
  } catch (error) {
    return next(error);
  }
};

const getRoomStatus = async (req, res, next) => {
  try {
    const roomCode = normalizeRoomCode(req.params.roomCode);
    const roomStatus = onlineService.getPrivateRoomStatus(roomCode, req.user.userId);
    return res.status(200).json(roomStatus);
  } catch (error) {
    return next(error);
  }
};

const deleteRoom = async (req, res, next) => {
  try {
    const roomCode = normalizeRoomCode(req.params.roomCode);
    onlineService.cancelPrivateRoom(roomCode, req.user.userId);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createRoom,
  deleteRoom,
  getRoomStatus,
  joinRoom,
};

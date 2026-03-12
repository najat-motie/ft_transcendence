const express = require('express');
const privateRoomController = require('../controllers/private-room.controller');
const { verifyAccessToken } = require('../middleware/auth');

const router = express.Router();

router.post('/room/create', verifyAccessToken, privateRoomController.createRoom);
router.post('/room/join', verifyAccessToken, privateRoomController.joinRoom);
router.get('/room/:roomCode', verifyAccessToken, privateRoomController.getRoomStatus);
router.delete('/room/:roomCode', verifyAccessToken, privateRoomController.deleteRoom);

module.exports = router;

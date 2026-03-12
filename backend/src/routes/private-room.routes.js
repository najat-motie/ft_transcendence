const express = require('express');
const rateLimit = require('express-rate-limit');
const privateRoomController = require('../controllers/private-room.controller');
const { verifyAccessToken } = require('../middleware/auth');

const router = express.Router();
const roomStatusLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 1200,
	message: 'Too many room status checks, please try again later.',
	standardHeaders: true,
	legacyHeaders: false,
});

router.post('/room/create', verifyAccessToken, privateRoomController.createRoom);
router.post('/room/join', verifyAccessToken, privateRoomController.joinRoom);
router.get('/room/:roomCode', roomStatusLimiter, verifyAccessToken, privateRoomController.getRoomStatus);
router.delete('/room/:roomCode', verifyAccessToken, privateRoomController.deleteRoom);

module.exports = router;

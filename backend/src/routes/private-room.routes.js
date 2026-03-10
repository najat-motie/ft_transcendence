const express = require('express');
const privateRoomController = require('../controllers/private-room.controller');
const { verifyAccessToken } = require('../middleware/auth');

const router = express.Router();

router.use(verifyAccessToken);

router.post('/room/create', privateRoomController.createRoom);
router.post('/room/join', privateRoomController.joinRoom);
router.get('/room/:roomCode', privateRoomController.getRoomStatus);
router.delete('/room/:roomCode', privateRoomController.deleteRoom);

module.exports = router;

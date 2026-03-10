const express = require('express');
const onlineController = require('../controllers/online.controller');
const { verifyAccessToken } = require('../middleware/auth');

const router = express.Router();

router.post('/ready-online', verifyAccessToken, onlineController.readyOnline);

module.exports = router;

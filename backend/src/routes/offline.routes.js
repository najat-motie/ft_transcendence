const express = require('express');
const rateLimit = require('express-rate-limit');
const offlineController = require('../controllers/offline.controller');

const router = express.Router();
const offlineStartLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 200,
	message: 'Too many restart attempts, please wait a moment.',
	standardHeaders: true,
	legacyHeaders: false,
});

router.post('/offline', offlineStartLimiter, offlineController.startOffline);

module.exports = router;

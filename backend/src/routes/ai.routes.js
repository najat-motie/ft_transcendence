const express = require('express');
const rateLimit = require('express-rate-limit');
const aiSessionController = require('../controllers/ai-session.controller');
const { verifyAccessToken } = require('../middleware/auth');

const router = express.Router();
const aiStartLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 200,
	message: 'Too many restart attempts, please wait a moment.',
	standardHeaders: true,
	legacyHeaders: false,
});

router.post('/', aiStartLimiter, aiSessionController.startAiSession);

module.exports = router;

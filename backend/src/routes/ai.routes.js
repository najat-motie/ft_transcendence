const express = require('express');
const aiSessionController = require('../controllers/ai-session.controller');
const { verifyAccessToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', aiSessionController.startAiSession);

module.exports = router;

const express = require('express');
const aiController = require('../controllers/ai.controller');
const aiSessionController = require('../controllers/ai-session.controller');
const { verifyAccessToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', aiSessionController.startAiSession);

router.use(verifyAccessToken);

router.post('/move', aiController.move);
router.post('/reset', aiController.reset);

module.exports = router;

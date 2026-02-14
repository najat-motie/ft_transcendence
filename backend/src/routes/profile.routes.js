const express = require('express');
const profileController = require('../controllers/profile.controller');
const { verifyAccessToken } = require('../middleware/auth');

const router = express.Router();

router.use(verifyAccessToken);

router.post('/', profileController.createProfile);

router.get('/:userId', profileController.getProfile);

router.put('/', profileController.updateProfile);

router.patch('/status', profileController.updateStatus);

router.post('/stats', profileController.updateStats);

router.get('/leaderboard', profileController.getLeaderboard);

module.exports = router;

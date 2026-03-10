const express = require('express');
const offlineController = require('../controllers/offline.controller');

const router = express.Router();

router.post('/offline', offlineController.startOffline);

module.exports = router;

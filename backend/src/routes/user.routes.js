const express = require('express');
const { verifyAccessToken } = require('../middleware/auth');
const { query, validationResult } = require('express-validator');
const friendshipService = require('../services/friendshipService');
const { formatResponse } = require('../utils/errors');

const router = express.Router();

router.use(verifyAccessToken);

router.get('/search',
  [query('q').isString().trim().notEmpty().withMessage('Query is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatResponse(false, null, errors.array()[0].msg));
    }
    try {
      const currentUserId = req.user.userId;
      const searchQuery = req.query.q;
      const users = await friendshipService.searchAvailableUsers(currentUserId, searchQuery);
      res.json(formatResponse(true, { users }, null));
    } catch (error) {
      res.status(500).json(formatResponse(false, null, error.message));
    }
  }
);

module.exports = router;

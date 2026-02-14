const express = require('express');
const { verifyAccessToken } = require('../middleware/auth');
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getFriends,
  removeFriend,
  checkFriendship,
} = require('../controllers/friend.controller');

const router = express.Router();

router.use(verifyAccessToken);

router.post('/request/:userId', sendFriendRequest);

router.post('/accept/:requestId', acceptFriendRequest);

router.post('/reject/:requestId', rejectFriendRequest);

router.get('/requests', getFriendRequests);

router.get('/', getFriends);

router.get('/check/:userId', checkFriendship);

router.delete('/:userId', removeFriend);

module.exports = router;

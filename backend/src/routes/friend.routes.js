const express = require('express');
const { verifyAccessToken } = require('../middleware/auth');
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
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
router.get('/requests/incoming', getIncomingFriendRequests);
router.get('/requests/outgoing', getOutgoingFriendRequests);

router.get('/', getFriends);

router.get('/check/:userId', checkFriendship);

router.delete('/remove/:userId', removeFriend); // alias for old frontend
router.delete('/:userId', removeFriend);

module.exports = router;

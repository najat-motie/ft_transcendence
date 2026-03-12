const express = require('express');
const { verifyAccessToken } = require('../middleware/auth');
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
} = require('../controllers/friend.controller');

const router = express.Router();

router.use(verifyAccessToken);

router.get('/incoming', getIncomingFriendRequests);
router.get('/outgoing', getOutgoingFriendRequests);
router.post('/send/:userId', sendFriendRequest);
router.post('/accept/:requestId', acceptFriendRequest);
router.post('/reject/:requestId', rejectFriendRequest);
router.post('/cancel/:requestId', cancelFriendRequest);

module.exports = router;

const prisma = require('../config/database');
const { formatAvatarUrl } = require('../utils/avatar');
const { sendServerError, parsePagination } = require('../utils/controller');

const mapProfile = (profile) => ({
  id: profile.user.id,
  username: profile.username,
  avatar: formatAvatarUrl(profile.avatar, profile.user.id),
  status: profile.status,
  email: profile.user.email,
  online: profile.status === 'online',
});

const findFriendRequestById = (requestId) => prisma.friendRequest.findUnique({
  where: { id: requestId },
});

const mapIncomingRequest = (request) => ({
  id: request.id,
  userId: request.sender.id,
  senderId: request.sender.id,
  username: request.sender.profile?.username || request.sender.email,
  avatar: formatAvatarUrl(request.sender.profile?.avatar || null, request.sender.id),
  status: request.status,
  userStatus: request.sender.profile?.status || 'offline',
  createdAt: request.createdAt,
});

const mapOutgoingRequest = (request) => ({
  id: request.id,
  userId: request.receiver.id,
  receiverId: request.receiver.id,
  username: request.receiver.profile?.username || request.receiver.email,
  avatar: formatAvatarUrl(request.receiver.profile?.avatar || null, request.receiver.id),
  status: request.status,
  userStatus: request.receiver.profile?.status || 'offline',
  createdAt: request.createdAt,
});

const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { userId: receiverId } = req.params;
    const { message } = req.body;

    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send friend request to yourself',
      });
    }

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: senderId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: senderId },
        ],
      },
    });

    if (existingFriendship) {
      return res.status(409).json({
        success: false,
        message: 'Already friends with this user',
      });
    }

    const pendingBetween = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId, status: 'pending' },
          { senderId: receiverId, receiverId: senderId, status: 'pending' },
        ],
      },
    });

    if (pendingBetween) {
      const isSender = pendingBetween.senderId === senderId;
      let messageText;
      if (isSender) {
        messageText = 'Friend request already pending';
      } else {
        messageText = 'This user has already sent you a request. Please respond to it.';
      }
      return res.status(409).json({
        success: false,
        message: messageText,
      });
    }

    const friendRequest = await prisma.friendRequest.upsert({
      where: { senderId_receiverId: { senderId, receiverId } },
      create: {
        senderId,
        receiverId,
        message: message || null,
        status: 'pending',
      },
      update: {
        status: 'pending',
        message: message || null,
        updatedAt: new Date(),
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            profile: { select: { username: true, avatar: true, status: true } },
          },
        },
        receiver: {
          select: {
            id: true,
            email: true,
            profile: { select: { username: true, avatar: true, status: true } },
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Friend request sent',
      data: friendRequest,
    });
  } catch (error) {
    console.error('Send friend request error:', error);
    return sendServerError(res, 'Failed to send friend request', error);
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { requestId } = req.params;

    const friendRequest = await findFriendRequestById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found',
      });
    }

    if (friendRequest.receiverId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this request',
      });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Friend request is no longer pending',
      });
    }

    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'accepted' },
    });

    const [user1Id, user2Id] = [friendRequest.senderId, friendRequest.receiverId].sort();

    const friendship = await prisma.friendship.upsert({
      where: { user1Id_user2Id: { user1Id, user2Id } },
      update: {},
      create: { user1Id, user2Id },
      include: {
        user1: { select: { id: true, email: true } },
        user2: { select: { id: true, email: true } },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Friend request accepted',
      data: friendship,
    });
  } catch (error) {
    console.error('Accept friend request error:', error);
    return sendServerError(res, 'Failed to accept friend request', error);
  }
};

const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { requestId } = req.params;

    const friendRequest = await findFriendRequestById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found',
      });
    }

    if (friendRequest.receiverId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this request',
      });
    }

    const updated = await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'rejected' },
    });

    return res.status(200).json({
      success: true,
      message: 'Friend request rejected',
      data: updated,
    });
  } catch (error) {
    console.error('Reject friend request error:', error);
    return sendServerError(res, 'Failed to reject friend request', error);
  }
};

const cancelFriendRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { requestId } = req.params;

    const friendRequest = await findFriendRequestById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found',
      });
    }

    if (friendRequest.senderId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this request',
      });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending requests can be cancelled',
      });
    }

    await prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'cancelled' },
    });

    return res.status(200).json({
      success: true,
      message: 'Friend request cancelled',
    });
  } catch (error) {
    console.error('Cancel friend request error:', error);
    return sendServerError(res, 'Failed to cancel friend request', error);
  }
};

const getIncomingFriendRequests = async (req, res) => {
  try {
    const userId = req.user.userId;

    const requests = await prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: 'pending',
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            profile: { select: { username: true, avatar: true, status: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = requests.map(mapIncomingRequest);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Get incoming friend requests error:', error);
    return sendServerError(res, 'Failed to fetch friend requests', error);
  }
};

const getOutgoingFriendRequests = async (req, res) => {
  try {
    const userId = req.user.userId;

    const requests = await prisma.friendRequest.findMany({
      where: {
        senderId: userId,
        status: 'pending',
      },
      include: {
        receiver: {
          select: {
            id: true,
            email: true,
            profile: { select: { username: true, avatar: true, status: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = requests.map(mapOutgoingRequest);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Get outgoing friend requests error:', error);
    return sendServerError(res, 'Failed to fetch outgoing requests', error);
  }
};

const getFriends = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit, offset } = parsePagination(req.query);
    const effectiveLimit = limit || 50;

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      take: effectiveLimit,
      skip: offset,
    });

    const friendIds = friendships.map((f) => {
      if (f.user1Id === userId) {
        return f.user2Id;
      }
      return f.user1Id;
    });

    if (friendIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        pagination: { limit: effectiveLimit, offset },
      });
    }

    const profiles = await prisma.userProfile.findMany({
      where: { userId: { in: friendIds } },
      include: {
        user: { select: { id: true, email: true, isActive: true } },
      },
    });

    const friends = profiles.map(mapProfile);

    return res.status(200).json({
      success: true,
      data: friends,
      pagination: {
        limit: effectiveLimit,
        offset,
      },
    });
  } catch (error) {
    console.error('Get friends error:', error);
    return sendServerError(res, 'Failed to fetch friends list', error);
  }
};

const removeFriend = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { userId: friendId } = req.params;

    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: currentUserId, user2Id: friendId },
          { user1Id: friendId, user2Id: currentUserId },
        ],
      },
    });

    if (!friendship) {
      return res.status(404).json({
        success: false,
        message: 'Friendship not found',
      });
    }

    await prisma.friendship.delete({
      where: { id: friendship.id },
    });

    return res.status(200).json({
      success: true,
      message: 'Friend removed successfully',
    });
  } catch (error) {
    console.error('Remove friend error:', error);
    return sendServerError(res, 'Failed to remove friend', error);
  }
};

const checkFriendship = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const { userId } = req.params;

    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: currentUserId, user2Id: userId },
          { user1Id: userId, user2Id: currentUserId },
        ],
      },
    });

    if (friendship) {
      return res.status(200).json({
        success: true,
        data: { isFriend: true, status: 'friends' },
      });
    }

    const pendingSent = await prisma.friendRequest.findFirst({
      where: { senderId: currentUserId, receiverId: userId, status: 'pending' },
    });

    if (pendingSent) {
      return res.status(200).json({
        success: true,
        data: { isFriend: false, status: 'pending_sent' },
      });
    }

    const pendingReceived = await prisma.friendRequest.findFirst({
      where: { senderId: userId, receiverId: currentUserId, status: 'pending' },
    });

    if (pendingReceived) {
      return res.status(200).json({
        success: true,
        data: { isFriend: false, status: 'pending_received' },
      });
    }

    return res.status(200).json({
      success: true,
      data: { isFriend: false, status: 'none' },
    });
  } catch (error) {
    console.error('Check friendship error:', error);
    return sendServerError(res, 'Failed to check friendship', error);
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  getIncomingFriendRequests,
  getOutgoingFriendRequests,
  getFriendRequests: getIncomingFriendRequests,
  getFriends,
  removeFriend,
  checkFriendship,
};

const prisma = require('../config/database');

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

    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        senderId,
        receiverId,
        status: 'pending',
      },
    });

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: 'Friend request already pending',
      });
    }

    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId,
        receiverId,
        message: message || null,
      },
      include: {
        sender: {
          select: { id: true, email: true },
        },
        receiver: {
          select: { id: true, email: true },
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
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to send friend request',
      error: errorMessage,
    });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { requestId } = req.params;

    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

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

    const friendship = await prisma.friendship.create({
      data: {
        user1Id,
        user2Id,
      },
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
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to accept friend request',
      error: errorMessage,
    });
  }
};

const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { requestId } = req.params;

    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

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
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to reject friend request',
      error: errorMessage,
    });
  }
};

const getFriendRequests = async (req, res) => {
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

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error('Get friend requests error:', error);
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch friend requests',
      error: errorMessage,
    });
  }
};

const getFriends = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 50, offset = 0 } = req.query;

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    const friendIds = friendships.map((f) => {
      if (f.user1Id === userId) {
        return f.user2Id;
      } else {
        return f.user1Id;
      }
    });

    const friends = await prisma.userProfile.findMany({
      where: { userId: { in: friendIds } },
      include: {
        user: {
          select: { id: true, email: true, isActive: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: friends,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Get friends error:', error);
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch friends list',
      error: errorMessage,
    });
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
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to remove friend',
      error: errorMessage,
    });
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

    return res.status(200).json({
      success: true,
      isFriend: !!friendship,
    });
  } catch (error) {
    console.error('Check friendship error:', error);
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to check friendship',
      error: errorMessage,
    });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getFriends,
  removeFriend,
  checkFriendship,
};

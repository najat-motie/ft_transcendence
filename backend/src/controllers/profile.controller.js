const prisma = require('../config/database');
const { formatAvatarUrl, generateDefaultAvatarUrl } = require('../utils/avatar');
const { saveAvatarIfProvided } = require('../utils/avatar-storage');
const { sendServerError, parsePagination } = require('../utils/controller');

const getProfileKpis = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, email: true, isActive: true, createdAt: true },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const [friendsCount, pendingRequestsReceived, pendingRequestsSent, unreadMessages] = await Promise.all([
      prisma.friendship.count({
        where: {
          OR: [
            { user1Id: userId },
            { user2Id: userId },
          ],
        },
      }),
      prisma.friendRequest.count({
        where: { receiverId: userId, status: 'pending' },
      }),
      prisma.friendRequest.count({
        where: { senderId: userId, status: 'pending' },
      }),
      prisma.message.count({
        where: { receiverId: userId, isRead: false },
      }),
    ]);

    const totalMatches = profile.wins + profile.losses;
    const winRate = totalMatches > 0
      ? Number(((profile.wins / totalMatches) * 100).toFixed(2))
      : 0;

    const accountAgeDays = profile.user?.createdAt
      ? Math.max(
        0,
        Math.floor((Date.now() - new Date(profile.user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      )
      : null;

    const kpis = {
      userId: profile.userId,
      username: profile.username,
      avatar: formatAvatarUrl(profile.avatar, profile.userId),
      bio: profile.bio,
      email: profile.user?.email,
      status: profile.status,
      lastSeen: profile.lastSeen,
      rank: profile.rank,
      level: profile.level,
      experience: profile.experience,
      wins: profile.wins,
      losses: profile.losses,
      totalMatches,
      winRate,
      friendsCount,
      pendingRequestsReceived,
      pendingRequestsSent,
      unreadMessages,
      accountAgeDays,
      isActive: profile.user?.isActive,
      createdAt: profile.user?.createdAt,
      updatedAt: profile.updatedAt,
    };

    return res.status(200).json({
      success: true,
      data: kpis,
    });
  } catch (error) {
    console.error('Get profile KPIs error:', error);
    return sendServerError(res, 'Failed to fetch profile KPIs', error);
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { id: true, email: true, isActive: true, createdAt: true },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...profile,
        avatar: formatAvatarUrl(profile.avatar, profile.userId),
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return sendServerError(res, 'Failed to fetch profile', error);
  }
};

const createProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, bio, avatar } = req.body;

    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: 'Profile already exists for this user',
      });
    }

    const usernameExists = await prisma.userProfile.findUnique({
      where: { username },
    });

    if (usernameExists) {
      return res.status(409).json({
        success: false,
        message: 'Username already taken',
      });
    }

    const storedAvatar = saveAvatarIfProvided(avatar) || generateDefaultAvatarUrl(userId);

    const profile = await prisma.userProfile.create({
      data: {
        userId,
        username,
        bio: bio || null,
        avatar: storedAvatar,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: {
        ...profile,
        avatar: formatAvatarUrl(profile.avatar, profile.userId),
      },
    });
  } catch (error) {
    console.error('Create profile error:', error);
    return sendServerError(res, 'Failed to create profile', error);
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, bio, avatar } = req.body;

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    if (username && username !== profile.username) {
      const usernameExists = await prisma.userProfile.findUnique({
        where: { username },
      });

      if (usernameExists) {
        return res.status(409).json({
          success: false,
          message: 'Username already taken',
        });
      }
    }

    const storedAvatar = saveAvatarIfProvided(avatar);

    const updatedProfile = await prisma.userProfile.update({
      where: { userId },
      data: {
        ...(username && { username }),
        ...(bio && { bio }),
        ...(storedAvatar && { avatar: storedAvatar }),
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        ...updatedProfile,
        avatar: formatAvatarUrl(updatedProfile.avatar, updatedProfile.userId),
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return sendServerError(res, 'Failed to update profile', error);
  }
};

const updateStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status } = req.body;

    const validStatuses = ['online', 'offline', 'in-game'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: online, offline, or in-game',
      });
    }

    const updatedProfile = await prisma.userProfile.update({
      where: { userId },
      data: {
        status,
        lastSeen: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: {
        ...updatedProfile,
        avatar: formatAvatarUrl(updatedProfile.avatar, updatedProfile.userId),
      },
    });
  } catch (error) {
    console.error('Update status error:', error);
    return sendServerError(res, 'Failed to update status', error);
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const { limit, offset } = parsePagination(req.query);
    const effectiveLimit = limit || 10;

    const leaderboard = await prisma.userProfile.findMany({
      orderBy: [
        { rank: 'asc' },
        { level: 'desc' },
        { experience: 'desc' },
      ],
      take: effectiveLimit,
      skip: offset,
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });

    const total = await prisma.userProfile.count();

    const leaderboardWithAvatars = leaderboard.map((entry) => ({
      ...entry,
      avatar: formatAvatarUrl(entry.avatar, entry.userId),
    }));

    return res.status(200).json({
      success: true,
      data: leaderboardWithAvatars,
      pagination: {
        total,
        limit: effectiveLimit,
        offset,
      },
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return sendServerError(res, 'Failed to fetch leaderboard', error);
  }
};

const updateStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { win, experience, level, rank } = req.body;

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    const didWin = Boolean(win);

    const updatedProfile = await prisma.userProfile.update({
      where: { userId },
      data: {
        wins: didWin ? profile.wins + 1 : profile.wins,
        losses: didWin ? profile.losses : profile.losses + 1,
        ...(experience && { experience: profile.experience + experience }),
        ...(level && { level }),
        ...(rank !== undefined && { rank }),
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Stats updated successfully',
      data: {
        ...updatedProfile,
        avatar: formatAvatarUrl(updatedProfile.avatar, updatedProfile.userId),
      },
    });
  } catch (error) {
    console.error('Update stats error:', error);
    return sendServerError(res, 'Failed to update stats', error);
  }
};

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
  updateStatus,
  getLeaderboard,
  updateStats,
  getProfileKpis,
};

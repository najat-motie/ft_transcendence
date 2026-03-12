const fs = require('fs');
const path = require('path');
const prisma = require('../config/database');

const ASSET_BASE_URL = process.env.ASSET_BASE_URL || process.env.API_BASE_URL || 'https://localhost';
const AVATAR_DIR = path.join(__dirname, '..', '..', 'uploads', 'avatars');

const formatAvatarUrl = (avatarPath) => {
  if (!avatarPath) return null;
  if (/^https?:\/\//i.test(avatarPath)) return avatarPath;
  return `${ASSET_BASE_URL}${avatarPath}`;
};

const ensureAvatarDir = () => {
  if (!fs.existsSync(AVATAR_DIR)) {
    fs.mkdirSync(AVATAR_DIR, { recursive: true });
  }
};

const saveAvatarIfProvided = (avatarPayload) => {
  if (!avatarPayload) return null;

  const match = avatarPayload.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    return avatarPayload;
  }

  const mime = match[1];
  const base64Data = match[2];
  const extension = mime.split('/')[1] || 'png';
  const filename = `avatar-${Date.now()}-${Math.round(Math.random() * 1e6)}.${extension}`;

  ensureAvatarDir();
  const filePath = path.join(AVATAR_DIR, filename);
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filePath, buffer);

  return `/uploads/avatars/${filename}`;
};

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
    let winRate;
    if (totalMatches > 0) {
      winRate = Number(((profile.wins / totalMatches) * 100).toFixed(2));
    } else {
      winRate = 0;
    }

    let accountAgeDays;
    if (profile.user?.createdAt) {
      accountAgeDays = Math.max(
        0,
        Math.floor((Date.now() - new Date(profile.user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      );
    } else {
      accountAgeDays = null;
    }

    const kpis = {
      userId: profile.userId,
      username: profile.username,
      avatar: formatAvatarUrl(profile.avatar),
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
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile KPIs',
      error: errorMessage,
    });
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
        avatar: formatAvatarUrl(profile.avatar),
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: errorMessage,
    });
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

    const storedAvatar = saveAvatarIfProvided(avatar);

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
        avatar: formatAvatarUrl(profile.avatar),
      },
    });
  } catch (error) {
    console.error('Create profile error:', error);
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to create profile',
      error: errorMessage,
    });
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
        avatar: formatAvatarUrl(updatedProfile.avatar),
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: errorMessage,
    });
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
        avatar: formatAvatarUrl(updatedProfile.avatar),
      },
    });
  } catch (error) {
    console.error('Update status error:', error);
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: errorMessage,
    });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const leaderboard = await prisma.userProfile.findMany({
      orderBy: [
        { rank: 'asc' },
        { level: 'desc' },
        { experience: 'desc' },
      ],
      take: parseInt(limit),
      skip: parseInt(offset),
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });

    const total = await prisma.userProfile.count();

    const leaderboardWithAvatars = leaderboard.map((entry) => ({
      ...entry,
      avatar: formatAvatarUrl(entry.avatar),
    }));

    return res.status(200).json({
      success: true,
      data: leaderboardWithAvatars,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: errorMessage,
    });
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

    const updatedProfile = await prisma.userProfile.update({
      where: { userId },
      data: {
        wins: (() => {
          if (win) {
            return profile.wins + 1;
          } else {
            return profile.wins;
          }
        })(),
        losses: (() => {
          if (!win) {
            return profile.losses + 1;
          } else {
            return profile.losses;
          }
        })(),
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
        avatar: formatAvatarUrl(updatedProfile.avatar),
      },
    });
  } catch (error) {
    console.error('Update stats error:', error);
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to update stats',
      error: errorMessage,
    });
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

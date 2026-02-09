const prisma = require('../config/database');

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
      data: profile,
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

    const profile = await prisma.userProfile.create({
      data: {
        userId,
        username,
        bio: bio || null,
        avatar: avatar || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: profile,
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

    const updatedProfile = await prisma.userProfile.update({
      where: { userId },
      data: {
        ...(username && { username }),
        ...(bio && { bio }),
        ...(avatar && { avatar }),
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile,
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
      data: updatedProfile,
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

    return res.status(200).json({
      success: true,
      data: leaderboard,
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
      data: updatedProfile,
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
};

const prisma = require('../config/database');

const buildPlayerSummary = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      profile: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  return {
    id: user.id,
    username: user.profile?.username || user.email || `Player-${user.id.slice(0, 8)}`,
    avatar: user.profile?.avatar || null,
  };
};

module.exports = {
  buildPlayerSummary,
};

const prisma = require('../config/database');
const { formatAvatarUrl } = require('../utils/avatar');

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
    avatar: formatAvatarUrl(user.profile?.avatar || null, user.id),
  };
};

module.exports = {
  buildPlayerSummary,
};

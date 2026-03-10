const prisma = require('../config/database');
const onlineService = require('../services/online.service');

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

const readyOnline = async (req, res, next) => {
  let waitingMatch = null;
  let requestClosed = false;

  try {
    const player = await buildPlayerSummary(req.user.userId);
    waitingMatch = onlineService.enqueuePlayer(player);

    const onClose = () => {
      requestClosed = true;
      waitingMatch.cancel();
    };

    req.on('close', onClose);

    try {
      const match = await waitingMatch.promise;

      if (!res.headersSent) {
        return res.status(200).json(match);
      }
    } finally {
      req.off('close', onClose);
    }
  } catch (error) {
    if (requestClosed || res.headersSent) {
      return;
    }

    return next(error);
  }
};

module.exports = {
  readyOnline,
};

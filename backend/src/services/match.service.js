const prisma = require('../config/database');

const resolveWinnerId = ({ playerXId, playerOId, finalState }) => {
  if (finalState?.game_status !== 'win') {
    return null;
  }

  if (finalState.winner === 'X') {
    return playerXId;
  }

  if (finalState.winner === 'O') {
    return playerOId;
  }

  return null;
};

const persistCompletedOnlineMatch = async ({ gameId, playerXId, playerOId, finalState }) => {
  if (!finalState || !['win', 'tie'].includes(finalState.game_status)) {
    throw new Error('Only finished online matches can be persisted');
  }

  return prisma.$transaction(async (tx) => {
    const existingMatch = await tx.onlineMatch.findUnique({
      where: { gameId },
    });

    if (existingMatch) {
      return {
        persisted: false,
        match: existingMatch,
      };
    }

    const winnerId = resolveWinnerId({ playerXId, playerOId, finalState });
    const loserId =
      winnerId === playerXId ? playerOId : winnerId === playerOId ? playerXId : null;

    const match = await tx.onlineMatch.create({
      data: {
        gameId,
        playerXId,
        playerOId,
        winnerId,
        status: finalState.game_status,
        finalState,
      },
    });

    if (winnerId && loserId) {
      const winnerProfile = await tx.userProfile.findUnique({
        where: { userId: winnerId },
        select: { userId: true },
      });
      const loserProfile = await tx.userProfile.findUnique({
        where: { userId: loserId },
        select: { userId: true },
      });

      if (winnerProfile) {
        await tx.userProfile.update({
          where: { userId: winnerId },
          data: {
            wins: {
              increment: 1,
            },
          },
        });
      }

      if (loserProfile) {
        await tx.userProfile.update({
          where: { userId: loserId },
          data: {
            losses: {
              increment: 1,
            },
          },
        });
      }
    }

    return {
      persisted: true,
      match,
    };
  });
};

module.exports = {
  persistCompletedOnlineMatch,
};

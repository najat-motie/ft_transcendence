const onlineService = require('../services/online.service');
const { buildPlayerSummary } = require('../services/player.service');

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

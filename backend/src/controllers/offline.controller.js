const offlineService = require('../services/offline.service');

const startOffline = async (req, res, next) => {
  try {
    const session = await offlineService.createSession();
    return res.status(200).json(session);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  startOffline,
};

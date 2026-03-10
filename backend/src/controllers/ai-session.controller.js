const aiSessionService = require('../services/ai-session.service');

const startAiSession = async (req, res, next) => {
  try {
    const session = await aiSessionService.createSession();
    return res.status(200).json(session);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  startAiSession,
};

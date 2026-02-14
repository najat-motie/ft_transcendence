const jwt = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const token = authHeader.slice(7);

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token expired',
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

const verifyRefreshToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided',
      });
    }

    const token = authHeader.slice(7);

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    req.user = decoded;
    req.refreshToken = token;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired',
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Invalid refresh token',
    });
  }
};

module.exports = {
  verifyAccessToken,
  verifyRefreshToken,
};

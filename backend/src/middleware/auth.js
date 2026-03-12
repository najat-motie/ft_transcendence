const jwt = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else if (req.cookies) {
      if (req.cookies.jwt_access) {
        token = req.cookies.jwt_access;
      } else if (req.cookies.accessToken) {
        token = req.cookies.accessToken;
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token expired',
        error: 'TOKEN_EXPIRED'
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
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else if (req.cookies) {
      if (req.cookies.jwt_refresh) {
        token = req.cookies.jwt_refresh;
      } else if (req.cookies.refreshToken) {
        token = req.cookies.refreshToken;
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    req.user = decoded;
    req.refreshToken = token;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired',
        error: 'TOKEN_EXPIRED'
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

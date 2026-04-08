const bcrypt = require('bcrypt');
const crypto = require('crypto');
const prisma = require('../config/database');
const tokenService = require('../services/token.service');
const oauthService = require('../services/oauth.service');
const { formatAvatarUrl, generateDefaultAvatarUrl } = require('../utils/avatar');
const { saveAvatarIfProvided } = require('../utils/avatar-storage');
const { sendServerError, getDevelopmentError } = require('../utils/controller');

function isHttpsRequest(req) {
  return req.secure || req.headers['x-forwarded-proto'] === 'https';
}

function getRequestOrigin(req) {
  const forwardedProto = req.headers['x-forwarded-proto'];
  const protocol = forwardedProto ? forwardedProto.split(',')[0].trim() : (req.secure ? 'https' : 'http');
  const host = req.headers['x-forwarded-host'] || req.headers.host;

  if (!host) {
    return null;
  }

  return `${protocol}://${host}`;
}

async function generateUniqueUsername(tx, desiredUsername, email) {
  let seedUsername;
  if (desiredUsername) {
    seedUsername = desiredUsername;
  } else if (email) {
    seedUsername = email.split('@')[0];
  } else {
    seedUsername = 'player';
  }

  const base = seedUsername
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 20) || 'player';

  let candidate = base;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const existing = await tx.userProfile.findUnique({ where: { username: candidate } });
    if (!existing) return candidate;
    candidate = `${base}${crypto.randomInt(100, 9999)}`;
  }
  return `${base}-${crypto.randomBytes(3).toString('hex')}`;
}

const register = async (req, res) => {
  try {
    const { email, password, username, avatar } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      const generatedUsername = await generateUniqueUsername(tx, username, email);
      const avatarPath = saveAvatarIfProvided(avatar) || generateDefaultAvatarUrl(user.id);

      const profile = await tx.userProfile.create({
        data: {
          userId: user.id,
          username: generatedUsername,
          avatar: avatarPath,
        },
      });

      return { user, profile };
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId: result.user.id,
        email: result.user.email,
        username: result.profile.username,
        avatar: formatAvatarUrl(result.profile.avatar, result.user.id),
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return sendServerError(res, 'Registration failed', error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'This account uses OAuth authentication. Please login with your OAuth provider.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const accessToken = tokenService.generateAccessToken(user.id);
    const refreshToken = await tokenService.generateRefreshToken(user.id);

    await prisma.userProfile.updateMany({
      where: { userId: user.id },
      data: { status: 'online', lastSeen: new Date() },
    });

    const cookieOptions = {
      httpOnly: true,
      secure: isHttpsRequest(req),
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    };

    res.cookie('jwt_access', accessToken, cookieOptions);
    res.cookie('jwt_refresh', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user: {
          userId: user.id,
          email: user.email,
          username: user.profile?.username || null,
          avatar: formatAvatarUrl(user.profile?.avatar || null, user.id),
          bio: user.profile?.bio || null,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return sendServerError(res, 'Login failed', error);
  }
};

const logout = async (req, res) => {
  try {
    const token = req.refreshToken;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token required',
      });
    }

    if (req.user?.userId) {
      await prisma.userProfile.updateMany({
        where: { userId: req.user.userId },
        data: { status: 'offline', lastSeen: new Date() },
      }).catch(() => {});
    }

    await tokenService.blacklistRefreshToken(token);

    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return sendServerError(res, 'Login failed', error);
  }
};

const refresh = async (req, res) => {
  try {
    const token = req.refreshToken;
    const userId = req.user.userId;

    const isValid = await tokenService.verifyRefreshTokenInDb(token, userId);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is invalid or expired',
        error: 'TOKEN_EXPIRED'
      });
    }

    const newAccessToken = tokenService.generateAccessToken(userId);

    res.cookie('jwt_access', newAccessToken, {
      httpOnly: true,
      secure: isHttpsRequest(req),
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    console.error('Refresh error:', error);
    return sendServerError(res, 'Token refresh failed', error);
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'Password change is not available for OAuth-only accounts',
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return sendServerError(res, 'Password change failed', error);
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent.',
      });
    }

    const resetToken = await tokenService.generateResetToken(user.id);

    console.log(`Password reset token for ${email}: ${resetToken}`);

    return res.status(200).json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent.',
      data: process.env.NODE_ENV === 'development' ? { resetToken } : undefined,
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return sendServerError(res, 'Password reset request failed', error);
  }
};

const completePasswordReset = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    let userId;
    try {
      const decoded = require('jsonwebtoken').verify(
        token,
        process.env.JWT_ACCESS_SECRET
      );
      userId = decoded.userId;
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token',
      });
    }

    const isValid = await tokenService.verifyResetToken(token, userId);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is invalid or expired',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    await tokenService.invalidateResetToken(token);

    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return sendServerError(res, 'Password reset failed', error);
  }
};

const oauth42Login = async (req, res) => {
  try {
    const clientId = process.env.OAUTH_42_CLIENT_ID;
    const redirectUri = process.env.OAUTH_42_CALLBACK_URL;
    
    if (!clientId || !redirectUri) {
      return res.status(500).json({
        success: false,
        message: 'OAuth 42 is not configured',
      });
    }

    const state = crypto.randomBytes(32).toString('hex');
    res.cookie('oauth_state', state, {
      httpOnly: true,
      secure: isHttpsRequest(req),
      maxAge: 10 * 60 * 1000, // 10 minutes
    });

    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=public&state=${state}`;
    
    return res.redirect(authUrl);
  } catch (error) {
    console.error('OAuth 42 login error:', error);
    return res.status(500).json({
      success: false,
      message: 'OAuth login failed',
      error: getDevelopmentError(error),
    });
  }
};

const oauth42Callback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const storedState = req.cookies.oauth_state;

    res.clearCookie('oauth_state');

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required',
      });
    }

    if (!state || !storedState || state !== storedState) {
      return res.status(403).json({
        success: false,
        message: 'Invalid state parameter. CSRF attempt blocked.',
      });
    }

    const tokenResponse = await oauthService.exchange42Code(code);
    const userInfo = await oauthService.get42UserInfo(tokenResponse.access_token);
    const user = await oauthService.findOrCreateUserFrom42(userInfo);

    const accessToken = tokenService.generateAccessToken(user.id);
    const refreshToken = await tokenService.generateRefreshToken(user.id);

    await prisma.userProfile.updateMany({
      where: { userId: user.id },
      data: { status: 'online', lastSeen: new Date() },
    });

    res.cookie('jwt_access', accessToken, {
      httpOnly: true,
      secure: isHttpsRequest(req),
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('jwt_refresh', refreshToken, {
      httpOnly: true,
      secure: isHttpsRequest(req),
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const frontendUrl = getRequestOrigin(req) || 'https://localhost';
    const redirectParams = new URLSearchParams({
      accessToken,
      refreshToken,
      userId: user.id,
      email: user.email,
    });

    const redirectUrl = `${frontendUrl}/auth/callback?${redirectParams.toString()}`;
    
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth callback error:', error);
    const frontendUrl = getRequestOrigin(req) || 'https://localhost';
    const errorMessage = encodeURIComponent('OAuth login failed. Please try again.');
    return res.redirect(`${frontendUrl}/login?error=${errorMessage}`);
  }
};

module.exports = {
  register,
  login,
  logout,
  refresh,
  changePassword,
  requestPasswordReset,
  completePasswordReset,
  oauth42Login,
  oauth42Callback,
};

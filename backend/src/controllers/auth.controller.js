const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const prisma = require('../config/database');
const tokenService = require('../services/token.service');
const oauthService = require('../services/oauth.service');

const AVATAR_DIR = path.join(__dirname, '..', '..', 'uploads', 'avatars');
const ASSET_BASE_URL = process.env.ASSET_BASE_URL || process.env.API_BASE_URL || 'http://localhost:3000';

function ensureAvatarDir() {
  if (!fs.existsSync(AVATAR_DIR)) {
    fs.mkdirSync(AVATAR_DIR, { recursive: true });
  }
}

function saveAvatarIfProvided(avatarPayload) {
  if (!avatarPayload) return null;

  // Accept data URLs (base64). Otherwise assume it's an existing URL/path.
  const match = avatarPayload.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    return avatarPayload;
  }

  const mime = match[1];
  const base64Data = match[2];
  const extension = mime.split('/')[1] || 'png';
  const filename = `avatar-${Date.now()}-${Math.round(Math.random() * 1e6)}.${extension}`;

  ensureAvatarDir();
  const filePath = path.join(AVATAR_DIR, filename);
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filePath, buffer);

  return `/uploads/avatars/${filename}`;
}

function formatAvatarUrl(avatarPath) {
  if (!avatarPath) return null;
  if (/^https?:\/\//i.test(avatarPath)) return avatarPath;
  return `${ASSET_BASE_URL}${avatarPath}`;
}

async function generateUniqueUsername(tx, desiredUsername, email) {
  const base = (desiredUsername || (email ? email.split('@')[0] : 'player'))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 20) || 'player';

  let candidate = base;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const existing = await tx.userProfile.findUnique({ where: { username: candidate } });
    if (!existing) return candidate;
    candidate = `${base}${crypto.randomInt(100, 9999)}`;
  }
  // Fallback with cuid-like suffix
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
      const avatarPath = saveAvatarIfProvided(avatar);

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
        avatar: formatAvatarUrl(result.profile.avatar),
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: errorMessage,
    });
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
          avatar: formatAvatarUrl(user.profile?.avatar || null),
          bio: user.profile?.bio || null,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: errorMessage,
    });
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

    await tokenService.blacklistRefreshToken(token);

    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: errorMessage,
    });
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

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    console.error('Refresh error:', error);
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }
    return res.status(500).json({
      success: false,
      message: 'Token refresh failed',
      error: errorMessage,
    });
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
      data: (() => {
        if (process.env.NODE_ENV === 'development') {
          return { resetToken };
        } else {
          return undefined;
        }
      })(),
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }
    return res.status(500).json({
      success: false,
      message: 'Password reset request failed',
      error: errorMessage,
    });
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
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }
    return res.status(500).json({
      success: false,
      message: 'Password reset failed',
      error: errorMessage,
    });
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
      secure: process.env.NODE_ENV === 'production',
      maxAge: 10 * 60 * 1000, // 10 minutes
    });

    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=public&state=${state}`;
    
    return res.redirect(authUrl);
  } catch (error) {
    console.error('OAuth 42 login error:', error);
    return res.status(500).json({
      success: false,
      message: 'OAuth login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
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

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to frontend with only non-sensitive tokens
    const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/auth/callback?userId=${user.id}&email=${encodeURIComponent(user.email)}`;
    
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth callback error:', error);
    const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:5173';
    const errorMessage = encodeURIComponent('OAuth login failed. Please try again.');
    return res.redirect(`${frontendUrl}/login?error=${errorMessage}`);
  }
};

module.exports = {
  register,
  login,
  logout,
  refresh,
  requestPasswordReset,
  completePasswordReset,
  oauth42Login,
  oauth42Callback,
};

const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );
};

const generateRefreshToken = async (userId) => {
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );

  const expiresIn = process.env.JWT_REFRESH_EXPIRY || '7d';
  const expiresAt = new Date();
  
  const match = expiresIn.match(/(\d+)([smhd])/);
  if (match) {
    const [, value, unit] = match;
    const num = parseInt(value);
    
    switch (unit) {
      case 's':
        expiresAt.setSeconds(expiresAt.getSeconds() + num);
        break;
      case 'm':
        expiresAt.setMinutes(expiresAt.getMinutes() + num);
        break;
      case 'h':
        expiresAt.setHours(expiresAt.getHours() + num);
        break;
      case 'd':
        expiresAt.setDate(expiresAt.getDate() + num);
        break;
    }
  }

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt,
    },
  });

  return refreshToken;
};

const verifyRefreshTokenInDb = async (token, userId) => {
  const dbToken = await prisma.refreshToken.findUnique({
    where: { token },
  });

  if (!dbToken || dbToken.userId !== userId) {
    return false;
  }

  if (new Date() > dbToken.expiresAt) {
    await prisma.refreshToken.delete({
      where: { token },
    });
    return false;
  }

  return true;
};

const blacklistRefreshToken = async (token) => {
  await prisma.refreshToken.delete({
    where: { token },
  }).catch(() => {
  });
};

const generateResetToken = async (userId) => {
  const resetToken = jwt.sign(
    { userId, type: 'reset' },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '1h' }
  );

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  await prisma.resetToken.create({
    data: {
      token: resetToken,
      userId,
      expiresAt,
    },
  });

  return resetToken;
};

const verifyResetToken = async (token, userId) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const dbToken = await prisma.resetToken.findUnique({
      where: { token },
    });

    if (!dbToken || dbToken.userId !== userId) {
      return false;
    }

    if (new Date() > dbToken.expiresAt) {
      await prisma.resetToken.delete({
        where: { token },
      });
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

const invalidateResetToken = async (token) => {
  await prisma.resetToken.delete({
    where: { token },
  }).catch(() => {
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshTokenInDb,
  blacklistRefreshToken,
  generateResetToken,
  verifyResetToken,
  invalidateResetToken,
};

const axios = require('axios');
const crypto = require('crypto');
const prisma = require('../config/database');

async function generateUniqueUsername(desiredUsername, email) {
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
    const existing = await prisma.userProfile.findUnique({ where: { username: candidate } });
    if (!existing) return candidate;
    candidate = `${base}${crypto.randomInt(100, 9999)}`;
  }
  return `${base}-${crypto.randomBytes(3).toString('hex')}`;
}

async function ensureUserProfile(userId, usernameSuggestion, avatarUrl = null) {
  const existing = await prisma.userProfile.findUnique({ where: { userId } });
  if (existing) return existing;

  const username = await generateUniqueUsername(usernameSuggestion, null);
  return prisma.userProfile.create({
    data: {
      userId,
      username,
      avatar: avatarUrl,
    },
  });
}

const exchange42Code = async (code) => {
  try {
    const response = await axios.post(
      'https://api.intra.42.fr/oauth/token',
      {
        grant_type: 'authorization_code',
        client_id: process.env.OAUTH_42_CLIENT_ID,
        client_secret: process.env.OAUTH_42_CLIENT_SECRET,
        code,
        redirect_uri: process.env.OAUTH_42_CALLBACK_URL,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(`Failed to exchange 42 code: ${error.message}`);
  }
};

const get42UserInfo = async (accessToken) => {
  try {
    const response = await axios.get(
      'https://api.intra.42.fr/v2/me',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(`Failed to get 42 user info: ${error.message}`);
  }
};

const findOrCreateUserFrom42 = async (oauthData) => {
  const { id: accountId, email, login } = oauthData;

  let oauthAccount = await prisma.oAuthAccount.findUnique({
    where: {
      provider_accountId: {
        provider: '42',
        accountId: accountId.toString(),
      },
    },
    include: {
      user: true,
    },
  });

  if (oauthAccount) {
    return oauthAccount.user;
  }

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        password: null,
      },
    });
  }

  await prisma.oAuthAccount.create({
    data: {
      provider: '42',
      accountId: accountId.toString(),
      userId: user.id,
      data: JSON.stringify(oauthData),
    },
  });

  await ensureUserProfile(user.id, login, oauthData.image_url || null);

  return user;
};

module.exports = {
  exchange42Code,
  get42UserInfo,
  findOrCreateUserFrom42,
};

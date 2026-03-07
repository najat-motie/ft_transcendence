const axios = require('axios');
const prisma = require('../config/database');

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

  return user;
};

module.exports = {
  exchange42Code,
  get42UserInfo,
  findOrCreateUserFrom42,
};

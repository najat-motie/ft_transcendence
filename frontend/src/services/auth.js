import {
  deleteCookie,
  getCookie,
  setCookie,
  getUserFromCookie,
  setUserInCookie,
} from "../utils/cookies";

const accessTokenKey = (userId) => `accessToken_${userId}`;
const refreshTokenKey = (userId) => `refreshToken_${userId}`;

export function setUser(session, days = 7) {
  const user = session?.user ?? session;
  const accessToken = session?.accessToken;
  const refreshToken = session?.refreshToken;

  if (user) {
    setUserInCookie(user, days);
  }

  if (user?.userId && accessToken) {
    setCookie(accessTokenKey(user.userId), accessToken, days);
  }

  if (user?.userId && refreshToken) {
    setCookie(refreshTokenKey(user.userId), refreshToken, days);
  }
}

export function getUser() {
  const user = getUserFromCookie();
  if (!user) return null;

  return {
    user,
    accessToken: getCookie(accessTokenKey(user.userId)),
    refreshToken: getCookie(refreshTokenKey(user.userId)),
  };
}

export function clearUser(userId) {
  logout(userId);
}

export function logout(userId) {
  const id = userId ?? getUserFromCookie()?.userId;
  deleteCookie("user");

  if (id) {
    deleteCookie(accessTokenKey(id));
    deleteCookie(refreshTokenKey(id));
  }

  deleteCookie("userProfile");
}

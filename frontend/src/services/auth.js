import {
  deleteCookie,
  getCookie,
  setCookie,
  getUserFromCookie,
  setUserInCookie,
} from "../utils/cookies";

export function setUser(session, days = 7) {
  const user = session?.user ?? session;
  const accessToken = session?.accessToken;
  const refreshToken = session?.refreshToken;

  if (user) {
    setUserInCookie(user, days);
  }

  if (user?.userId && accessToken) {
    setCookie(`accessToken_${user.userId}`, accessToken, days);
  }

  if (user?.userId && refreshToken) {
    setCookie(`refreshToken_${user.userId}`, refreshToken, days);
  }
}

export function getUser() {
  const user = getUserFromCookie();
  if (!user) return null;

  return {
    user,
    accessToken: getCookie(`accessToken_${user.userId}`),
    refreshToken: getCookie(`refreshToken_${user.userId}`),
  };
}

export function clearUser(userId) {
  logout(userId);
}

export function logout(userId) {
  const id = userId ?? getUserFromCookie()?.userId;
  deleteCookie("user");
  deleteCookie(`accessToken_${id}`);
  deleteCookie(`refreshToken_${id}`);
  deleteCookie("userProfile");
}

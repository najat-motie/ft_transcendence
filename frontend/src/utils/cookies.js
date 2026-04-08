/**
 * Get a cookie by name
 */
export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
}

/**
 * Set a cookie with optional expiry days
 */
export function setCookie(name, value, days = 7) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Strict`;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name) {
  document.cookie = `${name}=; Max-Age=-99999999; path=/`;
}

/**
 * Get user data from cookie
 */
export function getUserFromCookie() {
  const userJson = getCookie("user");
  if (!userJson) return null;
  
  try {
    return JSON.parse(decodeURIComponent(userJson));
  } catch {
    return null;
  }
}

/**
 * Set user data in cookie
 */
export function setUserInCookie(userData, days = 7) {
  const encoded = encodeURIComponent(JSON.stringify(userData));
  setCookie("user", encoded, days);
}

/**
 * Get user profile from cookie
 */
export function getUserProfileFromCookie() {
  const profileJson = getCookie("userProfile");
  if (!profileJson) return null;
  
  try {
    return JSON.parse(profileJson);
  } catch {
    return null;
  }
}

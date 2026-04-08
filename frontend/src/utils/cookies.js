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

function parseJsonCookie(name) {
  const rawValue = getCookie(name);
  if (!rawValue) return null;

  try {
    return JSON.parse(decodeURIComponent(rawValue));
  } catch {
    try {
      return JSON.parse(rawValue);
    } catch {
      return null;
    }
  }
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
  return parseJsonCookie("user");
}

/**
 * Set user data in cookie
 */
export function setUserInCookie(userData, days = 7) {
  const encoded = encodeURIComponent(JSON.stringify(userData));
  setCookie("user", encoded, days);
}

export function setUserProfileInCookie(profileData, days = 7) {
  const encoded = encodeURIComponent(JSON.stringify(profileData));
  setCookie("userProfile", encoded, days);
}

/**
 * Get user profile from cookie
 */
export function getUserProfileFromCookie() {
  return parseJsonCookie("userProfile");
}

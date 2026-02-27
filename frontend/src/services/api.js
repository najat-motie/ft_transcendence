const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

import { logout } from "./auth.js";
import { getCookie, setCookie, getUserFromCookie } from "../utils/cookies.js";

export async function apiRequest(endpoint, options = {}, skipAuth = false) {

  // Get user from cookies instead of localStorage
  const user = getUserFromCookie() || {};
  let accessToken = getCookie(`accessToken_${user.userId}`);
  let refreshToken = getCookie(`refreshToken_${user.userId}`);

  if (!skipAuth && !user.userId) {
    throw new Error("No active user. Please login.");
  }
  
  const makeRequest = async (token) => {
    const headers = { "Content-Type": "application/json" };
    if (!skipAuth && token) headers["Authorization"] = `Bearer ${token}`;

    return fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  };

  
  const parseJsonSafe = async (res) => {
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (err) {
      throw new Error(text || "Invalid JSON response");
    }
  };

  let response = await makeRequest(accessToken);
  let data = await parseJsonSafe(response);

  if (response.status === 401 && data?.error === "TOKEN_EXPIRED") {
    if (!refreshToken) {
      logout(user.userId);
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }

    const refreshResponse = await fetch(`${BASE_URL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshResponse.ok) {
      logout(user.userId);
      throw new Error("Session expired. Please login again.");
    }

    const refreshData = await parseJsonSafe(refreshResponse);
    const newAccessToken = refreshData.accessToken;
    
    // Store new tokens in cookies
    setCookie(`accessToken_${user.userId}`, newAccessToken, 7);
    if (refreshData.refreshToken) {
      setCookie(`refreshToken_${user.userId}`, refreshData.refreshToken, 7);
    }

    response = await makeRequest(newAccessToken);
    data = await parseJsonSafe(response);
    return data ?? {};
  }

  if (!response.ok) {
    const message = (data && data.message) || "Something went wrong";
    throw new Error(message);
  }

  return data ?? {};
}

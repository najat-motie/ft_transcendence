import { getUser, logout, setUser } from "./auth.js";
import { getApiBaseUrl } from "../lib/runtime-config.js";

const BASE_URL = getApiBaseUrl();
const JSON_HEADERS = { "Content-Type": "application/json" };
const SESSION_EXPIRED_MESSAGE = "Session expired. Please login again.";
const GENERIC_ERROR_MESSAGE = "Something went wrong";

const buildError = (responseBody) => new Error(responseBody?.message || GENERIC_ERROR_MESSAGE);

const throwSessionExpired = (userId) => {
  logout(userId);
  throw new Error(SESSION_EXPIRED_MESSAGE);
};

const parseJsonSafe = async (response) => {
  const responseText = await response.text();
  if (!responseText) return null;

  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error(responseText || "Invalid JSON response");
  }
};

export async function apiRequest(endpoint, options = {}, skipAuth = false) {
  const session = getUser();
  const user = session?.user || {};
  let accessToken = session?.accessToken;
  let refreshToken = session?.refreshToken;

  if (!skipAuth && !user.userId) {
    throw new Error("No active user. Please login.");
  }

  const makeRequest = async (token) => {
    const headers = { ...JSON_HEADERS };
    if (!skipAuth && token) headers["Authorization"] = `Bearer ${token}`;

    return fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });
  };

  const refreshAccessToken = async () => {
    const refreshResponse = await fetch(`${BASE_URL}/refresh`, {
      method: "POST",
      headers: JSON_HEADERS,
      credentials: "include",
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshResponse.ok) {
      throwSessionExpired(user.userId);
    }

    const refreshData = await parseJsonSafe(refreshResponse);
    const newAccessToken = refreshData?.data?.accessToken || refreshData?.accessToken;

    if (!newAccessToken) {
      throwSessionExpired(user.userId);
    }

    const nextRefreshToken = refreshData?.data?.refreshToken || refreshData?.refreshToken || refreshToken;

    setUser({
      user,
      accessToken: newAccessToken,
      refreshToken: nextRefreshToken,
    });

    refreshToken = nextRefreshToken;
    accessToken = newAccessToken;
    return newAccessToken;
  };

  if (!skipAuth && !accessToken && refreshToken) {
    await refreshAccessToken();
  }

  let response = await makeRequest(accessToken);
  let data = await parseJsonSafe(response);

  if (response.status === 401 && !skipAuth) {
    if (!refreshToken) {
      logout(user.userId);
      window.location.href = "/login";
      throw new Error(SESSION_EXPIRED_MESSAGE);
    }

    const newAccessToken = await refreshAccessToken();

    response = await makeRequest(newAccessToken);
    data = await parseJsonSafe(response);

    if (!response.ok) {
      throw buildError(data);
    }

    return data ?? {};
  }

  if (!response.ok) {
    throw buildError(data);
  }

  return data ?? {};
}

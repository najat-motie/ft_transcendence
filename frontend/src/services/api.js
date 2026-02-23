const BASE_URL = "http://localhost:3000";

import { logout } from "./auth.js";

export async function apiRequest(endpoint, options = {}, skipAuth = false) {

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  let accessToken = localStorage.getItem(`accessToken_${user.userId}`);
  let refreshToken = localStorage.getItem(`refreshToken_${user.userId}`);

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

  
  let response = await makeRequest(accessToken);
  const data = await response.json();

  if (!skipAuth && response.status === 401 && data.error === "TOKEN_EXPIRED") {
    if (!refreshToken) {
      logout(user.userId);
      window.location.href = "/login";
      // setUser(null);
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
      logout();
      throw new Error("Session expired. Please login again.");
    }

    const refreshData = await refreshResponse.json();
    const newAccessToken = refreshData.accessToken;
    localStorage.setItem(`accessToken_${user.userId}`, newAccessToken);
    if (refreshData.refreshToken) {
      localStorage.setItem(`refreshToken_${user.userId}`, refreshData.refreshToken);
    }

    response = await makeRequest(newAccessToken);
    return response.json();
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

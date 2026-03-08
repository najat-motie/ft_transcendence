const apiUrl = import.meta.env.VITE_WS_URL;

import { getUser, clearUser, setUser } from "./auth";

export async function apiRequest(endpoint, options = {}, skipAuth = false) {

  const user = getUser();
  const accessToken = user?.accessToken;
  const refreshToken = user?.refreshToken;

  const makeRequest = async (token) => {
    const headers = { "Content-Type": "application/json" };
    if (!skipAuth && token) headers["Authorization"] = `Bearer ${token}`;

    return fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers,
    });
  };

  
  let response = await makeRequest(accessToken);
  const data = await response.json();

  if (response.status === 401 && data.error === "TOKEN_EXPIRED") {
    if (!refreshToken) {
      clearUser();
      window.location.replace = "/login";
      throw new Error("Session expired. Please login again.");
    }

    const refreshResponse = await fetch(`${apiUrl}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshResponse.ok) {
      clearUser();
      window.location.replace = "/login";
      throw new Error("Session expired. Please login again.");
    }

    const refreshData = await refreshResponse.json();
    const newAccessToken = refreshData.accessToken;

    const updatedUser = {
      ...user,
      accessToken: newAccessToken,
      refreshToken: refreshData.refreshToken || refreshToken,
    };
    
    setUser(updatedUser);

    response = await makeRequest(newAccessToken);
    return response.json();
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

let socket = null;

import { getUser } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost";
const DEFAULT_WS_BASE_URL =
  import.meta.env.VITE_WS_BASE_URL ||
  API_BASE_URL.replace(/^http/i, (protocol) =>
    protocol.toLowerCase() === "https" ? "wss" : "ws"
  );

const appendToken = (url, token) => {
  if (!token) return url;
  const hasQuery = url.includes("?");
  const separator = hasQuery ? "&" : "?";
  return `${url}${separator}token=${encodeURIComponent(token)}`;
};

const resolveSocketUrl = (path, baseUrl) => {
  if (path.startsWith("ws://") || path.startsWith("wss://")) {
    return path;
  }

  return `${baseUrl}${path}`;
};

export const connectSocket = (path = "", options = {}) => {
  const baseUrl = options.baseUrl || DEFAULT_WS_BASE_URL;
  const session = getUser();
  const token = options.token || session?.accessToken;
  const targetUrl = appendToken(resolveSocketUrl(path, baseUrl), token);

  if (socket && socket.readyState === WebSocket.OPEN && socket.url === targetUrl) {
    return socket;
  }

  if (socket) {
    socket.close();
  }

  socket = new WebSocket(targetUrl);

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
    socket = null;
  };

  return socket;
};

export const getSocket = () => socket;

export const closeSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

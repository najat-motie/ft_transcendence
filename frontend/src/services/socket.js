let socket = null;
let connectionId = 0;

import { getUser } from "./auth";

const DEFAULT_WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;

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

  const myId = ++connectionId;

  if (socket) {
    socket.close();
  }

  let reconnectAttempts = 0;

  const connect = () => {
    if (connectionId !== myId) return;

    socket = new WebSocket(targetUrl);

    socket.onopen = () => {
      reconnectAttempts = 0;
    };

    socket.onclose = () => {
      socket = null;
      if (connectionId !== myId) return;

      setTimeout(() => {
        if (connectionId !== myId) return;
        reconnectAttempts++;
        connect();
      }, Math.min(1000 * reconnectAttempts + 1000, 30000));
    };
  };

  connect();
  return socket;
};

export const getSocket = () => socket;

export const closeSocket = () => {
  connectionId++;
  if (socket) {
    socket.close();
    socket = null;
  }
};
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

const trimTrailingSlash = (value) => value.replace(/\/+$/, "");

const resolveSocketUrl = (path, baseUrl) => {
  if (path.startsWith("ws://") || path.startsWith("wss://")) {
    return path;
  }

  const normalizedBaseUrl = trimTrailingSlash(baseUrl);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (normalizedBaseUrl.endsWith("/ws") && normalizedPath.startsWith("/ws/")) {
    return `${normalizedBaseUrl.slice(0, -3)}${normalizedPath}`;
  }

  return `${normalizedBaseUrl}${normalizedPath}`;
};

export const connectSocket = (path = "", options = {}) => {
  const baseUrl = options.baseUrl || DEFAULT_WS_BASE_URL;
  const session = getUser();
  const token = options.token || session?.accessToken;
  const targetUrl = appendToken(resolveSocketUrl(path, baseUrl), token);
  const shouldReconnect = options.autoReconnect !== false;

  const myId = ++connectionId;

  if (socket) {
    socket.close();
  }

  let reconnectAttempts = 0;

  const connect = () => {
    if (connectionId !== myId) return;

    const currentSocket = new WebSocket(targetUrl);
    socket = currentSocket;

    currentSocket.addEventListener("open", (event) => {
      if (connectionId !== myId || socket !== currentSocket) return;
      if (typeof options.onOpen === "function") {
        options.onOpen(event, currentSocket);
      }
    });

    currentSocket.addEventListener("message", (event) => {
      if (connectionId !== myId || socket !== currentSocket) return;
      if (typeof options.onMessage === "function") {
        options.onMessage(event, currentSocket);
      }
    });

    currentSocket.addEventListener("error", (event) => {
      if (connectionId !== myId || socket !== currentSocket) return;
      if (typeof options.onError === "function") {
        options.onError(event, currentSocket);
      }
    });

    currentSocket.onopen = () => {
      if (connectionId !== myId || socket !== currentSocket) return;
      reconnectAttempts = 0;
    };

    currentSocket.onclose = (event) => {
      if (connectionId !== myId || socket !== currentSocket) return;
      socket = null;
      if (typeof options.onClose === "function") {
        options.onClose(event);
      }
      if (!shouldReconnect) return;

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

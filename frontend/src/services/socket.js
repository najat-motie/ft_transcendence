let socket = null;
let connectionId = 0;

import { getUser } from "./auth";
import { getWsBaseUrl } from "../lib/runtime-config";

const normalizeSocketBaseUrl = (baseUrl) => {
  const resolvedBaseUrl = baseUrl?.trim() || getWsBaseUrl();

  try {
    const normalizedUrl = new URL(resolvedBaseUrl, window.location.origin);

    if (normalizedUrl.protocol === "http:") {
      normalizedUrl.protocol = "ws:";
    } else if (normalizedUrl.protocol === "https:") {
      normalizedUrl.protocol = "wss:";
    }

    return normalizedUrl.toString();
  } catch {
    return getWsBaseUrl();
  }
};

export const buildSocketUrl = (path = "", baseUrl, token) => {
  const normalizedBaseUrl = normalizeSocketBaseUrl(baseUrl);
  const resolvedUrl = new URL(path || "", normalizedBaseUrl);

  if (resolvedUrl.protocol === "http:") {
    resolvedUrl.protocol = "ws:";
  } else if (resolvedUrl.protocol === "https:") {
    resolvedUrl.protocol = "wss:";
  }

  if (token) {
    resolvedUrl.searchParams.set("token", token);
  }

  return resolvedUrl.toString();
};

export const connectSocket = (path = "", options = {}) => {
  const baseUrl = options.baseUrl || getWsBaseUrl();
  const session = getUser();
  const token = options.token || session?.accessToken;

  const targetUrl = buildSocketUrl(path, baseUrl, token);

  if (socket && socket.readyState === WebSocket.OPEN && socket.url === targetUrl) {
    return socket;
  }

  const myId = ++connectionId;

  if (socket) {
    socket.close();
  }

  socket = new WebSocket(targetUrl);

  socket.addEventListener("open", (event) => {
    if (connectionId !== myId) return;
    if (typeof options.onOpen === "function") {
      options.onOpen(event, socket);
    }
  });

  socket.addEventListener("message", (event) => {
    if (connectionId !== myId) return;
    if (typeof options.onMessage === "function") {
      options.onMessage(event, socket);
    }
  });

  socket.addEventListener("error", (event) => {
    if (connectionId !== myId) return;
    if (typeof options.onError === "function") {
      options.onError(event, socket);
    }
  });

  socket.addEventListener("close", (event) => {
    if (connectionId !== myId) return;
    if (typeof options.onClose === "function") {
      options.onClose(event, socket);
    }
    socket = null;
  });

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

let socket = null;

import { getUser } from "./auth";
import { getWsBaseUrl } from "../lib/runtime-config";

const DEFAULT_WS_BASE_URL = getWsBaseUrl();

const buildSocketUrl = (path, baseUrl, token) => {
  const normalizedPath = path
    ? path.startsWith("/")
      ? path
      : `/${path}`
    : "";

  const normalizedBaseUrl = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;

  const url = path && path.startsWith("ws")
    ? path
    : `${normalizedBaseUrl}${normalizedPath}`;

  if (!token) return url;
  return `${url}${url.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}`;
};

export const connectSocket = (path = "", options = {}) => {
  const baseUrl = options.baseUrl || DEFAULT_WS_BASE_URL;
  const session = getUser();
  const token = options.token || session?.accessToken;

  const targetUrl = buildSocketUrl(path, baseUrl, token);

  if (
    socket &&
    (socket.readyState === WebSocket.OPEN ||
     socket.readyState === WebSocket.CONNECTING) &&
    socket.url === targetUrl
  ) {
    return socket;
  }


  if (socket && socket.readyState !== WebSocket.CLOSED) {
    socket.close();
  }

  socket = new WebSocket(targetUrl);

  socket.addEventListener("open", (event) => {
    if (typeof options.onOpen === "function") {
      options.onOpen(event, socket);
    }
  });

  socket.addEventListener("message", (event) => {
    if (typeof options.onMessage === "function") {
      options.onMessage(event, socket);
    }
  });

  socket.addEventListener("error", (event) => {
    if (typeof options.onError === "function") {
      options.onError(event, socket);
    }
  });

  socket.addEventListener("close", (event) => {
    if (typeof options.onClose === "function") {
      options.onClose(event, socket);
    }
    socket = null;
  });

  return socket;
};

export const getSocket = () => socket;

export const closeSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

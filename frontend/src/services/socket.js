let socket = null;
let connectionId = 0;

import { getUser } from "./auth";

const DEFAULT_WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;

const buildSocketUrl = (path, baseUrl, token) => {
  const url = path.startsWith("ws") ? path : `${baseUrl}${path}`;
  if (!token) return url;
  return `${url}${url.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}`;
};

export const connectSocket = (path = "", options = {}) => {
  const baseUrl = options.baseUrl || DEFAULT_WS_BASE_URL;
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

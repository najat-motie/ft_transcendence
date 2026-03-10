let socket = null;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const DEFAULT_WS_BASE_URL =
  import.meta.env.VITE_WS_BASE_URL ||
  API_BASE_URL.replace(/^http/i, (protocol) =>
    protocol.toLowerCase() === "https" ? "wss" : "ws"
  );

const resolveSocketUrl = (path, baseUrl) => {
  if (path.startsWith("ws://") || path.startsWith("wss://")) {
    return path;
  }

  return `${baseUrl}${path}`;
};

export const connectSocket = (path = "", options = {}) => {
  const baseUrl = options.baseUrl || DEFAULT_WS_BASE_URL;
  const targetUrl = resolveSocketUrl(path, baseUrl);

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

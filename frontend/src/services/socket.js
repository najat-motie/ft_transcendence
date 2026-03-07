import { getUser } from "./auth.js";

let socket = null;

export const connectSocket = (path = "") => {
  const session = getUser();
  const token = session?.accessToken;

  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }

  socket = new WebSocket(`ws://localhost:5000${path}`);

  socket.onopen = () => {
    if (token) {
      socket.send(
        JSON.stringify({
          type: "authenticate",
          token,
        })
      );
    }
  };

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

let socket = null;
const wsUrl = import.meta.env.VITE_API_URL;

export const connectSocket = (path = "") => {

  const user = getUser();
  const token = user.accessToken;
  
  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }

  socket = new WebSocket(`${wsUrl}${path}`);

  socket.onopen = () => {
    socket.send(
      JSON.stringify({
        type: "authenticate",
        token,
      })
    );
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
  }
};

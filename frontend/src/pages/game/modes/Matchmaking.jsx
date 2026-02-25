import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectSocket, getSocket} from "../../../services/socket";
import "../../../styles/game/game-mode.css";

export default function Matchmaking() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Connecting to server...");

  useEffect(() => {
    // connect to WebSocket
    // Example:
    // const socket = connectSocket();
    // socket.onopen = () => { ... };
    // socket.onmessage = (event) => { ... };
    // socket.onerror = () => { ... };
    // socket.onclose = () => { ... };

    // Cleanup
    return () => {
      // cancel matchmaking and close WebSocket
      // const activeSocket = getSocket();
      // if (activeSocket && activeSocket.readyState === WebSocket.OPEN) {
      //   activeSocket.send(JSON.stringify({ type: "cancelMatchmaking" }));
      // }
      // socket.close();
      // socket = null;
    };
  }, [navigate]);

  const handleCancel = () => {
    // send cancel matchmaking via WebSocket
    // const socket = getSocket();
    // if (socket && socket.readyState === WebSocket.OPEN) {
    //   socket.send(JSON.stringify({ type: "cancelMatchmaking" }));
    // }

    navigate(-1);
  };

  return (
    <section className="matchmaking">
      <div className="matchmaking-container">
        <h2>Quick Match</h2>
        <p>{status}</p>

        {isConnected && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </section>
  );
}




// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../../styles/game/game-mode.css";

// export default function Matchmaking() {
//   const navigate = useNavigate();
//   const [status, setStatus] = useState("Searching for an online opponent...");

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setStatus("Opponent found! Starting game...");
//       setTimeout(() => {
//         navigate("/play/online-game");
//       }, 2000);
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [navigate]);

//   return (
//     <section className="matchmaking">
//       <div className="matchmaking-container">
//         <h2>Quick Match</h2>
//         <p>{status}</p>
//         <button type="button" onClick={() => navigate(-1)}>
//           Cancel
//         </button>
//       </div>
//     </section>
//   );
// }

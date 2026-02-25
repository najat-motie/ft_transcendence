import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectSocket, getSocket } from "../../../services/socket";
import "../../../styles/game/game-mode.css";

export default function CreateRoom() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // connect to WebSocket
    // const socket = connectSocket();
    // socket.onopen = () => { socket.send(JSON.stringify({ type: "createRoom" })) };
    // socket.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   switch(data.type) {
    //     case "roomCreated":
    //       setRoomCode(data.roomCode);
    //       setPlayers([data.hostUsername]);
    //       break;
    //     case "playerJoined":
    //       setPlayers(data.players);
    //       break;
    //     case "roomReady":
    //       navigate("/online-game");
    //       break;
    //     default: break;
    //   }
    // };

    return () => {
      // clean up WebSocket connection
    };
  }, [navigate]);

  const startGame = () => {
    // send start game command via WebSocket
    // const socket = getSocket();
    // if (socket) socket.send(JSON.stringify({ type: "startRoomGame", roomCode }));
  };

  return (
    <section className="action">
      <div className="action-container">
        <h2>Create Room</h2>

        {roomCode && (
          <>
            <p>Invite your friend using this room code:</p>
            <div className="room-code">{roomCode}</div>

            <h3>Players in Room:</h3>
            <ul>
              {players.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>

            <button type="button" onClick={startGame}>
              Start Game
            </button>
          </>
        )}

        {error && <p className="error">{error}</p>}

        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </section>
  );
}




// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../../styles/game/game-mode.css";

// export default function CreateRoom() {
//   const navigate = useNavigate();
//   const [roomCode, setRoomCode] = useState("ABCD1234");
//   const [players, setPlayers] = useState(["You"]);

//   const startGame = () => {
//     navigate("/play/online-game");
//   };

//   return (
//     <section className="action">
//       <div className="action-container">
//         <h2>Create Room</h2>
//         <p>Invite your friend using this room code:</p>
//         <div className="room-code">{roomCode}</div>

//         <h3>Players in Room:</h3>
//         <ul>
//           {players.map((p, i) => (
//             <li key={i}>{p}</li>
//           ))}
//         </ul>

//         <button type="button" onClick={startGame}>
//           Start Game
//         </button>
//         <button type="button" onClick={() => navigate(-1)}>
//           Cancel
//         </button>
//       </div>
//     </section>
//   );
// }

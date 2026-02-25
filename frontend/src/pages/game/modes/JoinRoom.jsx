import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectSocket } from "../../../services/socket";
import "../../../styles/game/game-mode.css";

export default function JoinRoom() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");

  const joinRoom = () => {
    if (!roomCode.trim()) {
      setError("Please enter a valid room code");
      return;
    }
    const codeRegex = /^[A-Z0-9]{6}$/;
    if (!codeRegex.test(roomCode)) {
      setError("Room code must be 6 letters or numbers");
      return;
    }

    // connect to WebSocket and send join room
    // const socket = connectSocket();
    // socket.onopen = () => {
    //   socket.send(JSON.stringify({ type: "joinRoom", roomCode }));
    // };
    // socket.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type === "roomJoined") navigate("/online-game");
    //   if (data.type === "error") setError(data.message);
    // };
  };

  return (
    <section className="action">
      <div className="action-container">
        <h2>Join Private Room</h2>

        <input
          className="input-code"
          type="text"
          placeholder="Enter Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
        />

        {error && <p className="error">{error}</p>}

        <button type="button" onClick={joinRoom}>
          Join
        </button>

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

// export default function JoinRoom() {
//   const navigate = useNavigate();
//   const [roomCode, setRoomCode] = useState("");
//   const [error, setError] = useState("");

//   const joinRoom = () => {
//     if (roomCode.trim() === "") {
//       setError("Please enter a valid room code");
//       return;
//     }
//     const codeRegex = /^[A-Z0-9]{6}$/;
//     if (!codeRegex.test(roomCode)) {
//       setError("Room code must be 6 letters or numbers");
//       return;
//     }
//     navigate("/play/online-game");
//   };

//   return (
//     <section className="action">
//       <div className="action-container">
//         <h2>Join Private Room</h2>
//         <input
//           className="input-code"
//           type="text"
//           placeholder="Enter Room Code"
//           value={roomCode}
//           onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
//         />
//         {error && <p className="error">{error}</p>}
//         <button type="button" onClick={joinRoom}>
//           Join
//         </button>
//         <button type="button" onClick={() => navigate(-1)}>
//           Cancel
//         </button>
//       </div>
//     </section>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../services/api";
import "../../../styles/game/game-mode.css";

export default function JoinRoom() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const joinRoom = async () => {
    if (!roomCode.trim()) {
      setError("Please enter a valid room code");
      return;
    }

    const codeRegex = /^[A-Z0-9]{6}$/;
    if (!codeRegex.test(roomCode)) {
      setError("Room code must be 6 letters or numbers");
      return;
    }

    try {
      setIsJoining(true);
      setError("");

      const match = await apiRequest("/room/join", {
        method: "POST",
        body: JSON.stringify({ room_code: roomCode.trim().toUpperCase() }),
      });

      navigate("/play/online", { state: match });
    } catch (requestError) {
      setError(requestError.message || "Failed to join room");
      setIsJoining(false);
    }
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
          {isJoining ? "Joining..." : "Join"}
        </button>

        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </section>
  );
}

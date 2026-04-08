import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import {
  actionContainerClass,
  actionGhostClass,
  actionHeadingClass,
  actionSectionClass,
  actionPrimaryClass,
  roomInputClass,
  roomPageStyle,
} from "./gameUi";

export default function JoinRoom() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    document.title = "ft_transcendence - Playing vs Friend";
  }, [])

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

      navigate("/play/online", {
        state: {
          ...match,
          source: "join-room",
        },
      });
    } catch (requestError) {
      setError(requestError.message || "Failed to join room");
      setIsJoining(false);
    }
  };

  return (
    <section className={actionSectionClass} style={roomPageStyle}>
      <div className={actionContainerClass}>
        <h2 className={actionHeadingClass}>Join Private Room</h2>

        <label className="mb-[0.45rem] block text-[0.78rem] uppercase tracking-[0.07em] text-slate-500" htmlFor="room-code-input">
          Room Code
        </label>
        <input
          id="room-code-input"
          className={roomInputClass}
          type="text"
          placeholder="e.g. AB12CD"
          value={roomCode}
          onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
          maxLength={6}
          autoComplete="off"
          spellCheck="false"
        />

        {error ? <p className="mb-5 rounded-[10px] border border-red-500/25 bg-red-500/10 px-[0.85rem] py-[0.55rem] text-[0.875rem] text-red-300">{error}</p> : null}

        <div className="flex flex-wrap justify-center gap-3">
          <button className={actionPrimaryClass} type="button" onClick={joinRoom}>
            {isJoining ? "Joining..." : "Join"}
          </button>

          <button className={actionGhostClass} type="button" onClick={() => navigate("/play")}>
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
}

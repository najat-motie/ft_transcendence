import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../services/api";
import "../../../styles/game/game-mode.css";

export default function CreateRoom() {
  const navigate = useNavigate();
  const mountedRef = useRef(true);
  const roomCodeRef = useRef("");
  const readyRef = useRef(false);
  const pollTimerRef = useRef(null);
  const [roomCode, setRoomCode] = useState("");
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Creating room...");

  useEffect(() => {
    mountedRef.current = true;

    const createRoom = async () => {
      try {
        const response = await apiRequest("/room/create", { method: "POST" });

        if (!mountedRef.current) {
          return;
        }

        setRoomCode(response.room_code);
        setPlayers(response.players || []);
        setStatus("Waiting for your opponent to join...");
        roomCodeRef.current = response.room_code || "";
      } catch (requestError) {
        if (!mountedRef.current) {
          return;
        }

        setError(requestError.message || "Failed to create room");
        setStatus("Unable to create room.");
      }
    };

    createRoom();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!roomCode) {
      return undefined;
    }

    const pollRoom = async () => {
      try {
        const response = await apiRequest(`/room/${roomCode}`);

        if (!mountedRef.current) {
          return;
        }

        if (response.players) {
          setPlayers(response.players);
        }

        if (response.ready) {
          readyRef.current = true;
          navigate("/play/online", { state: response });
        }
      } catch (requestError) {
        if (!mountedRef.current || readyRef.current) {
          return;
        }

        setError(requestError.message || "Failed to check room status");
        setStatus("Unable to continue waiting for opponent.");
      }
    };

    pollTimerRef.current = window.setInterval(pollRoom, 1000);
    pollRoom();

    return () => {
      if (pollTimerRef.current) {
        window.clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [navigate, roomCode]);

  useEffect(() => {
    return () => {
      if (!roomCodeRef.current || readyRef.current) {
        return;
      }

      apiRequest(`/room/${roomCodeRef.current}`, { method: "DELETE" }).catch(() => {});
    };
  }, []);

  const cancelRoom = async () => {
    if (roomCodeRef.current && !readyRef.current) {
      try {
        await apiRequest(`/room/${roomCodeRef.current}`, { method: "DELETE" });
      } catch (requestError) {
        setError(requestError.message || "Failed to cancel room");
        return;
      }
    }

    navigate(-1);
  };

  return (
    <section className="action">
      <div className="action-container">
        <h2>Create Room</h2>
        <p>{status}</p>

        {roomCode && (
          <>
            <p>Invite your friend using this room code:</p>
            <div className="room-code">{roomCode}</div>

            <h3>Players in Room:</h3>
            <ul>
              {players.map((p, i) => (
                <li key={p.id || i}>{p.username}</li>
              ))}
            </ul>
          </>
        )}

        {error && <p className="error">{error}</p>}

        <button className="ghost" type="button" onClick={cancelRoom}>
          Cancel
        </button>
      </div>
    </section>
  );
}

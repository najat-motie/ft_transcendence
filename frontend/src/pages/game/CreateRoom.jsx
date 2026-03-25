import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { cn } from "../../lib/cn";
import {
  actionContainerClass,
  actionGhostClass,
  actionHeadingClass,
  actionLeadClass,
  actionSectionClass,
  roomCodeClass,
  roomPageStyle,
  roomPlayerItemClass,
} from "./gameUi";

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
    document.title = "ft_transcendence - Create Room";
  }, [])

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
          navigate("/play/online", {
            state: {
              ...response,
              source: "create-room",
            },
          });
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
    <section className={actionSectionClass} style={roomPageStyle}>
      <div className={actionContainerClass}>
        <h2 className={actionHeadingClass}>Create Room</h2>
        <p className={actionLeadClass}>{status}</p>

        {roomCode ? (
          <>
            <p className="mb-[0.45rem] text-[0.72rem] uppercase tracking-[0.08em] text-slate-500">Invite your friend using this room code</p>
            <div className={roomCodeClass}>{roomCode}</div>
            <div className="my-[0.75rem] flex items-center justify-center gap-[5px]" aria-hidden="true">
              {[0, 0.2, 0.4].map((delay, index) => (
                <span
                  key={index}
                  className="h-2 w-2 animate-bounce rounded-full bg-sky-400"
                  style={{ animationDelay: `${delay}s` }}
                ></span>
              ))}
            </div>

            <h3 className="mb-[0.6rem] text-[0.8rem] font-semibold uppercase tracking-[0.07em] text-slate-200">Players in Room</h3>
            <ul className="mb-6 grid gap-[0.4rem]">
              {players.map((player, index) => (
                <li key={player.id || index} className={roomPlayerItemClass}>
                  <span className="h-2 w-2 shrink-0 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
                  {player.username}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {error ? <p className="mb-5 rounded-[10px] border border-red-500/25 bg-red-500/10 px-[0.85rem] py-[0.55rem] text-[0.875rem] text-red-300">{error}</p> : null}

        <button className={actionGhostClass} type="button" onClick={cancelRoom}>
          Cancel
        </button>
      </div>
    </section>
  );
}

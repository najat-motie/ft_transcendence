import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/game/mode.css";
import { apiRequest } from "../../services/api";

export default function Matchmaking() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Searching for opponent...");

  useEffect(() => {
    const startMatchmaking = async () => {
      try {
        const res = await apiRequest("/ready-online", { method: "POST" });
        const data = await res.json();

        setStatus("Match found! Starting game...");

        setTimeout(() => {
          navigate("/play/online", { state: { wsPath: data.ws_path } });
        }, 1500);
      } catch (err) {
        setStatus("Matchmaking failed.");
      }
    };

    startMatchmaking();
  }, [navigate]);

  return (
    <main className="matchmaking">
      <div className="matchmaking-container" role="status" aria-live="polite">
        <h2>Quick Match</h2>
        <p>{status}</p>
      </div>
    </main>
  );
}

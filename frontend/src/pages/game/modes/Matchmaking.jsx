import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../services/api";
import "../../../styles/game/game-mode.css";

export default function Matchmaking() {
  const navigate = useNavigate();
  const abortRef = useRef(null);
  const [status, setStatus] = useState("Searching for an online opponent...");
  const [isSearching, setIsSearching] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    const startMatchmaking = async () => {
      try {
        const match = await apiRequest("/ready-online", {
          method: "POST",
          signal: controller.signal,
        });

        setStatus("Match found. Joining room...");
        setIsSearching(false);
        navigate("/play/online", { state: match });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setStatus(error.message || "Matchmaking failed.");
        setIsSearching(false);
      }
    };

    startMatchmaking();

    return () => {
      controller.abort();
      abortRef.current = null;
    };
  }, [navigate]);

  const handleCancel = () => {
    abortRef.current?.abort();
    setIsSearching(false);
    navigate(-1);
  };

  return (
    <section className="matchmaking">
      <div className="matchmaking-container matchmaking-panel" role="status" aria-live="polite">
        <div className="matchmaking-kicker">Quick Match</div>
        <h2>Finding your next opponent</h2>
        <p className="matchmaking-lead">
          We are looking for an active player and preparing a live room with the fastest route in.
        </p>

        <div className="matchmaking-stage">
          <div className="matchmaking-radar" aria-hidden="true">
            <span className="matchmaking-radar-ring matchmaking-radar-ring-one" />
            <span className="matchmaking-radar-ring matchmaking-radar-ring-two" />
            <span className="matchmaking-radar-ring matchmaking-radar-ring-three" />
            <span className="matchmaking-radar-core" />
          </div>

          <div className="matchmaking-status-card">
            <div className="mm-spinner" aria-hidden="true" />
            <strong>{status}</strong>
            <span>
              {isSearching
                ? "Usually takes a few seconds. Stay here while we finish the connection."
                : "Room found. Redirecting you into the game now."}
            </span>
          </div>
        </div>

        <div className="matchmaking-steps" aria-hidden="true">
          <div className="matchmaking-step matchmaking-step-active">
            <span>1</span>
            <div>
              <strong>Searching queue</strong>
              <p>Scanning live players</p>
            </div>
          </div>
          <div className={`matchmaking-step ${!isSearching ? "matchmaking-step-active" : ""}`}>
            <span>2</span>
            <div>
              <strong>Creating room</strong>
              <p>Preparing realtime session</p>
            </div>
          </div>
          <div className="matchmaking-step">
            <span>3</span>
            <div>
              <strong>Launching game</strong>
              <p>Joining the board</p>
            </div>
          </div>
        </div>

        <div className="matchmaking-meta">
          <div className="matchmaking-meta-card">
            <strong>Mode</strong>
            <span>Ranked online</span>
          </div>
          <div className="matchmaking-meta-card">
            <strong>Connection</strong>
            <span>Realtime websocket</span>
          </div>
        </div>

        {isSearching && (
          <button className="ghost" type="button" onClick={handleCancel}>
            Cancel Search
          </button>
        )}
      </div>
    </section>
  );
}

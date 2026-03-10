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
      <div className="matchmaking-container">
        <h2>Quick Match</h2>
        <p>{status}</p>
        {isSearching && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </section>
  );
}

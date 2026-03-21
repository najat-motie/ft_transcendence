import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { cn } from "../../lib/cn";
import { slabHeading } from "../../lib/ui";
import { matchmakingContainerClass, matchmakingPageStyle } from "./gameUi";

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
      } catch {
        setStatus("Matchmaking failed.");
      }
    };

    startMatchmaking();
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center p-6 text-slate-200" style={matchmakingPageStyle}>
      <div className={`${matchmakingContainerClass} max-w-[400px]`} role="status" aria-live="polite">
        <h2 className={cn(slabHeading, "mb-2 text-[clamp(1.3rem,3vw,1.65rem)] text-slate-100")}>Quick Match</h2>
        <p className="m-0 text-[0.9rem] leading-[1.6] text-slate-400">{status}</p>
      </div>
    </main>
  );
}

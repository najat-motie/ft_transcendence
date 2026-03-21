import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../services/api";
import { cn } from "../../../lib/cn";
import { slabHeading } from "../../../lib/ui";
import {
  actionGhostClass,
  matchmakingContainerClass,
  matchmakingKickerClass,
  matchmakingMetaCardClass,
  matchmakingPageStyle,
  matchmakingStageClass,
  matchmakingStatusCardClass,
  matchmakingStepActiveClass,
  matchmakingStepBadgeActiveClass,
  matchmakingStepBadgeClass,
  matchmakingStepClass,
} from "../gameUi";

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
        navigate("/play/online", {
          state: {
            ...match,
            source: "matchmaking",
          },
        });
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
    <section className="flex min-h-screen items-start justify-center px-[clamp(1rem,4vw,3rem)] py-[clamp(1rem,4vw,3rem)] text-slate-200" style={matchmakingPageStyle}>
      <div className={`${matchmakingContainerClass} grid gap-[clamp(1rem,2vw,1.35rem)]`} role="status" aria-live="polite">
        <div className={matchmakingKickerClass}>Quick Match</div>
        <h2 className={cn(slabHeading, "m-0 text-[clamp(1.75rem,4vw,3rem)] text-slate-100")}>Finding your next opponent</h2>
        <p className="mx-auto max-w-[56ch] text-[clamp(0.95rem,1.5vw,1.05rem)] leading-[1.6] text-slate-400">
          We are looking for an active player and preparing a live room with the fastest route in.
        </p>

        <div className={matchmakingStageClass}>
          <div className="relative mx-auto grid aspect-square w-full max-w-[280px] place-items-center rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.08)_0%,rgba(15,23,42,0.05)_45%,transparent_68%),linear-gradient(180deg,rgba(15,23,42,0.6),rgba(15,23,42,0.2))]" aria-hidden="true">
            <span className="absolute inset-0 animate-ping rounded-full border border-sky-400/20"></span>
            <span className="absolute inset-[12%] animate-ping rounded-full border border-sky-400/20" style={{ animationDelay: "0.4s" }}></span>
            <span className="absolute inset-[24%] animate-ping rounded-full border border-sky-400/20" style={{ animationDelay: "0.8s" }}></span>
            <span className="h-[18px] w-[18px] rounded-full bg-sky-400 shadow-[0_0_0_10px_rgba(56,189,248,0.12),0_0_24px_rgba(56,189,248,0.75)]"></span>
          </div>

          <div className={matchmakingStatusCardClass}>
            <div className="h-11 w-11 animate-spin rounded-full border-[3px] border-sky-400/15 border-t-sky-400"></div>
            <strong className="text-[clamp(1rem,2vw,1.2rem)] text-slate-50">{status}</strong>
            <span className="text-[0.92rem] leading-[1.6] text-slate-400">
              {isSearching
                ? "Usually takes a few seconds. Stay here while we finish the connection."
                : "Room found. Redirecting you into the game now."}
            </span>
          </div>
        </div>

        <div className="grid gap-[0.85rem] min-[821px]:grid-cols-3">
          <div className={cn(matchmakingStepClass, matchmakingStepActiveClass)}>
            <span className={cn(matchmakingStepBadgeClass, matchmakingStepBadgeActiveClass)}>1</span>
            <div>
              <strong className="mb-[0.15rem] block text-[0.92rem] text-slate-50">Searching queue</strong>
              <p className="m-0 text-[0.8rem] leading-[1.45] text-slate-400">Scanning live players</p>
            </div>
          </div>
          <div className={cn(matchmakingStepClass, !isSearching && matchmakingStepActiveClass)}>
            <span className={cn(matchmakingStepBadgeClass, !isSearching && matchmakingStepBadgeActiveClass)}>2</span>
            <div>
              <strong className="mb-[0.15rem] block text-[0.92rem] text-slate-50">Creating room</strong>
              <p className="m-0 text-[0.8rem] leading-[1.45] text-slate-400">Preparing realtime session</p>
            </div>
          </div>
          <div className={matchmakingStepClass}>
            <span className={matchmakingStepBadgeClass}>3</span>
            <div>
              <strong className="mb-[0.15rem] block text-[0.92rem] text-slate-50">Launching game</strong>
              <p className="m-0 text-[0.8rem] leading-[1.45] text-slate-400">Joining the board</p>
            </div>
          </div>
        </div>

        <div className="grid gap-[0.85rem] min-[561px]:grid-cols-2">
          <div className={matchmakingMetaCardClass}>
            <strong className="text-[0.82rem] uppercase tracking-[0.05em] text-slate-50">Mode</strong>
            <span className="text-[0.92rem] text-slate-400">Ranked online</span>
          </div>
          <div className={matchmakingMetaCardClass}>
            <strong className="text-[0.82rem] uppercase tracking-[0.05em] text-slate-50">Connection</strong>
            <span className="text-[0.92rem] text-slate-400">Realtime websocket</span>
          </div>
        </div>

        {isSearching ? (
          <button className={`${actionGhostClass} justify-self-center max-[560px]:w-full`} type="button" onClick={handleCancel}>
            Cancel Search
          </button>
        ) : null}
      </div>
    </section>
  );
}

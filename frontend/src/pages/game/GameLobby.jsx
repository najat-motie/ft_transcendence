import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/cn";
import { goldPill, slabHeading } from "../../lib/ui";
import { lobbyPageStyle, playCardButtonClass, playCardClass, playShellClass } from "./gameUi";

export default function GameLobby() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ft_transcendence - Game Lobby";
  }, [])

  const gameModes = [
    {
      title: "Create Room",
      label: "Private room",
      description: "Create a room and invite your friend.",
      buttonText: "Create",
      route: "/play/create-room",
    },
    {
      title: "Join Room",
      label: "Room code",
      description: "Join a room using your unique room code.",
      buttonText: "Join",
      route: "/play/join-room",
    },
    {
      title: "Quick Match",
      label: "Online",
      description: "Get matched instantly with an online player.",
      buttonText: "Start",
      route: "/play/matchmaking",
    },
    {
      title: "Local Game",
      label: "Same device",
      description: "Play on the same device with a friend.",
      buttonText: "Play",
      route: "/play/local-game",
    },
    {
      title: "With AI",
      label: "Solo challenge",
      description: "Challenge yourself against an AI with human-like behavior.",
      buttonText: "Play",
      route: "/play/ai-game",
    },
  ];

  return (
    <section className="min-h-full px-[clamp(1rem,2vw,2rem)] py-[clamp(1rem,2vw,2rem)] text-slate-200 max-[900px]:p-4 max-[640px]:p-3" style={lobbyPageStyle}>
      <div className={playShellClass}>
        <div className="mx-auto mb-[clamp(1.5rem,4vw,3rem)] max-w-[720px] text-center max-[640px]:mx-0 max-[640px]:text-left">
          <span className={`${goldPill} mb-4`}>Game Lobby</span>
          <h2 className={cn(slabHeading, "mb-3 text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] text-slate-50")}>
            Choose Your Game Mode
          </h2>
          <p className="m-0 text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.7] text-slate-300">
            Pick the format that fits the moment, from quick online matches to private rooms, local battles, and AI practice.
          </p>
        </div>

        <div className="grid items-stretch gap-[clamp(1rem,2vw,1.5rem)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))] max-[640px]:grid-cols-1">
          {gameModes.map((mode) => (
            <article key={mode.title} className={playCardClass}>
              <div className="grid gap-[0.85rem]">
                <span className="inline-flex w-fit rounded-full bg-sky-400/15 px-3 py-1.5 text-[0.78rem] font-bold uppercase tracking-[0.04em] text-sky-300">
                  {mode.label}
                </span>
                <h3 className={cn(slabHeading, "text-[clamp(1.3rem,2vw,1.55rem)] text-white")}>{mode.title}</h3>
                <p className="m-0 text-[0.98rem] leading-[1.65] text-slate-400">{mode.description}</p>
              </div>
              <button
                className={playCardButtonClass}
                onClick={() => navigate(mode.route)}
                aria-label={`Open ${mode.title}`}
              >
                {mode.buttonText}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

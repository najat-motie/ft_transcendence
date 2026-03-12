import { useNavigate } from "react-router-dom";
import "../../styles/game/lobby.css";

export default function GameLobby() {
  const navigate = useNavigate();

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
    <section className="play-page">
      <div className="play-shell">
        <div className="play-header">
          <span className="play-kicker">Game Lobby</span>
          <h2 className="play-title">Choose Your Game Mode</h2>
          <p className="play-subtitle">
            Pick the format that fits the moment, from quick online matches to private rooms, local battles, and AI practice.
          </p>
        </div>

        <div className="play-modes">
          {gameModes.map(mode => (
            <article key={mode.title} className="play-card">
              <div className="play-card-content">
                <span className="play-card-tag">{mode.label}</span>
                <h3 className="play-card-title">{mode.title}</h3>
                <p className="play-card-desc">{mode.description}</p>
              </div>
              <button
                className="play-card-btn"
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

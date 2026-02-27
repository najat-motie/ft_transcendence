import { useNavigate } from "react-router-dom";
import "../../styles/game/lobby.css";

export default function GameLobby() {
  const navigate = useNavigate();

  const gameModes = [
    {
      title: "Create Room",
      description: "Create a room and invite your friend.",
      buttonText: "Create",
      route: "/play/create-room",
    },
    {
      title: "Join Room",
      description: "Join a room using your unique room code.",
      buttonText: "Join",
      route: "/play/join-room",
    },
    {
      title: "Quick Match",
      description: "Get matched instantly with an online player.",
      buttonText: "Start",
      route: "/play/matchmaking",
    },
    {
      title: "Local Game",
      description: "Play on the same device with a friend.",
      buttonText: "Play",
      route: "/play/local-game",
    },
    {
      title: "With AI",
      description: "Challenge yourself against an AI with human-like behavior.",
      buttonText: "Play",
      route: "/play/ai-game",
    }
  ];

  return (
    <div className="play-page">
      <div className="play-header">
        <h2 className="play-title">Choose Your Game Mode</h2>
        <p className="play-subtitle">
          Play your way — quick matches, private rooms, AI challenges, or local battles.
        </p>
      </div>

      <div className="play-modes">
        {gameModes.map((mode, index) => (
          <div key={index} className="play-card">
            <h3 className="play-card-title">{mode.title}</h3>
            <p className="play-card-desc">{mode.description}</p>
            <button
              className="play-card-btn"
              onClick={() => navigate(mode.route)}
            >
              {mode.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

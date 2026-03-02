import { useNavigate } from "react-router-dom";
import "../../styles/game/lobby.css";
import { apiRequest } from "../../services/api";
import { getUser } from "../../services/auth";

export default function GameLobby() {
  const navigate = useNavigate();

  const gameModes = [
    {
      title: "Play Local",
      description: "Play on the same device with a friend.",
      buttonText: "Play",
      mode: "offline",
    },
    {
      title: "Play Online",
      description: "Get matched instantly with an online player.",
      buttonText: "Start",
      mode: "online",
    },
    {
      title: "Play With AI",
      description: "Challenge yourself against an AI with human-like behavior.",
      buttonText: "Play",
      mode: "ai",
    },
  ];

  const createMatch = async (gameMode) => {
    try {
      if (gameMode.mode === "online") {
        navigate("/play/matchmaking");
        return;
      }

      const user = getUser();
      if (!user) return;

      let body = {};

      if (gameMode.mode === "ai") {
        body = {
          player_id: user.user.userId,
        };
      } else if (gameMode.mode === "offline") {
        body = {
          user_token: user.accessToken,
          player_choice: "X",
          starting_player: "X",
        };
      }

      const res = await apiRequest(`/${gameMode.mode}`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      navigate(`/play/${gameMode.mode}`, {
        state: { wsPath: data.ws_path },
      });

    } catch (err) {
      console.error("Failed to create match:", err);
    }
  };

  return (
    <main className="play-page">
      <header className="play-header">
        <h1 className="play-title">Choose Your Game Mode</h1>
        <p className="play-subtitle">
          Choose your challenge and prove your skills.
        </p>
      </header>

      <section className="play-modes" aria-label="Game modes">
        {gameModes.map((gameMode) => (
          <article
            key={gameMode.mode}
            className="play-card"
            aria-labelledby={`${gameMode.mode}-title`}
          >
            <h2
              id={`${gameMode.mode}-title`}
              className="play-card-title"
            >
              {gameMode.title}
            </h2>

            <p className="play-card-desc">
              {gameMode.description}
            </p>

            <button
              type="button"
              className="play-card-btn"
              onClick={() => createMatch(gameMode)}
            >
              {gameMode.buttonText}
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

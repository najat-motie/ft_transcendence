import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../services/api";
import "../../../styles/game/game-room.css";

export default function AIGame() {
  const navigate = useNavigate();

  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async (index) => {
    if (board[index] || winner || loading) return;

    try {
      setLoading(true);

      const data = await apiRequest("/ai/move", {
        method: "POST",
        body: JSON.stringify({
          board,
          move: index,
        }),
      });

      if (!data || !Array.isArray(data.board)) {
        throw new Error("Move failed");
      }

      setBoard(data.board);
      if (data.winner) {
        setWinner(data.winner);
      } else {
        setWinner(null);
      }
    } catch (error) {
      console.error("Error playing move:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetGame = async () => {
    try {
      const data = await apiRequest("/ai/reset", {
        method: "POST",
      });

      if (!data || !Array.isArray(data.board)) {
        throw new Error("Reset failed");
      }

      setBoard(data.board);
      if (data.winner) {
        setWinner(data.winner);
      } else {
        setWinner(null);
      }
    } catch (error) {
      console.error("Reset failed:", error);
    }
  };

  let winnerBanner = null;
  if (winner) {
    let bannerClassName = "winner-banner";
    let bannerText = "";

    if (winner === "Tie") {
      bannerClassName = "winner-banner tie";
      bannerText = "It's a Tie!";
    } else {
      bannerText = `${winner} Wins!`;
    }

    winnerBanner = <div className={bannerClassName}>{bannerText}</div>;
  }

  return (
    <section className="game-room">
      <div className="room-container">
        <h2>Challenge Yourself with an AI</h2>
        <p>Challenge yourself against an AI powered by the backend.</p>

        {winnerBanner}

        <div className="board">
          {board.map((cell, i) => (
            <div
              key={i}
              className={`cell ${cell}`}
              onClick={() => handleClick(i)}
            >
              {cell}
            </div>
          ))}
        </div>

        <div className="buttons">
          <button onClick={resetGame}>Restart</button>
          <button onClick={() => navigate("/play")}>Leave</button>
        </div>
      </div>
    </section>
  );
}

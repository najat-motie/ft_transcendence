import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { connectSocket, getSocket, closeSocket } from "../../services/socket";
import "../../styles/game/room.css";

export default function GameRoom({ mode = "local" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const wsPath = location.state?.wsPath;

  const [board, setBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState("");
  const [statusText, setStatusText] = useState("");
  const [gameStatus, setGameStatus] = useState("ongoing");

  useEffect(() => {
    if (!wsPath) return;

    const socket = connectSocket(wsPath);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.board) setBoard(data.board);
      if (data.status) setStatusText(data.status);
      if (data.game_status) setGameStatus(data.game_status);
      if (data.winner) setWinner(data.winner);
      if (data.message) setMessage(data.message);
    };

    socket.onclose = () => setStatusText("Disconnected from server.");

    return () => closeSocket();
  }, [wsPath]);

  const handleClick = (row, col) => {
    if (board[row][col] !== "" || gameStatus !== "ongoing") return;

    const socket = getSocket();
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ row, col }));
    }
  };

  return (
    <section className="game-room">
      <div className="room-container">
        <h2>
          {mode === "ai" && "Challenge Yourself with AI"}
          {mode === "local" && "Challenge your friend on the same device"}
        </h2>

        {gameStatus === "ongoing" && <p className="status">{statusText}</p>}

        {gameStatus === "win" && (
          <div className="winner-banner">{winner} wins!</div>
        )}

        {gameStatus === "tie" && (
          <div className="winner-banner tie">It's a Tie!</div>
        )}

        {message && <p className="game-message">{message}</p>}

        <div className="board">
          {board.map((rowArr, rowIndex) =>
            rowArr.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`cell ${cell}`}
                onClick={() => handleClick(rowIndex, colIndex)}
                role="button"
                aria-label={`Row ${rowIndex + 1} Column ${colIndex + 1}, ${cell || "empty"}`}
                tabIndex={0}
              >
                {cell}
              </div>
            ))
          )}
        </div>

        <div className="buttons">
          <button onClick={() => navigate(-1)}>Leave</button>
        </div>
      </div>
    </section>
  );
}

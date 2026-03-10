import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../services/api";
import { connectSocket, getSocket, closeSocket } from "../../../services/socket";
import "../../../styles/game/game-room.css";

const emptyBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

export default function AIGame() {
  const navigate = useNavigate();
  const connectionRef = useRef(0);

  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState(null);
  const [gameStatus, setGameStatus] = useState("starting");
  const [statusText, setStatusText] = useState("Starting AI game...");
  const [message, setMessage] = useState("");

  const startGame = async () => {
    const connectionId = connectionRef.current + 1;
    connectionRef.current = connectionId;

    closeSocket();
    setBoard(emptyBoard);
    setTurn("X");
    setWinner(null);
    setGameStatus("starting");
    setStatusText("Starting AI game...");
    setMessage("");

    try {
      const session = await apiRequest("/ai", { method: "POST" }, true);

      if (connectionId !== connectionRef.current) {
        return;
      }

      const socket = connectSocket(session.ws_path);

      socket.onmessage = (event) => {
        if (connectionId !== connectionRef.current) {
          return;
        }

        const data = JSON.parse(event.data);

        if (data.board) setBoard(data.board);
        if (data.turn !== undefined) setTurn(data.turn);
        if (data.game_status) setGameStatus(data.game_status);
        if (data.status) setStatusText(data.status);
        if (data.winner) setWinner(data.winner);
        if (data.message) setMessage(data.message);
        if (data.error) setMessage(data.error);
      };

      socket.onclose = () => {
        if (connectionId !== connectionRef.current) {
          return;
        }
        setStatusText("Disconnected from server.");
      };
    } catch (error) {
      if (connectionId !== connectionRef.current) {
        return;
      }

      setStatusText(error.message || "Failed to start AI game.");
      setGameStatus("error");
    }
  };

  useEffect(() => {
    startGame();

    return () => {
      connectionRef.current += 1;
      closeSocket();
    };
  }, []);

  const handleClick = (row, col) => {
    if (board[row][col] !== "" || gameStatus !== "ongoing" || turn !== "X") return;

    const socket = getSocket();
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ row, col }));
    }
  };

  const winnerText =
    winner === "Tie" || gameStatus === "tie"
      ? "It's a Tie!"
      : winner
        ? `${winner} Wins!`
        : null;

  return (
    <section className="game-room">
      <div className="room-container">
        <h2>Challenge Yourself with an AI</h2>
        {gameStatus === "ongoing" && <p>{turn === "X" ? "Your turn" : "AI turn"}</p>}
        {winnerText && (
          <div className={`winner-banner ${gameStatus === "tie" ? "tie" : ""}`}>{winnerText}</div>
        )}

        <p className="status">{statusText}</p>
        {message && <p className="game-message">{message}</p>}

        <div className="board">
          {board.map((rowArr, rowIndex) =>
            rowArr.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`cell ${cell}`}
                onClick={() => handleClick(rowIndex, colIndex)}
                role="button"
                tabIndex={0}
              >
                {cell}
              </div>
            ))
          )}
        </div>

        <div className="buttons">
          <button type="button" onClick={startGame}>
            Restart
          </button>
          <button type="button" onClick={() => navigate("/play")}>
            Leave
          </button>
        </div>
      </div>
    </section>
  );
}

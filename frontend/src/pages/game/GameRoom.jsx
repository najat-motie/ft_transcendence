import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { connectSocket, getSocket, closeSocket } from "../../services/socket";
import { cn } from "../../lib/cn";
import {
  boardBaseClass,
  cellBaseClass,
  cellOClass,
  cellXClass,
  roomButtonsClass,
  roomContainerClass,
  roomPageStyle,
  roomSectionClass,
  roomTitleClass,
  secondaryBoardButtonClass,
  statusTextClass,
  winnerTieClass,
  winnerWinClass,
} from "./gameUi";

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
    <section className={roomSectionClass} style={roomPageStyle}>
      <div className={roomContainerClass}>
        <h2 className={roomTitleClass}>
          {mode === "ai" && "Challenge Yourself with AI"}
          {mode === "local" && "Challenge your friend on the same device"}
        </h2>

        {gameStatus === "ongoing" ? <p className={statusTextClass}>{statusText}</p> : null}

        {gameStatus === "win" ? (
          <div className={winnerWinClass}>{winner} wins!</div>
        ) : null}

        {gameStatus === "tie" ? (
          <div className={winnerTieClass}>It's a Tie!</div>
        ) : null}

        {message ? <p className="my-[0.4rem] text-[0.875rem] text-slate-400">{message}</p> : null}

        <div className={boardBaseClass}>
          {board.map((rowArray, rowIndex) =>
            rowArray.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  cellBaseClass,
                  cell === "X" && cellXClass,
                  cell === "O" && cellOClass,
                )}
                onClick={() => handleClick(rowIndex, colIndex)}
                aria-label={`Row ${rowIndex + 1} Column ${colIndex + 1}, ${cell || "empty"}`}
                disabled={gameStatus !== "ongoing" || cell !== ""}
              >
                {cell}
              </button>
            )),
          )}
        </div>

        <div className={roomButtonsClass}>
          <button className={secondaryBoardButtonClass} onClick={() => navigate(-1)}>Leave</button>
        </div>
      </div>
    </section>
  );
}

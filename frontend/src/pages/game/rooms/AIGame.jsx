import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../services/api";
import { connectSocket, getSocket, closeSocket } from "../../../services/socket";
import { useSettings } from "../../../state/settings/settings.context";
import { exportSettings } from "../../../state/settings/settings.storage";
import boardsConfig from "../../../config/boards.config.json";
import { resolveSkinAssets } from "../../../utils/skinAssets";
import { playSound } from "../../../utils/soundPlayer";
import "../../../styles/game/room.css";

const emptyBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

export default function AIGame() {
  const navigate = useNavigate();
  const connectionRef = useRef(0);
  const { settings } = useSettings();
  const { xSrc, oSrc, boardSrc } = resolveSkinAssets(settings);
  const boardLabel = boardsConfig.themes.find((theme) => theme.id === settings.board.theme)?.label || "Board";

  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState(null);
  const [gameStatus, setGameStatus] = useState("starting");
  const [statusText, setStatusText] = useState("Starting AI game...");
  const [message, setMessage] = useState("");
  const [exportUrl, setExportUrl] = useState(null);
  const [lastBoardSignature, setLastBoardSignature] = useState("");
  const [isStarting, setIsStarting] = useState(false);

  const startGame = async () => {
    if (isStarting) {
      return;
    }

    const connectionId = connectionRef.current + 1;
    connectionRef.current = connectionId;
    setIsStarting(true);

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
    } finally {
      if (connectionId === connectionRef.current) {
        setIsStarting(false);
      }
    }
  };

  useEffect(() => {
    startGame();

    return () => {
      connectionRef.current += 1;
      closeSocket();
    };
  }, []);

  useEffect(() => {
    const blob = new Blob([exportSettings()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    setExportUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [settings]);

  useEffect(() => {
    if (!settings.sound.enabled) return;
    const signature = board.flat().join("");
    if (signature && signature !== lastBoardSignature) {
      playSound(settings.sound.selected, settings.sound.volume);
      setLastBoardSignature(signature);
    }
    if (gameStatus === "win" || gameStatus === "tie") {
      playSound("win", settings.sound.volume);
    }
  }, [board, gameStatus, lastBoardSignature, settings.sound.enabled, settings.sound.selected, settings.sound.volume]);

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
        {gameStatus === "ongoing" && (
          <p className="turn-indicator">
            {turn === "X" ? "Your turn" : "AI is thinking…"}
          </p>
        )}
        {winnerText && (
          <div className={`winner-banner ${gameStatus === "tie" ? "tie" : ""}`}>{winnerText}</div>
        )}

        <div aria-live="polite">
          <p className="status">{statusText}</p>
          {message && <p className="game-message">{message}</p>}
        </div>

        <div className="board-shell">
          <div className="board-toolbar">
            <div className="board-meta">
              <span className="board-chip">Board</span>
              <strong>{boardLabel}</strong>
            </div>
            <div className="board-actions">
              <button className="secondary" type="button" onClick={startGame} disabled={isStarting}>
                Restart
              </button>
              <button className="secondary danger" type="button" onClick={() => navigate("/play")}>
                Leave
              </button>
            </div>
          </div>

          <div
            className={`board ${boardSrc ? "board-has-bg" : ""} ${
              settings.effects.enabled && settings.effects.active.includes("glow") ? "effects-glow" : ""
            }`}
            style={boardSrc ? { backgroundImage: `url(${boardSrc})`, backgroundSize: "cover" } : {}}
          >
            {board.map((rowArr, rowIndex) =>
              rowArr.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`cell ${cell}`}
                  onClick={() => handleClick(rowIndex, colIndex)}
                  aria-label={`Row ${rowIndex + 1} Column ${colIndex + 1}, ${cell || "empty"}`}
                  disabled={cell !== "" || gameStatus !== "ongoing" || turn !== "X"}
                >
                  {cell === "X" && xSrc ? <img src={xSrc} alt="X skin" /> : null}
                  {cell === "O" && oSrc ? <img src={oSrc} alt="O skin" /> : null}
                  {cell !== "X" && cell !== "O" ? cell : null}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

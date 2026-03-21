import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../services/api";
import { connectSocket, getSocket, closeSocket } from "../../../services/socket";
import { useSettings } from "../../../state/settings/settings.context";
import boardsConfig from "../../../config/boards.config.json";
import { resolveSkinAssets } from "../../../utils/skinAssets";
import { playSound } from "../../../utils/soundPlayer";
import { cn } from "../../../lib/cn";
import {
  boardActionsClass,
  boardBaseClass,
  boardChipClass,
  boardFrameClass,
  boardMetaClass,
  boardShellClass,
  boardSkinClass,
  boardToolbarClass,
  cellBackgroundClass,
  cellBaseClass,
  cellGlowClass,
  cellOClass,
  cellXClass,
  gameMessageClass,
  roomContainerClass,
  roomLeaveButtonClass,
  roomPageStyle,
  roomRestartButtonClass,
  roomSectionClass,
  roomTitleClass,
  statusTextClass,
  turnIndicatorClass,
  winnerTieClass,
  winnerWinClass,
} from "../gameUi";

const emptyBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

export default function LocalGame() {
  const navigate = useNavigate();
  const connectionRef = useRef(0);
  const { settings } = useSettings();
  const { xSrc, oSrc, boardSrc } = resolveSkinAssets(settings);
  const boardLabel = boardsConfig.themes.find((theme) => theme.id === settings.board.theme)?.label || "Board";

  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState(null);
  const [gameStatus, setGameStatus] = useState("starting");
  const [statusText, setStatusText] = useState("Starting local game...");
  const [message, setMessage] = useState("");
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
    setStatusText("Starting local game...");
    setMessage("");

    try {
      const session = await apiRequest("/offline", { method: "POST" }, true);

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

      setStatusText(error.message || "Failed to start local game.");
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
    if (board[row][col] !== "" || gameStatus !== "ongoing") return;

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

  const renderCellContent = (cell) => {
    if (cell === "X") {
      return xSrc ? <img src={xSrc} alt="X skin" className={boardSkinClass} /> : "X";
    }
    if (cell === "O") {
      return oSrc ? <img src={oSrc} alt="O skin" className={boardSkinClass} /> : "O";
    }
    return cell;
  };

  return (
    <section className={roomSectionClass} style={roomPageStyle}>
      <div className={roomContainerClass}>
        <h2 className={roomTitleClass}>Local Game</h2>
        {gameStatus === "ongoing" ? (
          <p className={turnIndicatorClass}>
            {turn === "X" ? "Player X - your turn" : "Player O - your turn"}
          </p>
        ) : null}
        {winnerText ? (
          <div className={gameStatus === "tie" ? winnerTieClass : winnerWinClass}>{winnerText}</div>
        ) : null}

        <div aria-live="polite">
          <p className={statusTextClass}>{statusText}</p>
          {message ? <p className={gameMessageClass}>{message}</p> : null}
        </div>

        <div className={boardShellClass}>
          <div className={boardToolbarClass}>
            <div className={boardMetaClass}>
              <span className={boardChipClass}>Board</span>
              <strong>{boardLabel}</strong>
            </div>
            <div className={boardActionsClass}>
              <button className={roomRestartButtonClass} type="button" onClick={startGame} disabled={isStarting}>
                Restart
              </button>
              <button className={roomLeaveButtonClass} type="button" onClick={() => navigate(-1)}>
                Leave
              </button>
            </div>
          </div>

          <div
            className={cn(boardBaseClass, boardSrc && boardFrameClass)}
            style={boardSrc ? { backgroundImage: `url(${boardSrc})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
          >
            {board.map((rowArray, rowIndex) =>
              rowArray.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    cellBaseClass,
                    boardSrc && cellBackgroundClass,
                    settings.effects.enabled && settings.effects.active.includes("glow") && cellGlowClass,
                    cell === "X" && cellXClass,
                    cell === "O" && cellOClass,
                  )}
                  onClick={() => handleClick(rowIndex, colIndex)}
                  aria-label={`Row ${rowIndex + 1} Column ${colIndex + 1}, ${cell || "empty"}`}
                  disabled={cell !== "" || gameStatus !== "ongoing"}
                >
                  {renderCellContent(cell)}
                </button>
              )),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

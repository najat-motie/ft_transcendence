import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { connectSocket, getSocket, closeSocket } from "../../services/socket";
import { useSettings } from "../../state/settings/settings.context";
import boardsConfig from "../../config/boards.config.json";
import { resolveSkinAssets } from "../../utils/skinAssets";
import { playSound } from "../../utils/soundPlayer";
import { cn } from "../../lib/cn";
import {
  boardBaseClass,
  boardFrameClass,
  boardShellClass,
  boardSkinClass,
  cellBackgroundClass,
  cellBaseClass,
  cellGlowClass,
  cellOClass,
  cellXClass,
  roomButtonsClass,
  gameMessageClass,
  roomContainerClass,
  roomLeaveButtonClass,
  roomPageStyle,
  roomRestartButtonClass,
  roomSectionClass,
  roomTitleClass,
  statusTextClass,
  winnerTieClass,
  winnerWinClass,
} from "./gameUi";

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
  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState(null);
  const [gameStatus, setGameStatus] = useState("starting");
  const [statusText, setStatusText] = useState("Starting local game...");
  const [message, setMessage] = useState("");
  const [lastBoardSignature, setLastBoardSignature] = useState("");
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    document.title = "ft_transcendence - Playing vs Friend Locally";
  }, [])

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
    setStatusText("");
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
        if (data.winner) setWinner(data.winner);
        if (data.error) setStatusText(data.error);
      };

      socket.onclose = () => {
        if (connectionId !== connectionRef.current) {
          return;
        }
      };
    } catch (error) {
      if (connectionId !== connectionRef.current) {
        return;
      }

      setStatusText(error.message || "Failed to start local game.");
      setMessage("");
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

  useEffect(() => {
    if (turn === "X") {
      setMessage("X Turn");
    } else {
      setMessage("O turn");
    }
  }, [turn]);

  const handleClick = (row, col) => {
    if (board[row][col] !== "" || gameStatus !== "ongoing") return;

    const socket = getSocket();
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ row, col }));
    }
  };

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
        <h2 className={roomTitleClass}>Play with your friend on the same device</h2>
        
        <div aria-live="polite">
          {statusText ? <p className={statusTextClass}>{statusText}</p> : null}
        </div>

        {gameStatus === "ongoing" ? (
          <p className={gameMessageClass}>{message}</p>
        ) : null}

        { gameStatus === "win" ? <div className={winnerWinClass}>`${winner} Wins!`</div> : null}

        {gameStatus === "tie" ? <div className={winnerTieClass}>It's a Tie!</div> : null}

        <div className={boardShellClass}>
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

        <div className={roomButtonsClass}>
          <button className={roomRestartButtonClass} type="button" onClick={startGame} disabled={isStarting}>
            Restart
          </button>
          <button className={roomLeaveButtonClass} type="button" onClick={() => navigate(-1)}>
            Leave
          </button>
        </div>

      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { connectSocket, getSocket, closeSocket } from "../../services/socket";
import { useSettings } from "../../state/settings/settings.context";
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
  const [isStarting, setIsStarting] = useState(false);
  const [lastBoardSignature, setLastBoardSignature] = useState("");
  const [gameStatus, setGameStatus] = useState("starting");
  const [message, setMessage] = useState("Starting local game...");

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
    setMessage("Starting local game...");

    try {
      const session = await apiRequest("/offline", { method: "POST" }, true);

      if (connectionId !== connectionRef.current) {
        return;
      }

      connectSocket(session.ws_path, {
        onMessage: (event) => {
          if (connectionId !== connectionRef.current) {
            return;
          }

          const data = JSON.parse(event.data);

          if (data.board) setBoard(data.board);
          if (data.turn !== undefined) setTurn(data.turn);
          if (data.game_status) setGameStatus(data.game_status);
          if (data.winner) setWinner(data.winner);
        },
        onClose: () => {
          if (connectionId !== connectionRef.current) {
            return;
          }
          setMessage("Connection to the game was lost. You can restart or leave the match.");
        },
      });
    } catch (error) {
      if (connectionId !== connectionRef.current) {
        return;
      }

      setGameStatus("error");
      setMessage(error.message || "Failed to start local game.");
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
    if (gameStatus !== "ongoing") return;
  
    setMessage(`${turn} Turn`);
  }, [turn, gameStatus]);

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
          <p className={gameMessageClass}>{message}</p>
        </div>

        {gameStatus === "win" ? (
          <div className={winnerWinClass}>{winner} Wins!</div>
        ) : gameStatus === "tie" ? (
          <div className={winnerTieClass}>It's a Tie!</div>
        ) : null}

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
          <button className={roomLeaveButtonClass} type="button" onClick={() => navigate("/play")}>
            Leave
          </button>
        </div>

      </div>
    </section>
  );
}

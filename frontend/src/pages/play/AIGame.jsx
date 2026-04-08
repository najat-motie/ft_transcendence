import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { connectSocket, getSocket, closeSocket } from "../../services/socket";
import { getUser } from "../../services/auth";
import { useSettings } from "../../state/settings/settings.context";
import { resolveSkinAssets } from "../../utils/skinAssets";
import { playSound } from "../../utils/soundPlayer";
import { cn } from "../../lib/cn";
import aiAvatar from "../../assets/ai.png"
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
  playerAvatarClass,
  playerCardClass,
  playerInfoClass,
  roomContainerClass,
  roomLeaveButtonClass,
  roomRestartButtonClass,
  roomPageStyle,
  roomSectionClass,
  roomTitleClass,
  statusTextClass,
  winnerLoseClass,
  winnerTieClass,
  winnerWinClass,
} from "./gameUi";

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
  const session = getUser();
  const user = session?.user;

  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState("X");
  const [role, setRole] = useState("X");
  const [winner, setWinner] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [lastBoardSignature, setLastBoardSignature] = useState("");
  const [gameStatus, setGameStatus] = useState("starting");
  const [message, setMessage] = useState("Starting AI game...");
  const aiMessages = [
    "Nice move!",
    "Keep going!",
    "Smart choice!",
    "I see your move.",
    "Hmm... interesting.",
    "Let me think... 🤔",
    "You're doing great!",
    "Interesting move...",
    "You're challenging me 👀",
    "Let's see what happens next!",
  ];
  const aiUsername = "NovaBot";
  const prevBoardRef = useRef(board);
  const lastMessageRef = useRef("");
  const hasShownStartMessage = useRef(false);

  useEffect(() => {
    document.title = "ft_transcendence - Playing vs AI";
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
    setRole("X");
    setWinner(null);
    setGameStatus("starting");
    setMessage("Starting AI game...");
    hasShownStartMessage.current = false;

    try {
      const session = await apiRequest("/ai", { method: "POST" }, true);

      if (connectionId !== connectionRef.current) {
        return;
      }

      connectSocket(session.ws_path, {
        onMessage: (event) => {
          if (connectionId !== connectionRef.current) {
            return;
          }

          let data;
          try {
            data = JSON.parse(event.data);
          } catch {
            return;
          }

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
      setMessage(error.message || "Failed to start AI game.");
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
    if (
      gameStatus === "ongoing" &&
      turn === role &&
      !hasShownStartMessage.current
    ) {
      setMessage("Make your move!");
      hasShownStartMessage.current = true;
    }
  }, [gameStatus, turn, role]);

  useEffect(() => {
    if (gameStatus !== "ongoing") return;

    const prevBoard = prevBoardRef.current;

    const xMoved = board.some((row, r) =>
      row.some((cell, c) => cell === "X" && prevBoard[r][c] !== "X")
    );

    const isBoardEmpty = board.flat().every(cell => cell === "");

    if (isBoardEmpty || !xMoved) {
      prevBoardRef.current = board;
      return;
    }

    let randomMessage;

    do {
      randomMessage =
        aiMessages[Math.floor(Math.random() * aiMessages.length)];
    } while (randomMessage === lastMessageRef.current);

    lastMessageRef.current = randomMessage;

    setMessage(randomMessage);

    prevBoardRef.current = board;

  }, [board]);

  const handleClick = (row, col) => {
    if (board[row][col] !== "" || gameStatus !== "ongoing" || turn !== role) return;

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
        {!user && <h2 className={roomTitleClass}>Challenge Yourself with an AI</h2>}
        {user ? (
        <div className={playerCardClass}>
          <div className={playerInfoClass}>
              <img src={aiAvatar} alt="ai avatar" className={playerAvatarClass} />
            <div>
              <h4 className="mb-[0.15rem] text-[0.9rem] font-semibold text-slate-100">{aiUsername}</h4>
              <span className={statusTextClass}>
                <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]"></span>
                Online
              </span>
            </div>
          </div>
        </div>
        ) : null}

        <div aria-live="polite">
          <p className={gameMessageClass}>{message}</p>
        </div>

        {gameStatus === "win" ? (
          <div className={winner === role ? winnerWinClass : winnerLoseClass}>
            {winner === role ? "You Win!" : "You Lose!"}
          </div>
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
                  disabled={cell !== "" || gameStatus !== "ongoing" || turn !== "X"}
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
          <button className={roomLeaveButtonClass}  type="button" onClick={() => navigate("/play")}>
            Leave
          </button>
        </div>

        {user ? (
        <div className={playerCardClass}>
          <div className={playerInfoClass}>
            {user.avatar ? (
              <img src={user.avatar} alt={`${user.username} avatar`} className={playerAvatarClass} />
            ) : null}
            <div>
              <h4 className="mb-[0.15rem] text-[0.9rem] font-semibold text-slate-100">{user.username} (You)</h4>
              <span className={statusTextClass}>
                <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]"></span>
                Online
              </span>
            </div>
          </div>
        </div>
        ) : null}

      </div>
    </section>
  );
}

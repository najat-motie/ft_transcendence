import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { connectSocket, getSocket, closeSocket } from "../../services/socket";
import { getUser } from "../../services/auth";
import { useSettings } from "../../state/settings/settings.context";
import { resolveSkinAssets } from "../../utils/skinAssets";
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
  gameMessageClass,
  playerAvatarClass,
  playerCardClass,
  playerInfoClass,
  primaryRoomButtonClass,
  dangerRoomButtonClass,
  roomButtonsClass,
  roomContainerClass,
  roomPageStyle,
  roomSectionClass,
  statusTextClass,
  winnerLoseClass,
  winnerTieClass,
  winnerWinClass,
} from "./gameUi";

const mapPlayers = (players = [], currentUserId) => {
  const currentPlayer = players.find((player) => player.id === currentUserId) || null;
  const opponent = players.find((player) => player.id !== currentUserId) || null;

  return {
    bottom: currentPlayer,
    top: opponent,
  };
};

export default function OnlineGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSettings();
  const { xSrc, oSrc, boardSrc } = resolveSkinAssets(settings);
  const match = location.state || {};
  const source = match.source || null;
  const wsPath = match.ws_path || match.wsPath;
  const session = getUser();
  const savedUser = session?.user;

  const [board, setBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [role, setRole] = useState(match.role || null);
  const [turn, setTurn] = useState("Waiting for first move...");
  const [winner, setWinner] = useState(null);
  const [players, setPlayers] = useState(() => mapPlayers(match.players, savedUser?.userId));
  const [gameStatus, setGameStatus] = useState("waiting");
  const [statusText, setStatusText] = useState("Waiting for players...");
  const [message, setMessage] = useState("");
  const opponentName = players.top?.username || "Opponent";

  useEffect(() => {
    document.title = "ft_transcendence - Playing vs Online Player";
  }, []);

  useEffect(() => {
    if (!savedUser?.userId || !wsPath) {
      navigate("/play");
      return;
    }

    let isMounted = true;

    connectSocket(wsPath, {
      onOpen: (_, openedSocket) => {
        if (!isMounted || openedSocket.readyState !== WebSocket.OPEN) {
          return;
        }

        openedSocket.send(JSON.stringify({ player_id: savedUser.userId }));
        setStatusText("");
      },
      onMessage: (event) => {
        if (!isMounted) {
          return;
        }

        let data;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }

        if (data.role) setRole(data.role);
        if (data.players) setPlayers(mapPlayers(data.players, savedUser.userId));
        if (data.board) setBoard(data.board);
        if (data.turn !== undefined) setTurn(data.turn);
        if (data.game_status) setGameStatus(data.game_status);
        if (data.winner) setWinner(data.winner);
        if (data.message) setMessage(data.message);
        if (data.error) setMessage(data.error);
      },
      onClose: () => {
        if (!isMounted) {
          return;
        }

        setMessage("");
        setStatusText("Reconnecting to server...");
      },
    });

    return () => {
      isMounted = false;
      closeSocket();
    };
  }, [navigate, savedUser?.userId, wsPath]);

  useEffect(() => {
    if (gameStatus === "waiting") {
      setMessage("Waiting for both players...");
    } else if (gameStatus === "ongoing" && turn === role) {
      setMessage("Your turn");
    } else {
      setMessage(`${opponentName}'s turn`);
    }
  }, [turn, gameStatus, role]);

  const handleClick = (row, col) => {
    if (!savedUser?.userId) return;
    if (board[row][col] !== "" || gameStatus !== "ongoing" || role !== turn) return;

    const socket = getSocket();
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ player_id: savedUser.userId, row, col }));
    }
  };

  const handleRestart = () => {
    closeSocket();

    if (source === "matchmaking") {
      navigate("/play/matchmaking");
      return;
    }

    if (source === "create-room") {
      navigate("/play/create-room");
      return;
    }

    if (source === "join-room") {
      navigate("/play/join-room");
      return;
    }

    navigate("/play");
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

  if (!role) {
    return (
      <section className={roomSectionClass} style={roomPageStyle}>
        <div className={roomContainerClass}>
          <p className={statusTextClass}>Connecting to game...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={roomSectionClass} style={roomPageStyle}>
      <div className={roomContainerClass}>
        {players.top ? (
          <div className={playerCardClass}>
            <div className={playerInfoClass}>
              {players.top.avatar ? (
                <img src={players.top.avatar} alt={`${players.top.username} avatar`} className={playerAvatarClass} />
              ) : null}
              <div>
                <h4 className="mb-[0.15rem] text-[0.9rem] font-semibold text-slate-100">{players.top.username}</h4>
                <span className={statusTextClass}>
                  <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]"></span>
                  Online
                </span>
              </div>
            </div>
          </div>
        ) : null}

        <div aria-live="polite">
          {statusText ? <p className={statusTextClass}>{statusText}</p> : null}
        </div>

        {gameStatus === "waiting" || gameStatus === "ongoing" ? (
          <p className={gameMessageClass}>{message}</p>
        ) : null}

        {gameStatus === "win" ? (
          <div className={winner === role ? winnerWinClass : winnerLoseClass}>
            {winner === role ? "You Win!" : "You Lose!"}
          </div>
        ) : null}

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
                  disabled={cell !== "" || gameStatus !== "ongoing" || role !== turn}
                >
                  {renderCellContent(cell)}
                </button>
              )),
            )}
          </div>
        </div>

        <div className={roomButtonsClass}>
          <button className={primaryRoomButtonClass}  type="button" onClick={handleRestart}>
            Restart
          </button>
          <button className={dangerRoomButtonClass}  type="button" onClick={() => navigate("/play")}>
            Leave
          </button>
        </div>

        {players.bottom ? (
          <div className={playerCardClass}>
            <div className={playerInfoClass}>
              {players.bottom.avatar ? (
                <img src={players.bottom.avatar} alt={`${players.bottom.username} avatar`} className={playerAvatarClass} />
              ) : null}
              <div>
                <h4 className="mb-[0.15rem] text-[0.9rem] font-semibold text-slate-100">{players.bottom.username} (You)</h4>
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
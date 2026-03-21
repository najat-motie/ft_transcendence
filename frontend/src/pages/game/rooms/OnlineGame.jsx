import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../../state/settings/settings.context";
import boardsConfig from "../../../config/boards.config.json";
import { resolveSkinAssets } from "../../../utils/skinAssets";
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
  playerAvatarClass,
  playerCardClass,
  playerInfoClass,
  roomContainerClass,
  roomLeaveButtonClass,
  roomPageStyle,
  roomRestartButtonClass,
  roomSectionClass,
  statusTextClass,
  turnIndicatorClass,
  winnerLoseClass,
  winnerTieClass,
  winnerWinClass,
} from "../gameUi";

export default function OnlineGame() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { xSrc, oSrc, boardSrc } = resolveSkinAssets(settings);
  const boardLabel = boardsConfig.themes.find((theme) => theme.id === settings.board.theme)?.label || "Board";
  const [players, setPlayers] = useState(null);
  const [matchId, setMatchId] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState(null);

  const handleClick = (index) => {
    if (!players || board[index] || turn !== players.bottom.symbol || winner) return;
  };

  const resetGame = () => {};

  useEffect(() => {
    return () => {};
  }, []);

  const renderCellContent = (cell) => {
    if (cell === "X") {
      return xSrc ? <img src={xSrc} alt="X skin" className={boardSkinClass} /> : "X";
    }
    if (cell === "O") {
      return oSrc ? <img src={oSrc} alt="O skin" className={boardSkinClass} /> : "O";
    }
    return null;
  };

  if (!players || !matchId) {
    return (
      <section className={roomSectionClass} style={roomPageStyle}>
        <div className={roomContainerClass}>
          <p className={statusTextClass}>Waiting for opponent...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={roomSectionClass} style={roomPageStyle}>
      <div className={roomContainerClass}>
        <div className={playerCardClass}>
          <div className={playerInfoClass}>
            <img src={players.top.avatar} alt="avatar" className={playerAvatarClass} />
            <div>
              <h4 className="mb-[0.15rem] text-[0.9rem] font-semibold text-slate-100">{players.top.username}</h4>
              <span className={statusTextClass}>
                <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]"></span>
                Online
              </span>
            </div>
          </div>
        </div>

        {!winner ? (
          <div className={turnIndicatorClass}>
            {turn === players.bottom.symbol ? "Your turn" : "Opponent's turn"}
          </div>
        ) : null}

        {winner ? (
          <div
            className={
              winner === "Tie"
                ? winnerTieClass
                : winner === players.bottom.symbol
                  ? winnerWinClass
                  : winnerLoseClass
            }
          >
            {winner === "Tie"
              ? "It's a Tie!"
              : winner === players.bottom.symbol
                ? "You Win!"
                : "You Lose!"}
          </div>
        ) : null}

        <div className={boardShellClass}>
          <div className={boardToolbarClass}>
            <div className={boardMetaClass}>
              <span className={boardChipClass}>Board</span>
              <strong>{boardLabel}</strong>
            </div>
            <div className={boardActionsClass}>
              <button className={roomRestartButtonClass} type="button" onClick={resetGame}>
                Restart
              </button>
              <button className={roomLeaveButtonClass} type="button" onClick={() => navigate("/play")}>
                Leave
              </button>
            </div>
          </div>

          <div
            className={cn(boardBaseClass, boardSrc && boardFrameClass)}
            style={boardSrc ? { backgroundImage: `url(${boardSrc})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
          >
            {board.map((cell, index) => (
              <button
                key={index}
                className={cn(
                  cellBaseClass,
                  boardSrc && cellBackgroundClass,
                  settings.effects.enabled && settings.effects.active.includes("glow") && cellGlowClass,
                  cell === "X" && cellXClass,
                  cell === "O" && cellOClass,
                )}
                onClick={() => handleClick(index)}
                aria-label={`Cell ${index + 1}, ${cell || "empty"}`}
              >
                {renderCellContent(cell)}
              </button>
            ))}
          </div>
        </div>

        <div className={playerCardClass}>
          <div className={playerInfoClass}>
            <img src={players.bottom.avatar} alt="avatar" className={playerAvatarClass} />
            <div>
              <h4 className="mb-[0.15rem] text-[0.9rem] font-semibold text-slate-100">{players.bottom.username}</h4>
              <span className={statusTextClass}>
                <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]"></span>
                Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

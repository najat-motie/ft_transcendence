import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { connectSocket, getSocket, closeSocket } from "../../services/socket";
import { getUser } from "../../services/auth";
import "../../styles/game/room.css";

const emptyBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

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
  const match = location.state || {};
  const wsPath = match.ws_path || match.wsPath;
  const session = getUser();
  const savedUser = session?.user;

  const [board, setBoard] = useState(emptyBoard);
  const [role, setRole] = useState(match.role || null);
  const [turn, setTurn] = useState(null);
  const [winner, setWinner] = useState(null);
  const [players, setPlayers] = useState(() => mapPlayers(match.players, savedUser?.userId));
  const [gameStatus, setGameStatus] = useState("waiting");
  const [statusText, setStatusText] = useState("Waiting for players...");
  const [message, setMessage] = useState("");
  const [lastMove, setLastMove] = useState(null);

  useEffect(() => {
    if (!savedUser?.userId || !wsPath) {
      navigate("/play");
      return;
    }

    const socket = connectSocket(wsPath);

    socket.onopen = () => {
      socket.send(JSON.stringify({ player_id: savedUser.userId }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.role) setRole(data.role);
      if (data.players) setPlayers(mapPlayers(data.players, savedUser.userId));
      if (data.board) setBoard(data.board);
      if (data.status) setStatusText(data.status);
      if (data.turn !== undefined) setTurn(data.turn);
      if (data.game_status) setGameStatus(data.game_status);
      if (data.winner) setWinner(data.winner);
      if (data.message) setMessage(data.message);
      if (data.last_move !== undefined) setLastMove(data.last_move);
      if (data.error) setMessage(data.error);
    };

    socket.onclose = () => {
      setStatusText("Disconnected from server.");
    };

    return () => {
      closeSocket();
    };
  }, [navigate, savedUser?.userId, wsPath]);

  const handleClick = (row, col) => {
    if (!savedUser?.userId) return;
    if (board[row][col] !== "" || gameStatus !== "ongoing" || role !== turn) return;

    const socket = getSocket();
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ player_id: savedUser.userId, row, col }));
    }
  };

  if (!role) return <p className="status">Connecting to game...</p>;

  return (
    <section className="game-room">
      <div className="room-container">
        {players.top && (
          <div className="player-card">
            <div className="player-info">
              {players.top.avatar && (
                <img src={players.top.avatar} alt={`${players.top.username} avatar`} />
              )}
              <div>
                <h4>{players.top.username}</h4>
                <span className="status">
                  <span className="dot online"></span>Online
                </span>
              </div>
            </div>
          </div>
        )}

        {(gameStatus === "waiting" || gameStatus === "ongoing") && (
          <div className="turn-indicator">
            {gameStatus === "waiting"
              ? "Waiting for both players..."
              : turn === role
                ? "Your turn"
                : "Opponent's turn"}
          </div>
        )}

        {gameStatus === "win" && (
          <div className={`winner-banner ${winner !== role ? "lose" : ""}`}>
            {winner === role ? "You Win!" : "You Lose!"}
          </div>
        )}

        {gameStatus === "tie" && <div className="winner-banner tie">It's a Tie!</div>}

        <p className="status">{statusText}</p>
        {message && <p className="game-message">{message}</p>}
        {lastMove && (
          <p className="game-message">
            Last move: {lastMove.role} at ({lastMove.row}, {lastMove.col})
          </p>
        )}

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

        <div className="game-buttons">
          <button onClick={() => navigate(-1)}>Leave</button>
        </div>

        {players.bottom && (
          <div className="player-card">
            <div className="player-info">
              {players.bottom.avatar && (
                <img src={players.bottom.avatar} alt={`${players.bottom.username} avatar`} />
              )}
              <div>
                <h4>{players.bottom.username} (You)</h4>
                <span className="status">
                  <span className="dot online"></span>Online
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

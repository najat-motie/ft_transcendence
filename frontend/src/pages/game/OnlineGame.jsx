import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { connectSocket, getSocket, closeSocket } from "../../services/socket";
import { getUser } from "../../services/auth";
import "../../styles/game/room.css";

export default function OnlineGame() {
  const navigate = useNavigate();
  const location = useLocation();
  const wsPath = location.state?.wsPath;

  const [board, setBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [role, setRole] = useState(null);
  const [turn, setTurn] = useState(null);
  const [winner, setWinner] = useState(null);
  const [players, setPlayers] = useState({ bottom: null, top: null });
  const [gameStatus, setGameStatus] = useState("");
  // const [statusText, setStatusText] = useState("");
  const [message, setMessage] = useState("");

  const savedUser = getUser().user;

  useEffect(() => {
    if (!wsPath) {
      navigate("/");
      return;
    }

    const socket = connectSocket(wsPath);

    socket.onopen = () => {
      socket.send(JSON.stringify({ player_id: savedUser.userId }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.role) setRole(data.role);
      if (data.board) setBoard(data.board);
      if (data.status) setStatusText(data.status);
      // Need to send the current player's turn ("X" || "O") as `turn` 
      // so the frontend knows whose move it is and can prevent playing when it's not a player's turn
      if (data.turn) setTurn(data.turn);
      if (data.game_status) setGameStatus(data.game_status);
      if (data.winner) setWinner(data.winner);
      if (data.message) setMessage(data.message);
      
      

      // Need to send the full `players` array with each player's info (id, username, avatar) 
      if (data.players) {
        const myPlayer = data.players.find((p) => p.id === savedUser.userId);
        const opponent = data.players.find((p) => p.id !== savedUser.userId);
        if (myPlayer) myPlayer.username += " (You)";
        setPlayers({ bottom: myPlayer, top: opponent });
      }
    };

    socket.onclose = () => {
      setStatusText("Disconnected from server.");
    };

    return () => {
      closeSocket();
    };
  }, [wsPath, savedUser.userId, navigate]);

  const handleClick = (row, col) => {
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
              <img src={players.top.avatar} alt={`${players.top.username} avatar`} />
              <div>
                <h4>{players.top.username}</h4>
                <span className="status">
                  <span className="dot online"></span>Online
                </span>
              </div>
            </div>
          </div>
        )}

        {gameStatus === "ongoing" && (
          <div className="turn-indicator">
            {turn === role ? "Your turn" : "Opponent's turn"}
          </div>
        )}

        {gameStatus === "win" && (
          <div className={`winner-banner ${winner !== role ? "lose" : ""}`}>
            {winner === role ? "You Win!" : "You Lose!"}
          </div>
        )}

        {gameStatus === "tie" && <div className="winner-banner tie">It's a Tie!</div>}

        {message && <p className="game-message">{message}</p>}

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
              <img src={players.bottom.avatar} alt={`${players.bottom.username} avatar`} />
              <div>
                <h4>{players.bottom.username}</h4>
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

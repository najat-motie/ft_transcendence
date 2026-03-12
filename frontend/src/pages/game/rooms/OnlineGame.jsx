import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket } from "../../../services/socket";
import { useSettings } from "../../../state/settings/settings.context";
import boardsConfig from "../../../config/boards.config.json";
import { resolveSkinAssets } from "../../../utils/skinAssets";
import "../../../styles/game/room.css";

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
    // prevent clicking on filled cell or after game ends
    if (!players || board[index] || turn !== players.bottom.symbol || winner) return;

    // send move to WebSocket
    // Example:
    // socket.send(JSON.stringify({ type: "gameMove", matchId, index, symbol: players.bottom.symbol }));
  };

  const resetGame = () => {
    // send reset via WebSocket
    // const socket = getSocket();
    // if (socket) socket.send(JSON.stringify({ type: "resetGame", matchId }));
  };

  useEffect(() => {
    // initialize WebSocket connection
    // const socket = getSocket();
    // socket.onmessage = (event) => { ...handle socket messages... }

    return () => {
      // clean up WebSocket connection
      // socket.onmessage = null;
      // socket.close();
      // socket = null;
    };
  }, []);

  if (!players || !matchId) return <p className="status">Waiting for opponent...</p>;

  return (
    <section className="game-room">
      <div className="room-container">
        <div className="player-card">
          <div className="player-info">
            <img src={players.top.avatar} alt="avatar" />
            <div>
              <h4>{players.top.username}</h4>
              <span className="status">
                <span className="dot online"></span>Online
              </span>
            </div>
          </div>
        </div>

        {!winner && (
          <div className="turn-indicator">
            {turn === players.bottom.symbol ? "Your turn" : "Opponent's turn"}
          </div>
        )}

        {winner && (
          <div
            className={`winner-banner ${
              winner === "Tie" ? "tie" : winner === players.bottom.symbol ? "" : "lose"
            }`}
          >
            {winner === "Tie"
              ? "It's a Tie!"
              : winner === players.bottom.symbol
              ? "You Win!"
              : "You Lose!"}
          </div>
        )}

        <div className="board-shell">
          <div className="board-toolbar">
            <div className="board-meta">
              <span className="board-chip">Board</span>
              <strong>{boardLabel}</strong>
            </div>
            <div className="board-actions">
              <button className="secondary" type="button" onClick={resetGame}>
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
            {board.map((cell, i) => (
              <button
                key={i}
                className={`cell ${cell || ""}`}
                onClick={() => handleClick(i)}
                aria-label={`Cell ${i + 1}, ${cell || "empty"}`}
              >
                {cell === "X" ? (xSrc ? <img src={xSrc} alt="X skin" /> : "X") : null}
                {cell === "O" ? (oSrc ? <img src={oSrc} alt="O skin" /> : "O") : null}
              </button>
            ))}
          </div>
        </div>

        <div className="player-card">
          <div className="player-info">
            <img src={players.bottom.avatar} alt="avatar" />
            <div>
              <h4>{players.bottom.username}</h4>
              <span className="status">
                <span className="dot online"></span>Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../../styles/game/game-room.css";

// export default function GameRoom() {
//   const navigate = useNavigate();
//   const [board, setBoard] = useState(Array(9).fill(null));
//   const [xTurn, setXTurn] = useState(true);
//   const [winner, setWinner] = useState(null);

//   const players = {
//     top: {
//       username: "CasualEnjoyer",
//       avatar: "https://i.pravatar.cc/100?img=5",
//       online: true,
//       symbol: "O",
//     },
//     bottom: {
//       username: "AlexGrandmaster" + " (you)",
//       avatar: "https://i.pravatar.cc/100?img=3",
//       online: true,
//       symbol: "X",
//     },
//   };

//   const winningCombos = [
//     [0, 1, 2], [3, 4, 5], [6, 7, 8],
//     [0, 3, 6], [1, 4, 7], [2, 5, 8],
//     [0, 4, 8], [2, 4, 6],
//   ];

//   const checkWinner = (newBoard) => {
//     for (let combo of winningCombos) {
//       const [a, b, c] = combo;
//       if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
//         return newBoard[a];
//       }
//     }
//     return null;
//   };

//   const handleClick = (index) => {
//     if (board[index] || winner) return;

//     const newBoard = [...board];
//     newBoard[index] = xTurn ? "X" : "O";
//     setBoard(newBoard);
//     setXTurn(!xTurn);

//     const gameWinner = checkWinner(newBoard);
//     if (gameWinner) {
//       setWinner(gameWinner);
//     } else if (newBoard.every(cell => cell)) {
//       setWinner("Tie"); // all cells filled, no winner
//     }
//   };

//   const resetGame = () => {
//     setBoard(Array(9).fill(null));
//     setXTurn(true);
//     setWinner(null);
//   };

//   return (
//     <section className="game-room">
//       <div className="room-container">

//         {/* Top Player */}
//         <div className="player-card">
//           <div className="player-info">
//             <img src={players.top.avatar} alt="avatar" />
//             <div>
//               <h4>{players.top.username}</h4>
//               <span className="status">
//                 <span className="dot online"></span>
//                 Online
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Turn Indicator */}
//         {!winner && (
//           <div className="turn-indicator">
//             {xTurn === (players.bottom.symbol === "X") ? "Your turn" : "Opponent's turn"}
//           </div>
//         )}

//         {/* Winner Banner */}
//         {winner && (
//           <div
//             className={`winner-banner ${
//               winner === "Tie" ? "tie" : winner === players.bottom.symbol ? "" : "lose"
//             }`}
//           >
//             {winner === "Tie"
//               ? "It's a Tie!"
//               : winner === players.bottom.symbol
//               ? "You Win!"
//               : "You Lose!"}
//           </div>
//         )}

//         {/* Board */}
//         <div className="board">
//           {board.map((cell, i) => (
//             <div
//               key={i}
//               className={`cell ${cell ? cell : ""}`}
//               onClick={() => handleClick(i)}
//             >
//               {cell}
//             </div>
//           ))}
//         </div>

//         {/* Buttons */}
//         <div className="buttons">
//           <button onClick={resetGame}>Restart</button>
//           <button onClick={() => navigate("/play")}>Leave</button>
//         </div>

//         {/* Bottom Player */}
//         <div className="player-card">
//           <div className="player-info">
//             <img src={players.bottom.avatar} alt="avatar" />
//             <div>
//               <h4>{players.bottom.username}</h4>
//               <span className="status">
//                 <span className="dot online"></span>
//                 Online
//               </span>
//             </div>
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// }

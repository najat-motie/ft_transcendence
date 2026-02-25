import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/game/game-room.css";

export default function LocalGame() {
  const navigate = useNavigate();
  const [turn, setTurn] = useState("Player 1");
  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  useEffect(() => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a] === "X" ? "Player 1" : "Player 2");
        return;
      }
    }

    if (board.every((cell) => cell !== null)) {
      setWinner("Tie");
    }
  }, [board]);

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = turn === "Player 1" ? "X" : "O";
    setBoard(newBoard);
    setTurn(turn === "Player 1" ? "Player 2" : "Player 1");
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn("Player 1");
    setWinner(null);
  };

  return (
    <section className="game-room">
      <div className="room-container">
        <h2>Local Game</h2>
        {!winner && <p>{turn}'s turn</p>}
        {winner && <div className={`winner-banner ${winner === "Tie" ? "tie" : ""}`}>
          {winner === "Tie" ? "It's a Tie!" : `${winner} Wins!`}
        </div>}

        <div className="board">
          {board.map((cell, i) => (
            <div
              key={i}
              className={`cell ${cell}`}
              onClick={() => handleClick(i)}
            >
              {cell}
            </div>
          ))}
        </div>

        <button type="button" onClick={resetGame}>
          Restart
        </button>
        <button type="button" onClick={() => navigate(-1)}>
          Leave
        </button>
      </div>
    </section>
  );
}




// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { connectSocket, getSocket } from "../../../services/socket";
// import "../../../styles/game/game-room.css";

// export default function LocalGame() {
//   const navigate = useNavigate();
//   const savedUser = JSON.parse(localStorage.getItem("user"));
//   const token = localStorage.getItem(`accessToken_${savedUser.userId}`);

//   const [board, setBoard] = useState(Array(9).fill(null));
//   const [turn, setTurn] = useState("X");
//   const [winner, setWinner] = useState(null);
//   const [matchId, setMatchId] = useState(null);

//   useEffect(() => {
//     const socket = connectSocket(token);

//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);

//       switch (data.type) {
//         case "localMatchCreated":
//           setMatchId(data.matchId);
//           setBoard(Array(9).fill(null));
//           setTurn("X");
//           setWinner(null);
//           break;

//         case "gameState":
//           if (data.matchId !== matchId) return;
//           setBoard(data.board);
//           setTurn(data.turn);
//           setWinner(data.winner);
//           break;

//         default:
//           break;
//       }
//     };

//     socket.onopen = () => {
//       socket.send(
//         JSON.stringify({
//           type: "createLocalMatch",
//         })
//       );
//     };

//     return () => {
//       const s = getSocket();
//       if (s) s.onmessage = null;
//     };
//   }, [token, matchId]);

//   const handleClick = (index) => {
//     if (!matchId || board[index] || winner) return;

//     const socket = getSocket();
//     if (socket && socket.readyState === WebSocket.OPEN) {
//       socket.send(
//         JSON.stringify({
//           type: "gameMove",
//           matchId,
//           index,
//         })
//       );
//     }
//   };

//   const resetGame = () => {
//     const socket = getSocket();
//     if (socket) {
//       socket.send(
//         JSON.stringify({
//           type: "resetGame",
//           matchId,
//         })
//       );
//     }
//   };

//   return (
//     <section className="game-room">
//       <div className="room-container">
//         <h2>Local Hosted Game</h2>

//         {!winner && <p>{turn}'s turn</p>}

//         {winner && (
//           <div className={`winner-banner ${winner === "Tie" ? "tie" : ""}`}>
//             {winner === "Tie" ? "It's a Tie!" : `${winner} Wins!`}
//           </div>
//         )}

//         <div className="board">
//           {board.map((cell, i) => (
//             <div
//               key={i}
//               className={`cell ${cell}`}
//               onClick={() => handleClick(i)}
//             >
//               {cell}
//             </div>
//           ))}
//         </div>
//         <div className="buttonss">
//           <button onClick={resetGame}>Restart</button>
//           <button onClick={() => navigate(-1)}>Leave</button>
//         </div>
//       </div>
//     </section>
//   );
// }

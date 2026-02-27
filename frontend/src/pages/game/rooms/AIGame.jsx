import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../services/api";
import "../../../styles/game/game-room.css";

export default function AIGame() {
  const navigate = useNavigate();

  const [board, setBoard] = useState(Array(9).fill(null));
  const [winner, setWinner] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async (index) => {
    if (board[index] || winner || loading) return;

    try {
      setLoading(true);

      const response = await apiRequest("/ai/move", {
        method: "POST",
        body: JSON.stringify({
          board,
          move: index,
        }),
      });

      if (!response.ok) {
        throw new Error("Move failed");
      }

      const data = await response.json();

      setBoard(data.board);
      setWinner(data.winner);
    } catch (error) {
      console.error("Error playing move:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetGame = async () => {
    try {
      const response = await fetch(`${API_URL}/ai/reset`, {
        method: "POST",
      });

      const data = await response.json();

      setBoard(data.board);
      setWinner(null);
    } catch (error) {
      console.error("Reset failed:", error);
    }
  };

  return (
    <section className="game-room">
      <div className="room-container">
        <h2>Challenge Yourself with an AI</h2>
        <p>Challenge yourself against an AI powered by the backend.</p>

        {winner && (
          <div className={`winner-banner ${winner === "Tie" ? "tie" : ""}`}>
            {winner === "Tie" ? "It's a Tie!" : `${winner} Wins!`}
          </div>
        )}

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

        <div className="buttons">
          <button onClick={resetGame}>Restart</button>
          <button onClick={() => navigate("/play")}>Leave</button>
        </div>
      </div>
    </section>
  );
}




// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../styles/game/ai-game.css";

// export default function AIGame() {
//   const navigate = useNavigate();

//   const [board, setBoard] = useState(Array(9).fill(null));
//   const [playerTurn, setPlayerTurn] = useState(true);
//   const [winner, setWinner] = useState(null);

//   const winningCombos = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6],
//   ];

//   const checkWinner = (board) => {
//     for (let combo of winningCombos) {
//       const [a, b, c] = combo;
//       if (board[a] && board[a] === board[b] && board[a] === board[c]) {
//         return board[a];
//       }
//     }
//     if (!board.includes(null)) return "Draw";
//     return null;
//   };

//   const aiMove = (newBoard) => {
//     const emptyCells = newBoard
//       .map((val, idx) => (val === null ? idx : null))
//       .filter((v) => v !== null);

//     if (emptyCells.length === 0) return;

//     const aiChoice =
//       emptyCells[Math.floor(Math.random() * emptyCells.length)];

//     newBoard[aiChoice] = "O"; // AI = O
//     setBoard(newBoard);
//     const result = checkWinner(newBoard);
//     if (result) setWinner(result);
//     else setPlayerTurn(true);
//   };

//   const handleClick = (index) => {
//     if (board[index] || !playerTurn || winner) return;

//     const newBoard = [...board];
//     newBoard[index] = "X"; // Player = X
//     setBoard(newBoard);

//     const result = checkWinner(newBoard);
//     if (result) {
//       setWinner(result);
//       return;
//     }

//     setPlayerTurn(false);

//     setTimeout(() => aiMove([...newBoard]), 500);
//   };

//   const resetGame = () => {
//     setBoard(Array(9).fill(null));
//     setWinner(null);
//     setPlayerTurn(true);
//   };

//   return (
//     <section className="game-room">
//       <div className="room-container">
//         <h2>Challenge Yourself with an AI</h2>
//         <p>Challenge yourself against an AI with human-like behavior.</p>

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

//         {winner && (
//           <p className="winner-banner">
//             {winner === "Draw" ? "It's a draw!" : `${winner} wins!`}
//           </p>
//         )}

//         <div className="buttons">
//           <button onClick={resetGame}>Restart</button>
//           <button onClick={() => navigate(-1)}>Back</button>
//         </div>
//       </div>
//     </section>
//   );
// }

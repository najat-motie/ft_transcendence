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

const validateBoard = (board) => {
  if (!Array.isArray(board) || board.length !== 9) {
    return { valid: false, message: 'Board must be an array of 9 cells' };
  }

  for (let i = 0; i < board.length; i += 1) {
    const value = board[i];
    const isEmpty = value === null || value === '';
    const isMark = value === 'X' || value === 'O';
    if (!isEmpty && !isMark) {
      return { valid: false, message: 'Board cells must be null, empty string, X, or O' };
    }
  }

  return { valid: true };
};

const normalizeBoard = (board) => {
  const normalized = [];
  for (let i = 0; i < board.length; i += 1) {
    if (board[i] === 'X' || board[i] === 'O') {
      normalized.push(board[i]);
    } else {
      normalized.push(null);
    }
  }
  return normalized;
};

const getWinner = (board) => {
  for (let i = 0; i < winningCombos.length; i += 1) {
    const [a, b, c] = winningCombos[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  let hasEmptyCell = false;
  for (let i = 0; i < board.length; i += 1) {
    if (!board[i]) {
      hasEmptyCell = true;
      break;
    }
  }

  if (!hasEmptyCell) {
    return 'Tie';
  }

  return null;
};

const getEmptyIndices = (board) => {
  const emptyIndices = [];
  for (let i = 0; i < board.length; i += 1) {
    if (!board[i]) {
      emptyIndices.push(i);
    }
  }
  return emptyIndices;
};

const findWinningMove = (board, mark) => {
  const emptyIndices = getEmptyIndices(board);

  for (let i = 0; i < emptyIndices.length; i += 1) {
    const testIndex = emptyIndices[i];
    const testBoard = [...board];
    testBoard[testIndex] = mark;
    const winner = getWinner(testBoard);
    if (winner === mark) {
      return testIndex;
    }
  }

  return null;
};

const chooseAiMove = (board) => {
  const winMove = findWinningMove(board, 'O');
  if (winMove !== null) {
    return winMove;
  }

  const blockMove = findWinningMove(board, 'X');
  if (blockMove !== null) {
    return blockMove;
  }

  if (!board[4]) {
    return 4;
  }

  const corners = [0, 2, 6, 8];
  for (let i = 0; i < corners.length; i += 1) {
    const corner = corners[i];
    if (!board[corner]) {
      return corner;
    }
  }

  const emptyIndices = getEmptyIndices(board);
  if (emptyIndices.length > 0) {
    return emptyIndices[0];
  }

  return null;
};

const move = async (req, res) => {
  try {
    const { board, move: playerMove } = req.body;

    const boardValidation = validateBoard(board);
    if (!boardValidation.valid) {
      return res.status(400).json({
        success: false,
        message: boardValidation.message,
      });
    }

    if (!Number.isInteger(playerMove) || playerMove < 0 || playerMove > 8) {
      return res.status(400).json({
        success: false,
        message: 'Move must be an integer between 0 and 8',
      });
    }

    const nextBoard = normalizeBoard(board);

    if (nextBoard[playerMove]) {
      return res.status(400).json({
        success: false,
        message: 'Cell is already occupied',
      });
    }

    nextBoard[playerMove] = 'X';
    const afterPlayerWinner = getWinner(nextBoard);
    if (afterPlayerWinner) {
      return res.status(200).json({
        success: true,
        board: nextBoard,
        winner: afterPlayerWinner,
      });
    }

    const aiMove = chooseAiMove(nextBoard);
    if (aiMove !== null) {
      nextBoard[aiMove] = 'O';
    }

    const finalWinner = getWinner(nextBoard);

    return res.status(200).json({
      success: true,
      board: nextBoard,
      winner: finalWinner,
    });
  } catch (error) {
    console.error('AI move error:', error);
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to process AI move',
      error: errorMessage,
    });
  }
};

const reset = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      board: [null, null, null, null, null, null, null, null, null],
      winner: null,
    });
  } catch (error) {
    console.error('AI reset error:', error);
    let errorMessage;
    if (process.env.NODE_ENV === 'development') {
      errorMessage = error.message;
    } else {
      errorMessage = undefined;
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to reset AI game',
      error: errorMessage,
    });
  }
};

module.exports = {
  move,
  reset,
};

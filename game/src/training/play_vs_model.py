from __future__ import annotations

from pathlib import Path

from tictactoe_model import (
    apply_action,
    empty_board,
    legal_actions,
    load_model,
    terminal,
    winner,
)

ROOT = Path(__file__).resolve().parent
DEFAULT_MODEL_PATH = ROOT / "models" / "final_model.pkl"


def render(board):
    symbols = {1: "X", -1: "O", 0: " "}
    rows = []
    for r in range(3):
        rows.append(" " + " | ".join(symbols[board[3 * r + c]] for c in range(3)))
    return "\n---+---+---\n".join(rows)


def play_human(model) -> None:
    human = 1
    ai = -1
    board = empty_board()
    player = 1

    print("\nYou are X. Enter moves as: row col (0..2)")
    while True:
        print("\n" + render(board) + "\n")

        if terminal(board):
            w = winner(board)
            if w == human:
                print("Result: Human win.")
            elif w == ai:
                print("Result: Model win.")
            else:
                print("Result: Tie.")
            return

        if player == human:
            while True:
                try:
                    raw = input("Your move> ").strip()
                except EOFError:
                    print("\nInput ended.")
                    return
                try:
                    r, c = map(int, raw.split())
                    action = 3 * r + c
                except Exception:
                    print("Invalid input. Use: row col")
                    continue
                if action not in legal_actions(board):
                    print("Cell not available.")
                    continue
                board = apply_action(board, action, player)
                break
        else:
            action = model.choose_action(board, player)
            print(f"Model plays: {action // 3} {action % 3}")
            board = apply_action(board, action, player)

        player = -player


def main() -> None:
    if not DEFAULT_MODEL_PATH.exists():
        raise FileNotFoundError(
            "Final model not found at training/models/final_model.pkl. Run training/training_ai.py first."
        )
    model = load_model(str(DEFAULT_MODEL_PATH))
    play_human(model)


if __name__ == "__main__":
    main()

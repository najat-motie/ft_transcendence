from __future__ import annotations

import pickle
import random
from dataclasses import dataclass
from functools import lru_cache
from typing import Dict, List, Tuple

Board = Tuple[int, ...]
StateKey = Tuple[Board, int]
WIN_LINES = (
    (0, 1, 2),
    (3, 4, 5),
    (6, 7, 8),
    (0, 3, 6),
    (1, 4, 7),
    (2, 5, 8),
    (0, 4, 8),
    (2, 4, 6),
)


def empty_board() -> Board:
    return (0,) * 9


def legal_actions(board: Board) -> List[int]:
    return [i for i, value in enumerate(board) if value == 0]


def apply_action(board: Board, action: int, player: int) -> Board:
    cells = list(board)
    cells[action] = player
    return tuple(cells)


def winner(board: Board) -> int:
    for i, j, k in WIN_LINES:
        total = board[i] + board[j] + board[k]
        if total == 3:
            return 1
        if total == -3:
            return -1
    return 0


def terminal(board: Board) -> bool:
    return winner(board) != 0 or all(v != 0 for v in board)


@lru_cache(maxsize=None)
def minimax_value(board: Board, player: int) -> int:
    w = winner(board)
    if w == player:
        return 1
    if w == -player:
        return -1

    actions = legal_actions(board)
    if not actions:
        return 0

    best = -2
    for action in actions:
        value = -minimax_value(apply_action(board, action, player), -player)
        if value > best:
            best = value
            if best == 1:
                break
    return best


def minimax_action(board: Board, player: int) -> int:
    actions = legal_actions(board)
    if not actions:
        return 0

    best_action = actions[0]
    best_value = -2
    for action in actions:
        value = -minimax_value(apply_action(board, action, player), -player)
        if value > best_value or (value == best_value and action < best_action):
            best_value = value
            best_action = action
    return best_action


@dataclass
class RLQModel:
    q: Dict[StateKey, List[float]]

    def _qvals(self, key: StateKey) -> List[float]:
        if key not in self.q:
            self.q[key] = [0.0] * 9
        return self.q[key]

    def choose_action(self, board: Board, player: int) -> int:
        actions = legal_actions(board)
        if not actions:
            return 0

        best_action = actions[0]
        qvals = self._qvals((board, player))
        best_value = qvals[best_action]
        for action in actions[1:]:
            value = qvals[action]
            if value > best_value or (value == best_value and action < best_action):
                best_value = value
                best_action = action
        return best_action


def _linear(start: float, end: float, step: int, total_steps: int) -> float:
    if total_steps <= 1:
        return end
    t = min(1.0, max(0.0, (step - 1) / (total_steps - 1)))
    return start + (end - start) * t


def _update_q(
    model: RLQModel,
    board: Board,
    player: int,
    action: int,
    reward: float,
    next_board: Board,
    next_player: int,
    done: bool,
    alpha: float,
    gamma: float,
) -> None:
    key = (board, player)
    qvals = model._qvals(key)
    old = qvals[action]
    if done:
        target = reward
    else:
        next_key = (next_board, next_player)
        next_qvals = model._qvals(next_key)
        next_actions = legal_actions(next_board)
        best_next = max((next_qvals[a] for a in next_actions), default=0.0)
        target = reward - gamma * best_next

    qvals[action] = old + alpha * (target - old)


def train_model(
    episodes: int = 300_000,
    alpha: float = 0.35,
    gamma: float = 0.99,
    epsilon_start: float = 1.0,
    epsilon_end: float = 0.02,
    teacher_start: float = 0.70,
    teacher_end: float = 0.05,
    seed: int = 7,
    log_every: int = 50_000,
) -> RLQModel:
    rng = random.Random(seed)
    model = RLQModel(q={})

    for episode in range(1, episodes + 1):
        epsilon = _linear(epsilon_start, epsilon_end, episode, episodes)
        teacher_prob = _linear(teacher_start, teacher_end, episode, episodes)

        board = empty_board()
        player = 1

        while not terminal(board):
            actions = legal_actions(board)
            if not actions:
                break

            if rng.random() < teacher_prob:
                action = minimax_action(board, player)
            elif rng.random() < epsilon:
                action = rng.choice(actions)
            else:
                action = model.choose_action(board, player)

            next_board = apply_action(board, action, player)
            done = terminal(next_board)

            if done:
                w = winner(next_board)
                reward = 1.0 if w == player else (-1.0 if w == -player else 0.0)
            else:
                reward = 0.0

            _update_q(
                model=model,
                board=board,
                player=player,
                action=action,
                reward=reward,
                next_board=next_board,
                next_player=-player,
                done=done,
                alpha=alpha,
                gamma=gamma,
            )

            board = next_board
            player = -player

        if log_every and episode % log_every == 0:
            print(
                f"[ep={episode}] epsilon={epsilon:.3f} teacher_prob={teacher_prob:.3f} states={len(model.q)}"
            )

    return model


def save_model(model: RLQModel, path: str) -> None:
    payload = {"version": 2, "q": model.q}
    with open(path, "wb") as f:
        pickle.dump(payload, f)


def load_model(path: str) -> RLQModel:
    with open(path, "rb") as f:
        payload = pickle.load(f)
    if isinstance(payload, dict) and payload.get("version") == 2 and isinstance(payload.get("q"), dict):
        model = RLQModel(q=payload["q"])
        return model
    raise TypeError(f"Unsupported model format: {type(payload)!r}")

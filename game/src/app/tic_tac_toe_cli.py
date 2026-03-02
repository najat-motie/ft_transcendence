import random


def make_cell():
    return {"text": ""}


def set_cell(cell, text):
    cell["text"] = text


def make_label(text=""):
    return {"text": text}


def set_label(current_label, text):
    current_label["text"] = text


def create_game_state(player_choice=None):
    local_players = ["X", "O"]
    local_player = player_choice if player_choice in local_players else random.choice(local_players)
    return {
        "players": local_players,
        "player": local_player,
        "label": make_label(local_player + " turn"),
        "table_game": [[make_cell() for _ in range(3)] for _ in range(3)],
    }


def bind_state(state):
    global players, player, label, table_game
    players = state["players"]
    player = state["player"]
    label = state["label"]
    table_game = state["table_game"]


def sync_state(state):
    state["players"] = players
    state["player"] = player
    state["label"] = label
    state["table_game"] = table_game


def print_board():
    for h in range(3):
        row = []
        for w in range(3):
            value = table_game[h][w]["text"] if table_game[h][w]["text"] != "" else " "
            row.append(value)
        print(" " + " | ".join(row))
        if h < 2:
            print("---+---+---")
    print()


def board_state_text():
    rows = []
    for h in range(3):
        row = []
        for w in range(3):
            value = table_game[h][w]["text"] if table_game[h][w]["text"] != "" else " "
            row.append(value)
        rows.append(" " + " | ".join(row))
        if h < 2:
            rows.append("---+---+---")
    return "\n".join(rows)


def next(h, w):
    global player
    game_status = is_winning()
    if table_game[h][w]["text"] == "" and game_status["status"] == "ongoing":
        set_cell(table_game[h][w], player)
        game_status = is_winning()

        if game_status["status"] == "ongoing":
            if player == players[0]:
                player = players[1]
            else:
                player = players[0]
            set_label(label, player + " turn")

        elif game_status["status"] == "win":
            set_label(label, game_status["winner"] + " wins")

        elif game_status["status"] == "tie":
            set_label(label, "the players tied")


def is_winning():
    for h in range(3):
        if table_game[h][0]["text"] == table_game[h][1]["text"] == table_game[h][2]["text"] and table_game[h][0]["text"] != "":
            return {
                "status": "win",
                "winner": table_game[h][0]["text"],
                "line_type": "row",
                "cells": [(h, 0), (h, 1), (h, 2)],
            }

    for w in range(3):
        if table_game[0][w]["text"] == table_game[1][w]["text"] == table_game[2][w]["text"] and table_game[0][w]["text"] != "":
            return {
                "status": "win",
                "winner": table_game[0][w]["text"],
                "line_type": "col",
                "cells": [(0, w), (1, w), (2, w)],
            }

    if table_game[0][0]["text"] == table_game[1][1]["text"] == table_game[2][2]["text"] and table_game[0][0]["text"] != "":
        return {
            "status": "win",
            "winner": table_game[0][0]["text"],
            "line_type": "diag",
            "cells": [(0, 0), (1, 1), (2, 2)],
        }

    if table_game[0][2]["text"] == table_game[1][1]["text"] == table_game[2][0]["text"] and table_game[0][2]["text"] != "":
        return {
            "status": "win",
            "winner": table_game[0][2]["text"],
            "line_type": "diag",
            "cells": [(0, 2), (1, 1), (2, 0)],
        }

    i = 0
    for h in range(3):
        for w in range(3):
            if table_game[h][w]["text"] != "":
                i += 1

    if i == 9:
        return {
            "status": "tie",
            "winner": None,
            "line_type": None,
            "cells": [],
        }

    return {
        "status": "ongoing",
        "winner": None,
        "line_type": None,
        "cells": [],
    }


def start_new_game():
    global player
    player = random.choice(players)
    set_label(label, player + " turn")
    for h in range(3):
        for w in range(3):
            set_cell(table_game[h][w], "")


def main():
    print("Tic_Tac_Toe_game (CLI)")
    print("Commands: '<row> <col>' (0-2), 'quit'")
    print()
    print(label["text"])
    print_board()

    while True:
        user_input = input("> ").strip().lower()

        if user_input == "quit":
            print("Bye.")
            break

        parts = user_input.split()
        if len(parts) != 2 or not all(p.isdigit() for p in parts):
            print("Invalid input. Use '<row> <col>' or 'quit'.")
            continue

        h, w = int(parts[0]), int(parts[1])
        if not (0 <= h <= 2 and 0 <= w <= 2):
            print("Coordinates must be between 0 and 2.")
            continue

        before = table_game[h][w]["text"]
        before_label = label["text"]
        next(h, w)
        if before != table_game[h][w]["text"] or before_label != label["text"]:
            print(label["text"])
            print_board()
            state = is_winning()
            if state["status"] == "win":
                print(f"Win details: type={state['line_type']}, cells={state['cells']}")
                print("Game over.")
                break
            if state["status"] == "tie":
                print("Game over.")
                break
        else:
            print("Move ignored. Cell is occupied or game already finished.")


_initial_state = create_game_state()
players = _initial_state["players"]
player = _initial_state["player"]
label = _initial_state["label"]
table_game = _initial_state["table_game"]


if __name__ == "__main__":
    main()

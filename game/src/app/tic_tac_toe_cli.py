import random

class TicTacToeGame:
    def __init__(self, player_choice=None):
        self.players = ["X", "O"]
        self.player = player_choice if player_choice in self.players else random.choice(self.players)
        self.label = {"text": self.player + " turn"}
        self.table_game = [[{"text": ""} for _ in range(3)] for _ in range(3)]

    def print_board(self):
        for h in range(3):
            row = []
            for w in range(3):
                value = self.table_game[h][w]["text"] if self.table_game[h][w]["text"] != "" else " "
                row.append(value)
            print(" " + " | ".join(row))
            if h < 2:
                print("---+---+---")
        print()

    def board_state_text(self):
        rows = []
        for h in range(3):
            row = []
            for w in range(3):
                value = self.table_game[h][w]["text"] if self.table_game[h][w]["text"] != "" else " "
                row.append(value)
            rows.append(" " + " | ".join(row))
            if h < 2:
                rows.append("---+---+---")
        return "\n".join(rows)

    def next(self, h, w):
        game_status = self.is_winning()
        if self.table_game[h][w]["text"] == "" and game_status["status"] == "ongoing":
            self.table_game[h][w]["text"] = self.player
            game_status = self.is_winning()

            if game_status["status"] == "ongoing":
                if self.player == self.players[0]:
                    self.player = self.players[1]
                else:
                    self.player = self.players[0]
                self.label["text"] = self.player + " turn"

            elif game_status["status"] == "win":
                self.label["text"] = game_status["winner"] + " wins"

            elif game_status["status"] == "tie":
                self.label["text"] = "the players tied"

    def is_winning(self):
        for h in range(3):
            if self.table_game[h][0]["text"] == self.table_game[h][1]["text"] == self.table_game[h][2]["text"] and self.table_game[h][0]["text"] != "":
                return {
                    "status": "win",
                    "winner": self.table_game[h][0]["text"],
                    "line_type": "row",
                    "cells": [(h, 0), (h, 1), (h, 2)],
                }

        for w in range(3):
            if self.table_game[0][w]["text"] == self.table_game[1][w]["text"] == self.table_game[2][w]["text"] and self.table_game[0][w]["text"] != "":
                return {
                    "status": "win",
                    "winner": self.table_game[0][w]["text"],
                    "line_type": "col",
                    "cells": [(0, w), (1, w), (2, w)],
                }

        if self.table_game[0][0]["text"] == self.table_game[1][1]["text"] == self.table_game[2][2]["text"] and self.table_game[0][0]["text"] != "":
            return {
                "status": "win",
                "winner": self.table_game[0][0]["text"],
                "line_type": "diag",
                "cells": [(0, 0), (1, 1), (2, 2)],
            }

        if self.table_game[0][2]["text"] == self.table_game[1][1]["text"] == self.table_game[2][0]["text"] and self.table_game[0][2]["text"] != "":
            return {
                "status": "win",
                "winner": self.table_game[0][2]["text"],
                "line_type": "diag",
                "cells": [(0, 2), (1, 1), (2, 0)],
            }

        i = 0
        for h in range(3):
            for w in range(3):
                if self.table_game[h][w]["text"] != "":
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

    def start_new_game(self):
        self.player = random.choice(self.players)
        self.label["text"] = self.player + " turn"
        for h in range(3):
            for w in range(3):
                self.table_game[h][w]["text"] = ""


def main():
    game = TicTacToeGame()
    print("Tic_Tac_Toe_game (CLI)")
    print("Commands: '<row> <col>' (0-2), 'quit'")
    print()
    print(game.label["text"])
    game.print_board()

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

        before = game.table_game[h][w]["text"]
        before_label = game.label["text"]
        game.next(h, w)
        
        if before != game.table_game[h][w]["text"] or before_label != game.label["text"]:
            print(game.label["text"])
            game.print_board()
            state = game.is_winning()
            if state["status"] == "win":
                print(f"Win details: type={state['line_type']}, cells={state['cells']}")
                print("Game over.")
                break
            if state["status"] == "tie":
                print("Game over.")
                break
        else:
            print("Move ignored. Cell is occupied or game already finished.")

if __name__ == "__main__":
    main()

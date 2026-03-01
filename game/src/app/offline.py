from json import JSONDecodeError
from typing import Literal

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, field_validator

from . import tic_tac_toe_cli as game


router = APIRouter()
active_games = {}
active_player_ids = set()


class OfflinePayload(BaseModel):
    game_id: str
    player_id: str
    player_choice: Literal["X", "O"]
    starting_player: Literal["X", "O"] | None = None

    @field_validator("game_id", "player_id", mode="before")
    @classmethod
    def validate_and_strip_id(cls, value):
        if not isinstance(value, str):
            raise ValueError("must be a string")
        stripped = value.strip()
        if stripped == "":
            raise ValueError("must not be empty")
        return stripped


def websocket_is_open(websocket):
    return getattr(getattr(websocket, "client_state", None), "name", "") != "DISCONNECTED"


def current_board():
    return [[game.table_game[h][w]["text"] for w in range(3)] for h in range(3)]


def ws_state_message(note=""):
    state = game.is_winning()
    payload = {
        "board": current_board(),
        "status": game.label["text"],
        "game_status": state["status"],
    }
    if state["status"] == "win":
        payload["winner"] = state["winner"]
        payload["line_type"] = state["line_type"]
        payload["cells"] = state["cells"]
    if note:
        payload["message"] = note
    return payload


@router.post("/offline")
async def offline(payload: OfflinePayload):
    game_id = payload.game_id
    player_id = payload.player_id
    player_choice = payload.player_choice
    starting_player = payload.starting_player or player_choice

    if game_id in active_games:
        raise HTTPException(status_code=400, detail="game_id must be unique")
    if player_id in active_player_ids:
        raise HTTPException(status_code=400, detail="player_id must be unique")

    active_games[game_id] = {
        "game_id": game_id,
        "player_id": player_id,
        "player_choice": player_choice,
        "starting_player": starting_player,
        "state": game.create_game_state(player_choice=starting_player),
        "connected": False,
    }
    active_player_ids.add(player_id)
    return {"ws_path": f"/ws/{game_id}"}


@router.websocket("/ws/{game_id}")
async def websocket_game(websocket: WebSocket, game_id: str):
    await websocket.accept()
    session = active_games.get(game_id)
    if session is None:
        await websocket.send_json({"error": "Game not found."})
        await websocket.close()
        return
    if session["connected"]:
        await websocket.send_json({"error": "Game already has an active connection."})
        await websocket.close()
        return

    session["connected"] = True

    try:
        game.bind_state(session["state"])
        print(f"[ws {game_id}] {game.label['text']}")
        game.print_board()
        await websocket.send_json(
            ws_state_message(
                f"Game started. {session['starting_player']} goes first. Send moves as : "
                "{'row': 0, 'col': 0}."
            )
        )

        while True:
            game.bind_state(session["state"])
            note = ""
            try:
                raw = await websocket.receive_json()
            except JSONDecodeError:
                note = "Invalid JSON payload. Use JSON object with row and col."
                await websocket.send_json(ws_state_message(note))
                continue

            if not isinstance(raw, dict):
                note = "Invalid payload. Use JSON object with row and col."
            else:
                h = raw.get("row")
                w = raw.get("col")
                if type(h) is not int or type(w) is not int:
                    note = "Invalid payload. row and col must be integers."
                elif not (0 <= h <= 2 and 0 <= w <= 2):
                    note = "Coordinates must be between 0 and 2."
                else:
                    before = game.table_game[h][w]["text"]
                    before_label = game.label["text"]
                    game.next(h, w)
                    if before != game.table_game[h][w]["text"] or before_label != game.label["text"]:
                        print(f"[ws {game_id}] {game.label['text']}")
                        game.print_board()
                        note = "Move accepted."
                        state = game.is_winning()
                        if state["status"] == "win":
                            note = f"Win details: type={state['line_type']}, cells={state['cells']}"
                        if state["status"] == "tie":
                            note = "Game over: tie."
                    else:
                        note = "Move ignored. Cell is occupied or game already finished."

            game.sync_state(session["state"])
            response = ws_state_message(note)
            state = game.is_winning()
            await websocket.send_json(response)
            if state["status"] in {"win", "tie"}:
                if websocket_is_open(websocket):
                    await websocket.close()
                break

    except WebSocketDisconnect:
        pass
    except Exception as exc:
        print(f"[ws {game_id}] backend error: {exc}")
        if websocket_is_open(websocket):
            await websocket.close()
    finally:
        if game_id in active_games:
            active_player_ids.discard(active_games[game_id]["player_id"])
            del active_games[game_id]

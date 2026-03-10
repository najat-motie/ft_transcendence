from json import JSONDecodeError
from typing import Literal

from fastapi import APIRouter, HTTPException, Response, WebSocket, WebSocketDisconnect
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


class OfflineMovePayload(BaseModel):
    player_id: str
    row: int
    col: int

    @field_validator("player_id", mode="before")
    @classmethod
    def validate_and_strip_player_id(cls, value):
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


def state_status_text(state):
    if state["status"] == "win":
        return "Win"
    if state["status"] == "tie":
        return "Tie"
    return "Next turn"


def build_state_payload(session, last_move=None, message=""):
    game.bind_state(session["state"])
    state = game.is_winning()
    payload = {
        "board": current_board(),
        "status": state_status_text(state),
        "turn": game.player if state["status"] == "ongoing" else None,
        "game_status": state["status"],
        "last_move": last_move,
    }
    if state["status"] == "win":
        payload["winner"] = state["winner"]
        payload["line_type"] = state["line_type"]
        payload["cells"] = state["cells"]
    if message:
        payload["message"] = message
    return payload


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


@router.get("/offline/{game_id}/state")
async def offline_state(game_id: str):
    session = active_games.get(game_id)

    if session is None:
        raise HTTPException(status_code=404, detail="Game not found")

    return build_state_payload(session)


@router.post("/offline/{game_id}/move")
async def offline_move(game_id: str, payload: OfflineMovePayload):
    session = active_games.get(game_id)

    if session is None:
        raise HTTPException(status_code=404, detail="Game not found")

    if payload.player_id != session["player_id"]:
        raise HTTPException(status_code=400, detail="Unknown player_id for this game")

    if not (0 <= payload.row <= 2 and 0 <= payload.col <= 2):
        raise HTTPException(status_code=400, detail="Coordinates must be between 0 and 2")

    game.bind_state(session["state"])
    state = game.is_winning()

    if state["status"] != "ongoing":
        raise HTTPException(status_code=409, detail="Game already finished")

    if game.table_game[payload.row][payload.col]["text"] != "":
        raise HTTPException(status_code=409, detail="Cell is already occupied")

    current_role = game.player
    game.next(payload.row, payload.col)
    game.sync_state(session["state"])

    return build_state_payload(
        session,
        {
            "player_id": payload.player_id,
            "role": current_role,
            "row": payload.row,
            "col": payload.col,
        },
    )


@router.delete("/offline/{game_id}", status_code=204)
async def delete_offline_game(game_id: str):
    if game_id not in active_games:
        raise HTTPException(status_code=404, detail="Game not found")

    active_player_ids.discard(active_games[game_id]["player_id"])
    del active_games[game_id]
    return Response(status_code=204)


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

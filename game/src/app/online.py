import asyncio
from json import JSONDecodeError
from typing import Optional

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, field_validator

from . import tic_tac_toe_cli as game


router = APIRouter()
active_online_games = {}
active_online_player_ids = set()


class OnlinePayload(BaseModel):
    game_id: str
    player_x: str
    player_o: str
    starting_player: Optional[str] = None

    @field_validator("game_id", "player_x", "player_o", mode="before")
    @classmethod
    def validate_and_strip_id(cls, value):
        if not isinstance(value, str):
            raise ValueError("must be a string")
        stripped = value.strip()
        if stripped == "":
            raise ValueError("must not be empty")
        return stripped

    @field_validator("starting_player", mode="before")
    @classmethod
    def validate_and_strip_optional_starting_player(cls, value):
        if value is None:
            return None
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


async def send_json_safe(websocket, payload):
    if websocket_is_open(websocket):
        await websocket.send_json(payload)


async def broadcast(session, payload):
    for _, ws in list(session["connections"].items()):
        if websocket_is_open(ws):
            await ws.send_json(payload)


async def close_all_connections(session, reason):
    await broadcast(session, {"message": reason})
    for _, ws in list(session["connections"].items()):
        if websocket_is_open(ws):
            await ws.close()
    session["connections"].clear()


def cleanup_session(game_id):
    if game_id in active_online_games:
        session = active_online_games[game_id]
        active_online_player_ids.discard(session["player_x"])
        active_online_player_ids.discard(session["player_o"])
        del active_online_games[game_id]


@router.post("/online")
async def online(payload: OnlinePayload):
    game_id = payload.game_id
    player_x = payload.player_x
    player_o = payload.player_o
    starting_player = payload.starting_player or player_x

    if player_x == player_o:
        raise HTTPException(status_code=400, detail="player_x and player_o must be different")
    if starting_player not in {player_x, player_o}:
        raise HTTPException(status_code=400, detail="starting_player must be player_x or player_o")
    if game_id in active_online_games:
        raise HTTPException(status_code=400, detail="game_id must be unique")
    if player_x in active_online_player_ids or player_o in active_online_player_ids:
        raise HTTPException(status_code=400, detail="player ids must be unique")

    starting_role = "X" if starting_player == player_x else "O"

    active_online_games[game_id] = {
        "game_id": game_id,
        "player_x": player_x,
        "player_o": player_o,
        "starting_player": starting_player,
        "starting_role": starting_role,
        "roles": {player_x: "X", player_o: "O"},
        "state": game.create_game_state(player_choice=starting_role),
        "connections": {},
        "lock": asyncio.Lock(),
        "finished": False,
    }
    active_online_player_ids.add(player_x)
    active_online_player_ids.add(player_o)
    return {"ws_path": f"/ws/online/{game_id}"}


@router.websocket("/ws/online/{game_id}")
async def websocket_online(websocket: WebSocket, game_id: str):
    await websocket.accept()
    session = active_online_games.get(game_id)
    player_id = None

    if session is None:
        await websocket.send_json({"error": "Game not found."})
        await websocket.close()
        return

    try:
        while True:
            try:
                join_payload = await websocket.receive_json()
            except JSONDecodeError:
                await send_json_safe(websocket, {"error": "Invalid JSON join payload."})
                continue

            if not isinstance(join_payload, dict):
                await send_json_safe(websocket, {"error": "Invalid join payload."})
                continue

            raw_player_id = join_payload.get("player_id")
            if not isinstance(raw_player_id, str):
                await send_json_safe(websocket, {"error": "player_id is required for websocket join."})
                continue

            player_id = raw_player_id.strip()
            if player_id not in session["roles"]:
                await send_json_safe(websocket, {"error": "Unknown player_id for this game."})
                continue

            break

        async with session["lock"]:
            if session["finished"]:
                await websocket.send_json({"error": "Game already finished."})
                await websocket.close()
                return

            if player_id in session["connections"]:
                await websocket.send_json({"error": "This player is already connected."})
                await websocket.close()
                return

            session["connections"][player_id] = websocket

        await send_json_safe(
            websocket,
            {
                "message": "Connected.",
                "player_id": player_id,
                "role": session["roles"][player_id],
            },
        )

        if len(session["connections"]) < 2:
            await send_json_safe(websocket, {"message": "Waiting for the other player to connect."})
        else:
            game.bind_state(session["state"])
            print(f"[ws-online {game_id}] both connected")
            game.print_board()
            await broadcast(
                session,
                ws_state_message(
                    f"Both players connected. {session['starting_player']} "
                    f"({session['starting_role']}) starts. Send "
                    "{'player_id': '...', 'row': 0, 'col': 0}."
                ),
            )

        while True:
            game.bind_state(session["state"])
            try:
                raw = await websocket.receive_json()
            except JSONDecodeError:
                await send_json_safe(websocket, ws_state_message("Invalid JSON payload. Use JSON object."))
                continue

            async with session["lock"]:
                note = ""
                should_end = False

                if not isinstance(raw, dict):
                    note = "Invalid payload. Use JSON object."
                else:
                    msg_player_id = raw.get("player_id")
                    h = raw.get("row")
                    w = raw.get("col")

                    if msg_player_id != player_id:
                        note = "player_id does not match this websocket connection."
                    elif len(session["connections"]) < 2:
                        note = "Both players must be connected before moves are accepted."
                    elif session["roles"][player_id] != game.player:
                        note = "Not your turn."
                    elif type(h) is not int or type(w) is not int:
                        note = "Invalid payload. row and col must be integers."
                    elif not (0 <= h <= 2 and 0 <= w <= 2):
                        note = "Coordinates must be between 0 and 2."
                    else:
                        before = game.table_game[h][w]["text"]
                        before_label = game.label["text"]
                        game.next(h, w)
                        if before != game.table_game[h][w]["text"] or before_label != game.label["text"]:
                            print(f"[ws-online {game_id}] {game.label['text']}")
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
                if state["status"] in {"win", "tie"}:
                    session["finished"] = True
                    should_end = True

            await broadcast(session, response)
            if should_end:
                await close_all_connections(session, "Game finished.")
                cleanup_session(game_id)
                break

    except WebSocketDisconnect:
        current_session = active_online_games.get(game_id)
        if current_session is not None and not current_session["finished"]:
            if player_id is not None and current_session["connections"].get(player_id) is websocket:
                del current_session["connections"][player_id]
            if current_session["connections"]:
                await close_all_connections(current_session, "A player disconnected. Game closed.")
            cleanup_session(game_id)
    except Exception as exc:
        print(f"[ws-online {game_id}] backend error: {exc}")

        current_session = active_online_games.get(game_id)
        if current_session is not None and not current_session["finished"]:
            if player_id is not None and current_session["connections"].get(player_id) is websocket:
                del current_session["connections"][player_id]
            if current_session["connections"]:
                await close_all_connections(current_session, "A player disconnected. Game closed.")
            cleanup_session(game_id)
        else:
            if websocket_is_open(websocket):
                await websocket.close()

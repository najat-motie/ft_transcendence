from json import JSONDecodeError
from pathlib import Path

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, field_validator

from training.tictactoe_model import legal_actions, load_model, minimax_action

from . import tic_tac_toe_cli as game


router = APIRouter()
active_ai_games = {}
active_ai_player_ids = set()


class AIPayload(BaseModel):
    game_id: str
    player_id: str

    @field_validator("game_id", "player_id", mode="before")
    @classmethod
    def validate_and_strip_id(cls, value):
        if not isinstance(value, str):
            raise ValueError("must be a string")
        stripped = value.strip()
        if stripped == "":
            raise ValueError("must not be empty")
        return stripped


MODEL = None
MODEL_PATH = Path(__file__).resolve().parent.parent / "training" / "models" / "final_model.pkl"
try:
    if MODEL_PATH.exists():
        MODEL = load_model(str(MODEL_PATH))
    else:
        print(f"[ai] model not found at {MODEL_PATH}, using minimax fallback")
except Exception as exc:
    print(f"[ai] failed to load model at {MODEL_PATH}: {exc}. Using minimax fallback")


def websocket_is_open(websocket):
    return getattr(getattr(websocket, "client_state", None), "name", "") != "DISCONNECTED"


def current_board():
    return [[game.table_game[h][w]["text"] for w in range(3)] for h in range(3)]


def ws_state_message(note="", ai_move=None):
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
    if ai_move is not None:
        payload["ai_move"] = ai_move
    if note:
        payload["message"] = note
    return payload


def board_to_model():
    mapping = {"X": 1, "O": -1, "": 0}
    board = []
    for h in range(3):
        for w in range(3):
            board.append(mapping[game.table_game[h][w]["text"]])
    return tuple(board)


def apply_ai_turn(session):
    state = game.is_winning()
    if state["status"] != "ongoing" or game.player != session["ai_choice"]:
        return None

    board = board_to_model()
    available = legal_actions(board)
    if not available:
        return None

    ai_player = 1 if session["ai_choice"] == "X" else -1
    action = None

    if MODEL is not None:
        try:
            action = MODEL.choose_action(board, ai_player)
        except Exception as exc:
            print(f"[ai] model inference failed: {exc}. Using minimax fallback")

    if action not in available:
        action = minimax_action(board, ai_player)

    if action not in available:
        action = available[0]

    h, w = divmod(action, 3)
    before = game.table_game[h][w]["text"]
    game.next(h, w)
    game.sync_state(session["state"])

    if before == game.table_game[h][w]["text"]:
        return None
    return {"row": h, "col": w}


@router.post("/ai")
async def ai(payload: AIPayload):
    game_id = payload.game_id
    player_id = payload.player_id
    player_choice = "X"
    ai_choice = "O"
    starting_player = "X"

    if game_id in active_ai_games:
        raise HTTPException(status_code=400, detail="game_id must be unique")
    if player_id in active_ai_player_ids:
        raise HTTPException(status_code=400, detail="player_id must be unique")

    active_ai_games[game_id] = {
        "game_id": game_id,
        "player_id": player_id,
        "player_choice": player_choice,
        "ai_choice": ai_choice,
        "starting_player": starting_player,
        "state": game.create_game_state(player_choice=starting_player),
        "connected": False,
    }
    active_ai_player_ids.add(player_id)
    return {"ws_path": f"/ws/ai/{game_id}"}


@router.websocket("/ws/ai/{game_id}")
async def websocket_ai(websocket: WebSocket, game_id: str):
    await websocket.accept()
    session = active_ai_games.get(game_id)

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
        note = (
            f"Game started. You are {session['player_choice']}. "
            f"{session['starting_player']} goes first. Send moves as "
            "{'row': 0, 'col': 0}."
        )
        ai_move = apply_ai_turn(session)
        if ai_move is not None:
            note = f"{note} AI played at ({ai_move['row']}, {ai_move['col']})."
            game.bind_state(session["state"])

        await websocket.send_json(ws_state_message(note, ai_move))

        state = game.is_winning()
        if state["status"] in {"win", "tie"}:
            if websocket_is_open(websocket):
                await websocket.close()
            return

        while True:
            game.bind_state(session["state"])
            note = ""
            ai_move = None
            try:
                raw = await websocket.receive_json()
            except JSONDecodeError:
                note = "Invalid JSON payload. Use JSON object with row and col."
                await websocket.send_json(ws_state_message(note, ai_move))
                continue

            if not isinstance(raw, dict):
                note = "Invalid payload. Use JSON object with row and col."
            else:
                h = raw.get("row")
                w = raw.get("col")

                if game.player != session["player_choice"]:
                    note = "Wait for your turn. AI is playing."
                elif type(h) is not int or type(w) is not int:
                    note = "Invalid payload. row and col must be integers."
                elif not (0 <= h <= 2 and 0 <= w <= 2):
                    note = "Coordinates must be between 0 and 2."
                else:
                    before = game.table_game[h][w]["text"]
                    before_label = game.label["text"]
                    game.next(h, w)

                    if before != game.table_game[h][w]["text"] or before_label != game.label["text"]:
                        note = "Move accepted."
                        state = game.is_winning()

                        if state["status"] == "ongoing":
                            ai_move = apply_ai_turn(session)
                            game.bind_state(session["state"])
                            if ai_move is not None:
                                note = f"{note} AI played at ({ai_move['row']}, {ai_move['col']})."

                        state = game.is_winning()
                        if state["status"] == "win":
                            note = f"Win details: type={state['line_type']}, cells={state['cells']}"
                        elif state["status"] == "tie":
                            note = "Game over: tie."
                    else:
                        note = "Move ignored. Cell is occupied or game already finished."

            game.sync_state(session["state"])
            response = ws_state_message(note, ai_move)
            state = game.is_winning()
            await websocket.send_json(response)

            if state["status"] in {"win", "tie"}:
                if websocket_is_open(websocket):
                    await websocket.close()
                break

    except WebSocketDisconnect:
        pass
    except Exception as exc:
        print(f"[ws-ai {game_id}] backend error: {exc}")
        if websocket_is_open(websocket):
            await websocket.close()
    finally:
        if game_id in active_ai_games:
            active_ai_player_ids.discard(active_ai_games[game_id]["player_id"])
            del active_ai_games[game_id]

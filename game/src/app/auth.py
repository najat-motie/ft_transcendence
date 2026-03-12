import os
import jwt
from fastapi import HTTPException, WebSocketException, Request, WebSocket

JWT_ACCESS_SECRET = os.environ.get(
    "JWT_ACCESS_SECRET",
    "81e45a029595019d2fd5cecbeab157a617488f72d4abda778418c521b3b2e2bed9f0264eafa67ecbb413f3ac6ced703c894dc1faa57ee6c89abe05ad519c08c5"
)
SERVICE_API_KEY = os.environ.get("SERVICE_API_KEY", "super_secret_internal_key")

def verify_jwt_token(token: str) -> dict:
    if not token:
        raise ValueError("Missing access token")
    try:
        decoded = jwt.decode(token, JWT_ACCESS_SECRET, algorithms=["HS256"])
        return decoded
    except jwt.ExpiredSignatureError:
        raise ValueError("Token is expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")

async def secure_http(request: Request):
    api_key = request.headers.get("x-api-key")
    if api_key == SERVICE_API_KEY:
        return "service"
    
    token = request.cookies.get("jwt_access")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            
    if token:
        try:
            return verify_jwt_token(token).get("userId")
        except ValueError as e:
            raise HTTPException(status_code=401, detail=str(e))
            
    raise HTTPException(status_code=401, detail="Unauthorized")

async def secure_ws(websocket: WebSocket) -> str:
    token = websocket.cookies.get("jwt_access")
    if not token:
        await websocket.close(code=1008, reason="Missing jwt_access cookie")
        return None
    try:
        decoded = verify_jwt_token(token)
        return decoded.get("userId")
    except ValueError as e:
        await websocket.close(code=1008, reason=str(e))
        return None

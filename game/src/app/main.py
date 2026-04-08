from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .offline import router as offline_router
from .online import router as online_router
from .ai import router as ai_router


app = FastAPI()
cors_origins = [
    origin.strip()
    for origin in os.environ.get("CORS_ORIGIN", "https://localhost").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(offline_router)
app.include_router(online_router)
app.include_router(ai_router)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .offline import router as offline_router
from .online import router as online_router
from .ai import router as ai_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("CORS_ORIGIN", "https://localhost")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(offline_router)
app.include_router(online_router)
app.include_router(ai_router)

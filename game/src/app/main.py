from fastapi import FastAPI

from .offline import router as offline_router
from .online import router as online_router
from .ai import router as ai_router


app = FastAPI()
app.include_router(offline_router)
app.include_router(online_router)
app.include_router(ai_router)

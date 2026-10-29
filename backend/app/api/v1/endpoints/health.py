from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.db.session import get_db

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict[str, str]:
    """Liveness: the process is up."""
    return {"status": "ok"}


@router.get("/ready")
def ready(
    db: Annotated[Session, Depends(get_db)],
    settings: Annotated[Settings, Depends(get_settings)],
) -> JSONResponse:
    """Readiness: database reachable, plus which integrations are configured."""
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False
    body = {
        "status": "ready" if db_ok else "degraded",
        "database": "ok" if db_ok else "unavailable",
        "integrations": {
            "gemini_text": settings.gemini_text_enabled,
            "gemini_image": settings.gemini_image_enabled,
            "youtube": settings.youtube_enabled,
            "email": settings.email_enabled,
        },
    }
    return JSONResponse(status_code=200 if db_ok else 503, content=body)

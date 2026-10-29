"""Import every model here so Alembic autogenerate discovers it.

Domain models are added per phase (users in Phase 3, conversations in Phase 5, ...).
"""

from app.db.base import Base

__all__ = ["Base"]

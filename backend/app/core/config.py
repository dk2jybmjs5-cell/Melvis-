"""Application configuration loaded from environment variables."""

from functools import lru_cache
from typing import Annotated, Literal

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: Literal["development", "test", "production"] = "development"
    app_name: str = "MELVIS"
    log_level: str = "INFO"
    api_v1_prefix: str = "/api/v1"

    database_url: str = "sqlite:///./melvis.db"

    secret_key: str = Field(default="dev-insecure-change-me", min_length=16)
    session_cookie_name: str = "melvis_session"
    session_ttl_minutes: int = 60 * 24 * 7
    cookie_secure: bool = False
    cookie_samesite: Literal["lax", "strict", "none"] = "lax"

    cors_origins: Annotated[list[str], NoDecode] = ["http://localhost:5173"]

    gemini_api_key: str = ""
    gemini_text_model: str = ""
    gemini_image_model: str = ""
    ai_request_timeout_seconds: float = 30.0
    ai_daily_message_limit: int = 100
    ai_daily_image_limit: int = 10

    youtube_api_key: str = ""

    email_provider: str = ""
    email_from: str = ""

    sentry_dsn: str = ""

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _split_origins(cls, v: object) -> object:
        if isinstance(v, str):
            return [o.strip() for o in v.split(",") if o.strip()]
        return v

    @model_validator(mode="after")
    def _production_guards(self) -> "Settings":
        if self.app_env == "production":
            if self.secret_key.startswith("dev-") or len(self.secret_key) < 32:
                raise ValueError("SECRET_KEY must be a strong random value in production")
            if "*" in self.cors_origins:
                raise ValueError("Wildcard CORS origins are not allowed in production")
            if not self.cookie_secure:
                raise ValueError("COOKIE_SECURE must be true in production")
            if self.database_url.startswith("sqlite"):
                raise ValueError("Production requires PostgreSQL")
        return self

    # Integration availability - drives honest "unavailable" states in the UI.
    @property
    def gemini_text_enabled(self) -> bool:
        return bool(self.gemini_api_key and self.gemini_text_model)

    @property
    def gemini_image_enabled(self) -> bool:
        return bool(self.gemini_api_key and self.gemini_image_model)

    @property
    def youtube_enabled(self) -> bool:
        return bool(self.youtube_api_key)

    @property
    def email_enabled(self) -> bool:
        return bool(self.email_provider and self.email_from)


@lru_cache
def get_settings() -> Settings:
    return Settings()

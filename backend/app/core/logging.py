"""Structured JSON logging with correlation IDs and redaction of sensitive keys."""

import contextvars
import json
import logging
import sys
from datetime import UTC, datetime
from typing import Any

correlation_id: contextvars.ContextVar[str] = contextvars.ContextVar("correlation_id", default="-")

SENSITIVE_KEYS = {
    "password",
    "token",
    "secret",
    "authorization",
    "cookie",
    "api_key",
    "content",
    "body",
    "journal",
    "message",
    "transcript",
    "note",
}


def redact(data: Any) -> Any:
    if isinstance(data, dict):
        return {
            k: "[REDACTED]" if any(s in k.lower() for s in SENSITIVE_KEYS) else redact(v)
            for k, v in data.items()
        }
    if isinstance(data, list):
        return [redact(i) for i in data]
    return data


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, Any] = {
            "ts": datetime.now(UTC).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "msg": record.getMessage(),
            "correlation_id": correlation_id.get(),
        }
        extra = getattr(record, "extra_fields", None)
        if isinstance(extra, dict):
            payload.update(redact(extra))
        if record.exc_info and record.exc_info[0]:
            payload["exc_type"] = record.exc_info[0].__name__
        return json.dumps(payload)


def configure_logging(level: str = "INFO") -> None:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())
    root = logging.getLogger()
    root.handlers = [handler]
    root.setLevel(level.upper())

import pytest
from pydantic import ValidationError

from app.core.config import Settings
from app.core.logging import redact


def test_health(client):
    r = client.get("/api/v1/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}
    assert "X-Request-ID" in r.headers


def test_ready_reports_db_and_integrations(client):
    r = client.get("/api/v1/ready")
    assert r.status_code == 200
    body = r.json()
    assert body["database"] == "ok"
    assert set(body["integrations"]) == {"gemini_text", "gemini_image", "youtube", "email"}


def test_request_id_is_propagated(client):
    r = client.get("/api/v1/health", headers={"X-Request-ID": "abc123"})
    assert r.headers["X-Request-ID"] == "abc123"


def test_unknown_route_uses_standard_error_shape(client):
    r = client.get("/api/v1/does-not-exist")
    assert r.status_code == 404
    assert r.json()["error"]["code"] == "http_error"


def test_cors_allows_configured_origin_only(client):
    ok = client.options(
        "/api/v1/health",
        headers={"Origin": "http://localhost:5173", "Access-Control-Request-Method": "GET"},
    )
    bad = client.options(
        "/api/v1/health",
        headers={"Origin": "https://evil.example", "Access-Control-Request-Method": "GET"},
    )
    assert ok.headers.get("access-control-allow-origin") == "http://localhost:5173"
    assert "access-control-allow-origin" not in bad.headers


@pytest.mark.parametrize(
    "override",
    [
        {"secret_key": "dev-insecure-change-me"},
        {"cors_origins": "*"},
        {"cookie_secure": False},
        {"database_url": "sqlite:///./x.db"},
    ],
)
def test_production_config_guards(override):
    base = dict(
        app_env="production",
        secret_key="x" * 40,
        cookie_secure=True,
        cors_origins="https://melvis.app",
        database_url="postgresql+psycopg://u:p@h/db",
    )
    base.update(override)
    with pytest.raises(ValidationError):
        Settings(**base)


def test_log_redaction():
    out = redact({"path": "/x", "password": "p", "nested": {"journal_text": "private"}})
    assert out["password"] == "[REDACTED]"
    assert out["nested"]["journal_text"] == "[REDACTED]"
    assert out["path"] == "/x"

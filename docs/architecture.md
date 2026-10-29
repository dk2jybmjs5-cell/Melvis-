# MELVIS architecture

Status legend: **Built** = implemented and tested in this repo. **Planned** = designed, not yet built.

## Overview

MELVIS is a two-tier web application: a React single-page app talking to a FastAPI REST API over HTTPS, with PostgreSQL for persistence and server-side integrations for Gemini (text and image), YouTube Data API v3, and email.

```
Browser (React SPA)
   │  HTTPS, JSON, HTTP-only session cookie
   ▼
FastAPI  /api/v1
   ├── api/ ........... routes, request/response schemas, dependencies
   ├── services/ ...... business logic (auth, chat, safety, wellness, images, resources)
   ├── repositories/ .. database access, always scoped to the authenticated user
   ├── ai/ ............ provider interface + Gemini adapter, prompts, orchestration
   ├── integrations/ .. YouTube, email
   └── db/ ............ SQLAlchemy engine/session, Alembic migrations
   ▼
PostgreSQL (SQLite allowed for local dev only)
```

Rule: routes never touch the database or a provider directly. Routes call services; services call repositories and providers.

## Components

| Component | Responsibility | Status |
|---|---|---|
| Config (`core/config.py`) | Typed env settings; refuses unsafe production config (weak secret, wildcard CORS, insecure cookies, SQLite) | Built |
| Logging (`core/logging.py`) | JSON logs, correlation IDs, redaction of sensitive keys; request bodies never logged | Built |
| Errors (`core/exceptions.py`) | One error shape `{error:{code,message,request_id}}`; internals hidden | Built |
| Health (`/health`, `/ready`) | Liveness, DB readiness, integration availability | Built |
| Auth | Argon2id hashing, server-side sessions in HTTP-only cookies, CSRF double-submit token, rate limits | Planned (Phase 3) |
| Chat | Provider abstraction, Gemini adapter, streaming via SSE, context truncation, quotas | Planned (Phase 5) |
| Safety | Rule-based crisis detection first, model-assisted classification second, verified resource config | Planned (Phase 5) |
| Visual explainer | Text first, then optional Gemini image; alt text; ownership-checked storage | Planned (Phase 6) |
| Voice | Browser Web Speech API with feature detection; no audio retained | Planned (Phase 6) |
| Mood, journal, activities | User-owned CRUD, private by default, never auto-sent to AI | Planned (Phase 7) |
| Resources | YouTube Data API v3 with curated queries, cache, labelled fallback library | Planned (Phase 7) |
| Therapist module | Roles, verification, booking, messaging, calls, payments | Planned (separate module, after core) |

## Key decisions

- **Session cookies over JWT in localStorage.** HTTP-only cookies keep tokens out of JavaScript; server-side sessions allow real revocation. Cost: CSRF protection is required for state-changing requests.
- **Provider abstraction for AI.** `ai/providers/base.py` defines the interface; Gemini is one implementation. Model IDs live in env (`GEMINI_TEXT_MODEL`, `GEMINI_IMAGE_MODEL`), never in code.
- **Safety is not delegated to the model.** Deterministic rules run before any model call and can short-circuit to crisis resources.
- **Honest unavailability.** Missing credentials produce labelled "not configured" states, never mock responses.
- **Frontend server state via TanStack Query**; 4xx errors are never retried.

# MELVIS

An AI-powered mental wellness companion for people aged 15–30: conversations, visual explanations, mood check-ins, private journaling, guided breathing and meditation, and curated learning resources.

MELVIS is not a therapist, cannot diagnose, and is not an emergency service.

> **Build status:** Phases 1–2 (architecture and foundation) complete. See [`docs/requirements-checklist.md`](docs/requirements-checklist.md) for exactly what is built and tested.

## Stack

Frontend: React 18, TypeScript (strict), Vite, Tailwind CSS, React Router, TanStack Query, Zod, Vitest.
Backend: Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2, Alembic, PostgreSQL (SQLite for local dev), pytest.

## Run locally

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```
API docs: http://localhost:8000/docs

Optional Postgres: `docker compose up -d db`, then set
`DATABASE_URL=postgresql+psycopg://melvis:melvis_local_only@localhost:5432/melvis`.

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Open http://localhost:5173/status to see the frontend reading live backend readiness.

## Checks

```bash
# backend
ruff check . && ruff format --check . && mypy app && pytest -q
# frontend
npm run typecheck && npm run lint && npm test && npm run build
```

## Docs
- [Architecture](docs/architecture.md)
- [Requirements checklist](docs/requirements-checklist.md)
- [Environment and credentials](docs/environment-and-credentials.md)

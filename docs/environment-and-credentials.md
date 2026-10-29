# Environment variables and external credentials

| Variable | Needed for | Required? | Where to get it |
|---|---|---|---|
| `DATABASE_URL` | Everything | Yes | Local: SQLite default or `docker compose up db`. Production: managed Postgres (e.g. Neon, Supabase, Render) |
| `SECRET_KEY` | Sessions, CSRF | Yes | `python -c "import secrets; print(secrets.token_urlsafe(64))"` |
| `CORS_ORIGINS` | Browser access | Yes | Your frontend URL(s), comma-separated |
| `COOKIE_SECURE` | Sessions | `true` in prod | — |
| `GEMINI_API_KEY` | Chat, images | For AI features | Google AI Studio |
| `GEMINI_TEXT_MODEL` | Chat | For chat | Pick a current model from Google's model list; don't hard-code |
| `GEMINI_IMAGE_MODEL` | Visual explainer | For images | A current image-capable Gemini model; confirm access and pricing first |
| `YOUTUBE_API_KEY` | Resource library | Optional | Google Cloud Console → enable YouTube Data API v3 |
| `EMAIL_PROVIDER`, `EMAIL_FROM`, SMTP vars | Verification, resets | Optional | Any SMTP provider or transactional email service |
| `SENTRY_DSN` | Error monitoring | Optional | Sentry project settings |
| `VITE_API_BASE_URL` (frontend) | API calls | Yes | Backend URL + `/api/v1` |

Open items that need a human decision before the relevant phase:
1. Gemini key and which text/image models your key can access (Phase 5–6).
2. Verified Nigerian crisis-support contacts, each checked against an official source (Phase 5).
3. Hosting targets for frontend and backend (Phase 9).

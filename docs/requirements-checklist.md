# Requirements checklist

Ticked only when implemented **and** covered by an executed test.

## Phase 1–2: Discovery and foundation
- [x] Monorepo structure, `.gitignore`, env templates
- [x] FastAPI app with versioned router `/api/v1`
- [x] Typed configuration with production safety guards
- [x] Structured JSON logging, correlation IDs, sensitive-key redaction
- [x] Standard error responses
- [x] `/health` and `/ready` (DB + integration availability)
- [x] Explicit-origin CORS
- [x] SQLAlchemy 2 session management, Alembic wired
- [x] React + TS (strict) + Vite + Tailwind + Router + TanStack Query
- [x] Typed API client with normalised errors
- [x] Accessible shell: skip link, focus styles, reduced motion, non-clinical disclaimer
- [x] CI workflow for both apps

## Phase 3: Authentication
- [ ] Registration, login, logout
- [ ] Argon2id password hashing
- [ ] Server-side sessions, HTTP-only cookies, revocation
- [ ] CSRF protection
- [ ] Rate limiting on auth endpoints
- [ ] Ownership enforcement helper + cross-user access tests
- [ ] Preferences and consent records
- [ ] Data export and account deletion
- [ ] Email verification and password reset (when email configured)

## Phase 4: Core interface
- [ ] Landing, sign-up, login, onboarding/consent, dashboard, settings
- [ ] Protected routes
- [ ] Component library (buttons, forms, dialogs, toasts, skeletons, empty states)
- [ ] Dark mode toggle

## Phase 5: AI chat
- [ ] Provider interface + Gemini adapter (official SDK)
- [ ] Conversations and messages with pagination
- [ ] Streaming, cancel, retry, duplicate-submit guard
- [ ] Timeouts, quotas, provider-failure handling
- [ ] Layered crisis safety + synthetic scenario tests
- [ ] Verified crisis resources for Nigeria

## Phase 6: Visual and voice
- [ ] "Show me visually" workflow with alt text and AI-generated label
- [ ] Image ownership and access control
- [ ] Speech-to-text and text-to-speech with fallbacks

## Phase 7: Wellness modules
- [ ] Mood check-ins, history, charts
- [ ] Private journal with search and confirmed autosave
- [ ] Breathing, grounding, meditation with timers
- [ ] YouTube resource library with fallback

## Phase 8–9: Hardening and delivery
- [ ] Accessibility and responsive audit
- [ ] Security review
- [ ] Full docs set and recorded test results

# StudyFlow AI — Architecture & Implementation Plan

This is the analysis pass requested before implementation: folder structure, data model, auth/API/AI architecture, routing, design system, risks, dependencies, and phased plan. Phase 1 (scaffolded alongside this doc) covers project setup, database, and authentication only — nothing further.

## 1. Folder Structure

Single Next.js 14 app (App Router), no separate backend — Route Handlers serve as the API layer. This avoids the complexity of a second deployable for an MVP while keeping a clean service boundary so a standalone API could be split out later if needed.

```
studyflow-ai/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (marketing)/              # public landing page, no auth
│   │   │   └── page.tsx
│   │   ├── (auth)/                   # login/register/reset — no sidebar shell
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── reset-password/page.tsx
│   │   │   └── verify-email/page.tsx
│   │   ├── (app)/                    # authenticated shell (sidebar + header)
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── courses/...
│   │   │   ├── assignments/...
│   │   │   ├── exams/...
│   │   │   ├── planner/...
│   │   │   ├── calendar/...
│   │   │   ├── gpa/...
│   │   │   ├── notes/...
│   │   │   ├── documents/...
│   │   │   ├── groups/...
│   │   │   ├── analytics/...
│   │   │   └── assistant/...
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── courses/route.ts + [id]/route.ts
│   │       ├── assignments/...
│   │       └── ai/...
│   ├── components/
│   │   ├── ui/            # shadcn primitives (button, card, input, dialog...)
│   │   ├── marketing/
│   │   ├── auth/
│   │   └── app/            # sidebar, header, dashboard widgets
│   ├── server/
│   │   ├── services/       # business logic (AssignmentService, GpaService, AiService)
│   │   ├── repositories/   # Prisma queries, one per entity — isolates ORM from services
│   │   └── auth.ts         # NextAuth config
│   ├── lib/                 # zod schemas, utils, ai-provider abstraction
│   └── middleware.ts        # route protection + RBAC gate
└── .env.example
```

**Why a service + repository split:** services hold business rules (e.g. "GPA recalculates when an assignment's grade is entered"); repositories are the only files that import Prisma. This keeps route handlers thin and testable, and satisfies the "no logic in giant route files" requirement.

## 2. Core Entities & Relationships (full model — built incrementally per phase)

```
User 1───* Semester 1───* Course 1───* Assignment
                              │            │
                              │            └──* StudySession (optional link)
                              1───* Exam
                              1───* Note
                              1───* Document
                              1───* GradeEntry ──> feeds GpaSnapshot (derived, per Semester)

User 1───* StudySession
User 1───* Notification
User *───* StudyGroup (via GroupMembership)
StudyGroup 1───* GroupMessage, GroupSharedTask

Assignment.dueDate ──drives──> StudyPlanner suggestions
StudySession.completed ──feeds──> Analytics aggregates
```

Key relationship rules: an `Assignment` and `Exam` always belong to exactly one `Course`; a `Course` always belongs to exactly one `Semester`; GPA is computed from `GradeEntry` rows per `Course`, never stored as a raw editable number — this is what keeps "the system connects everything" from section 4 honest instead of decorative.

Phase 1 only needs the auth-adjacent subset: `User`, `Account`, `Session`, `VerificationToken`, plus profile fields captured at registration (institution, academic level). Full academic entities land in Phase 2.

## 3. Authentication Architecture

- **Auth.js (NextAuth) v5**, JWT session strategy (stateless, scales horizontally without a session store).
- Providers: Credentials (email + bcrypt-hashed password) and Google OAuth.
- Email verification: signed, expiring token in `VerificationToken`; unverified users can log in but are gated from data-mutating routes until verified (soft gate, not a hard wall — reduces onboarding drop-off while still requiring verification before real use).
- Password reset: same token table, single-use, 1-hour expiry.
- Sessions: JWT with `userId` + `role` claims; `middleware.ts` checks the token on every `(app)` route and every `/api/*` route re-validates server-side (never trust the client-side redirect alone).
- RBAC: single `role` enum (`STUDENT`, `ADMIN`) is enough for MVP — no need for a permissions table until the admin portal (Phase 10) has more than one privilege tier.

## 4. API Architecture

REST-ish Route Handlers under `src/app/api/`, one resource per folder. Conventions:
- Every handler validates input with a Zod schema shared with the frontend form (`src/lib/schemas/`) — one source of truth for validation rules.
- Every handler re-checks `userId` ownership on the row before mutating (never rely on the ID in the URL alone).
- Handlers call a `server/services/*` function; they don't touch Prisma directly.
- Errors return a consistent `{ error: { code, message } }` shape; loading/error states in the UI key off `code`, not string-matching messages.

## 5. AI Service Architecture

```
UI (Ask AI, plan approval, insight card)
        ↓
AiService (server/services/ai.service.ts)
        ↓  — builds a structured prompt from real user data (courses, deadlines, sessions)
AiProvider interface  { generatePlan(), summarizeDocument(), chat() }
        ↓
Concrete adapter: OpenAiAdapter | GeminiAdapter | GrokAdapter  (picked via AI_PROVIDER env var)
```

The service layer always requests **structured JSON output** (a study plan is `{ sessions: [{courseId, date, startTime, durationMin, reason}] }`, not free text), validates it against a Zod schema before it ever reaches the database or UI, and rejects/retries once on a schema mismatch. This is what makes "validated AI output" in section 72 real rather than aspirational — the UI never renders raw model text as if it were data.

## 6. Frontend Routing

Three route groups so layouts don't leak into each other:
- `(marketing)` — no auth, public, includes landing page.
- `(auth)` — no sidebar, centered card layout, redirects to `/dashboard` if already signed in.
- `(app)` — sidebar + header shell, `middleware.ts` blocks unauthenticated access, every child route reads the same session.

## 7. Design System

Chosen deliberately against the two clichés this brief could easily fall into — "generic SaaS card kit" and "warm cream + terracotta AI-generated" — and against the obvious "parchment and Times New Roman" reading of "academic":

- **Palette** — `ink` `#14213C` (primary text/dark surfaces), `paper` `#F7F7F5` (cool off-white background, not cream), `indigo` `#3454D1` (primary accent — actions, links, focus states), `amber` `#E8A33D` (used sparingly — streaks, due-soon states, never as a second primary color), `sage` `#5B8266` (completed/success), `slate` `#A9AFBC` (borders, muted text).
- **Type** — *Fraunces* (variable serif) for headlines and the landing page — gives "academic" real personality instead of a stock serif; *Manrope* for UI/body — calm, geometric, avoids the extremely default feel of shipping Inter untouched.
- **Layout** — left-aligned, generous whitespace, sidebar-based app shell. Most cards use a **1px `slate` hairline border, not a drop shadow** — shadows are reserved for the dashboard's "Today's Focus" hero card and modals only, so elevation actually means something instead of every card looking identical.
- **Motion** — motion is a first-class part of this product's premium feel, not a garnish, so it gets a real library: **Framer Motion**, added as a dependency starting Phase 2 (added to `package.json` now so Phase 3 can use it immediately). Rules to keep it premium instead of noisy: spend the boldness on a small number of signature moments (the dashboard's "Today's Focus" stagger-in on load, a study-timer ring that actually animates progress, a satisfying check-off/complete transition on tasks) rather than a hover-and-fade on every card; everything else stays fast and quiet (150–250ms, standard easing). Respect `prefers-reduced-motion`. Motion answers something the user did or something that changed — it doesn't run just to look busy.

## 8. Security Risks & Mitigations

| Risk | Mitigation |
|---|---|
| IDOR (user A reads/edits user B's assignment) | Every repository query filters by `userId`/ownership, never by ID alone |
| Client-trusted MIME type on upload | Re-check file signature server-side before storing (section 63) |
| AI prompt injection via note/document content fed into prompts | Treat document text as data, not instructions; system prompt is fixed, user content is never concatenated into the instruction portion |
| Secrets in client bundle | AI/storage keys only ever read server-side; `NEXT_PUBLIC_*` reserved for genuinely public values |
| Session fixation / long-lived tokens | Short JWT expiry with refresh, invalidate on password change |
| Unvalidated AI JSON reaching the DB | Zod-validate every AI response before persisting (section 5 above) |

## 9. Scalability Considerations

- JWT sessions avoid a sticky session store, so the app scales horizontally on Vercel/Railway without extra config.
- Heavy AI calls (plan generation, document summarization) should eventually move to a background job queue rather than blocking a request — acceptable to call synchronously for MVP, flagged here for Phase 7+.
- Analytics aggregates (section 6/60) should be pre-computed on write (e.g. update a `WeeklyStudyStats` row when a session completes) rather than recalculated from raw rows on every dashboard load, once usage grows.
- Prisma connection pooling (e.g. via PgBouncer or Prisma Accelerate) is needed before deploying to a serverless target — plain Postgres connections exhaust fast on Vercel functions.

## 10. Dependencies (Phase 1)

`next`, `react`, `typescript`, `tailwindcss`, `@prisma/client` + `prisma`, `next-auth@beta` (v5), `bcryptjs`, `zod`, `react-hook-form`, `@hookform/resolvers`, `lucide-react`, plus shadcn/ui components added via its CLI (not a runtime dependency).

## 11. Implementation Phases

Unchanged from the brief (section 68) — Phase 1: setup + auth (this delivery). Phase 2: core data model. Phase 3: core UI/dashboard. Phase 4: academic workflow. Phase 5: notes/documents/search. Phase 6: GPA/analytics. Phase 7: AI. Phase 8: collaboration. Phase 9: notifications. Phase 10: admin. Phase 11: hardening.

## 12. What's in This Delivery (Phase 1 only)

- Next.js + TypeScript + Tailwind project, configured with the design tokens above.
- Prisma schema: `User`, `Account`, `Session`, `VerificationToken` (auth-only subset).
- Auth.js v5 config: Credentials + Google OAuth, JWT sessions, middleware route protection.
- Pages: landing page (real hero, not lorem ipsum), `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`.
- A protected `/dashboard` stub that proves the auth flow end-to-end (no widgets yet — that's Phase 3).
- `.env.example`, seed script stub, README with setup instructions.

Nothing in Phases 2–11 is stubbed with fake data per section 70 — those screens simply don't exist yet in this delivery.

## 13. Phase 2 — Delivered

- Prisma schema extended: `Semester`, `Course`, `Assignment`, `Exam`, `StudySession`, with the relationships from §2. `Course` carries a denormalized `userId` so ownership checks don't need a join through `Semester` on every read.
- Repository layer (`src/server/repositories/`): one file per entity, every query scoped by ownership — `Assignment`/`Exam` prove ownership through `course.userId` since they have no direct `userId` of their own.
- Service layer (`src/server/services/`): business rules live here — e.g. `SemesterService` enforces "only one active semester at a time."
- Full REST CRUD (`GET`/`POST` on the collection, `GET`/`PATCH`/`DELETE` on `/:id`) for all five resources, each re-validating the session server-side via `requireUserId()` and validating input with the shared Zod schemas in `src/lib/schemas/academic.schema.ts`.
- Seed script extended with a sample semester, two courses, an assignment, an exam, and a study session — enough to exercise every new endpoint immediately.
- `framer-motion` added as a dependency (unused until Phase 3 builds real screens) per the motion decision in §7.

No UI reads these endpoints yet — that's Phase 3, next.


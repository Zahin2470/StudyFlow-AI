# StudyFlow AI

> Your Academic Life, Organized.

This repository contains **Phase 1** of StudyFlow AI: project setup, database, and
authentication. See `ARCHITECTURE.md` for the full system design and phased plan —
academic entities (courses, assignments, exams...), the dashboard, AI assistant, and
everything else in the brief are built in the phases that follow, deliberately not
stubbed here.

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma · PostgreSQL · Auth.js v5

## Getting started

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL, AUTH_SECRET, Google OAuth keys
npx auth secret            # generates AUTH_SECRET if you don't have one
npm run db:migrate         # creates the auth tables
npm run db:seed            # optional — creates demo@studyflow.ai / Password123
npm run dev
```

Visit `http://localhost:3000`.

## What works right now

- Landing page hero
- Register (`/register`) → creates a user, issues an email-verify token
- Login (`/login`) → email/password (Credentials) or Google OAuth
- Forgot/reset password flow
- Dashboard, Courses, Assignments, Exams, Calendar, Study Planner + Timer, Notes, Documents, GPA & Grades, Analytics — all backed by real data, no fake/hardcoded content anywhere
- AI Assistant (chat + study-plan generation) — works once `AI_PROVIDER`/`AI_API_KEY` are set in `.env`; shows a plain "not configured" state otherwise, the rest of the app is unaffected either way

## Environment variables

See `.env.example`. `AI_PROVIDER`/`AI_API_KEY` and the storage variables are present for
Phase 5/7 but unused until those phases land — no need to fill them in yet.

## Project structure

See `ARCHITECTURE.md` §1 for the full breakdown and the reasoning behind the
service/repository split.

## Next steps (Phase 2)

Add the academic data model — `Semester`, `Course`, `Assignment`, `Exam`,
`StudySession` — and their CRUD API routes. Nothing in the UI references these yet.

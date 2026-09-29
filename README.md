<div align="center">

# 📚 StudyFlow AI

### Your Academic Life, Organized.

*A full-stack academic operating system for students — courses, assignments, exams, study planning, grades, and an AI assistant that actually understands how they connect.*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5-black?style=flat-square)](https://authjs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

[Features](#-features) • [Tech Stack](#️-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [Roadmap](#-roadmap)

</div>

---

## ✨ Overview

StudyFlow AI brings everything a student juggles — courses, deadlines, exams, study time, grades, notes, files, and group work — into one connected system, instead of five disconnected apps. Every screen is backed by real data with no hardcoded placeholders; where a feature isn't built yet, it's honestly marked as such rather than faked.

Built end-to-end in eight phases, each with its own architectural reasoning documented in [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## 🎯 Features

<table>
<tr>
<td valign="top" width="50%">

### 🎓 Academic Core
- **Courses** — organized by semester, color-coded
- **Assignments** — priority, status, due-date tracking
- **Exams** — countdown, weight, location
- **Calendar** — unified month view of everything due
- **GPA & Grades** — calculated live from entries, never hand-typed

### 📅 Study Tools
- **Study Planner** — schedule sessions ahead of time
- **Study Timer** — animated focus timer that logs real sessions
- **Analytics** — weekly study time, GPA trend, completion rates

</td>
<td valign="top" width="50%">

### 🗂️ Content
- **Notes** — per-course, quick to capture
- **Documents** — real file upload/download, storage-provider agnostic
- **Global Search** — across courses, assignments, exams, notes, files

### 🎨 Experience
- **Dark & light mode** — system-aware, persisted, reaches every screen through one token system
- **Motion done deliberately** — one signature moment per surface (an interactive dashboard preview on the landing page, a real animated study timer), not motion sprinkled on everything

### 🤝 Collaboration & AI
- **Study Groups** — invite-code join, group chat, shared tasks
- **AI Assistant** — chat + AI-generated study plans, grounded in your actual courses and deadlines, provider-agnostic (OpenAI / Gemini / Grok)

</td>
</tr>
</table>

Every one of these is a genuinely working feature, not a mockup — see [`ARCHITECTURE.md`](./ARCHITECTURE.md) for what's real vs. what's intentionally deferred.

## 🖼️ Screenshots

> _Add screenshots or a short demo GIF here once you have a deployed instance — a Dashboard and Study Planner shot make the best first impression._

```
docs/
└── screenshots/
    ├── dashboard.png
    ├── planner.png
    └── ai-assistant.png
```

## 🛠️ Tech Stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router, Route Handlers as the API layer) |
| Language | TypeScript |
| Styling | Tailwind CSS — custom design tokens, not default shadcn theme |
| Animation | Framer Motion |
| Database | PostgreSQL + [Prisma](https://www.prisma.io/) |
| Auth | [Auth.js v5](https://authjs.dev/) — Credentials + Google OAuth, JWT sessions |
| Forms & Validation | React Hook Form + Zod (shared schemas, client and server) |
| Charts | Recharts |
| File Storage | Pluggable `StorageProvider` — local disk by default, S3/Supabase-ready |
| AI | Pluggable `AiProvider` — OpenAI, Gemini, or Grok |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database ([Supabase](https://supabase.com/), [Railway](https://railway.app/), or local Postgres all work)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# fill in DATABASE_URL and AUTH_SECRET at minimum — see Environment Variables below

# 3. Generate an auth secret if you don't have one
npx auth secret

# 4. Set up the database
npm run db:migrate

# 5. (Optional) Seed demo data
npm run db:seed
# → creates demo@studyflow.ai / Password123 with sample courses,
#   assignments, grades, and a study group (invite code: demo1234)

# 6. Run the dev server
npm run dev
```

Visit **http://localhost:3000** 🎉

### Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |

## 🔐 Environment Variables

See [`.env.example`](./.env.example) for the full list. The essentials to get running:

| Variable | Required | Notes |
|---|:---:|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `AUTH_SECRET` | ✅ | Generate with `npx auth secret` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional | Enables Google sign-in |
| `AI_PROVIDER` / `AI_API_KEY` | Optional | Enables the AI Assistant (`openai`, `gemini`, or `grok`) |
| `STORAGE_PROVIDER` | Optional | Defaults to `local` — works with zero config |

Everything not marked required has a graceful fallback — the app runs fully without AI or Google OAuth configured.

## 📁 Project Structure

```
studyflow-ai/
├── prisma/
│   ├── schema.prisma        # full data model — see ARCHITECTURE.md §2
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (marketing)/      # public landing page
│   │   ├── (auth)/           # login, register, password reset
│   │   ├── (app)/            # authenticated shell — every real feature lives here
│   │   └── api/              # REST route handlers, one folder per resource
│   ├── components/
│   │   ├── ui/                # shared primitives (Modal, Badge, EmptyState...)
│   │   └── app/                # feature components, one folder per section
│   ├── server/
│   │   ├── services/           # business logic
│   │   ├── repositories/       # Prisma queries, ownership-scoped
│   │   └── services/{ai,storage}/  # pluggable provider abstractions
│   ├── lib/                    # Zod schemas, GPA math, shared utils
│   └── middleware.ts           # route protection
└── ARCHITECTURE.md            # full design rationale, phase by phase
```

Full breakdown and the reasoning behind the service/repository split: [`ARCHITECTURE.md §1`](./ARCHITECTURE.md).

## 🧭 Roadmap

**✅ Complete** — Auth, Courses, Assignments, Exams, Calendar, Study Planner + Timer, Notes, Documents, Search, GPA & Grades, Analytics, AI Assistant, Study Groups.

**Known, honest gaps** (not blockers — the natural "harden for production" list):
- AI provider adapters are built against documented APIs but untested against live keys
- Group chat polls every 5s rather than using real-time websockets
- Notes are plain text — no rich text editor yet
- File storage is local-disk by default until an S3/Supabase adapter is added
- No email delivery yet — verification/reset tokens are generated but not sent

**Not started**: Notifications system, Admin portal, Subscriptions/billing.

## 🤝 Contributing

This is currently a solo academic project, but suggestions and issues are welcome — open an issue to discuss a change before submitting a PR.

## 📄 License

[MIT](./LICENSE)

---

<div align="center">

Built by **Abrar Hossain Zahin** — B.Sc. CSE student & AI/ML researcher, East West University

[Portfolio](https://abrar-hossain-zahin-portfolio.vercel.app)

</div>

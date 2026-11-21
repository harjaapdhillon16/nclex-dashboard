# QREXq

Exam-preparation platform in the style of a question bank (UWorld / Boot.camp): learn each topic, practice with exam-style
questions, then test yourself with mock exams. NCLEX-RN is the most complete course; every other course ships with starter content.

Built with Next.js 16, React 19, Tailwind CSS v4, PostgreSQL (Neon) and Drizzle ORM.

## What a learner does

1. **Today** – one clear next step, question-bank usage, performance by unit, readiness estimate.
2. **Learn** – a course is split into units; each unit has lessons, flashcards and practice questions.
3. **Practice** – build a test (tutor / timed / exam) from a pool (all, unused, incorrect, marked) and the units you choose.
4. **Mock exams** – full-length timed exams and past test history.
5. **Progress** – accuracy over time, weakest units and topics.

Staff (`admin`, `reviewer`) also get **Content admin**: content health per course, the question review queue, bulk import and AI drafts.

## Run it

```bash
npm install
npm run db:push     # create the schema in the database from .env.local
npm run db:seed     # idempotent: courses, questions, lessons, flashcards, plans, demo accounts
npm run dev         # http://localhost:3000
```

Demo accounts (password is `SEED_PASSWORD` in `.env.local`): `student@qrexq.test`, `reviewer@qrexq.test`, `admin@qrexq.test`.

## Where things live

| Area | Location |
|---|---|
| Learner app | `app/(app)/dashboard`, `app/(app)/exam/[slug]/*` |
| Test player and results | `app/test/[id]`, `app/(app)/test/[id]/results` |
| Admin | `app/(app)/admin/*` |
| Learning path (units, progress, next step) | `lib/learning-path.ts` |
| Test creation and analytics | `lib/tests.ts` |
| Course catalogue and seed content | `lib/seed/catalog.ts`, `lib/seed/content/*` |
| Database schema | `lib/db/schema.ts` |

All questions and lessons are original writing for practice purposes.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

Backend API is expected at `http://127.0.0.1:3001` (configured via `NEXT_PUBLIC_API_URL` in `.env`).

## Architecture

This is a **French-language medical data collection app** for a doctoral thesis on epidural analgesia during labor. Built with Next.js 13 App Router, React 18, TypeScript, Tailwind CSS, and shadcn/ui.

### Key Layers

**`app/`** — Next.js App Router pages. Three routes: `/` (dashboard), `/patients` (list), `/patients/new` (create), `/patients/[id]` (view/edit).

**`components/`** — Two main feature areas:
- `components/dashboard/` — Statistics, satisfaction distribution chart (recharts), recent patients list
- `components/patient-form/` — A 9-step guided form (`patient-form.tsx` orchestrates steps 1–9). Each step (`form-step1.tsx`–`form-step9.tsx`) covers a distinct clinical area: socio-demographics, medical history, current pregnancy, labor, epidural analgesia, delivery, anesthesia details, analgesic efficacy, and satisfaction/follow-up.

**`lib/`** — Core logic:
- `types.ts` — The central `Patient` interface with 8 nested sections and 40+ fields
- `data-context.tsx` — React Context providing global CRUD state; syncs with backend and falls back to localStorage
- `api.ts` — REST client for backend (`GET`, `POST`, `PATCH` on `/api/patients`)
- `storage.ts` — localStorage utilities and CSV export
- `utils.ts` — `cn()` helper, `formatDate()`, `generateId()`, empty patient template

### Data Flow

1. `DataProvider` (in `components/providers.tsx`) wraps the app and loads patients from the backend on mount, falling back to localStorage.
2. Components consume `useData()` from `data-context.tsx` for all CRUD operations.
3. Forms use `react-hook-form` with `zod` validation. The multi-step form holds accumulated state in `patient-form.tsx` and submits on the final step.
4. On submit, data is sent to the backend via `api.ts` and also persisted to localStorage.

### UI Conventions

- All UI primitives are from shadcn/ui (`components/ui/`). Do not re-implement what's already there.
- Dark/light mode via `next-themes` with class-based Tailwind dark mode.
- Toast notifications via `sonner` (wrapped in `use-toast.ts`).
- Path alias `@/` resolves to the repo root.

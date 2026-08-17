# Phase 2 — Backend & Core Pages

**Status:** ✅ Completed  
**Goal:** Add database, authentication, Home page, Create Hangout page, and navigation using clean layered architecture.

---

## 1. Data Access & Repositories (`src/db/`)

- `[x]` Create `.env.local` with `DATABASE_URL`
- `[x]` `src/db/schema.ts` — All table definitions (users, hangouts, activities, hangoutActivities, places, itineraryItems, memories)
- `[x]` `drizzle.config.ts` — Drizzle Kit config
- `[x]` `src/db/index.ts` — Drizzle client
- `[x]` **Repository Layer (`src/db/repositories/`)**:
  - `[x]` `src/db/repositories/usersRepository.ts`
  - `[x]` `src/db/repositories/hangoutsRepository.ts`
  - `[x]` `src/db/repositories/activitiesRepository.ts`
- `[x]` `src/db/seed.ts` — Seed users (Agam, Diva), 8 activities, mock places

---

## 2. Business Logic & Services (`src/services/` & `src/lib/actions/`)

- `[x]` `src/lib/session.ts` — Session config & types (`SessionData`)
- `[x]` `src/services/authService.ts` — Secret hashing & verification rules
- `[x]` `src/lib/actions/auth.ts` — Login / Logout server actions
- `[x]` `src/services/hangoutService.ts` — Zod schema validation & domain service
- `[x]` `src/lib/actions/hangouts.ts` — Hangout creation server action
- `[x]` `src/middleware.ts` — Session guard for `/home`, `/hangouts/*`, `/memories`

---

## 3. UI Logic Hooks (`src/hooks/`)

- `[x]` `src/hooks/useHomeData.ts` — Home view state, formatted greeting, upcoming status formatting
- `[x]` `src/hooks/useCreateHangout.ts` — Form validation, duration auto-calculator, currency formatter

---

## 4. Pure Presentation Pages (`src/components/pages/`)

### Home Page (`/home`)
- `[x]` `src/app/(app)/home/page.tsx` — Server Component data fetcher
- `[x]` `src/components/pages/HomePage.tsx` — Presentational UI
- `[x]` `src/components/pages/HomePage.module.css`

### Create Hangout (`/hangouts/new`)
- `[x]` `src/app/(app)/hangouts/new/page.tsx` — Route entry
- `[x]` `src/components/pages/CreateHangoutPage.tsx` — Presentational UI
- `[x]` `src/components/pages/CreateHangoutPage.module.css`

---

## 5. Navigation & Layout

- `[x]` `src/components/nav/DesktopNav.tsx`
- `[x]` `src/components/nav/MobileNav.tsx`
- `[x]` `src/components/nav/MobileHeader.tsx`
- `[x]` `src/components/nav/Nav.module.css`
- `[x]` `src/app/(app)/layout.tsx` — Authenticated layout shell

---

## Verification

- `[ ]` Pure separation: No raw SQL / Drizzle queries inside UI components or hooks
- `[ ]` Login flow works through `authService` + session cookies
- `[ ]` Create hangout works through `useCreateHangout` + `hangoutsRepository`
- `[ ]` `npm run build` passes cleanly

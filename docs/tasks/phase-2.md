# Phase 2 — Backend & Core Pages

**Status:** ⏳ Not Started  
**Goal:** Add database, authentication, Home page, Create Hangout page, and navigation

---

## Database Setup (Drizzle ORM + PostgreSQL)

- `[ ]` Create `.env.local` with `DATABASE_URL`
- `[ ]` `src/db/schema.ts` — All table definitions:
  - `[ ]` `users` table (id, name, secret_hash, created_at)
  - `[ ]` `hangouts` table (id, created_by, date, start_time, end_time, area, budget, notes, status, created_at)
  - `[ ]` `activities` table (id, name, icon, slug)
  - `[ ]` `hangout_activities` table (hangout_id, activity_id, user_id, choice)
  - `[ ]` `places` table (id, name, category, area, distance_km, price_min, price_max, rating, description)
  - `[ ]` `itinerary_items` table (id, hangout_id, place_id, activity_id, start_time, end_time, order)
  - `[ ]` `memories` table (id, hangout_id, note, rating, created_at)
- `[ ]` `drizzle.config.ts` — Drizzle Kit config
- `[ ]` `src/db/index.ts` — Drizzle client (postgres/neon)
- `[ ]` Run `drizzle-kit generate` — generate migrations
- `[ ]` Run `drizzle-kit migrate` — apply migrations to DB
- `[ ]` `src/db/seed.ts` — Seed data:
  - `[ ]` User: Agam (hashed secret)
  - `[ ]` User: Diva (hashed secret)
  - `[ ]` 8 activities: Coffee, Food, Games, Movie, Walk, Study, Explore, Dessert
  - `[ ]` 10+ mock places across all activity categories
- `[ ]` Run seed

---

## Authentication (iron-session)

- `[ ]` `src/lib/session.ts` — Session config (cookie name, password, TTL), `SessionData` type
- `[ ]` `src/lib/auth.ts` — `hashSecret()`, `verifySecret()` using `bcrypt` or `crypto`
- `[ ]` `src/app/api/auth/login/route.ts` — POST: verify secret → set session cookie → return user
- `[ ]` `src/app/api/auth/logout/route.ts` — POST: destroy session cookie
- `[ ]` `src/middleware.ts` — Protect routes: redirect to `/` if no session on `/home`, `/hangouts/*`, `/memories`
- `[ ]` Update `AccessPage.tsx` — replace temp secrets with real API call to `/api/auth/login`

---

## Home Page (`/home`)

- `[ ]` `src/app/home/page.tsx` — Server Component, fetch data, export metadata
- `[ ]` `src/components/pages/HomePage.tsx`
  - `[ ]` Greeting (time-of-day: morning / afternoon / evening) + user name
  - `[ ]` **Next Hangout Card** with all states:
    - `[ ]` No plans yet → CTA "Plan Something"
    - `[ ]` Pending (action needed by you) → "Respond" button
    - `[ ]` Pending (waiting for other) → "Waiting for [name]..."
    - `[ ]` Confirmed → green "CONFIRMED ✓"
    - `[ ]` Today → pulsing card, "TODAY! 🎉", "Start Adventure →"
  - `[ ]` **Quick Plan** row — 4 activity chips (Coffee, Food, Games, Walk) with 3D PNG icons
  - `[ ]` **Explore** row
  - `[ ]` **Recent Adventures** list (last 3 completed hangouts)
- `[ ]` `src/components/pages/HomePage.module.css`
- `[ ]` R3F: Light scene (particles + 1 fish entry in `sceneConfig.ts`)

---

## Create Hangout (`/hangouts/new`)

- `[ ]` `src/app/hangouts/new/page.tsx` — Route entry, metadata
- `[ ]` `src/components/pages/CreateHangoutPage.tsx`
  - `[ ]` Date picker (today or future only)
  - `[ ]` Start time + End time pickers
  - `[ ]` Duration field (auto-calculated, read-only)
  - `[ ]` Area / location text input
  - `[ ]` Budget input — formatted "Rp 100.000" with dot separators
  - `[ ]` Notes textarea (optional, max 500 chars)
  - `[ ]` Client-side validation with inline error messages
  - `[ ]` Server Action: `createHangout()` — inserts to DB, redirects to activities page
- `[ ]` `src/components/pages/CreateHangoutPage.module.css`
- `[ ]` `src/lib/actions/hangouts.ts` — `createHangout` Server Action
- `[ ]` R3F: Minimal scene

---

## Navigation

- `[ ]` `src/components/nav/DesktopNav.tsx` — Top nav bar (glass blur, logo, links, user badge)
- `[ ]` `src/components/nav/MobileNav.tsx` — Bottom tab bar (Home, Plans, New, Memories)
- `[ ]` `src/components/nav/MobileHeader.tsx` — Back arrow / title / user initial
- `[ ]` `src/components/nav/Nav.module.css` — Shared nav styles
- `[ ]` Mount nav in `src/app/(app)/layout.tsx` — separate layout for authenticated pages

---

## Authenticated Layout (`(app)` group)

- `[ ]` `src/app/(app)/layout.tsx` — Wraps all authenticated routes: Desktop nav + Mobile header + Mobile bottom tab
- `[ ]` Move `/home`, `/hangouts/*`, `/memories` under `(app)` group

---

## Verification

- `[ ]` Login with `agam-secret` (real DB) → session set → redirected to `/home`
- `[ ]` Login with wrong secret → error displayed
- `[ ]` Opening `/home` without session → redirected to `/`
- `[ ]` Home page shows correct greeting (morning / afternoon / evening)
- `[ ]` Next Hangout card shows correct state
- `[ ]` Create Hangout form validates all fields correctly
- `[ ]` Submitting Create Hangout form creates a record in DB
- `[ ]` Desktop nav renders on `/home`
- `[ ]` Mobile nav renders on `/home` on small screens
- `[ ]` `npm run build` — zero errors

---

## Files to Create This Phase

```
src/
├── app/
│   ├── api/auth/
│   │   ├── login/route.ts
│   │   └── logout/route.ts
│   ├── (app)/
│   │   ├── layout.tsx          ← authenticated shell
│   │   ├── home/page.tsx
│   │   └── hangouts/
│   │       └── new/page.tsx
│   └── middleware.ts
├── db/
│   ├── schema.ts
│   ├── index.ts
│   └── seed.ts
├── lib/
│   ├── session.ts
│   ├── auth.ts
│   └── actions/
│       └── hangouts.ts
└── components/
    ├── nav/
    │   ├── DesktopNav.tsx
    │   ├── MobileNav.tsx
    │   ├── MobileHeader.tsx
    │   └── Nav.module.css
    └── pages/
        ├── HomePage.tsx
        ├── HomePage.module.css
        ├── CreateHangoutPage.tsx
        └── CreateHangoutPage.module.css
```

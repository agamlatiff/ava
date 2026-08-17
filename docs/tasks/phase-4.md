# Phase 4 — Hangout Day, Memories & Deployment

**Status:** ⏳ Not Started  
**Goal:** Complete the remaining screens, polish every interaction, and deploy to production

---

## Hangout Day (`/hangouts/[id]/today`)

- `[ ]` `src/app/(app)/hangouts/[id]/today/page.tsx`
- `[ ]` `src/components/pages/HangoutDayPage.tsx`
  - `[ ]` "TODAY'S ADVENTURE 🌊" title
  - `[ ]` Reuse `Timeline` component with progress state per stop:
    - `[ ]` **Upcoming** — hollow dot (`--text-muted`), default glass card
    - `[ ]` **In Progress** — filled dot + pulsing ring (`--primary`), glowing card border, "Mark Complete ✓" button
    - `[ ]` **Completed** — checkmark dot (`--success`), card at 60% opacity
  - `[ ]` Auto-detect current stop based on current time vs scheduled times
  - `[ ]` "Mark Complete" Server Action: `markActivityComplete()` — updates `itinerary_items` status
- `[ ]` `src/components/pages/HangoutDayPage.module.css`
- `[ ]` `src/lib/actions/today.ts` — `markActivityComplete`
- `[ ]` R3F: Light scene

---

## Save Memory (`/hangouts/[id]/memory`)

- `[ ]` `src/app/(app)/hangouts/[id]/memory/page.tsx`
- `[ ]` `src/components/pages/SaveMemoryPage.tsx`
  - `[ ]` "Save This Memory 🐚" title
  - `[ ]` Hangout number badge + date
  - `[ ]` Activity chips recap (read-only display of completed activities)
  - `[ ]` Textarea: "What was your favorite part?" (optional, max 500 chars)
  - `[ ]` **Interactive star rating** (1–5 stars):
    - `[ ]` Hover highlights stars left-to-right
    - `[ ]` Click locks in rating with gold fill sweep animation
  - `[ ]` "Save Memory 🐚" button
  - `[ ]` Server Action: `saveMemory()` — inserts memory record, marks hangout `status = completed`
  - `[ ]` Success flash animation → redirect to `/memories`
- `[ ]` `src/components/pages/SaveMemoryPage.module.css`
- `[ ]` `src/components/ui/StarRatingInput.tsx` — Interactive star rating input (separate from read-only display)
- `[ ]` `src/lib/actions/memory.ts` — `saveMemory`
- `[ ]` R3F: Light scene + static starfish

---

## Memories (`/memories`)

- `[ ]` `src/app/(app)/memories/page.tsx` — Server Component, fetch all memories with hangout data
- `[ ]` `src/components/pages/MemoriesPage.tsx`
  - `[ ]` "Our Adventures 🌊" title
  - `[ ]` Stacked glass memory cards, each showing:
    - `[ ]` Hangout number (#001, #002...)
    - `[ ]` Activity emoji chips (horizontal row)
    - `[ ]` Date (human-readable: "Aug 22, 2026")
    - `[ ]` Star rating (read-only `StarRating` component)
    - `[ ]` Note snippet (first ~50 chars, ellipsis)
  - `[ ]` Counter footer: "X adventures together 🐠"
  - `[ ]` **Empty state**: "Your adventures will appear here" with ocean wave graphic + lonely fish message
- `[ ]` `src/components/pages/MemoriesPage.module.css`
- `[ ]` R3F: Light–medium scene

---

## Plans List (`/hangouts`)

- `[ ]` `src/app/(app)/hangouts/page.tsx`
- `[ ]` `src/components/pages/HangoutsListPage.tsx`
  - `[ ]` "Your Plans" title
  - `[ ]` List of all hangouts (upcoming + past), sorted by date
  - `[ ]` Each item: date, area, status badge, "View →" link to current hangout step
  - `[ ]` Status badges: Pending / Confirmed / Completed / Today
  - `[ ]` Empty state: "No plans yet — create one!"
- `[ ]` `src/components/pages/HangoutsListPage.module.css`

---

## Polish — Micro-Animations

- `[ ]` Button hover: `brightness(1.1)` + shadow increase (already in globals.css — verify it works)
- `[ ]` Button press: `scale(0.97)` 100ms (already in globals.css — verify it works)
- `[ ]` Card hover (desktop): `translateY(-2px)` + shadow increase
- `[ ]` Activity chip select: scale bounce `1 → 1.08 → 1` + border + badge appear
- `[ ]` Star rating tap: individual star `scale(1.2)` then back, gold fill sweeps left-to-right
- `[ ]` Error shake: fires on all error states across all forms
- `[ ]` Success pulse: fires on confirmation and memory save
- `[ ]` Loading skeleton: shimmer on all data-fetching pages
- `[ ]` Celebration bubble burst: fires on match results and both-confirmed state

---

## Polish — Accessibility & SEO

- `[ ]` Every page has unique `<title>` tag
- `[ ]` Every page has `<meta name="description">` 
- `[ ]` All interactive elements have `aria-label` or visible label
- `[ ]` All icon-only buttons have `aria-label`
- `[ ]` R3F canvas has `aria-hidden="true"` and `role="presentation"` (already done in Phase 1)
- `[ ]` All touch targets ≥ 44px height/width
- `[ ]` Focus ring visible on all focusable elements (`:focus-visible` in globals.css)
- `[ ]` Heading hierarchy correct on every page (one `<h1>` per page)
- `[ ]` Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<button>` throughout
- `[ ]` All form inputs have associated `<label>` elements

---

## Polish — Empty States

- `[ ]` Home page: no upcoming hangout
- `[ ]` Plans list: no hangouts
- `[ ]` Memories: no memories yet
- `[ ]` Match results: no activities matched
- `[ ]` Place selection: no places for an activity (fallback message)

---

## Polish — Loading States

- `[ ]` Skeleton shimmer on Home page while fetching next hangout
- `[ ]` Skeleton shimmer on Memories while fetching list
- `[ ]` Skeleton shimmer on Plans list
- `[ ]` Button spinner on all form submissions
- `[ ]` `<Suspense>` boundaries on all Server Components fetching data

---

## Deployment

### Infrastructure Setup
- `[ ]` Create Neon or Supabase PostgreSQL instance (free tier)
- `[ ]` Get `DATABASE_URL` connection string

### Environment Variables
- `[ ]` `.env.local` (local, gitignored):
  - `[ ]` `DATABASE_URL`
  - `[ ]` `SESSION_SECRET` (32+ char random string)
- `[ ]` Vercel environment variables (same keys, production values)

### Database Production
- `[ ]` Run `drizzle-kit migrate` against production DB
- `[ ]` Run seed script against production DB

### Vercel Deployment
- `[ ]` Connect GitHub repo to Vercel
- `[ ]` Configure build settings (Next.js auto-detected)
- `[ ]` Set all environment variables in Vercel dashboard
- `[ ]` Deploy and verify build succeeds

### Smoke Test (Production)
- `[ ]` Access page loads with 3D ocean scene
- `[ ]` Agam can log in with real secret
- `[ ]` Diva can log in with real secret
- `[ ]` Full flow works end-to-end on production URL
- `[ ]` Mobile responsive on actual iPhone/Android device

---

## Final Verification

- `[ ]` All 11 screens render correctly on mobile (375px) and desktop (1280px)
- `[ ]` Full user flow (both users) works start to finish
- `[ ]` Lighthouse Performance ≥ 80
- `[ ]` Lighthouse Accessibility ≥ 90
- `[ ]` R3F: 60fps on desktop (Chrome DevTools)
- `[ ]` R3F: 30fps+ on mobile
- `[ ]` `prefers-reduced-motion` freezes R3F on all pages
- `[ ]` `npm run build` — zero TypeScript errors, zero lint errors
- `[ ]` All 24 items in PRD §24 "Definition of Done" checked off

---

## Files to Create This Phase

```
src/
├── app/(app)/
│   ├── hangouts/
│   │   ├── page.tsx                ← plans list
│   │   └── [id]/
│   │       ├── today/page.tsx
│   │       └── memory/page.tsx
│   └── memories/page.tsx
├── lib/actions/
│   ├── today.ts
│   └── memory.ts
└── components/
    ├── ui/
    │   └── StarRatingInput.tsx     ← interactive (vs read-only StarRating)
    └── pages/
        ├── HangoutDayPage.tsx
        ├── HangoutDayPage.module.css
        ├── SaveMemoryPage.tsx
        ├── SaveMemoryPage.module.css
        ├── MemoriesPage.tsx
        ├── MemoriesPage.module.css
        ├── HangoutsListPage.tsx
        └── HangoutsListPage.module.css
```

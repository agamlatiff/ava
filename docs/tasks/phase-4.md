# Phase 4 — Hangout Day, Memories & Deployment

**Status:** 🔄 In Progress  
**Goal:** Hangout day timeline, memories history, star rating inputs, full polish, and production deployment.

---

## 1. Repositories & Caching (`src/db/repositories/`)

- `[ ]` `src/db/repositories/memoriesRepository.ts` — Create memory, fetch memories with hangout details
- `[ ]` `getCachedMemories()` — tagged data cache for completed hangout memories
- `[ ]` `revalidateTag('memories')` on memory save mutation

---

## 2. Business Services & Server Actions (`src/services/` & `src/lib/actions/`)

- `[ ]` `src/lib/actions/today.ts` — Action to mark itinerary items in-progress or completed
- `[ ]` `src/lib/actions/memory.ts` — Action to persist memory & transition hangout status

---

## 3. UI Logic Hooks (`src/hooks/`)

- `[ ]` `src/hooks/useHangoutDay.ts` — Real-time progress detection, step completion handler
- `[ ]` `src/hooks/useMemoryForm.ts` — Star rating state, note input, submit transition
- `[ ]` `src/hooks/useMemoriesList.ts` — Sorting & memory formatting

---

## 4. Pure Presentation Pages (`src/components/pages/`)

- `[ ]` `src/components/pages/HangoutDayPage.tsx`
- `[ ]` `src/components/pages/SaveMemoryPage.tsx`
- `[ ]` `src/components/pages/MemoriesPage.tsx`
- `[ ]` `src/components/pages/HangoutsListPage.tsx`
- `[ ]` `src/components/ui/StarRatingInput.tsx`

---

## 5. Deployment & Production Setup

- `[ ]` Neon / Supabase DB configuration
- `[ ]` Production migrations & seeding
- `[ ]` Vercel deployment
- `[ ]` Lighthouse & performance verification

---

## Verification

- [ ] Complete decoupled flow from data to UI
- [ ] Responsive on mobile & desktop
- [ ] Clean build: `npm run build` with 0 errors

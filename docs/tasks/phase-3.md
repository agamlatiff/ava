# Phase 3 — Activity Matching & Itinerary Flow

**Status:** ✅ Completed  
**Goal:** Build the collaborative planning loop (activities, matching, places, itinerary, confirmation) with clean separation of concerns.

---

## 1. Repositories & Caching (`src/db/repositories/`)

- `[x]` `src/db/repositories/placesRepository.ts` — Query places by activity category
- `[x]` `src/db/repositories/itineraryRepository.ts` — Create & fetch itinerary items, update status
- `[x]` **Caching Layer (`src/db/cache.ts`)**:
  - `[x]` `getCachedActivities()` — 24h `unstable_cache` with tag `activities`
  - `[x]` `getCachedPlacesByCategory(category)` — `unstable_cache` with tag `places`

---

## 2. Business Services & Server Actions (`src/services/` & `src/lib/actions/`)

- `[x]` `src/services/matchingService.ts` — Pure matching algorithm (both selected positively = match)
- `[x]` `src/services/itineraryService.ts` — Time-slot allocation & itinerary generation engine
- `[x]` `src/lib/actions/activities.ts` — Activity submission actions
- `[x]` `src/lib/actions/places.ts` — Place selection actions
- `[x]` `src/lib/actions/confirm.ts` — Confirmation state machine action

---

## 3. UI Logic Hooks (`src/hooks/`)

- `[x]` `src/hooks/useActivitySelect.ts` — Chip toggle state, multi-select counter, submission handler
- `[x]` `src/hooks/useResponderReactions.ts` — Reaction toggles (❤️/👍/👎) state & submission
- `[x]` `src/hooks/usePlaceSelect.ts` — Grouped place radio selection state
- `[x]` `src/hooks/useHangoutConfirm.ts` — Confirmation state machine client handlers

---

## 4. Pure Presentation Pages (`src/components/pages/` & `src/app/(app)/`)

- `[x]` `src/components/pages/ActivitiesPage.tsx` & `src/app/(app)/hangouts/[id]/activities/page.tsx`
- `[x]` `src/components/pages/MatchResultsPage.tsx` & `src/app/(app)/hangouts/[id]/matches/page.tsx`
- `[x]` `src/components/pages/PlacesPage.tsx` & `src/app/(app)/hangouts/[id]/places/page.tsx`
- `[x]` `src/components/pages/ItineraryPage.tsx` & `src/app/(app)/hangouts/[id]/itinerary/page.tsx`
- `[x]` `src/components/pages/ConfirmPage.tsx` & `src/app/(app)/hangouts/[id]/confirm/page.tsx`
- `[x]` Shared UI: `ActivityChip.tsx`, `PlaceCard.tsx`, `Timeline.tsx`, `StarRating.tsx`

---

## Verification

- [ ] Matching service unit logic runs 100% independently of React UI
- [ ] Timeline calculations handled in `itineraryService.ts`
- [ ] Zero database calls in UI components
- [ ] `npm run build` passes with zero type errors

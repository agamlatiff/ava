# Phase 3 — Activity Matching & Itinerary Flow

**Status:** 🔄 In Progress  
**Goal:** Build the collaborative planning loop (activities, matching, places, itinerary, confirmation) with clean separation of concerns.

---

## 1. Repositories (`src/db/repositories/`)

- `[ ]` `src/db/repositories/hangoutActivitiesRepository.ts` — Save choices, fetch user selections
- `[ ]` `src/db/repositories/placesRepository.ts` — Query places by activity category
- `[ ]` `src/db/repositories/itineraryRepository.ts` — Create & fetch itinerary items, update status

---

## 2. Business Services & Server Actions (`src/services/` & `src/lib/actions/`)

- `[ ]` `src/services/matchingService.ts` — Pure matching algorithm (both selected positively = match)
- `[ ]` `src/services/itineraryService.ts` — Time-slot allocation & itinerary generation engine
- `[ ]` `src/lib/actions/activities.ts` — Activity submission actions
- `[ ]` `src/lib/actions/places.ts` — Place selection actions
- `[ ]` `src/lib/actions/confirm.ts` — Confirmation state machine action

---

## 3. UI Logic Hooks (`src/hooks/`)

- `[ ]` `src/hooks/useActivitySelect.ts` — Chip toggle state, multi-select counter, submission handler
- `[ ]` `src/hooks/useResponderReactions.ts` — Reaction toggles (❤️/👍/👎) state & submission
- `[ ]` `src/hooks/useMatchCelebration.ts` — Particle/celebration triggers on match screen load
- `[ ]` `src/hooks/usePlaceSelect.ts` — Grouped place radio selection state
- `[ ]` `src/hooks/useHangoutConfirm.ts` — Confirmation state machine client polling & handlers

---

## 4. Pure Presentation Pages (`src/components/pages/`)

- `[ ]` `src/components/pages/ActivitiesPage.tsx`
- `[ ]` `src/components/pages/MatchResultsPage.tsx`
- `[ ]` `src/components/pages/PlacesPage.tsx`
- `[ ]` `src/components/pages/ItineraryPage.tsx`
- `[ ]` `src/components/pages/ConfirmPage.tsx`
- `[ ]` Shared UI: `ActivityChip.tsx`, `PlaceCard.tsx`, `Timeline.tsx`, `StarRating.tsx`, `StatusBadge.tsx`

---

## Verification

- [ ] Matching service unit logic runs 100% independently of React UI
- [ ] Timeline calculations handled in `itineraryService.ts`
- [ ] Zero database calls in UI components
- [ ] `npm run build` passes with zero type errors

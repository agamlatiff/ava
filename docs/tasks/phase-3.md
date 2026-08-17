# Phase 3 — Activity Matching & Itinerary Flow

**Status:** ⏳ Not Started  
**Goal:** Build the full collaborative planning loop — activities, matching, place selection, itinerary, confirmation

---

## Activity Selection (`/hangouts/[id]/activities`)

### Creator View
- `[ ]` `src/app/(app)/hangouts/[id]/activities/page.tsx` — Server Component, detect user role (creator / responder)
- `[ ]` `src/components/pages/ActivitiesPage.tsx`
  - `[ ]` 2-column grid of 8 activity chips
  - `[ ]` Each chip: 3D PNG icon (64px) + label
  - `[ ]` Tap to toggle — selected chip: blue border + checkmark badge (top-right)
  - `[ ]` Deselected chip: default glass appearance
  - `[ ]` Selection counter: "3 activities selected"
  - `[ ]` "Send to Diva 🐠" CTA button (disabled if 0 selected)
  - `[ ]` Server Action: `saveCreatorActivities()` — saves selections, updates hangout status

### Responder View (Diva)
- `[ ]` "AGAM'S PLAN 🐙" header with hangout summary (date, time, area)
- `[ ]` Creator's selected activities listed, each with 3-state reaction toggle:
  - `[ ]` ❤️ Love — coral border, warm-coral background tint
  - `[ ]` 👍 Like — teal border, accent-teal background tint
  - `[ ]` 👎 Pass — dimmed, slight red border
- `[ ]` "Submit Choices 🐚" button
- `[ ]` Server Action: `saveResponderReactions()` — saves reactions, redirects to match results

### Waiting State (Creator after sending)
- `[ ]` "Waiting for Diva... 🐢" message
- `[ ]` Auto-refresh or polling every 10s to check if responder has submitted
- `[ ]` Redirect to match results once both submitted

- `[ ]` `src/components/pages/ActivitiesPage.module.css`
- `[ ]` `src/lib/actions/activities.ts` — `saveCreatorActivities`, `saveResponderReactions`
- `[ ]` R3F: Light scene

---

## Match Results (`/hangouts/[id]/matches`)

- `[ ]` `src/app/(app)/hangouts/[id]/matches/page.tsx`
- `[ ]` `src/components/pages/MatchResultsPage.tsx`
  - `[ ]` Matching logic: activity matched if creator selected AND responder chose ❤️ or 👍
  - `[ ]` "Match Found! 🎉" title with glow pulse animation
  - `[ ]` Matched activities — highlighted glass cards with both users' emoji reactions
  - `[ ]` Unmatched activities — dimmed, below `<hr>` divider with "No Match" label
  - `[ ]` "Build the Plan →" button → navigate to place selection
  - `[ ]` Empty match state: "You didn't match anything 😅" + "Try Again" to go back to activities
- `[ ]` `src/components/pages/MatchResultsPage.module.css`
- `[ ]` R3F: Medium — celebration bubble burst on page load (trigger via `useEffect`)

---

## Place Selection (`/hangouts/[id]/places`)

- `[ ]` `src/app/(app)/hangouts/[id]/places/page.tsx`
- `[ ]` `src/components/pages/PlacesPage.tsx`
  - `[ ]` Places grouped by matched activity heading (e.g. "☕ Coffee", "🎮 Games")
  - `[ ]` Each place: glass card with activity icon, name, distance, star rating, price range (Rp)
  - `[ ]` Radio selection — one place per activity group
  - `[ ]` Rating stars rendered in `--warm-gold`
  - `[ ]` "Build Itinerary 📋" button (disabled until all groups have a selection)
  - `[ ]` Server Action: `savePlaceSelections()` — saves selections, generates itinerary
- `[ ]` `src/components/pages/PlacesPage.module.css`
- `[ ]` `src/lib/actions/places.ts` — `savePlaceSelections`, `generateItinerary`
- `[ ]` `src/lib/itinerary.ts` — `buildItinerary()` — auto-assigns time slots from hangout start time
- `[ ]` R3F: Minimal scene

---

## Itinerary (`/hangouts/[id]/itinerary`)

- `[ ]` `src/app/(app)/hangouts/[id]/itinerary/page.tsx`
- `[ ]` `src/components/pages/ItineraryPage.tsx`
  - `[ ]` "Your Plan" title + date subtitle
  - `[ ]` **Vertical timeline** component:
    - `[ ]` Glowing blue connecting line (2px, `--primary`)
    - `[ ]` Timeline dot per stop: 12px circle, `--primary` fill + glow
    - `[ ]` Each stop: glass card — 3D PNG activity icon, place name, description, distance
    - `[ ]` Between-stop label: "~5 min walk" duration
    - `[ ]` Time markers left of timeline (JetBrains Mono font)
  - `[ ]` Bottom sticky bar: "Estimated Cost: Rp 85.000" + "Confirm Plan ✓" button
- `[ ]` `src/components/ui/Timeline.tsx` — Reusable timeline component
- `[ ]` `src/components/pages/ItineraryPage.module.css`
- `[ ]` R3F: Light scene (particles + small jellyfish + turtle)

---

## Confirmation (`/hangouts/[id]/confirm`)

- `[ ]` `src/app/(app)/hangouts/[id]/confirm/page.tsx`
- `[ ]` `src/components/pages/ConfirmPage.tsx`
  - `[ ]` State machine:
    - `[ ]` **Pending** — ○ Agam · ○ Diva — show "✓ I'm In!" button for current user
    - `[ ]` **Waiting** — ✓ You confirmed · ○ Other user — "Waiting for [name]..."
    - `[ ]` **Confirmed** — ✓ Agam · ✓ Diva — "IT'S ON! 🎉" + "See you [day]! 🌊"
  - `[ ]` Server Action: `confirmHangout()` — records user confirmation, checks if both confirmed
  - `[ ]` Polling or revalidation to detect when the other user confirms
  - `[ ]` On fully confirmed: update hangout `status` = `confirmed` in DB
- `[ ]` `src/components/pages/ConfirmPage.module.css`
- `[ ]` `src/lib/actions/confirm.ts` — `confirmHangout`
- `[ ]` R3F: Minimal by default → Medium celebration (bubble burst + bloom) when both confirmed

---

## Shared UI Components

- `[ ]` `src/components/ui/ActivityChip.tsx` — Reusable activity chip (select, react, display modes)
- `[ ]` `src/components/ui/PlaceCard.tsx` — Reusable place glass card
- `[ ]` `src/components/ui/Timeline.tsx` — Vertical timeline with dots and line
- `[ ]` `src/components/ui/StarRating.tsx` — Read-only star rating display
- `[ ]` `src/components/ui/StatusBadge.tsx` — Hangout status pill (Pending / Confirmed / Completed)

---

## Verification

- `[ ]` Creator can select activities and send to Diva
- `[ ]` Diva sees creator's activities and can submit reactions
- `[ ]` Creator sees "waiting" state and gets redirected when Diva submits
- `[ ]` Match results correctly identify matched vs unmatched activities
- `[ ]` Empty match state shows "Try Again"
- `[ ]` Bubble burst celebration fires on match results page load
- `[ ]` Place selection groups places by matched activity
- `[ ]` Can select one place per activity group
- `[ ]` Itinerary auto-assigns times from hangout start time
- `[ ]` Both users can confirm independently
- `[ ]` When both confirm: hangout status → `confirmed`, celebration scene fires
- `[ ]` Confirmed hangout appears on Home page with correct state
- `[ ]` `npm run build` — zero errors

---

## Files to Create This Phase

```
src/
├── app/(app)/hangouts/[id]/
│   ├── activities/page.tsx
│   ├── matches/page.tsx
│   ├── places/page.tsx
│   ├── itinerary/page.tsx
│   └── confirm/page.tsx
├── lib/
│   ├── itinerary.ts
│   └── actions/
│       ├── activities.ts
│       ├── places.ts
│       └── confirm.ts
└── components/
    ├── ui/
    │   ├── ActivityChip.tsx
    │   ├── PlaceCard.tsx
    │   ├── Timeline.tsx
    │   ├── StarRating.tsx
    │   └── StatusBadge.tsx
    └── pages/
        ├── ActivitiesPage.tsx
        ├── ActivitiesPage.module.css
        ├── MatchResultsPage.tsx
        ├── MatchResultsPage.module.css
        ├── PlacesPage.tsx
        ├── PlacesPage.module.css
        ├── ItineraryPage.tsx
        ├── ItineraryPage.module.css
        ├── ConfirmPage.tsx
        └── ConfirmPage.module.css
```

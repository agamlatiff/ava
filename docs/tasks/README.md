# Let's Go — Build Progress & Architecture

**Stack:** Next.js 15 · TypeScript · Drizzle ORM · PostgreSQL · React Three Fiber  
**3D Strategy:** Procedural geometry (no .glb models for MVP)  
**Auth:** iron-session  

---

## Architectural Principles (Clean Separation of Concerns)

To avoid mixing UI with business and state logic, we strictly enforce 4 decoupled layers:

1. **Presentation Layer (`src/components/`, `src/app/`)**: Pure UI views, design tokens, CSS Modules, no direct DB or raw async logic.
2. **UI Logic Layer (`src/hooks/`)**: Custom React hooks managing client-side form state, animations, user interactions, and event handlers.
3. **Business & Service Layer (`src/lib/actions/`, `src/services/`)**: Zod validation schemas, business logic (matching algorithms, calculations), server actions.
4. **Data Access / Repository Layer (`src/db/repositories/`)**: Isolated Drizzle ORM queries, transactions, and mutations.

---

## Phases

| Phase | File | Status | Description |
|-------|------|--------|-------------|
| 1 | [phase-1.md](./phase-1.md) | ✅ Completed | Foundation, R3F canvas, Access page + Hook separation |
| 2 | [phase-2.md](./phase-2.md) | ✅ Completed | Database repositories, auth service, Home, Create Hangout, Nav |
| 3 | [phase-3.md](./phase-3.md) | 🔄 In Progress | Activity selection hook, matching service, places, itinerary, confirm |
| 4 | [phase-4.md](./phase-4.md) | ⏳ Not Started | Hangout day, memories, polish, deployment |
| Refactor | [phase-refactor.md](./phase-refactor.md) | ⏳ Not Started | Architecture audit, strict decoupling verification, performance & types cleanup |

---

## Screen → Phase Map

| Screen | Route | Phase | UI Hook / Logic | Service / Repo |
|--------|-------|-------|-----------------|----------------|
| Access (login) | `/` | Phase 1 | `useAccessForm` | `authService` |
| Home | `/home` | Phase 2 | `useHomeData` | `hangoutRepository` |
| Create Hangout | `/hangouts/new` | Phase 2 | `useCreateHangout` | `hangoutService` |
| Activity Selection | `/hangouts/[id]/activities` | Phase 3 | `useActivitySelect` | `activityRepository` |
| Match Results | `/hangouts/[id]/matches` | Phase 3 | `useMatchCelebration`| `matchingService` |
| Place Selection | `/hangouts/[id]/places` | Phase 3 | `usePlaceSelect` | `placesRepository` |
| Itinerary | `/hangouts/[id]/itinerary` | Phase 3 | `useItineraryTimeline`| `itineraryService` |
| Confirmation | `/hangouts/[id]/confirm` | Phase 3 | `useHangoutConfirm` | `hangoutService` |
| Hangout Day | `/hangouts/[id]/today` | Phase 4 | `useHangoutDay` | `itineraryRepository` |
| Save Memory | `/hangouts/[id]/memory` | Phase 4 | `useMemoryForm` | `memoryRepository` |
| Memories | `/memories` | Phase 4 | `useMemoriesList` | `memoryRepository` |

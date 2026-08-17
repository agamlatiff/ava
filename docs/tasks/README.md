# Let's Go — Build Progress

**Stack:** Next.js 15 · TypeScript · Drizzle ORM · PostgreSQL · React Three Fiber  
**3D Strategy:** Procedural geometry (no .glb models for MVP)  
**Auth:** iron-session

---

## Phases

| Phase | File | Status | Description |
|-------|------|--------|-------------|
| 1 | [phase-1.md](./phase-1.md) | 🔄 In Progress | Foundation, R3F canvas, Access page |
| 2 | [phase-2.md](./phase-2.md) | ⏳ Not Started | Database, auth, Home, Create Hangout, nav |
| 3 | [phase-3.md](./phase-3.md) | ⏳ Not Started | Activities, matching, places, itinerary, confirm |
| 4 | [phase-4.md](./phase-4.md) | ⏳ Not Started | Hangout day, memories, polish, deployment |

---

## Screen → Phase Map

| Screen | Route | Phase |
|--------|-------|-------|
| Access (login) | `/` | Phase 1 |
| Home | `/home` | Phase 2 |
| Create Hangout | `/hangouts/new` | Phase 2 |
| Activity Selection | `/hangouts/[id]/activities` | Phase 3 |
| Match Results | `/hangouts/[id]/matches` | Phase 3 |
| Place Selection | `/hangouts/[id]/places` | Phase 3 |
| Itinerary | `/hangouts/[id]/itinerary` | Phase 3 |
| Confirmation | `/hangouts/[id]/confirm` | Phase 3 |
| Hangout Day | `/hangouts/[id]/today` | Phase 4 |
| Save Memory | `/hangouts/[id]/memory` | Phase 4 |
| Memories | `/memories` | Phase 4 |

---

## Temp Secrets (Phase 1 testing only)

| User | Secret |
|------|--------|
| Agam | `agam-secret` |
| Diva | `diva-secret` |

> These are replaced by real hashed secrets from the database in Phase 2.

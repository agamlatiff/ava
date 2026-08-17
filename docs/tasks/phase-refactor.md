# Refactor & Architecture Audit Phase

**Status:** ⏳ Not Started  
**Goal:** Perform an end-to-end architectural health check, ensuring strict separation between presentation, state logic, business services, and database queries.

---

## 1. UI & Presentation Decoupling Audit

- `[ ]` **Zero Embedded Form/Async Logic**: Verify no `.tsx` component contains inline `useState`/`useEffect` clumps for complex business rules. All converted into dedicated `src/hooks/use[Feature].ts`.
- `[ ]` **CSS Modules / Styling Isolation**: Verify styles are scoped cleanly without inline style pollution except for dynamic 3D positions/transforms.
- `[ ]` **Accessibility & Component Props Contract**: Ensure all pure UI components take typed, testable props with zero side effects.

---

## 2. Service & Repository Layer Audit

- `[ ]` **Repository Pattern Compliance (`src/db/repositories/`)**:
  - `[ ]` `usersRepo.ts` — contains all User Drizzle queries.
  - `[ ]` `hangoutsRepo.ts` — contains all Hangout Drizzle queries & transactions.
  - `[ ]` `activitiesRepo.ts` — contains all Activity selections queries.
  - `[ ]` `placesRepo.ts` — contains all Place queries.
  - `[ ]` `memoriesRepo.ts` — contains all Memory queries.
- `[ ]` **Zero Raw DB Queries in Server Actions**: Verify Server Actions only call services or repositories, never raw `db.select()` / `db.insert()`.
- `[ ]` **Strict Zod Validation**: Validate all client inputs at the action boundary before hitting services.

---

## 3. R3F & WebGL Performance Refactor

- `[ ]` **Memory Leaks Check**: Ensure geometries, materials, and instanced meshes dispose cleanly on unmount.
- `[ ]` **Render Loop Optimization**: Ensure `useFrame` only mutates ref matrices, with no state triggers or object allocations inside frame loops.
- `[ ]` **Asset & Bundle Tree Shaking**: Verify Three.js imports use modular paths to keep client bundles slim.

---

## 4. TypeScript & Type Safety Review

- `[ ]` `strict: true` type-check across the entire project (`npm run build`).
- `[ ]` Eliminate all `any` or loose `unknown` casts.
- `[ ]` Shared contract types placed in `src/types/`.

---

## Verification Checklist

- [ ] Complete clean pass on `npm run lint`.
- [ ] Complete clean pass on `tsc --noEmit`.
- [ ] Component story/test readiness: Every UI component can be rendered in isolation with mock props.

# Phase 1 — Foundation & Access Page

**Status:** ✅ Completed  
**Goal:** Scaffold the project, set up the R3F ocean canvas system, build the Access page (`/`) with clean architecture.

---

## Setup

- `[x]` Initialize Next.js 15 (App Router + TypeScript)
- `[x]` Install `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `three`
- `[x]` Install `iron-session`, `drizzle-orm`, `drizzle-kit`, `@types/three`
- `[x]` Configure Google Fonts — Outfit, Inter, JetBrains Mono (in `layout.tsx`)
- `[x]` Set up full CSS design tokens in `globals.css`
- `[x]` Clean generated Next.js boilerplate

---

## R3F Ocean Canvas System

- `[x]` `src/components/ocean/OceanCanvas.tsx` — Root `<Canvas>`, fixed background, aria-hidden, quality-aware DPR
- `[x]` `src/components/ocean/OceanSceneManager.tsx` — Route-based scene intensity switcher
- `[x]` `src/components/ocean/sceneConfig.ts` — Intensity map per route (bubbles, particles, fish, effects)
- `[x]` `src/components/ocean/lighting/OceanLighting.tsx` — Ambient + directional + pulsing point lights
- `[x]` `src/components/ocean/effects/BubbleSystem.tsx` — Instanced bubble pool, rise + sine sway
- `[x]` `src/components/ocean/effects/ParticleField.tsx` — GPU particles, custom GLSL shaders
- `[x]` `src/components/ocean/effects/LightRays.tsx` — Procedural volumetric light cones
- `[x]` `src/components/ocean/hooks/useSceneQuality.ts` — Device detection → low / medium / high preset
- `[x]` `src/components/ocean/hooks/useReducedMotion.ts` — `prefers-reduced-motion` hook

---

## Access Page (`/`) — Clean Architecture

- `[x]` `src/app/page.tsx` — Route entry, exports metadata
- `[x]` `src/hooks/useAccessForm.ts` — **UI & State Logic Hook**:
  - Manages secret input, state machine (`idle`, `typing`, `loading`, `error`, `success`)
  - Input focus control, error messages, and temporary validation
- `[x]` `src/components/pages/AccessPage.tsx` — **Pure Presentation UI**:
  - Consumes `useAccessForm`
  - Glassmorphism login card
  - Feature bullets sidebar (desktop only)
  - Gradient "Let's Go" logo text + tagline
  - Fully accessible ARIA attributes
- `[x]` `src/components/pages/AccessPage.module.css` — Scoped page styles

---

## Global Layout

- `[x]` `src/app/layout.tsx` — Root layout: `OceanCanvas` mounted once, gradient CSS fallback
- `[x]` `src/app/globals.css` — Complete design system (tokens, typography, glass, buttons, inputs, animations)

---

## Verification

- `[/]` `npm run dev` — dev server starts and page is visible
- `[ ]` Access page renders with live R3F bubbles + particles + light rays
- `[ ]` Mobile (375px) layout: sidebar hidden, single column card
- `[ ]` Desktop (1280px) layout: sidebar + card side by side
- `[ ]` Error state: shake animation fires on wrong secret
- `[ ]` Success state: glow pulse fires, redirects to `/home`
- `[ ]` `prefers-reduced-motion`: R3F canvas is frozen (no animation)
- `[ ]` `npm run build` — zero TypeScript or lint errors

---

## Files Created This Phase

```
src/
├── app/
│   ├── globals.css              ✅ Design system
│   ├── layout.tsx               ✅ Root layout + OceanCanvas
│   └── page.tsx                 ✅ Access route
├── hooks/
│   └── useAccessForm.ts         ✅ UI logic hook for Access form
└── components/
    ├── ocean/
    │   ├── OceanCanvas.tsx      ✅ Root R3F canvas
    │   ├── OceanSceneManager.tsx✅ Route-based scene switcher
    │   ├── sceneConfig.ts       ✅ Per-route intensity config
    │   ├── effects/
    │   │   ├── BubbleSystem.tsx ✅ Instanced bubbles
    │   │   ├── ParticleField.tsx✅ GPU particles (GLSL)
    │   │   └── LightRays.tsx    ✅ Volumetric light cones
    │   ├── lighting/
    │   │   └── OceanLighting.tsx✅ Scene lighting
    │   └── hooks/
    │       ├── useSceneQuality.ts  ✅ Quality preset
    │       └── useReducedMotion.ts ✅ Motion pref
    └── pages/
        ├── AccessPage.tsx       ✅ Pure Presentational View
        └── AccessPage.module.css✅ Scoped styles
```

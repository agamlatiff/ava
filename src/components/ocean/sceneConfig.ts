'use client'

import { useMemo } from 'react'

export type SceneIntensity = 'heavy' | 'medium' | 'light' | 'minimal'

export interface SceneConfig {
  intensity: SceneIntensity
  bubbles: number
  particles: number
  fish: number
  lightRays: boolean
  caustics: boolean
  seabed: boolean
  coral: boolean
  seaweed: number
  celebration: boolean
}

const SCENE_MAP: Record<string, SceneConfig> = {
  '/':                         { intensity: 'heavy',   bubbles: 18, particles: 35, fish: 4, lightRays: true,  caustics: true,  seabed: true, coral: true, seaweed: 12, celebration: false },
  '/home':                     { intensity: 'medium',  bubbles: 8,  particles: 20, fish: 3, lightRays: true,  caustics: true,  seabed: true, coral: true, seaweed: 10, celebration: false },
  '/hangouts/new':             { intensity: 'light',   bubbles: 4,  particles: 10, fish: 1, lightRays: false, caustics: true,  seabed: true, coral: true, seaweed: 6,  celebration: false },
  '/hangouts/[id]/activities': { intensity: 'light',   bubbles: 6,  particles: 12, fish: 2, lightRays: false, caustics: true,  seabed: true, coral: true, seaweed: 8,  celebration: false },
  '/hangouts/[id]/matches':    { intensity: 'heavy',   bubbles: 24, particles: 25, fish: 4, lightRays: true,  caustics: true,  seabed: true, coral: true, seaweed: 12, celebration: true  },
  '/hangouts/[id]/places':     { intensity: 'light',   bubbles: 4,  particles: 10, fish: 1, lightRays: false, caustics: true,  seabed: true, coral: true, seaweed: 6,  celebration: false },
  '/hangouts/[id]/itinerary':  { intensity: 'light',   bubbles: 5,  particles: 12, fish: 2, lightRays: false, caustics: true,  seabed: true, coral: true, seaweed: 8,  celebration: false },
  '/hangouts/[id]/confirm':    { intensity: 'medium',  bubbles: 8,  particles: 15, fish: 2, lightRays: true,  caustics: true,  seabed: true, coral: true, seaweed: 8,  celebration: false },
  '/hangouts/[id]/today':      { intensity: 'medium',  bubbles: 10, particles: 18, fish: 3, lightRays: true,  caustics: true,  seabed: true, coral: true, seaweed: 10, celebration: false },
  '/hangouts/[id]/memory':     { intensity: 'light',   bubbles: 4,  particles: 10, fish: 1, lightRays: false, caustics: true,  seabed: true, coral: true, seaweed: 6,  celebration: false },
  '/memories':                 { intensity: 'medium',  bubbles: 8,  particles: 20, fish: 3, lightRays: true,  caustics: true,  seabed: true, coral: true, seaweed: 10, celebration: false },
}

const DEFAULT_CONFIG: SceneConfig = {
  intensity: 'light',
  bubbles: 5,
  particles: 12,
  fish: 2,
  lightRays: false,
  caustics: true,
  seabed: true,
  coral: true,
  seaweed: 8,
  celebration: false,
}

export function getSceneConfig(pathname: string): SceneConfig {
  // Exact match first
  if (SCENE_MAP[pathname]) return SCENE_MAP[pathname]

  // Pattern match for dynamic routes
  for (const [pattern, config] of Object.entries(SCENE_MAP)) {
    const regex = new RegExp(
      '^' + pattern.replace(/\[id\]/g, '[^/]+') + '$'
    )
    if (regex.test(pathname)) return config
  }

  return DEFAULT_CONFIG
}

export function useSceneConfig(pathname: string): SceneConfig {
  return useMemo(() => getSceneConfig(pathname), [pathname])
}


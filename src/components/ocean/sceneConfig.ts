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
  celebration: boolean
}

const SCENE_MAP: Record<string, SceneConfig> = {
  '/':                           { intensity: 'heavy',   bubbles: 18, particles: 40, fish: 3, lightRays: true,  caustics: true,  celebration: false },
  '/home':                       { intensity: 'light',   bubbles: 4,  particles: 10, fish: 1, lightRays: false, caustics: false, celebration: false },
  '/hangouts/new':               { intensity: 'minimal', bubbles: 0,  particles: 6,  fish: 0, lightRays: false, caustics: false, celebration: false },
  '/hangouts/[id]/activities':   { intensity: 'light',   bubbles: 4,  particles: 8,  fish: 0, lightRays: false, caustics: false, celebration: false },
  '/hangouts/[id]/matches':      { intensity: 'medium',  bubbles: 25, particles: 15, fish: 0, lightRays: false, caustics: false, celebration: true  },
  '/hangouts/[id]/places':       { intensity: 'minimal', bubbles: 0,  particles: 6,  fish: 0, lightRays: false, caustics: false, celebration: false },
  '/hangouts/[id]/itinerary':    { intensity: 'light',   bubbles: 3,  particles: 8,  fish: 0, lightRays: false, caustics: false, celebration: false },
  '/hangouts/[id]/confirm':      { intensity: 'light',   bubbles: 3,  particles: 8,  fish: 0, lightRays: false, caustics: false, celebration: false },
  '/hangouts/[id]/today':        { intensity: 'light',   bubbles: 3,  particles: 8,  fish: 0, lightRays: false, caustics: false, celebration: false },
  '/hangouts/[id]/memory':       { intensity: 'light',   bubbles: 0,  particles: 8,  fish: 0, lightRays: false, caustics: false, celebration: false },
  '/memories':                   { intensity: 'light',   bubbles: 4,  particles: 12, fish: 1, lightRays: false, caustics: false, celebration: false },
}

const DEFAULT_CONFIG: SceneConfig = {
  intensity: 'light',
  bubbles: 3,
  particles: 8,
  fish: 0,
  lightRays: false,
  caustics: false,
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

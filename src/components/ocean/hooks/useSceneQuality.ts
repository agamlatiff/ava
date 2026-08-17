'use client'

import { useEffect, useState } from 'react'

export type QualityPreset = 'low' | 'medium' | 'high'

export interface QualityConfig {
  preset: QualityPreset
  dpr: [number, number]
  particleMultiplier: number
  bubbleMultiplier: number
  enableFish: boolean
  enablePostProcessing: boolean
  enableCaustics: boolean
}

const QUALITY_PRESETS: Record<QualityPreset, QualityConfig> = {
  low: {
    preset: 'low',
    dpr: [1, 1],
    particleMultiplier: 0,
    bubbleMultiplier: 0.3,
    enableFish: false,
    enablePostProcessing: false,
    enableCaustics: false,
  },
  medium: {
    preset: 'medium',
    dpr: [1, 1.25],
    particleMultiplier: 0.5,
    bubbleMultiplier: 0.6,
    enableFish: true,
    enablePostProcessing: false,
    enableCaustics: false,
  },
  high: {
    preset: 'high',
    dpr: [1, 1.5],
    particleMultiplier: 1,
    bubbleMultiplier: 1,
    enableFish: true,
    enablePostProcessing: true,
    enableCaustics: true,
  },
}

function detectQuality(): QualityPreset {
  if (typeof window === 'undefined') return 'high'

  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  const cores = navigator.hardwareConcurrency ?? 4
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4

  if (cores <= 2 || memory <= 2) return 'low'
  if (isMobile || cores <= 4 || memory <= 4) return 'medium'
  return 'high'
}

export function useSceneQuality(): QualityConfig {
  const [config, setConfig] = useState<QualityConfig>(QUALITY_PRESETS.high)

  useEffect(() => {
    const preset = detectQuality()
    setConfig(QUALITY_PRESETS[preset])
  }, [])

  return config
}

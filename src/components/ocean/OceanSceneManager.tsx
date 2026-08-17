'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { BubbleSystem } from './effects/BubbleSystem'
import { ParticleField } from './effects/ParticleField'
import { LightRays } from './effects/LightRays'
import { OceanLighting } from './lighting/OceanLighting'
import { useSceneConfig } from './sceneConfig'
import { useSceneQuality } from './hooks/useSceneQuality'
import { useReducedMotion } from './hooks/useReducedMotion'

export function OceanSceneManager() {
  const pathname = usePathname()
  const config = useSceneConfig(pathname)
  const quality = useSceneQuality()
  const reducedMotion = useReducedMotion()

  // Apply quality multipliers
  const bubbleCount   = Math.floor(config.bubbles   * quality.bubbleMultiplier)
  const particleCount = Math.floor(config.particles * quality.particleMultiplier)

  return (
    <>
      <OceanLighting intensity={config.intensity} />

      {/* Fog — deep ocean atmosphere */}
      <fog attach="fog" args={['#062040', 8, 25]} />

      <Suspense fallback={null}>
        {bubbleCount > 0 && (
          <BubbleSystem count={bubbleCount} reducedMotion={reducedMotion} />
        )}

        {particleCount > 0 && (
          <ParticleField count={particleCount} reducedMotion={reducedMotion} />
        )}

        {config.lightRays && quality.preset !== 'low' && (
          <LightRays count={3} reducedMotion={reducedMotion} />
        )}
      </Suspense>
    </>
  )
}

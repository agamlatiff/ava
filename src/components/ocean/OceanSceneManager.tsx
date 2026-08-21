'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { BubbleSystem } from './effects/BubbleSystem'
import { ParticleField } from './effects/ParticleField'
import { LightRays } from './effects/LightRays'
import { OceanLighting } from './lighting/OceanLighting'
import { Fish } from './creatures/Fish'
import { OceanFloor } from './environment/OceanFloor'
import { Coral } from './environment/Coral'
import { Seaweed } from './environment/Seaweed'
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
  const fishCount     = Math.max(1, Math.floor(config.fish * (quality.preset === 'low' ? 0.5 : 1)))
  const seaweedCount  = Math.floor(config.seaweed * (quality.preset === 'low' ? 0.5 : 1))

  return (
    <>
      <OceanLighting intensity={config.intensity} />

      {/* BACKGROUND: Deep ocean atmospheric fog */}
      <fog attach="fog" args={['#041a38', 9, 28]} />

      <Suspense fallback={null}>
        {/* BACKGROUND: Volumetric god rays */}
        {config.lightRays && quality.preset !== 'low' && (
          <LightRays count={3} reducedMotion={reducedMotion} />
        )}

        {/* BACKGROUND / MIDGROUND: Floating marine plankton glow */}
        {particleCount > 0 && (
          <ParticleField count={particleCount} reducedMotion={reducedMotion} />
        )}

        {/* MIDGROUND: Subtle rising bubbles */}
        {bubbleCount > 0 && (
          <BubbleSystem count={bubbleCount} reducedMotion={reducedMotion} />
        )}

        {/* FOREGROUND: Sandy seabed with caustics */}
        {config.seabed && quality.preset !== 'low' && (
          <OceanFloor reducedMotion={reducedMotion} />
        )}

        {/* FOREGROUND & MIDGROUND: Corals & rocky outcrops framing borders */}
        {config.coral && (
          <Coral />
        )}

        {/* FOREGROUND: Swaying kelp & seaweed */}
        {seaweedCount > 0 && (
          <Seaweed count={seaweedCount} reducedMotion={reducedMotion} />
        )}

        {/* FOREGROUND & BACKGROUND: Tropical fish with natural slow kinematics */}
        {config.fish > 0 && (
          <Fish count={fishCount} reducedMotion={reducedMotion} />
        )}
      </Suspense>
    </>
  )
}

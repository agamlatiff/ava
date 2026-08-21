'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { BubbleSystem } from './effects/BubbleSystem'
import { ParticleField } from './effects/ParticleField'
import { LightRays } from './effects/LightRays'
import { OceanLighting } from './lighting/OceanLighting'
import { Fish } from './creatures/Fish'
import { SeaTurtle } from './creatures/SeaTurtle'
import { OceanFloor } from './environment/OceanFloor'
import { Coral } from './environment/Coral'
import { Seaweed } from './environment/Seaweed'
import { useSceneConfig } from './sceneConfig'
import { useSceneQuality } from './hooks/useSceneQuality'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useFrame } from '@react-three/fiber'
import { oceanState, OceanWorldEvent } from './hooks/globalOceanState'
import { useRef } from 'react'

function EventController({ reducedMotion }: { reducedMotion: boolean }) {
  const nextEventTimer = useRef(0)

  useFrame((state, delta) => {
    if (reducedMotion) return

    if (nextEventTimer.current === 0) {
      nextEventTimer.current = 15 + Math.random() * 20 // First event
    }

    // Update global state math (current drift, timers)
    oceanState.update(delta, state.clock.elapsedTime)

    // Sparse world event generator
    if (oceanState.activeEvent === 'none') {
      nextEventTimer.current -= delta
      if (nextEventTimer.current <= 0) {
        // Trigger a random event
        const rand = Math.random()
        let eventType: OceanWorldEvent = 'pause'
        let duration = 3.0

        if (rand > 0.66) {
          eventType = 'surge'
          duration = 5.0
        } else if (rand > 0.33) {
          eventType = 'bubbles'
          duration = 4.0
        }

        oceanState.triggerEvent(eventType, duration)
        
        // Schedule next event (20 to 60 seconds from now)
        nextEventTimer.current = 20 + Math.random() * 40
      }
    }
  })

  return null
}

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
      <fog attach="fog" args={['#082D54', 10, 32]} />




      <Suspense fallback={null}>
        {/* EVENT CONTROLLER: Updates global current and triggers sparse events */}
        <EventController reducedMotion={reducedMotion} />

        {/* BACKGROUND: Volumetric god rays */}
        {config.lightRays && quality.preset !== 'low' && (
          <LightRays count={3} reducedMotion={reducedMotion} />
        )}

        {/* BACKGROUND / MIDGROUND: Floating marine plankton glow */}
        {particleCount > 0 && (
          <ParticleField count={particleCount} reducedMotion={reducedMotion} />
        )}

        {/* MIDGROUND: Gentle sea turtle gliding in upper column */}
        {quality.preset !== 'low' && (
          <SeaTurtle reducedMotion={reducedMotion} />
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

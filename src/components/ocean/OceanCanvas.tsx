'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { OceanSceneManager } from './OceanSceneManager'
import { useSceneQuality } from './hooks/useSceneQuality'

export function OceanCanvas() {
  const quality = useSceneQuality()

  return (
    <Canvas
      aria-hidden="true"
      role="presentation"
      className="ocean-canvas"
      camera={{ position: [0, 0, 6], fov: 60, near: 0.1, far: 50 }}
      dpr={quality.dpr}
      gl={{
        antialias: quality.preset !== 'low',
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    >
      <Suspense fallback={null}>
        <OceanSceneManager />
      </Suspense>
    </Canvas>
  )
}

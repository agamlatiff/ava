'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface OceanLightingProps {
  intensity?: 'heavy' | 'medium' | 'light' | 'minimal'
}

export function OceanLighting({ intensity = 'light' }: OceanLightingProps) {
  const pointLightRef = useRef<THREE.PointLight>(null!)
  const causticLightRef = useRef<THREE.DirectionalLight>(null!)
  const timeRef = useRef(0)

  // Gently pulse underwater point light & caustic bounce
  useFrame((_, delta) => {
    timeRef.current += delta
    const t = timeRef.current

    if (pointLightRef.current) {
      pointLightRef.current.intensity = 0.55 + Math.sin(t * 0.4) * 0.1
    }

    if (causticLightRef.current) {
      causticLightRef.current.intensity = 0.28 + Math.sin(t * 0.8 + 1.0) * 0.08
    }
  })

  const ambientMultiplier = intensity === 'heavy' ? 1.2 : 1.0

  return (
    <>
      {/* 1. Sunlight through tropical surface (Hemisphere: sky azure, ground deep teal) */}
      <hemisphereLight
        args={['#58D0FF', '#023850', 0.65 * ambientMultiplier]}
      />

      {/* 2. Primary directional sunlight coming down through the water surface */}
      <directionalLight
        position={[2, 12, 4]}
        intensity={0.9 * ambientMultiplier}
        color="#7CE8FF"
        castShadow={false}
      />

      {/* 3. Upward caustic bounce light from sandy seabed */}
      <directionalLight
        ref={causticLightRef}
        position={[-2, -8, -1]}
        intensity={0.28}
        color="#00E5FF"
        castShadow={false}
      />

      {/* 4. Warm subtle marine glow near center for depth perception */}
      <pointLight
        ref={pointLightRef}
        position={[0, 0.5, 2]}
        intensity={0.55}
        color="#80DEEA"
        distance={10}
        decay={2}
      />
    </>
  )
}

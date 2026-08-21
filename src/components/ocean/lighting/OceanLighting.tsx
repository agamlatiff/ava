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
      pointLightRef.current.intensity = 0.55 + Math.sin(t * 0.4) * 0.08
    }

    if (causticLightRef.current) {
      causticLightRef.current.intensity = 0.25 + Math.sin(t * 0.6 + 1.0) * 0.06
    }
  })

  const ambientMultiplier = intensity === 'heavy' ? 1.2 : 1.0

  return (
    <>
      {/* 1. Atmospheric sky/ground hemisphere light (Surface azure to deep water) */}
      <hemisphereLight
        args={['#64D5FF', '#06284C', 0.7 * ambientMultiplier]}
      />

      {/* 2. Primary directional sunlight coming down through the ocean surface */}
      <directionalLight
        position={[1, 14, 3]}
        intensity={0.85 * ambientMultiplier}
        color="#8CE8FF"
        castShadow={false}
      />

      {/* 3. Left perimeter rock fill light (Gives visible 3D form & detail to left corner reef) */}
      <directionalLight
        position={[-6, -2, 3]}
        intensity={0.4}
        color="#3E7C9E"
        castShadow={false}
      />

      {/* 4. Right perimeter rock fill light (Gives visible 3D form & detail to right corner reef) */}
      <directionalLight
        position={[6, -2, 3]}
        intensity={0.4}
        color="#3E7C9E"
        castShadow={false}
      />

      {/* 5. Upward caustic bounce light from sandy seabed */}
      <directionalLight
        ref={causticLightRef}
        position={[0, -7, -2]}
        intensity={0.25}
        color="#00E5FF"
        castShadow={false}
      />

      {/* 6. Warm subtle marine glow near center for depth perception */}
      <pointLight
        ref={pointLightRef}
        position={[0, 0.5, 2]}
        intensity={0.55}
        color="#80DEEA"
        distance={11}
        decay={2}
      />
    </>
  )
}

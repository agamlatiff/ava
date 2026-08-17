'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface OceanLightingProps {
  intensity?: 'heavy' | 'medium' | 'light' | 'minimal'
}

export function OceanLighting({ intensity = 'light' }: OceanLightingProps) {
  const pointLightRef = useRef<THREE.PointLight>(null!)
  const timeRef = useRef(0)

  // Gently pulse the underwater point light
  useFrame((_, delta) => {
    if (!pointLightRef.current) return
    timeRef.current += delta
    const t = timeRef.current
    pointLightRef.current.intensity = 0.6 + Math.sin(t * 0.5) * 0.1
  })

  const ambientIntensity = intensity === 'heavy' ? 0.6 : 0.4
  const dirIntensity     = intensity === 'heavy' ? 0.8 : 0.5

  return (
    <>
      {/* Base ambient — ocean blue tint */}
      <ambientLight intensity={ambientIntensity} color="#1a6ab5" />

      {/* Main directional light from above-left (sunlight through water) */}
      <directionalLight
        position={[-2, 8, 4]}
        intensity={dirIntensity}
        color="#40a0e0"
        castShadow={false}
      />

      {/* Soft fill from below — simulates caustic light bounce */}
      <directionalLight
        position={[2, -4, -2]}
        intensity={0.15}
        color="#00bcd4"
        castShadow={false}
      />

      {/* Subtle pulsing point light near center — underwater life feel */}
      <pointLight
        ref={pointLightRef}
        position={[0, 0, 2]}
        intensity={0.6}
        color="#80deea"
        distance={8}
        decay={2}
      />
    </>
  )
}

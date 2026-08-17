'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface LightRaysProps {
  count?: number
  reducedMotion?: boolean
}

export function LightRays({ count = 3, reducedMotion = false }: LightRaysProps) {
  const groupRef = useRef<THREE.Group>(null!)

  const rays = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: (i - (count - 1) / 2) * 3 + (Math.random() - 0.5),
      rotationOffset: Math.random() * Math.PI * 2,
      speed: 0.1 + Math.random() * 0.1,
      opacity: 0.04 + Math.random() * 0.04,
    }))
  }, [count])

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) return
    const t = state.clock.elapsedTime

    groupRef.current.children.forEach((child, i) => {
      const ray = rays[i]
      if (!ray) return
      const mesh = child as THREE.Mesh
      const mat = mesh.material as THREE.MeshBasicMaterial
      // Pulse opacity gently
      mat.opacity = ray.opacity * (0.7 + 0.3 * Math.sin(t * ray.speed + ray.rotationOffset))
    })
  })

  return (
    <group ref={groupRef} position={[0, 4, -2]}>
      {rays.map((ray, i) => (
        <mesh key={i} position={[ray.x, 0, 0]} rotation={[0, 0, (Math.random() - 0.5) * 0.3]}>
          {/* Tall thin cone pointing downward, like sunlight penetrating water */}
          <coneGeometry args={[0.6, 12, 6, 1, true]} />
          <meshBasicMaterial
            color="#4DD0E1"
            transparent
            opacity={ray.opacity}
            side={THREE.FrontSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

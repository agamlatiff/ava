'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface LightRaysProps {
  count?: number
  reducedMotion?: boolean
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function LightRays({ count = 4, reducedMotion = false }: LightRaysProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const timeRef = useRef(0)

  const rays = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: (i - (count - 1) / 2) * 3 + (pseudoRandom(i * 4 + 1) - 0.5),
      rotationOffset: pseudoRandom(i * 4 + 2) * Math.PI * 2,
      rotationZ: (pseudoRandom(i * 4 + 5) - 0.5) * 0.3,
      speed: 0.1 + pseudoRandom(i * 4 + 3) * 0.1,
      opacity: 0.04 + pseudoRandom(i * 4 + 4) * 0.04,
    }))
  }, [count])

  useFrame((_, delta) => {
    if (!groupRef.current || reducedMotion) return
    timeRef.current += delta
    const t = timeRef.current

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
        <mesh key={i} position={[ray.x, 0, 0]} rotation={[0, 0, ray.rotationZ]}>
          {/* Tall thin cone pointing downward, like sunlight penetrating water */}
          <coneGeometry args={[0.6, 12, 6, 1, true]} />
          <meshBasicMaterial
            color="#4DD0E1"
            transparent
            opacity={ray.opacity}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

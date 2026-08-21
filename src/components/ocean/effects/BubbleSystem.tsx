'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BubbleSystemProps {
  count: number
  reducedMotion?: boolean
}

interface BubbleData {
  position: THREE.Vector3
  speed: number
  swayFreq: number
  swayAmp: number
  swayOffset: number
  scale: number
  opacity: number
  startX: number
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function BubbleSystem({ count, reducedMotion = false }: BubbleSystemProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const timeRef = useRef(0)

  // Pre-allocate stable bubble particles
  const bubbles = useMemo<BubbleData[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      position: new THREE.Vector3(
        (pseudoRandom(i * 7 + 1) - 0.5) * 10,
        -6 + pseudoRandom(i * 7 + 2) * 12,
        (pseudoRandom(i * 7 + 3) - 0.5) * 4 - 1
      ),
      speed: 0.4 + pseudoRandom(i * 7 + 4) * 0.8,
      swayFreq: 0.8 + pseudoRandom(i * 7 + 5) * 1.2,
      swayAmp: 0.15 + pseudoRandom(i * 7 + 6) * 0.25,
      swayOffset: pseudoRandom(i * 7 + 7) * Math.PI * 2,
      scale: 0.04 + pseudoRandom(i * 7 + 8) * 0.12,
      opacity: 0.3 + pseudoRandom(i * 7 + 9) * 0.5,
      startX: (pseudoRandom(i * 7 + 10) - 0.5) * 10,
    }))
  }, [count])

  useFrame((_, delta) => {
    if (!meshRef.current || reducedMotion) return

    timeRef.current += delta
    const t = timeRef.current

    bubbles.forEach((bubble, i) => {
      bubble.position.y += bubble.speed * delta
      bubble.position.x = bubble.startX + Math.sin(t * bubble.swayFreq + bubble.swayOffset) * bubble.swayAmp

      // Reset when above scene
      if (bubble.position.y > 7) {
        bubble.position.y = -6 - ((i * 1.3) % 3)
        bubble.startX = ((i * 3.7) % 10) - 5
        bubble.position.x = bubble.startX
      }

      dummy.position.copy(bubble.position)
      dummy.scale.setScalar(bubble.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  // Sphere geometry with smooth glass/bubble material
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 12, 12), [])
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#E0F7FA',
        transmission: 0.9,
        opacity: 0.7,
        transparent: true,
        roughness: 0.05,
        ior: 1.1,
        thickness: 0.1,
      }),
    []
  )

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={false}
    />
  )
}

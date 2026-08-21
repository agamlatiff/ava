'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { oceanState } from '../hooks/globalOceanState'

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
  startX: number
  startZ: number
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function BubbleSystem({ count, reducedMotion = false }: BubbleSystemProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const timeRef = useRef(0)

  // Pre-allocate stable bubble particles with varied depths
  const bubbles = useMemo<BubbleData[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const z = (pseudoRandom(i * 7 + 3) - 0.5) * 5 - 2
      const startX = (pseudoRandom(i * 7 + 1) - 0.5) * 11
      return {
        position: new THREE.Vector3(
          startX,
          -5.5 + pseudoRandom(i * 7 + 2) * 11,
          z
        ),
        speed: 0.35 + pseudoRandom(i * 7 + 4) * 0.45,
        swayFreq: 0.7 + pseudoRandom(i * 7 + 5) * 0.8,
        swayAmp: 0.12 + pseudoRandom(i * 7 + 6) * 0.18,
        swayOffset: pseudoRandom(i * 7 + 7) * Math.PI * 2,
        scale: 0.035 + pseudoRandom(i * 7 + 8) * 0.08,
        startX,
        startZ: z,
      }
    })
  }, [count])

  useFrame((_, delta) => {
    if (!meshRef.current || reducedMotion) return

    timeRef.current += delta
    const t = timeRef.current

    // If bubbles event is active, boost their speed temporarily
    const speedBoost = oceanState.activeEvent === 'bubbles' ? 2.5 : 1.0

    bubbles.forEach((bubble, i) => {
      // Ascend upwards with current drift
      bubble.position.y += bubble.speed * speedBoost * delta
      const currentDrift = Math.sin(t * 0.35 + bubble.swayOffset) * 0.25
      bubble.position.x = bubble.startX + Math.sin(t * bubble.swayFreq + bubble.swayOffset) * bubble.swayAmp + currentDrift + oceanState.currentDrift * 3.0

      // Loop back to bottom when reaching surface
      if (bubble.position.y > 6.5) {
        bubble.position.y = -5.5 - ((i * 0.8) % 2.5)
        bubble.startX = ((i * 3.1) % 11) - 5.5
        bubble.position.x = bubble.startX
      }

      // Calculate scale fade based on height (bubbles pop/shrink near surface)
      let scaleMult = 1.0
      if (bubble.position.y > 4.5) {
        scaleMult = Math.max(0.01, 1.0 - (bubble.position.y - 4.5) / 2.0)
      }

      dummy.position.copy(bubble.position)
      dummy.scale.setScalar(bubble.scale * scaleMult)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  const geometry = useMemo(() => new THREE.SphereGeometry(1, 10, 10), [])
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#E0F7FA',
        transmission: 0.92,
        opacity: 0.65,
        transparent: true,
        roughness: 0.08,
        ior: 1.1,
        thickness: 0.08,
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

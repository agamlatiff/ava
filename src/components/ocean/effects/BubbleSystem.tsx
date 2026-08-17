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

export function BubbleSystem({ count, reducedMotion = false }: BubbleSystemProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const bubbles = useMemo<BubbleData[]>(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        -6 + Math.random() * -4, // start below viewport
        (Math.random() - 0.5) * 4
      ),
      speed: 0.3 + Math.random() * 0.5,
      swayFreq: 0.4 + Math.random() * 0.6,
      swayAmp: 0.15 + Math.random() * 0.2,
      swayOffset: Math.random() * Math.PI * 2,
      scale: 0.04 + Math.random() * 0.08,
      opacity: 0.15 + Math.random() * 0.2,
      startX: (Math.random() - 0.5) * 10,
    }))
  }, [count])

  useFrame((state, delta) => {
    if (!meshRef.current || reducedMotion) return

    const t = state.clock.elapsedTime

    bubbles.forEach((bubble, i) => {
      if (!reducedMotion) {
        bubble.position.y += bubble.speed * delta
        bubble.position.x = bubble.startX + Math.sin(t * bubble.swayFreq + bubble.swayOffset) * bubble.swayAmp

        // Reset when above scene
        if (bubble.position.y > 7) {
          bubble.position.y = -6 - Math.random() * 3
          bubble.startX = (Math.random() - 0.5) * 10
          bubble.position.x = bubble.startX
        }
      }

      dummy.position.copy(bubble.position)
      dummy.scale.setScalar(bubble.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshPhysicalMaterial
        transmission={0.9}
        roughness={0.05}
        thickness={0.3}
        ior={1.33}
        color="#80DEEA"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  )
}

'use client'

import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'

/**
 * GLB Realistic Coral Formation
 */
function GLBCoral({
  position,
  scale = 1,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number]
  scale?: number | [number, number, number]
  rotation?: [number, number, number]
}) {
  const gltf = useGLTF('/models/ocean/coral_formation.glb')
  const cloned = useMemo(() => gltf.scene.clone(true), [gltf.scene])

  return (
    <group position={position} scale={scale} rotation={rotation}>
      <primitive object={cloned} />
    </group>
  )
}

/**
 * GLB Realistic Submarine Ocean Rock Outcrop
 */
function GLBRock({
  position,
  scale = 1,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number]
  scale?: number | [number, number, number]
  rotation?: [number, number, number]
}) {
  const gltf = useGLTF('/models/ocean/ocean_rock.glb')
  const cloned = useMemo(() => gltf.scene.clone(true), [gltf.scene])

  return (
    <group position={position} scale={scale} rotation={rotation}>
      <primitive object={cloned} />
    </group>
  )
}

export function Coral() {
  return (
    <group position={[0, -4.5, 0]}>
      {/* ── FOREGROUND LEFT REEF FORMATION ── */}
      <group position={[-5.0, 0, -1.2]}>
        <GLBRock position={[0, 0, 0]} scale={[1.6, 1.2, 1.4]} rotation={[0, 0.4, 0]} />
        <GLBCoral position={[0.2, 0.6, 0.2]} scale={1.4} rotation={[0, 0.2, 0]} />
      </group>

      {/* ── FOREGROUND RIGHT REEF FORMATION ── */}
      <group position={[5.2, 0, -1.5]}>
        <GLBRock position={[0, 0, 0]} scale={[1.8, 1.3, 1.5]} rotation={[0, -0.6, 0]} />
        <GLBCoral position={[-0.3, 0.7, 0.1]} scale={1.5} rotation={[0, Math.PI * 0.7, 0]} />
      </group>

      {/* ── MIDGROUND / DISTANT SUBTLE REEF OUTPOSTS ── */}
      <group position={[-3.6, 0, -4.5]}>
        <GLBRock position={[0, 0, 0]} scale={[0.9, 0.7, 0.8]} rotation={[0, 1.2, 0]} />
        <GLBCoral position={[0, 0.3, 0]} scale={0.75} rotation={[0, 0.5, 0]} />
      </group>

      <group position={[3.8, 0, -4.8]}>
        <GLBRock position={[0, 0, 0]} scale={[1.0, 0.8, 0.9]} rotation={[0, -0.8, 0]} />
        <GLBCoral position={[0, 0.35, 0]} scale={0.8} rotation={[0, 2.1, 0]} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/ocean/coral_formation.glb')
useGLTF.preload('/models/ocean/ocean_rock.glb')

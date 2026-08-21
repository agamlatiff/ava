'use client'

import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/**
 * GLB Realistic Coral Formation with luminous underwater material
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
  const cloned = useMemo(() => {
    const scene = gltf.scene.clone(true)
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        mesh.material = new THREE.MeshStandardMaterial({
          color: '#E06D75', // Warm pastel coral rose
          roughness: 0.7,
          metalness: 0.05,
        })
      }
    })
    return scene
  }, [gltf.scene])

  return (
    <group position={position} scale={scale} rotation={rotation}>
      <primitive object={cloned} />
    </group>
  )
}

/**
 * GLB Realistic Submarine Ocean Rock Outcrop with soft blue-gray marine granite material
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
  const cloned = useMemo(() => {
    const scene = gltf.scene.clone(true)
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        mesh.material = new THREE.MeshStandardMaterial({
          color: '#264A62', // Marine blue-gray granite
          roughness: 0.85,
          metalness: 0.05,
        })
      }
    })
    return scene
  }, [gltf.scene])

  return (
    <group position={position} scale={scale} rotation={rotation}>
      <primitive object={cloned} />
    </group>
  )
}

export function Coral() {
  return (
    <group position={[0, -5.2, 0]}>
      {/* ── FOREGROUND LEFT CORNER (Softly grounding left margin) ── */}
      <group position={[-5.4, 0, -1.5]}>
        <GLBRock position={[0, 0, 0]} scale={[1.4, 1.1, 1.3]} rotation={[0, 0.4, 0]} />
        <GLBCoral position={[0.2, 0.5, 0.2]} scale={1.1} rotation={[0, 0.2, 0]} />
      </group>

      {/* ── FOREGROUND RIGHT CORNER (Softly grounding right margin) ── */}
      <group position={[5.6, 0, -1.8]}>
        <GLBRock position={[0, 0, 0]} scale={[1.5, 1.2, 1.4]} rotation={[0, -0.6, 0]} />
        <GLBCoral position={[-0.3, 0.6, 0.1]} scale={1.2} rotation={[0, Math.PI * 0.7, 0]} />
      </group>

      {/* ── MIDGROUND / DISTANT REEF OUTPOSTS (Deep atmospheric depth) ── */}
      <group position={[-4.0, 0, -5.0]}>
        <GLBRock position={[0, 0, 0]} scale={[0.75, 0.55, 0.65]} rotation={[0, 1.2, 0]} />
        <GLBCoral position={[0, 0.2, 0]} scale={0.6} rotation={[0, 0.5, 0]} />
      </group>

      <group position={[4.2, 0, -5.2]}>
        <GLBRock position={[0, 0, 0]} scale={[0.85, 0.65, 0.75]} rotation={[0, -0.8, 0]} />
        <GLBCoral position={[0, 0.25, 0]} scale={0.65} rotation={[0, 2.1, 0]} />
      </group>
    </group>
  )
}

useGLTF.preload('/models/ocean/coral_formation.glb')
useGLTF.preload('/models/ocean/ocean_rock.glb')

'use client'

import { useMemo } from 'react'
import * as THREE from 'three'


/**
 * Procedural branching staghorn coral.
 */
function BranchCoral({
  position,
  scale = 1,
  color = '#FF7043',
  opacity = 1.0,
}: {
  position: [number, number, number]
  scale?: number
  color?: string
  opacity?: number
}) {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.75,
        metalness: 0.08,
        transparent: opacity < 1.0,
        opacity,
      }),
    [color, opacity]
  )

  const branchGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.04, 0.08, 0.6, 6)
    geo.translate(0, 0.3, 0)
    return geo
  }, [])

  return (
    <group position={position} scale={scale}>
      {/* Central stem */}
      <mesh geometry={branchGeo} material={material} />
      {/* Left branch */}
      <group position={[0, 0.25, 0]} rotation={[0, 0, 0.5]}>
        <mesh geometry={branchGeo} material={material} scale={[0.85, 0.8, 0.85]} />
      </group>
      {/* Right branch */}
      <group position={[0, 0.2, 0]} rotation={[0.3, 0.5, -0.6]}>
        <mesh geometry={branchGeo} material={material} scale={[0.9, 0.85, 0.9]} />
      </group>
      {/* Back branch */}
      <group position={[0, 0.35, 0]} rotation={[-0.4, 0.2, 0.2]}>
        <mesh geometry={branchGeo} material={material} scale={[0.75, 0.7, 0.75]} />
      </group>
    </group>
  )
}

/**
 * Procedural tiered plate coral.
 */
function PlateCoral({
  position,
  scale = 1,
  color = '#7E57C2',
  opacity = 1.0,
}: {
  position: [number, number, number]
  scale?: number
  color?: string
  opacity?: number
}) {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.65,
        metalness: 0.1,
        transparent: opacity < 1.0,
        opacity,
      }),
    [color, opacity]
  )

  return (
    <group position={position} scale={scale}>
      {/* Base stem */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.06, 0.12, 0.3, 6]} />
        <primitive object={material} attach="material" />
      </mesh>
      {/* Top shelf */}
      <mesh position={[0, 0.32, 0]} rotation={[0.1, 0.2, -0.1]}>
        <cylinderGeometry args={[0.45, 0.38, 0.06, 8]} />
        <primitive object={material} attach="material" />
      </mesh>
      {/* Secondary shelf */}
      <mesh position={[0.2, 0.22, 0.1]} rotation={[-0.1, 0.4, 0.15]}>
        <cylinderGeometry args={[0.28, 0.22, 0.04, 8]} />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  )
}

/**
 * Low-poly rocky seabed formation.
 */
function SeabedRock({
  position,
  scale = 1,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number]
  scale?: number | [number, number, number]
  rotation?: [number, number, number]
}) {
  const rockMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#152B44',
        roughness: 0.9,
        metalness: 0.05,
        flatShading: true,
      }),
    []
  )

  const rockGeo = useMemo(() => new THREE.DodecahedronGeometry(0.8, 1), [])

  return (
    <mesh
      position={position}
      scale={scale}
      rotation={rotation}
      geometry={rockGeo}
      material={rockMat}
    />
  )
}

export function Coral() {
  return (

    <group position={[0, -4.3, 0]}>
      {/* ── FOREGROUND LEFT CORAL & ROCK GROUP ── */}
      <group position={[-5.2, 0, -1.2]}>
        {/* Foundation rocks */}
        <SeabedRock position={[0, 0.4, 0]} scale={[1.8, 1.2, 1.5]} rotation={[0.2, 0.5, 0.1]} />
        <SeabedRock position={[1.2, 0.3, 0.4]} scale={[1.2, 0.9, 1.1]} rotation={[0.4, -0.3, 0]} />

        {/* Foreground corals */}
        <BranchCoral position={[0.2, 1.0, 0.1]} scale={1.4} color="#FF6E40" />
        <BranchCoral position={[-0.4, 0.8, -0.2]} scale={1.1} color="#FF4081" />
        <PlateCoral position={[1.0, 0.8, 0.3]} scale={1.3} color="#7E57C2" />
        <PlateCoral position={[0.4, 0.5, 0.7]} scale={1.0} color="#26A69A" />
      </group>

      {/* ── FOREGROUND RIGHT CORAL & ROCK GROUP ── */}
      <group position={[5.4, 0, -1.5]}>
        {/* Foundation rocks */}
        <SeabedRock position={[0, 0.4, 0]} scale={[2.0, 1.3, 1.6]} rotation={[-0.1, -0.4, 0.2]} />
        <SeabedRock position={[-1.1, 0.25, 0.5]} scale={[1.3, 0.8, 1.0]} rotation={[0.3, 0.6, -0.1]} />

        {/* Foreground corals */}
        <BranchCoral position={[-0.3, 0.9, 0.2]} scale={1.5} color="#FFAB40" />
        <BranchCoral position={[0.5, 0.8, -0.3]} scale={1.2} color="#FF5252" />
        <PlateCoral position={[-0.9, 0.7, 0.4]} scale={1.4} color="#00BCD4" />
        <PlateCoral position={[0.2, 0.6, 0.6]} scale={1.0} color="#BA68C8" />
      </group>

      {/* ── MIDGROUND / DISTANT CORAL CLUSTERS (Smaller, subtle) ── */}
      <group position={[-3.5, 0, -4.5]}>
        <SeabedRock position={[0, 0.2, 0]} scale={[0.9, 0.6, 0.8]} />
        <BranchCoral position={[0, 0.5, 0]} scale={0.7} color="#B388FF" opacity={0.6} />
      </group>

      <group position={[3.8, 0, -4.8]}>
        <SeabedRock position={[0, 0.2, 0]} scale={[1.0, 0.7, 0.9]} />
        <PlateCoral position={[0, 0.4, 0]} scale={0.75} color="#80DEEA" opacity={0.6} />
      </group>
    </group>
  )
}

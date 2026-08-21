'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SeaTurtleProps {
  reducedMotion?: boolean
}

export function SeaTurtle({ reducedMotion = false }: SeaTurtleProps) {
  const rootRef = useRef<THREE.Group>(null!)
  const leftFlipperRef = useRef<THREE.Group>(null!)
  const rightFlipperRef = useRef<THREE.Group>(null!)
  const timeRef = useRef(0)

  // Subtle translucent materials for atmospheric depth
  const shellMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1C4B59',
        roughness: 0.8,
        metalness: 0.05,
      }),
    []
  )

  const skinMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2A6878',
        roughness: 0.75,
        metalness: 0.05,
      }),
    []
  )

  // Geometries
  const shellGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.7, 12, 8)
    geo.scale(1.3, 0.45, 1.0)
    return geo
  }, [])

  const flipperGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.quadraticCurveTo(0.4, 0.2, 0.9, -0.1)
    shape.quadraticCurveTo(0.6, -0.3, 0, 0)
    const geo = new THREE.ShapeGeometry(shape)
    geo.scale(0.85, 0.85, 0.85)
    return geo
  }, [])

  const headGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.22, 8, 6)
    geo.scale(1.2, 0.75, 0.85)
    return geo
  }, [])

  useFrame((_, delta) => {
    if (!rootRef.current || reducedMotion) return
    timeRef.current += delta * 0.25
    const t = timeRef.current

    // Slow, serene path high up in the background
    const x = Math.sin(t) * 5.0 + 1.5
    const z = Math.cos(t * 0.7) * 2.2 - 6.5
    const y = 2.8 + Math.sin(t * 1.2) * 0.22

    // Heading tangent
    const nextX = Math.sin(t + 0.04) * 5.0 + 1.5
    const nextZ = Math.cos((t + 0.04) * 0.7) * 2.2 - 6.5
    const heading = Math.atan2(nextX - x, nextZ - z)
    const roll = Math.sin(t) * 0.05

    rootRef.current.position.set(x, y, z)
    rootRef.current.rotation.set(0, heading + Math.PI / 2, roll)

    // Gentle flipper stroke
    const stroke = Math.sin(timeRef.current * 2.8) * 0.25
    if (leftFlipperRef.current) leftFlipperRef.current.rotation.z = -0.25 + stroke
    if (rightFlipperRef.current) rightFlipperRef.current.rotation.z = 0.25 - stroke
  })

  return (
    <group ref={rootRef} scale={0.55}>
      {/* Carapace Shell */}
      <mesh geometry={shellGeo} material={shellMat} />

      {/* Head */}
      <mesh geometry={headGeo} material={skinMat} position={[0.8, 0.04, 0]} />

      {/* Fore Flippers */}
      <group ref={leftFlipperRef} position={[0.35, -0.04, 0.5]} rotation={[0.2, 0.35, -0.25]}>
        <mesh geometry={flipperGeo} material={skinMat} />
      </group>
      <group ref={rightFlipperRef} position={[0.35, -0.04, -0.5]} rotation={[-0.2, -0.35, 0.25]}>
        <mesh geometry={flipperGeo} material={skinMat} scale={[1, -1, 1]} />
      </group>

      {/* Rear Flippers */}
      <mesh
        geometry={flipperGeo}
        material={skinMat}
        position={[-0.55, -0.04, 0.3]}
        scale={[0.45, 0.45, 0.45]}
        rotation={[0, 0.5, -0.15]}
      />
      <mesh
        geometry={flipperGeo}
        material={skinMat}
        position={[-0.55, -0.04, -0.3]}
        scale={[0.45, -0.45, 0.45]}
        rotation={[0, -0.5, 0.15]}
      />
    </group>
  )
}

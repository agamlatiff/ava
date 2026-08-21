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

  // Materials
  const shellMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#2E6070',
        roughness: 0.7,
        metalness: 0.08,
      }),
    []
  )

  const skinMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#4A8A96',
        roughness: 0.65,
        metalness: 0.05,
      }),
    []
  )

  // Geometries
  const shellGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.7, 14, 10)
    geo.scale(1.3, 0.5, 1.0)
    return geo
  }, [])

  const flipperGeo = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.quadraticCurveTo(0.4, 0.2, 0.9, -0.1)
    shape.quadraticCurveTo(0.6, -0.3, 0, 0)
    const geo = new THREE.ShapeGeometry(shape)
    geo.scale(0.9, 0.9, 0.9)
    return geo
  }, [])

  const headGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.24, 10, 8)
    geo.scale(1.2, 0.8, 0.9)
    return geo
  }, [])

  useFrame((_, delta) => {
    if (!rootRef.current || reducedMotion) return
    timeRef.current += delta * 0.4
    const t = timeRef.current

    // Slow graceful glide path in the upper ocean
    const x = Math.sin(t) * 4.5 + 2.0
    const z = Math.cos(t * 0.8) * 2.0 - 4.0
    const y = 2.4 + Math.sin(t * 1.5) * 0.3

    // Heading tangent
    const nextX = Math.sin(t + 0.05) * 4.5 + 2.0
    const nextZ = Math.cos((t + 0.05) * 0.8) * 2.0 - 4.0
    const heading = Math.atan2(nextX - x, nextZ - z)
    const roll = Math.sin(t) * 0.06

    rootRef.current.position.set(x, y, z)
    rootRef.current.rotation.set(0, heading + Math.PI / 2, roll)

    // Gentle flipper stroke
    const stroke = Math.sin(timeRef.current * 3.5) * 0.35
    if (leftFlipperRef.current) leftFlipperRef.current.rotation.z = -0.3 + stroke
    if (rightFlipperRef.current) rightFlipperRef.current.rotation.z = 0.3 - stroke
  })

  return (
    <group ref={rootRef} scale={0.9}>
      {/* Carapace Shell */}
      <mesh geometry={shellGeo} material={shellMat} />

      {/* Head */}
      <mesh geometry={headGeo} material={skinMat} position={[0.85, 0.05, 0]} />

      {/* Fore Flippers */}
      <group ref={leftFlipperRef} position={[0.4, -0.05, 0.55]} rotation={[0.2, 0.4, -0.3]}>
        <mesh geometry={flipperGeo} material={skinMat} />
      </group>
      <group ref={rightFlipperRef} position={[0.4, -0.05, -0.55]} rotation={[-0.2, -0.4, 0.3]}>
        <mesh geometry={flipperGeo} material={skinMat} scale={[1, -1, 1]} />
      </group>

      {/* Rear Flippers */}
      <mesh
        geometry={flipperGeo}
        material={skinMat}
        position={[-0.6, -0.05, 0.35]}
        scale={[0.5, 0.5, 0.5]}
        rotation={[0, 0.6, -0.2]}
      />
      <mesh
        geometry={flipperGeo}
        material={skinMat}
        position={[-0.6, -0.05, -0.35]}
        scale={[0.5, -0.5, 0.5]}
        rotation={[0, -0.6, 0.2]}
      />
    </group>
  )
}

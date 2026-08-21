'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export type FishType = 'clownfish' | 'blue-tang' | 'butterflyfish' | 'distant'

interface FishInstance {
  id: number
  type: FishType
  isBackground: boolean
  baseSpeed: number
  speedVariance: number
  radiusX: number
  radiusZ: number
  centerPos: THREE.Vector3
  pathAngle: number
  yBase: number
  yAmplitude: number
  yFrequency: number
  swimFreq: number
  scale: number
}

interface FishProps {
  count?: number
  reducedMotion?: boolean
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

/**
 * High-fidelity GLB Tropical Fish (Clownfish)
 */
function GLBTropicalFish({ data, reducedMotion }: { data: FishInstance; reducedMotion: boolean }) {
  const gltf = useGLTF('/models/ocean/tropical_fish.glb')
  const clonedScene = useMemo(() => gltf.scene.clone(true), [gltf.scene])
  const rootGroupRef = useRef<THREE.Group>(null!)

  const timeOffset = useMemo(() => data.id * 1.618, [data.id])
  const angleRef = useRef(data.pathAngle)

  useFrame((_, delta) => {
    if (!rootGroupRef.current) return

    if (!reducedMotion) {
      angleRef.current += (data.baseSpeed + Math.sin(angleRef.current * 1.5) * data.speedVariance) * delta
    }

    const a = angleRef.current
    const posX = data.centerPos.x + Math.sin(a) * data.radiusX
    const posZ = data.centerPos.z + Math.cos(a) * data.radiusZ
    const posY = data.yBase + Math.sin(a * data.yFrequency + timeOffset) * data.yAmplitude

    // Calculate heading tangent and pitch
    const nextA = a + 0.04
    const nextX = data.centerPos.x + Math.sin(nextA) * data.radiusX
    const nextZ = data.centerPos.z + Math.cos(nextA) * data.radiusZ

    const heading = Math.atan2(nextX - posX, nextZ - posZ)
    const pitch = (Math.cos(a * data.yFrequency + timeOffset) * data.yAmplitude) * 0.12
    const roll = Math.sin(a) * 0.08 // Subtle banking on curved turns

    rootGroupRef.current.position.set(posX, posY, posZ)
    rootGroupRef.current.rotation.set(pitch, heading, roll)

    // Tail fin wave oscillation
    if (!reducedMotion) {
      const tail = rootGroupRef.current.getObjectByName('TailFin')
      if (tail) {
        tail.rotation.y = Math.sin(a * data.swimFreq + timeOffset) * 0.28
      }
    }
  })



  return (
    <group ref={rootGroupRef} scale={data.scale}>
      <primitive object={clonedScene} />
    </group>
  )
}

/**
 * Distant silhouette fish for deep midground atmosphere
 */
function DistantFish({ data, reducedMotion }: { data: FishInstance; reducedMotion: boolean }) {
  const rootGroupRef = useRef<THREE.Group>(null!)
  const angleRef = useRef(data.pathAngle)
  const timeOffset = useMemo(() => data.id * 1.618, [data.id])

  const distantMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0D3B66',
        roughness: 0.85,
        metalness: 0.1,
        transparent: true,
        opacity: 0.6,
      }),
    []
  )

  const distantGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.35, 10, 8)
    geo.scale(1.4, 0.8, 0.4)
    return geo
  }, [])

  useFrame((_, delta) => {
    if (!rootGroupRef.current) return

    if (!reducedMotion) {
      angleRef.current += (data.baseSpeed + Math.sin(angleRef.current * 1.2) * data.speedVariance) * delta
    }

    const a = angleRef.current
    const posX = data.centerPos.x + Math.sin(a) * data.radiusX
    const posZ = data.centerPos.z + Math.cos(a) * data.radiusZ
    const posY = data.yBase + Math.sin(a * data.yFrequency + timeOffset) * data.yAmplitude

    const nextA = a + 0.04
    const nextX = data.centerPos.x + Math.sin(nextA) * data.radiusX
    const nextZ = data.centerPos.z + Math.cos(nextA) * data.radiusZ

    const heading = Math.atan2(nextX - posX, nextZ - posZ)
    rootGroupRef.current.position.set(posX, posY, posZ)
    rootGroupRef.current.rotation.set(0, heading, 0)
  })

  return (
    <group ref={rootGroupRef} scale={data.scale}>
      <mesh geometry={distantGeo} material={distantMat} />
    </group>
  )
}

export function Fish({ count = 3, reducedMotion = false }: FishProps) {
  const fishList = useMemo<FishInstance[]>(() => {
    const list: FishInstance[] = []

    // 1. Foreground Realistic GLB Fish
    const fgCount = Math.max(1, Math.min(count, 2))
    for (let i = 0; i < fgCount; i++) {
      list.push({
        id: i,
        type: 'clownfish',
        isBackground: false,
        baseSpeed: 0.22 + pseudoRandom(i * 7 + 1) * 0.12,
        speedVariance: 0.05,
        radiusX: 3.8 + pseudoRandom(i * 7 + 2) * 2.0,
        radiusZ: 1.8 + pseudoRandom(i * 7 + 3) * 1.2,
        centerPos: new THREE.Vector3(
          (pseudoRandom(i * 7 + 4) - 0.5) * 3.2,
          -0.3 + (pseudoRandom(i * 7 + 5) - 0.5) * 2.0,
          -1.4 + (pseudoRandom(i * 7 + 6) - 0.5) * 1.2
        ),
        pathAngle: pseudoRandom(i * 7 + 7) * Math.PI * 2,
        yBase: -0.3 + (pseudoRandom(i * 7 + 8) - 0.5) * 1.6,
        yAmplitude: 0.22 + pseudoRandom(i * 7 + 9) * 0.18,
        yFrequency: 1.1 + pseudoRandom(i * 7 + 10) * 0.7,
        swimFreq: 5.2 + pseudoRandom(i * 7 + 11) * 1.8,
        scale: 0.9 + pseudoRandom(i * 7 + 12) * 0.25,
      })
    }

    // 2. Distant background fish
    const bgCount = 2
    for (let i = 0; i < bgCount; i++) {
      const idx = fgCount + i
      list.push({
        id: idx,
        type: 'distant',
        isBackground: true,
        baseSpeed: 0.16 + pseudoRandom(idx * 7 + 1) * 0.08,
        speedVariance: 0.03,
        radiusX: 5.2 + pseudoRandom(idx * 7 + 2) * 2.2,
        radiusZ: 2.4 + pseudoRandom(idx * 7 + 3) * 1.6,
        centerPos: new THREE.Vector3(
          (pseudoRandom(idx * 7 + 4) - 0.5) * 4.8,
          0.4 + (pseudoRandom(idx * 7 + 5) - 0.5) * 1.8,
          -5.6 + (pseudoRandom(idx * 7 + 6) - 0.5) * 1.8
        ),
        pathAngle: pseudoRandom(idx * 7 + 7) * Math.PI * 2,
        yBase: 0.2 + (pseudoRandom(idx * 7 + 8) - 0.5) * 1.4,
        yAmplitude: 0.14 + pseudoRandom(idx * 7 + 9) * 0.12,
        yFrequency: 0.8 + pseudoRandom(idx * 7 + 10) * 0.5,
        swimFreq: 4.2 + pseudoRandom(idx * 7 + 11) * 1.2,
        scale: 0.35 + pseudoRandom(idx * 7 + 12) * 0.12,
      })
    }

    return list
  }, [count])

  return (
    <group>
      {fishList.map((fish) =>
        fish.isBackground ? (
          <DistantFish key={fish.id} data={fish} reducedMotion={reducedMotion} />
        ) : (
          <GLBTropicalFish key={fish.id} data={fish} reducedMotion={reducedMotion} />
        )
      )}
    </group>
  )
}

useGLTF.preload('/models/ocean/tropical_fish.glb')

'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export type FishType = 'clownfish' | 'midground' | 'distant'

interface FishInstance {
  id: number
  type: FishType
  depthLayer: 'foreground-peripheral' | 'midground' | 'background'
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
 * Foreground / Midground Realistic GLB Tropical Fish (Clownfish)
 * Rendered at refined, natural proportions.
 */
function GLBTropicalFish({ data, reducedMotion }: { data: FishInstance; reducedMotion: boolean }) {
  const gltf = useGLTF('/models/ocean/tropical_fish.glb')
  const clonedScene = useMemo(() => gltf.scene.clone(true), [gltf.scene])
  const rootGroupRef = useRef<THREE.Group>(null!)

  const timeOffset = useMemo(() => data.id * 2.137, [data.id])
  const angleRef = useRef(data.pathAngle)

  useFrame((_, delta) => {
    if (!rootGroupRef.current) return

    if (!reducedMotion) {
      angleRef.current += (data.baseSpeed + Math.sin(angleRef.current * 1.4) * data.speedVariance) * delta
    }

    const a = angleRef.current
    const posX = data.centerPos.x + Math.sin(a) * data.radiusX
    const posZ = data.centerPos.z + Math.cos(a) * data.radiusZ
    const posY = data.yBase + Math.sin(a * data.yFrequency + timeOffset) * data.yAmplitude

    // Calculate heading tangent and banking
    const nextA = a + 0.03
    const nextX = data.centerPos.x + Math.sin(nextA) * data.radiusX
    const nextZ = data.centerPos.z + Math.cos(nextA) * data.radiusZ

    const heading = Math.atan2(nextX - posX, nextZ - posZ)
    const pitch = (Math.cos(a * data.yFrequency + timeOffset) * data.yAmplitude) * 0.1
    const roll = Math.sin(a) * 0.06

    rootGroupRef.current.position.set(posX, posY, posZ)
    rootGroupRef.current.rotation.set(pitch, heading, roll)

    // Tail fin gentle swimming stroke
    if (!reducedMotion) {
      const tail = rootGroupRef.current.getObjectByName('TailFin')
      if (tail) {
        tail.rotation.y = Math.sin(a * data.swimFreq + timeOffset) * 0.22
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
 * Distant silhouetted fish for deep background marine depth
 */
function DistantFish({ data, reducedMotion }: { data: FishInstance; reducedMotion: boolean }) {
  const rootGroupRef = useRef<THREE.Group>(null!)
  const angleRef = useRef(data.pathAngle)
  const timeOffset = useMemo(() => data.id * 2.137, [data.id])

  const distantMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0A3258',
        roughness: 0.9,
        metalness: 0.05,
        transparent: true,
        opacity: data.depthLayer === 'background' ? 0.45 : 0.7,
      }),
    [data.depthLayer]
  )

  const distantGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.3, 8, 6)
    geo.scale(1.3, 0.7, 0.35)
    return geo
  }, [])

  useFrame((_, delta) => {
    if (!rootGroupRef.current) return

    if (!reducedMotion) {
      angleRef.current += (data.baseSpeed + Math.sin(angleRef.current * 1.1) * data.speedVariance) * delta
    }

    const a = angleRef.current
    const posX = data.centerPos.x + Math.sin(a) * data.radiusX
    const posZ = data.centerPos.z + Math.cos(a) * data.radiusZ
    const posY = data.yBase + Math.sin(a * data.yFrequency + timeOffset) * data.yAmplitude

    const nextA = a + 0.03
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

    // ─────────────────────────────────────────────────────────────
    // 1. FOREGROUND PERIPHERAL FISH: Small & swimming at edges only
    // Kept away from the central screen text (x outside [-2.5, 2.5])
    // ─────────────────────────────────────────────────────────────
    list.push({
      id: 0,
      type: 'clownfish',
      depthLayer: 'foreground-peripheral',
      baseSpeed: 0.18,
      speedVariance: 0.03,
      radiusX: 2.2,
      radiusZ: 1.4,
      centerPos: new THREE.Vector3(-4.2, -1.6, -2.5), // Lower left corner
      pathAngle: 0.4,
      yBase: -1.6,
      yAmplitude: 0.18,
      yFrequency: 0.9,
      swimFreq: 4.8,
      scale: 0.42, // Refined, gentle size
    })

    // ─────────────────────────────────────────────────────────────
    // 2. MIDGROUND FISH: Calmly swimming across mid-depths
    // ─────────────────────────────────────────────────────────────
    const midCount = Math.max(1, Math.min(count, 2))
    for (let i = 0; i < midCount; i++) {
      const idx = 1 + i
      list.push({
        id: idx,
        type: 'clownfish',
        depthLayer: 'midground',
        baseSpeed: 0.15 + pseudoRandom(idx * 5 + 1) * 0.06,
        speedVariance: 0.02,
        radiusX: 4.5 + pseudoRandom(idx * 5 + 2) * 1.5,
        radiusZ: 2.0 + pseudoRandom(idx * 5 + 3) * 1.0,
        centerPos: new THREE.Vector3(
          (pseudoRandom(idx * 5 + 4) - 0.5) * 4.0,
          0.2 + (pseudoRandom(idx * 5 + 5) - 0.5) * 1.5,
          -5.2 + (pseudoRandom(idx * 5 + 6) - 0.5) * 1.2
        ),
        pathAngle: pseudoRandom(idx * 5 + 7) * Math.PI * 2,
        yBase: 0.2 + (pseudoRandom(idx * 5 + 8) - 0.5) * 1.2,
        yAmplitude: 0.14 + pseudoRandom(idx * 5 + 9) * 0.08,
        yFrequency: 0.8 + pseudoRandom(idx * 5 + 10) * 0.4,
        swimFreq: 4.2 + pseudoRandom(idx * 5 + 11) * 0.8,
        scale: 0.32 + pseudoRandom(idx * 5 + 12) * 0.08, // Subtle midground scale
      })
    }

    // ─────────────────────────────────────────────────────────────
    // 3. BACKGROUND FISH: Tiny distant silhouettes in deep fog
    // ─────────────────────────────────────────────────────────────
    const bgCount = 3
    for (let i = 0; i < bgCount; i++) {
      const idx = 10 + i
      list.push({
        id: idx,
        type: 'distant',
        depthLayer: 'background',
        baseSpeed: 0.12 + pseudoRandom(idx * 7 + 1) * 0.05,
        speedVariance: 0.02,
        radiusX: 6.0 + pseudoRandom(idx * 7 + 2) * 2.0,
        radiusZ: 3.0 + pseudoRandom(idx * 7 + 3) * 1.5,
        centerPos: new THREE.Vector3(
          (pseudoRandom(idx * 7 + 4) - 0.5) * 6.0,
          0.8 + (pseudoRandom(idx * 7 + 5) - 0.5) * 2.0,
          -10.5 + (pseudoRandom(idx * 7 + 6) - 0.5) * 2.5
        ),
        pathAngle: pseudoRandom(idx * 7 + 7) * Math.PI * 2,
        yBase: 0.8 + (pseudoRandom(idx * 7 + 8) - 0.5) * 1.6,
        yAmplitude: 0.1 + pseudoRandom(idx * 7 + 9) * 0.06,
        yFrequency: 0.6 + pseudoRandom(idx * 7 + 10) * 0.3,
        swimFreq: 3.5 + pseudoRandom(idx * 7 + 11) * 0.6,
        scale: 0.18 + pseudoRandom(idx * 7 + 12) * 0.06, // Tiny distant speck
      })
    }

    return list
  }, [count])

  return (
    <group>
      {fishList.map((fish) =>
        fish.depthLayer === 'background' ? (
          <DistantFish key={fish.id} data={fish} reducedMotion={reducedMotion} />
        ) : (
          <GLBTropicalFish key={fish.id} data={fish} reducedMotion={reducedMotion} />
        )
      )}
    </group>
  )
}

useGLTF.preload('/models/ocean/tropical_fish.glb')

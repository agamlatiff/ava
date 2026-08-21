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
  behavior: 'hover-graze' | 'cruise-glide' | 'distant-drift'
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
 * Realistic Tropical Fish with depth-tuned materials
 */
function GLBTropicalFish({ data, reducedMotion }: { data: FishInstance; reducedMotion: boolean }) {
  const gltf = useGLTF('/models/ocean/tropical_fish.glb')
  
  // Clone and apply depth-specific material tuning (avoids black silhouettes)
  const clonedScene = useMemo(() => {
    const scene = gltf.scene.clone(true)

    const isForeground = data.depthLayer === 'foreground-peripheral'
    
    // Depth-tuned material palettes
    const bodyColor     = isForeground ? '#FF7A00' : '#D05A0A'
    const bodyEmissive  = isForeground ? '#3D1500' : '#1C0A00'
    const stripeColor   = isForeground ? '#FFFFFF' : '#D0E4F0'
    const finColor      = isForeground ? '#FFA040' : '#C06818'

    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        const name = mesh.name || ''

        if (name === 'FishBody') {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(bodyColor),
            roughness: 0.35,
            metalness: 0.08,
            emissive: new THREE.Color(bodyEmissive),
            emissiveIntensity: 0.5,
          })
        } else if (name.startsWith('stripe') || name.startsWith('Stripe') || name === 'stripe1' || name === 'stripe2') {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(stripeColor),
            roughness: 0.3,
            metalness: 0.02,
          })
        } else if (name.includes('Fin') || name.includes('fin')) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(finColor),
            roughness: 0.45,
            transparent: true,
            opacity: 0.88,
            side: THREE.DoubleSide,
            emissive: new THREE.Color(bodyEmissive),
            emissiveIntensity: 0.3,
          })
        }
      }
    })

    return scene
  }, [gltf.scene, data.depthLayer])

  const rootGroupRef = useRef<THREE.Group>(null!)
  const angleRef = useRef(data.pathAngle)
  const timeOffset = useMemo(() => data.id * 3.17, [data.id])

  useFrame((_, delta) => {
    if (!rootGroupRef.current) return

    const t = angleRef.current

    if (data.behavior === 'hover-graze') {
      // ─────────────────────────────────────────────────────────
      // 1. Grazing / Hovering Behavior (Foreground Reef Fish)
      // Stays near the reef on the left margin, gentle hovering
      // ─────────────────────────────────────────────────────────
      if (!reducedMotion) {
        angleRef.current += delta * 0.4
      }
      
      const hoverAngle = angleRef.current
      const hoverBob = Math.sin(hoverAngle * 1.4 + timeOffset) * 0.12
      const hoverDriftX = Math.sin(hoverAngle * 0.6 + timeOffset) * 0.35
      const hoverDriftZ = Math.cos(hoverAngle * 0.5 + timeOffset) * 0.25

      const posX = data.centerPos.x + hoverDriftX
      const posY = data.yBase + hoverBob
      const posZ = data.centerPos.z + hoverDriftZ

      // Gentle exploratory orientation
      const yaw = Math.sin(hoverAngle * 0.5 + timeOffset) * 0.4 + 0.3
      const pitch = Math.cos(hoverAngle * 1.4 + timeOffset) * 0.06
      const roll = Math.sin(hoverAngle * 0.8) * 0.04

      rootGroupRef.current.position.set(posX, posY, posZ)
      rootGroupRef.current.rotation.set(pitch, yaw, roll)

      // Slow delicate pectoral fin flutter
      if (!reducedMotion) {
        const tail = rootGroupRef.current.getObjectByName('TailFin')
        if (tail) {
          tail.rotation.y = Math.sin(hoverAngle * 3.5 + timeOffset) * 0.15
        }
      }
    } else {
      // ─────────────────────────────────────────────────────────
      // 2. Cruising & Gliding Behavior (Midground Fish)
      // Smooth spline tangents, acceleration/glide cycle, banking
      // ─────────────────────────────────────────────────────────
      if (!reducedMotion) {
        // Wave-like speed cycle: tail kick acceleration -> long smooth glide
        const cycleSpeed = data.baseSpeed * (0.8 + 0.5 * Math.sin(t * 1.8 + timeOffset))
        angleRef.current += cycleSpeed * delta
      }

      const a = angleRef.current
      const posX = data.centerPos.x + Math.sin(a) * data.radiusX
      const posZ = data.centerPos.z + Math.cos(a) * data.radiusZ
      const posY = data.yBase + Math.sin(a * data.yFrequency + timeOffset) * data.yAmplitude

      const nextA = a + 0.03
      const nextX = data.centerPos.x + Math.sin(nextA) * data.radiusX
      const nextZ = data.centerPos.z + Math.cos(nextA) * data.radiusZ

      const heading = Math.atan2(nextX - posX, nextZ - posZ)
      const pitch = (Math.cos(a * data.yFrequency + timeOffset) * data.yAmplitude) * 0.08
      const roll = Math.sin(a * 2.0) * 0.06 // Hydrodynamic banking

      rootGroupRef.current.position.set(posX, posY, posZ)
      rootGroupRef.current.rotation.set(pitch, heading, roll)

      if (!reducedMotion) {
        const tail = rootGroupRef.current.getObjectByName('TailFin')
        if (tail) {
          const tailRate = 3.0 + Math.sin(t * 1.8 + timeOffset) * 2.0
          tail.rotation.y = Math.sin(a * tailRate + timeOffset) * 0.22
        }
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
        color: new THREE.Color('#144E7E'),
        roughness: 0.9,
        metalness: 0.05,
        transparent: true,
        opacity: 0.42,
        emissive: new THREE.Color('#0A2640'),
        emissiveIntensity: 0.3,
      }),
    []
  )

  const distantGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.26, 8, 6)
    geo.scale(1.3, 0.65, 0.3)
    return geo
  }, [])

  useFrame((_, delta) => {
    if (!rootGroupRef.current) return

    if (!reducedMotion) {
      angleRef.current += data.baseSpeed * delta
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
    // 1. FOREGROUND PERIPHERAL FISH: Calmly grazing near left reef
    // Kept strictly away from center text (x < -3.8)
    // ─────────────────────────────────────────────────────────────
    list.push({
      id: 0,
      type: 'clownfish',
      depthLayer: 'foreground-peripheral',
      behavior: 'hover-graze',
      baseSpeed: 0.12,
      speedVariance: 0.02,
      radiusX: 1.2,
      radiusZ: 0.8,
      centerPos: new THREE.Vector3(-4.5, -1.8, -2.2), // Grazing near left reef
      pathAngle: 0.2,
      yBase: -1.8,
      yAmplitude: 0.12,
      yFrequency: 0.6,
      swimFreq: 3.5,
      scale: 0.44,
    })

    // ─────────────────────────────────────────────────────────────
    // 2. MIDGROUND CRUISING FISH: Swimming serenely across mid-depths
    // ─────────────────────────────────────────────────────────────
    const midCount = Math.max(1, Math.min(count, 2))
    for (let i = 0; i < midCount; i++) {
      const idx = 1 + i
      list.push({
        id: idx,
        type: 'clownfish',
        depthLayer: 'midground',
        behavior: 'cruise-glide',
        baseSpeed: 0.13 + pseudoRandom(idx * 5 + 1) * 0.04,
        speedVariance: 0.03,
        radiusX: 5.0 + pseudoRandom(idx * 5 + 2) * 1.5,
        radiusZ: 2.2 + pseudoRandom(idx * 5 + 3) * 1.0,
        centerPos: new THREE.Vector3(
          (pseudoRandom(idx * 5 + 4) - 0.5) * 3.8,
          0.2 + (pseudoRandom(idx * 5 + 5) - 0.5) * 1.2,
          -5.6 + (pseudoRandom(idx * 5 + 6) - 0.5) * 1.0
        ),
        pathAngle: pseudoRandom(idx * 5 + 7) * Math.PI * 2,
        yBase: 0.2 + (pseudoRandom(idx * 5 + 8) - 0.5) * 0.9,
        yAmplitude: 0.11 + pseudoRandom(idx * 5 + 9) * 0.05,
        yFrequency: 0.65 + pseudoRandom(idx * 5 + 10) * 0.25,
        swimFreq: 4.2 + pseudoRandom(idx * 5 + 11) * 0.6,
        scale: 0.33 + pseudoRandom(idx * 5 + 12) * 0.05,
      })
    }

    // ─────────────────────────────────────────────────────────────
    // 3. BACKGROUND FISH: Tiny hazy distant silhouettes in deep fog
    // ─────────────────────────────────────────────────────────────
    const bgCount = 4
    for (let i = 0; i < bgCount; i++) {
      const idx = 10 + i
      list.push({
        id: idx,
        type: 'distant',
        depthLayer: 'background',
        behavior: 'distant-drift',
        baseSpeed: 0.09 + pseudoRandom(idx * 7 + 1) * 0.03,
        speedVariance: 0.01,
        radiusX: 6.8 + pseudoRandom(idx * 7 + 2) * 2.0,
        radiusZ: 3.4 + pseudoRandom(idx * 7 + 3) * 1.5,
        centerPos: new THREE.Vector3(
          (pseudoRandom(idx * 7 + 4) - 0.5) * 6.5,
          1.2 + (pseudoRandom(idx * 7 + 5) - 0.5) * 1.8,
          -11.5 + (pseudoRandom(idx * 7 + 6) - 0.5) * 2.5
        ),
        pathAngle: pseudoRandom(idx * 7 + 7) * Math.PI * 2,
        yBase: 1.2 + (pseudoRandom(idx * 7 + 8) - 0.5) * 1.2,
        yAmplitude: 0.08 + pseudoRandom(idx * 7 + 9) * 0.04,
        yFrequency: 0.45 + pseudoRandom(idx * 7 + 10) * 0.2,
        swimFreq: 3.0 + pseudoRandom(idx * 7 + 11) * 0.4,
        scale: 0.16 + pseudoRandom(idx * 7 + 12) * 0.04,
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

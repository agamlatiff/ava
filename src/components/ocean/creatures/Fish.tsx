'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { oceanState } from '../hooks/globalOceanState'

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

    // Depth-tuned material palettes
    let bodyColor     = '#FF7A00'
    let bodyEmissive  = '#3D1500'
    let stripeColor   = '#FFFFFF'
    let finColor      = '#FFA040'

    if (data.depthLayer === 'midground') {
      bodyColor     = '#D05A0A'
      bodyEmissive  = '#4A1D05' // Brightened emissive prevents black
      stripeColor   = '#E0F0FA'
      finColor      = '#C06818'
    } else if (data.depthLayer === 'background') {
      bodyColor     = '#3D8EAB'
      bodyEmissive  = '#1A4D66'
      stripeColor   = '#5FAAC7'
      finColor      = '#3D8EAB'
    }

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

  useFrame((state, delta) => {
    if (!rootGroupRef.current) return

    if (data.behavior === 'hover-graze') {
      // ─────────────────────────────────────────────────────────
      // 1. Grazing / Hovering Behavior (Foreground Reef Fish)
      // Stays near the reef on the left margin, gentle hovering
      // ─────────────────────────────────────────────────────────
      const isPaused = oceanState.activeEvent === 'pause'

      if (!reducedMotion) {
        // Slow down dramatically if paused, otherwise normal
        angleRef.current += (isPaused ? delta * 0.05 : delta * 0.4)
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
          // Keep fluttering even if paused
          tail.rotation.y = Math.sin(timeOffset + state.clock.elapsedTime * 3.5) * (isPaused ? 0.05 : 0.15)
        }
      }
    } else {
      // ─────────────────────────────────────────────────────────
      // 2. Cruising & Gliding Behavior (Midground Fish)
      // Organic point-to-point wandering with momentum and banking
      // ─────────────────────────────────────────────────────────
      if (!rootGroupRef.current.userData.state) {
        rootGroupRef.current.userData.state = {
          x: data.centerPos.x + (Math.random() - 0.5) * 2,
          z: data.centerPos.z + (Math.random() - 0.5) * 2,
          heading: data.pathAngle,
          targetHeading: data.pathAngle,
          turnTimer: Math.random() * 2.0,
          time: timeOffset
        }
      }

      const state = rootGroupRef.current.userData.state

      if (!reducedMotion) {
        state.time += delta
        state.turnTimer -= delta

        if (state.turnTimer <= 0) {
          const distFromCenter = Math.hypot(state.x - data.centerPos.x, state.z - data.centerPos.z)
          if (distFromCenter > (data.radiusX + data.radiusZ) * 0.4) {
             state.targetHeading = Math.atan2(data.centerPos.x - state.x, data.centerPos.z - state.z)
             state.targetHeading += (Math.random() - 0.5) * 0.5
          } else {
             state.targetHeading += (Math.random() - 0.5) * 1.5
          }
          state.turnTimer = 3.0 + Math.random() * 4.0
        }

        let diff = state.targetHeading - state.heading
        diff = Math.atan2(Math.sin(diff), Math.cos(diff))
        state.heading += diff * 0.5 * delta

        const cycleSpeed = data.baseSpeed * (0.8 + 0.6 * Math.sin(state.time * 1.8))
        
        state.x += Math.sin(state.heading) * cycleSpeed * delta * 5.0
        state.z += Math.cos(state.heading) * cycleSpeed * delta * 5.0
      }

      const posY = data.yBase + Math.sin(state.time * data.yFrequency) * data.yAmplitude

      let diffHeading = state.targetHeading - state.heading
      diffHeading = Math.atan2(Math.sin(diffHeading), Math.cos(diffHeading))
      const roll = diffHeading * 0.4
      const pitch = (Math.cos(state.time * data.yFrequency) * data.yAmplitude) * 0.1

      rootGroupRef.current.position.set(state.x, posY, state.z)
      rootGroupRef.current.rotation.set(pitch, state.heading, roll)

      if (!reducedMotion) {
        const tail = rootGroupRef.current.getObjectByName('TailFin')
        if (tail) {
          const tailRate = 3.0 + Math.sin(state.time * 1.8) * 2.0
          tail.rotation.y = Math.sin(state.time * 4.0) * 0.22 * (tailRate / 3.0)
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
  const timeOffset = useMemo(() => data.id * 2.137, [data.id])

  const distantMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#2C6E9E'),
        roughness: 0.9,
        metalness: 0.05,
        transparent: true,
        opacity: 0.42,
        emissive: new THREE.Color('#144E7E'), // Lifted emissive to avoid pure black
        emissiveIntensity: 0.4,
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

    if (!rootGroupRef.current.userData.state) {
      rootGroupRef.current.userData.state = {
        x: data.centerPos.x + (Math.random() - 0.5) * 4,
        z: data.centerPos.z + (Math.random() - 0.5) * 4,
        heading: data.pathAngle,
        targetHeading: data.pathAngle,
        turnTimer: Math.random() * 5.0,
        time: timeOffset
      }
    }

    const state = rootGroupRef.current.userData.state

    if (!reducedMotion) {
      state.time += delta
      state.turnTimer -= delta

      if (state.turnTimer <= 0) {
        const distFromCenter = Math.hypot(state.x - data.centerPos.x, state.z - data.centerPos.z)
        if (distFromCenter > (data.radiusX + data.radiusZ) * 0.5) {
            state.targetHeading = Math.atan2(data.centerPos.x - state.x, data.centerPos.z - state.z)
            state.targetHeading += (Math.random() - 0.5) * 0.4
        } else {
            state.targetHeading += (Math.random() - 0.5) * 1.0
        }
        state.turnTimer = 4.0 + Math.random() * 6.0
      }

      let diff = state.targetHeading - state.heading
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      state.heading += diff * 0.3 * delta

      state.x += Math.sin(state.heading) * data.baseSpeed * delta * 5.0
      state.z += Math.cos(state.heading) * data.baseSpeed * delta * 5.0
    }

    const posY = data.yBase + Math.sin(state.time * data.yFrequency) * data.yAmplitude
    rootGroupRef.current.position.set(state.x, posY, state.z)
    rootGroupRef.current.rotation.set(0, state.heading, 0)
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
          1.5 + (pseudoRandom(idx * 5 + 4) - 0.5) * 2.0, // Shifted to right side (away from text)
          -0.5 + (pseudoRandom(idx * 5 + 5) - 0.5) * 1.0, // Shifted lower
          -7.0 + (pseudoRandom(idx * 5 + 6) - 0.5) * 1.0 // Pushed deeper to reduce scale/impact
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

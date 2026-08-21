'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
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
 * Creates procedural fish geometry with body, tail, dorsal fin, pectoral fins, and eyes.
 */
function createFishGeometries(type: FishType) {
  // Body - smooth streamlined ellipsoid
  const bodyGeo = new THREE.SphereGeometry(0.35, 14, 10)
  if (type === 'blue-tang') {
    bodyGeo.scale(1.4, 1.2, 0.45)
  } else if (type === 'butterflyfish') {
    bodyGeo.scale(1.1, 1.45, 0.35)
  } else if (type === 'distant') {
    bodyGeo.scale(1.3, 0.8, 0.4)
  } else {
    // Clownfish
    bodyGeo.scale(1.5, 0.9, 0.5)
  }

  // Tail / Caudal fin
  const tailShape = new THREE.Shape()
  tailShape.moveTo(0, 0)
  tailShape.quadraticCurveTo(0.28, 0.28, 0.42, 0.38)
  tailShape.quadraticCurveTo(0.32, 0, 0.42, -0.38)
  tailShape.quadraticCurveTo(0.28, -0.28, 0, 0)
  const tailGeo = new THREE.ShapeGeometry(tailShape)
  tailGeo.scale(0.8, 0.8, 0.8)

  // Dorsal fin
  const dorsalShape = new THREE.Shape()
  dorsalShape.moveTo(-0.25, 0)
  dorsalShape.quadraticCurveTo(-0.05, 0.26, 0.2, 0.2)
  dorsalShape.quadraticCurveTo(0.28, 0.05, 0.24, 0)
  dorsalShape.closePath()
  const dorsalGeo = new THREE.ShapeGeometry(dorsalShape)

  // Pectoral fin
  const finShape = new THREE.Shape()
  finShape.moveTo(0, 0)
  finShape.quadraticCurveTo(0.12, 0.14, 0.24, 0.04)
  finShape.quadraticCurveTo(0.14, -0.09, 0, 0)
  const finGeo = new THREE.ShapeGeometry(finShape)

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.055, 6, 6)
  const pupilGeo = new THREE.SphereGeometry(0.03, 6, 6)

  return { bodyGeo, tailGeo, dorsalGeo, finGeo, eyeGeo, pupilGeo }
}

/**
 * Creates materials for foreground/midground tropical species and distant silhouette fish.
 */
function createFishMaterials(type: FishType, isBackground: boolean) {
  if (isBackground) {
    // Subtle, low-contrast silhouette material for distant fish
    const distantMat = new THREE.MeshStandardMaterial({
      color: '#0D3B66',
      roughness: 0.8,
      metalness: 0.1,
      transparent: true,
      opacity: 0.65,
    })
    return {
      bodyMat: distantMat,
      stripeMat: distantMat,
      finMat: distantMat,
      eyeWhiteMat: distantMat,
      eyePupilMat: distantMat,
    }
  }

  let bodyColor = '#FF6F00' // Clownfish orange
  let stripeColor = '#FFFFFF'
  let finColor = '#FF6F00'
  let roughness = 0.3

  if (type === 'blue-tang') {
    bodyColor = '#1565C0' // Royal marine blue
    stripeColor = '#FFD54F'
    finColor = '#FFCA28'
    roughness = 0.25
  } else if (type === 'butterflyfish') {
    bodyColor = '#FFD54F' // Golden yellow
    stripeColor = '#FFFFFF'
    finColor = '#FFE082'
    roughness = 0.3
  }

  const bodyMat = new THREE.MeshStandardMaterial({
    color: bodyColor,
    roughness,
    metalness: 0.1,
  })

  const stripeMat = new THREE.MeshStandardMaterial({
    color: stripeColor,
    roughness: 0.35,
    side: THREE.DoubleSide,
  })

  const finMat = new THREE.MeshStandardMaterial({
    color: finColor,
    roughness: 0.4,
    transparent: true,
    opacity: 0.88,
    side: THREE.DoubleSide,
  })

  const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: '#FFFFFF' })
  const eyePupilMat = new THREE.MeshBasicMaterial({ color: '#111111' })

  return { bodyMat, stripeMat, finMat, eyeWhiteMat, eyePupilMat }
}

interface SingleFishProps {
  data: FishInstance
  reducedMotion: boolean
}

function SingleFish({ data, reducedMotion }: SingleFishProps) {
  const rootGroupRef = useRef<THREE.Group>(null!)
  const tailRef = useRef<THREE.Group>(null!)
  const leftFinRef = useRef<THREE.Group>(null!)
  const rightFinRef = useRef<THREE.Group>(null!)

  const timeOffset = useMemo(() => data.id * 1.618, [data.id])
  const angleRef = useRef(data.pathAngle)

  const { bodyGeo, tailGeo, dorsalGeo, finGeo, eyeGeo, pupilGeo } = useMemo(
    () => createFishGeometries(data.type),
    [data.type]
  )

  const { bodyMat, stripeMat, finMat, eyeWhiteMat, eyePupilMat } = useMemo(
    () => createFishMaterials(data.type, data.isBackground),
    [data.type, data.isBackground]
  )

  useFrame((_, delta) => {
    if (!rootGroupRef.current) return

    // Slow, natural gliding trajectory
    if (!reducedMotion) {
      angleRef.current += (data.baseSpeed + Math.sin(angleRef.current * 1.5) * data.speedVariance) * delta
    }

    const a = angleRef.current
    const posX = data.centerPos.x + Math.sin(a) * data.radiusX
    const posZ = data.centerPos.z + Math.cos(a) * data.radiusZ
    const posY = data.yBase + Math.sin(a * data.yFrequency + timeOffset) * data.yAmplitude

    // Orientation tangent
    const nextA = a + 0.04
    const nextX = data.centerPos.x + Math.sin(nextA) * data.radiusX
    const nextZ = data.centerPos.z + Math.cos(nextA) * data.radiusZ

    const heading = Math.atan2(nextX - posX, nextZ - posZ)
    const pitch = (Math.cos(a * data.yFrequency + timeOffset) * data.yAmplitude) * 0.12
    const roll = Math.sin(a) * 0.08 // Subtle banking on turns

    rootGroupRef.current.position.set(posX, posY, posZ)
    rootGroupRef.current.rotation.set(pitch, heading, roll)

    // Tail fin natural wave
    if (tailRef.current && !reducedMotion) {
      const tailWiggle = Math.sin(a * data.swimFreq + timeOffset) * 0.3
      tailRef.current.rotation.y = tailWiggle
    }

    // Pectoral fins flutter
    if (!data.isBackground && leftFinRef.current && rightFinRef.current && !reducedMotion) {
      const finFlap = Math.sin(a * data.swimFreq * 1.1 + timeOffset) * 0.22
      leftFinRef.current.rotation.z = -0.25 + finFlap
      rightFinRef.current.rotation.z = 0.25 - finFlap
    }
  })

  return (
    <group ref={rootGroupRef} scale={data.scale}>
      {/* Main body */}
      <mesh geometry={bodyGeo} material={bodyMat} />

      {/* Decorative stripes for foreground clownfish */}
      {!data.isBackground && data.type === 'clownfish' && (
        <>
          <mesh position={[0.02, 0, 0]} scale={[0.18, 0.94, 0.52]}>
            <sphereGeometry args={[0.35, 14, 10]} />
            <primitive object={stripeMat} attach="material" />
          </mesh>
          <mesh position={[0.2, 0, 0]} scale={[0.15, 0.86, 0.48]}>
            <sphereGeometry args={[0.35, 14, 10]} />
            <primitive object={stripeMat} attach="material" />
          </mesh>
        </>
      )}

      {/* Dorsal fin */}
      <mesh
        geometry={dorsalGeo}
        material={finMat}
        position={[-0.05, 0.24, 0]}
      />

      {/* Tail fin */}
      <group ref={tailRef} position={[-0.42, 0, 0]}>
        <mesh
          geometry={tailGeo}
          material={finMat}
          position={[-0.22, 0, 0]}
          rotation={[0, Math.PI, 0]}
        />
      </group>

      {/* Pectoral fins for foreground fish */}
      {!data.isBackground && (
        <>
          <group ref={leftFinRef} position={[0.14, -0.04, 0.15]} rotation={[0.2, 0.35, -0.25]}>
            <mesh geometry={finGeo} material={finMat} />
          </group>
          <group ref={rightFinRef} position={[0.14, -0.04, -0.15]} rotation={[-0.2, -0.35, 0.25]}>
            <mesh geometry={finGeo} material={finMat} />
          </group>

          {/* Eyes */}
          <mesh geometry={eyeGeo} material={eyeWhiteMat} position={[0.3, 0.07, 0.13]} />
          <mesh geometry={pupilGeo} material={eyePupilMat} position={[0.33, 0.07, 0.15]} />
          <mesh geometry={eyeGeo} material={eyeWhiteMat} position={[0.3, 0.07, -0.13]} />
          <mesh geometry={pupilGeo} material={eyePupilMat} position={[0.33, 0.07, -0.15]} />
        </>
      )}
    </group>
  )
}

const FOREGROUND_SPECIES: FishType[] = ['clownfish', 'blue-tang', 'butterflyfish']

export function Fish({ count = 4, reducedMotion = false }: FishProps) {
  const fishList = useMemo<FishInstance[]>(() => {
    const list: FishInstance[] = []

    // 1. Foreground / Midground fish (larger, detailed, slow swim)
    const fgCount = Math.max(1, Math.min(count, 3))
    for (let i = 0; i < fgCount; i++) {
      const type = FOREGROUND_SPECIES[i % FOREGROUND_SPECIES.length]
      list.push({
        id: i,
        type,
        isBackground: false,
        baseSpeed: 0.25 + pseudoRandom(i * 7 + 1) * 0.15, // Slow, natural
        speedVariance: 0.06,
        radiusX: 3.6 + pseudoRandom(i * 7 + 2) * 2.2,
        radiusZ: 1.8 + pseudoRandom(i * 7 + 3) * 1.4,
        centerPos: new THREE.Vector3(
          (pseudoRandom(i * 7 + 4) - 0.5) * 3.5,
          -0.2 + (pseudoRandom(i * 7 + 5) - 0.5) * 2.2,
          -1.5 + (pseudoRandom(i * 7 + 6) - 0.5) * 1.5
        ),
        pathAngle: pseudoRandom(i * 7 + 7) * Math.PI * 2,
        yBase: -0.2 + (pseudoRandom(i * 7 + 8) - 0.5) * 1.8,
        yAmplitude: 0.25 + pseudoRandom(i * 7 + 9) * 0.2,
        yFrequency: 1.2 + pseudoRandom(i * 7 + 10) * 0.8,
        swimFreq: 5.5 + pseudoRandom(i * 7 + 11) * 2.0,
        scale: 0.85 + pseudoRandom(i * 7 + 12) * 0.25,
      })
    }

    // 2. Distant / Background fish (smaller, subtle, deep z: -4.5 to -7.5)
    const bgCount = 2
    for (let i = 0; i < bgCount; i++) {
      const idx = fgCount + i
      list.push({
        id: idx,
        type: 'distant',
        isBackground: true,
        baseSpeed: 0.18 + pseudoRandom(idx * 7 + 1) * 0.1,
        speedVariance: 0.04,
        radiusX: 5.0 + pseudoRandom(idx * 7 + 2) * 2.5,
        radiusZ: 2.5 + pseudoRandom(idx * 7 + 3) * 1.8,
        centerPos: new THREE.Vector3(
          (pseudoRandom(idx * 7 + 4) - 0.5) * 5.0,
          0.4 + (pseudoRandom(idx * 7 + 5) - 0.5) * 2.0,
          -5.5 + (pseudoRandom(idx * 7 + 6) - 0.5) * 2.0
        ),
        pathAngle: pseudoRandom(idx * 7 + 7) * Math.PI * 2,
        yBase: 0.2 + (pseudoRandom(idx * 7 + 8) - 0.5) * 1.5,
        yAmplitude: 0.15 + pseudoRandom(idx * 7 + 9) * 0.15,
        yFrequency: 0.9 + pseudoRandom(idx * 7 + 10) * 0.6,
        swimFreq: 4.5 + pseudoRandom(idx * 7 + 11) * 1.5,
        scale: 0.38 + pseudoRandom(idx * 7 + 12) * 0.15, // Small distant scale
      })
    }

    return list
  }, [count])

  return (
    <group>
      {fishList.map((fish) => (
        <SingleFish key={fish.id} data={fish} reducedMotion={reducedMotion} />
      ))}
    </group>
  )
}

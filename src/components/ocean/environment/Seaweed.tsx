'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SeaweedProps {
  count?: number
  reducedMotion?: boolean
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

/**
 * Procedurally generates a tapered, curved 3D organic kelp blade geometry.
 */
function createOrganicBladeGeometry(
  height: number,
  baseWidth: number,
  bendAmp: number,
  bendPhase: number,
  bowAmp: number,
  segments: number = 24
): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry()
  const vertexCount = (segments + 1) * 2
  const positions = new Float32Array(vertexCount * 3)
  const uvs = new Float32Array(vertexCount * 2)
  const heightNorms = new Float32Array(vertexCount)
  const indices: number[] = []

  for (let i = 0; i <= segments; i++) {
    const t = i / segments // 0 (root) to 1 (tip)
    const y = t * height

    // Organic width tapering:
    // Narrow at root (0.4), swells at lower-mid (1.0), tapers to slender tip (0.08)
    const widthFactor =
      t < 0.2
        ? 0.4 + (t / 0.2) * 0.6
        : Math.pow(1.0 - (t - 0.2) / 0.8, 1.2) * 0.92 + 0.08
    const halfW = (baseWidth * widthFactor) / 2

    // Natural static S-curve spine
    const spineX = Math.sin(t * Math.PI * 1.15 + bendPhase) * bendAmp * t
    const spineZ = Math.sin(t * Math.PI * 0.85) * bowAmp * t

    const idxLeft = i * 2
    const idxRight = i * 2 + 1

    // Left vertex
    positions[idxLeft * 3]     = spineX - halfW
    positions[idxLeft * 3 + 1] = y
    positions[idxLeft * 3 + 2] = spineZ

    uvs[idxLeft * 2]     = 0.0
    uvs[idxLeft * 2 + 1] = t
    heightNorms[idxLeft] = t

    // Right vertex
    positions[idxRight * 3]     = spineX + halfW
    positions[idxRight * 3 + 1] = y
    positions[idxRight * 3 + 2] = spineZ

    uvs[idxRight * 2]     = 1.0
    uvs[idxRight * 2 + 1] = t
    heightNorms[idxRight] = t

    // Build quad indices
    if (i < segments) {
      const v0 = i * 2
      const v1 = i * 2 + 1
      const v2 = (i + 1) * 2
      const v3 = (i + 1) * 2 + 1

      indices.push(v0, v2, v1)
      indices.push(v1, v2, v3)
    }
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geo.setAttribute('aHeightNorm', new THREE.BufferAttribute(heightNorms, 1))
  geo.setIndex(indices)
  geo.computeVertexNormals()

  return geo
}

const vertexShader = `
  uniform float uTime;
  attribute float aHeightNorm;
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aFlexibility;
  varying vec2 vUv;
  varying float vHeight;

  void main() {
    vUv = uv;
    vHeight = aHeightNorm;
    vec3 pos = position;

    // Organic current swaying with non-linear height lag
    float hLag = pow(aHeightNorm, 1.75);
    float waveX1 = sin(uTime * aSpeed + aPhase) * 0.42;
    float waveX2 = cos(uTime * (aSpeed * 0.58) + aPhase * 1.3) * 0.22;
    float waveZ  = cos(uTime * (aSpeed * 0.82) + aPhase) * 0.2;

    pos.x += (waveX1 + waveX2) * hLag * aFlexibility;
    pos.z += waveZ * hLag * aFlexibility;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform vec3 uBaseColor;
  uniform vec3 uMidColor;
  uniform vec3 uTipColor;
  varying vec2 vUv;
  varying float vHeight;

  void main() {
    // 3-stop rich tropical kelp gradient (Deep root -> Jade blade -> Luminous sea green tip)
    vec3 color = vHeight < 0.45
      ? mix(uBaseColor, uMidColor, vHeight / 0.45)
      : mix(uMidColor, uTipColor, (vHeight - 0.45) / 0.55);

    // Soft edge feathering for organic contour
    float edgeFeather = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);
    float tipFeather = smoothstep(1.0, 0.94, vHeight);

    float alpha = (0.8 + vHeight * 0.18) * edgeFeather * tipFeather;
    gl_FragColor = vec4(color, alpha);
  }
`

interface BladeConfig {
  x: number
  z: number
  height: number
  width: number
  bendAmp: number
  bendPhase: number
  bowAmp: number
  phase: number
  speed: number
  flexibility: number
  rotY: number
}

export function Seaweed({ count = 11, reducedMotion = false }: SeaweedProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const timeRef = useRef(0)

  // Natural cluster configuration (Left Grove & Right Kelp Bed)
  const bladeConfigs = useMemo<BladeConfig[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const isLeft = i % 2 === 0
      const side = isLeft ? -1 : 1
      // Clustered strictly in left/right margins away from center UI
      const baseDistance = 3.8 + pseudoRandom(i * 7 + 1) * 2.2
      const x = side * baseDistance
      const z = -1.2 + (pseudoRandom(i * 7 + 2) - 0.5) * 3.4
      const height = 2.4 + pseudoRandom(i * 7 + 3) * 2.2
      const width = 0.28 + pseudoRandom(i * 7 + 4) * 0.12

      return {
        x,
        z,
        height,
        width,
        bendAmp: (pseudoRandom(i * 7 + 5) - 0.5) * 0.45,
        bendPhase: pseudoRandom(i * 7 + 6) * Math.PI * 2,
        bowAmp: (pseudoRandom(i * 7 + 7) - 0.5) * 0.35,
        phase: pseudoRandom(i * 7 + 8) * Math.PI * 2,
        speed: 0.6 + pseudoRandom(i * 7 + 9) * 0.4,
        flexibility: 0.75 + pseudoRandom(i * 7 + 10) * 0.4,
        rotY: pseudoRandom(i * 7 + 11) * Math.PI,
      }
    })
  }, [count])

  // Generate unique geometry per blade with custom vertex attributes
  const geometries = useMemo(() => {
    return bladeConfigs.map((cfg) => {
      const geo = createOrganicBladeGeometry(
        cfg.height,
        cfg.width,
        cfg.bendAmp,
        cfg.bendPhase,
        cfg.bowAmp,
        22
      )

      const vertexCount = geo.attributes.position.count
      const phases = new Float32Array(vertexCount).fill(cfg.phase)
      const speeds = new Float32Array(vertexCount).fill(cfg.speed)
      const flexs = new Float32Array(vertexCount).fill(cfg.flexibility)

      geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))
      geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
      geo.setAttribute('aFlexibility', new THREE.BufferAttribute(flexs, 1))

      return geo
    })
  }, [bladeConfigs])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBaseColor: { value: new THREE.Color('#003328') }, // Deep kelp teal root
      uMidColor:  { value: new THREE.Color('#0A6E56') }, // Jade kelp body
      uTipColor:  { value: new THREE.Color('#38D8B8') }, // Luminous sea green tip
    }),
    []
  )

  useFrame((_, delta) => {
    if (reducedMotion || !materialRef.current) return
    timeRef.current += delta
    materialRef.current.uniforms.uTime.value = timeRef.current
  })

  return (
    <group position={[0, -5.2, 0]}>
      {bladeConfigs.map((cfg, idx) => (
        <mesh
          key={idx}
          geometry={geometries[idx]}
          position={[cfg.x, 0, cfg.z]}
          rotation={[0, cfg.rotY, 0]}
        >
          <shaderMaterial
            ref={idx === 0 ? materialRef : undefined}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            side={THREE.DoubleSide}
            transparent
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

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

const vertexShader = `
  uniform float uTime;
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aFlexibility;
  varying vec2 vUv;
  varying float vHeightNorm;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Organic current swaying: non-linear height lag with multi-frequency waves
    float heightFactor = pow(clamp(uv.y, 0.0, 1.0), 1.6);
    float wave1 = sin(uTime * aSpeed + aPhase) * 0.38;
    float wave2 = cos(uTime * (aSpeed * 0.65) + aPhase * 1.3) * 0.22;
    float swayX = (wave1 + wave2) * heightFactor * aFlexibility;
    float swayZ = cos(uTime * (aSpeed * 0.8) + aPhase) * 0.18 * heightFactor;

    pos.x += swayX;
    pos.z += swayZ;

    vHeightNorm = uv.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform vec3 uBaseColor;
  uniform vec3 uTipColor;
  varying vec2 vUv;
  varying float vHeightNorm;

  void main() {
    // Rich gradient from deep marine kelp teal to sunlit translucent sea green
    vec3 color = mix(uBaseColor, uTipColor, vHeightNorm);
    float alpha = 0.82 + vHeightNorm * 0.15;
    gl_FragColor = vec4(color, alpha);
  }
`

interface BladeData {
  x: number
  z: number
  height: number
  width: number
  phase: number
  speed: number
  flexibility: number
  rotationY: number
}

export function Seaweed({ count = 10, reducedMotion = false }: SeaweedProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const timeRef = useRef(0)

  const blades = useMemo<BladeData[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      // Cluster seaweed primarily on the outer edges (left & right)
      const side = i % 2 === 0 ? -1 : 1
      const xOffset = side * (3.8 + pseudoRandom(i * 5 + 1) * 2.8)
      return {
        x: xOffset,
        z: -1.6 + (pseudoRandom(i * 5 + 2) - 0.5) * 3.2,
        height: 2.6 + pseudoRandom(i * 5 + 3) * 1.8,
        width: 0.22 + pseudoRandom(i * 5 + 4) * 0.12,
        phase: pseudoRandom(i * 5 + 5) * Math.PI * 2,
        speed: 0.7 + pseudoRandom(i * 5 + 6) * 0.5,
        flexibility: 0.8 + pseudoRandom(i * 5 + 7) * 0.4,
        rotationY: pseudoRandom(i * 5 + 8) * Math.PI,
      }
    })
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBaseColor: { value: new THREE.Color('#003D33') }, // Deep kelp teal
      uTipColor: { value: new THREE.Color('#26A69A') },  // Luminous sea green
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
      {blades.map((blade, idx) => (

        <mesh
          key={idx}
          position={[blade.x, blade.height / 2, blade.z]}
          rotation={[0, blade.rotationY, 0]}
        >
          <planeGeometry args={[blade.width, blade.height, 4, 16]} />
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

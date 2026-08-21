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
  attribute float aHeight;
  varying vec2 vUv;
  varying float vHeightNorm;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Fixed base, organic current sway increasing along height
    float heightFactor = pow(clamp(uv.y, 0.0, 1.0), 1.4);
    float swayX = sin(uTime * 1.1 + aPhase) * 0.32 * heightFactor;
    float swayZ = cos(uTime * 0.8 + aPhase * 0.7) * 0.22 * heightFactor;

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
    // Gradient from deep ocean kelp green to translucent sea emerald
    vec3 color = mix(uBaseColor, uTipColor, vHeightNorm);
    float alpha = 0.85 + vHeightNorm * 0.12;
    gl_FragColor = vec4(color, alpha);
  }
`

interface BladeData {
  x: number
  z: number
  height: number
  width: number
  phase: number
  rotationY: number
}

export function Seaweed({ count = 10, reducedMotion = false }: SeaweedProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const timeRef = useRef(0)

  const blades = useMemo<BladeData[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      // Cluster seaweed groves on left and right sides
      const side = i % 2 === 0 ? -1 : 1
      const xOffset = side * (3.2 + pseudoRandom(i * 5 + 1) * 3.2)
      return {
        x: xOffset,
        z: -1.8 + (pseudoRandom(i * 5 + 2) - 0.5) * 3.5,
        height: 2.4 + pseudoRandom(i * 5 + 3) * 1.6,
        width: 0.2 + pseudoRandom(i * 5 + 4) * 0.12,
        phase: pseudoRandom(i * 5 + 5) * Math.PI * 2,
        rotationY: pseudoRandom(i * 5 + 6) * Math.PI,
      }
    })
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBaseColor: { value: new THREE.Color('#004D40') }, // Deep teal/kelp
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
    <group position={[0, -4.5, 0]}>
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

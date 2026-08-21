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
  attribute float aCurvature;
  varying vec2 vUv;
  varying float vHeightNorm;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // 1. Organic Tapering: Wider at root, organically tapering to a slender curved tip
    float taper = 1.0 - pow(uv.y, 1.3) * 0.7;
    // 2. Static natural biological curvature curve
    float staticCurve = sin(uv.y * 3.14159 * 0.7) * aCurvature;
    pos.x = (pos.x + staticCurve) * taper;

    // 3. Dynamic current swaying with height lag
    float heightFactor = pow(clamp(uv.y, 0.0, 1.0), 1.6);
    float wave1 = sin(uTime * aSpeed + aPhase) * 0.35;
    float wave2 = cos(uTime * (aSpeed * 0.6) + aPhase * 1.3) * 0.2;
    float swayX = (wave1 + wave2) * heightFactor * aFlexibility;
    float swayZ = cos(uTime * (aSpeed * 0.75) + aPhase) * 0.16 * heightFactor;

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
    
    // Soft organic edge & tip shaping (eliminates rectangular plane edges)
    float tipShape = smoothstep(1.0, 0.85, vHeightNorm);
    float edgeShape = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
    
    float alpha = (0.75 + vHeightNorm * 0.2) * tipShape * edgeShape;
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
  curvature: number
  rotationY: number
}

export function Seaweed({ count = 10, reducedMotion = false }: SeaweedProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const timeRef = useRef(0)

  const blades = useMemo<BladeData[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      // Cluster seaweed strictly on the outer margins (left & right framing)
      const side = i % 2 === 0 ? -1 : 1
      const xOffset = side * (4.0 + pseudoRandom(i * 5 + 1) * 2.6)
      return {
        x: xOffset,
        z: -1.6 + (pseudoRandom(i * 5 + 2) - 0.5) * 3.0,
        height: 2.8 + pseudoRandom(i * 5 + 3) * 1.8,
        width: 0.32 + pseudoRandom(i * 5 + 4) * 0.12,
        phase: pseudoRandom(i * 5 + 5) * Math.PI * 2,
        speed: 0.65 + pseudoRandom(i * 5 + 6) * 0.45,
        flexibility: 0.75 + pseudoRandom(i * 5 + 7) * 0.4,
        curvature: (pseudoRandom(i * 5 + 8) - 0.5) * 0.35,
        rotationY: pseudoRandom(i * 5 + 9) * Math.PI,
      }
    })
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBaseColor: { value: new THREE.Color('#004236') }, // Deep kelp teal
      uTipColor: { value: new THREE.Color('#2BBBAD') },  // Luminous sea green tip
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

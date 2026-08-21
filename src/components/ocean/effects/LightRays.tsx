'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface LightRaysProps {
  count?: number
  reducedMotion?: boolean
}

const vertexShader = `
  uniform float uTime;
  attribute float aSpeed;
  attribute float aPhase;
  varying vec2 vUv;
  varying float vIntensity;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Gentle lateral drift with current
    float sway = sin(uTime * aSpeed * 0.5 + aPhase) * 0.35 * (1.0 - uv.y);
    pos.x += sway;

    vIntensity = 0.7 + 0.3 * sin(uTime * aSpeed + aPhase);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform vec3 uColor;
  varying vec2 vUv;
  varying float vIntensity;

  void main() {
    // Smooth vertical falloff from ocean surface downward
    float verticalFade = pow(vUv.y, 1.6);
    
    // Soft horizontal beam falloff (Gaussian-like curve across width)
    float horizontalFade = sin(vUv.x * 3.14159265);
    horizontalFade = pow(horizontalFade, 1.8);

    float alpha = verticalFade * horizontalFade * vIntensity * 0.14;
    gl_FragColor = vec4(uColor, alpha);
  }
`

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function LightRays({ count = 4, reducedMotion = false }: LightRaysProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const timeRef = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#7FE7FC') },
    }),
    []
  )

  const rayInstances = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const x = (i - (count - 1) / 2) * 2.8 + (pseudoRandom(i * 5 + 1) - 0.5) * 1.2
      const z = -2.5 + (pseudoRandom(i * 5 + 2) - 0.5) * 2.0
      const width = 1.4 + pseudoRandom(i * 5 + 3) * 1.0
      const height = 12 + pseudoRandom(i * 5 + 4) * 4
      const tiltZ = (pseudoRandom(i * 5 + 5) - 0.5) * 0.15
      const speed = 0.3 + pseudoRandom(i * 5 + 6) * 0.3
      const phase = pseudoRandom(i * 5 + 7) * Math.PI * 2

      return { x, z, width, height, tiltZ, speed, phase }
    })
  }, [count])

  useFrame((_, delta) => {
    if (reducedMotion || !materialRef.current) return
    timeRef.current += delta
    materialRef.current.uniforms.uTime.value = timeRef.current
  })

  return (
    <group position={[0, 4.5, 0]}>
      {rayInstances.map((ray, i) => (
        <mesh
          key={i}
          position={[ray.x, -ray.height / 2, ray.z]}
          rotation={[0, 0, ray.tiltZ]}
        >
          <planeGeometry args={[ray.width, ray.height, 4, 8]} />
          <shaderMaterial
            ref={i === 0 ? materialRef : undefined}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

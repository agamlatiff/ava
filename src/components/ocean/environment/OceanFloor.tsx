'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface OceanFloorProps {
  reducedMotion?: boolean
}

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uSandColor;
  uniform vec3 uCausticColor;
  varying vec2 vUv;
  varying vec3 vWorldPos;

  // Procedural Voronoi-like caustic wave interference
  float causticPattern(vec2 uv, float time) {
    vec2 p = uv * 6.0;
    float c1 = sin(p.x * 1.4 + time * 0.8) * cos(p.y * 1.2 - time * 0.7);
    float c2 = sin(p.x * 2.2 - time * 0.6 + c1) * cos(p.y * 2.0 + time * 0.9);
    float c3 = sin((p.x + p.y) * 1.8 + time * 0.5 + c2);
    float pattern = pow((c1 + c2 + c3) / 3.0 * 0.5 + 0.5, 3.0);
    return clamp(pattern * 2.2, 0.0, 1.0);
  }

  void main() {
    float caustics = causticPattern(vUv, uTime);

    // Distance fade towards back of scene (depth fog blend)
    float depthFade = smoothstep(12.0, -2.0, vWorldPos.z);
    
    // Sandy base with caustics modulation
    vec3 color = mix(uSandColor, uCausticColor, caustics * 0.45);

    // Deep ocean distance blend
    vec3 deepWater = vec3(0.024, 0.125, 0.25);
    color = mix(deepWater, color, depthFade);

    gl_FragColor = vec4(color, 0.92);
  }
`

export function OceanFloor({ reducedMotion = false }: OceanFloorProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const timeRef = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSandColor: { value: new THREE.Color('#0A3A68') },
      uCausticColor: { value: new THREE.Color('#4DD0E1') },
    }),
    []
  )

  useFrame((_, delta) => {
    if (reducedMotion || !materialRef.current) return
    timeRef.current += delta
    materialRef.current.uniforms.uTime.value = timeRef.current
  })

  return (
    <mesh position={[0, -4.5, -2]} rotation={[-Math.PI / 2 + 0.1, 0, 0]}>
      <planeGeometry args={[32, 24, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleFieldProps {
  count: number
  reducedMotion?: boolean
}

const vertexShader = /* glsl */`
  attribute float aOpacity;
  attribute float aOffset;
  varying float vOpacity;
  uniform float uTime;

  void main() {
    vOpacity = aOpacity;
    vec3 pos = position;

    if (uTime > 0.0) {
      pos.y += sin(uTime * 0.08 + aOffset) * 0.03;
      pos.x += cos(uTime * 0.06 + aOffset * 0.7) * 0.015;
    }

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = mix(2.0, 4.0, aOpacity) * (300.0 / -mvPosition.z);
  }
`

const fragmentShader = /* glsl */`
  varying float vOpacity;
  uniform vec3 uColor;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, dist) * vOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`

export function ParticleField({ count, reducedMotion = false }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null!)
  const timeRef = useRef(0)

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const opacities = new Float32Array(count)
    const offsets = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6

      opacities[i] = 0.1 + Math.random() * 0.2
      offsets[i] = Math.random() * Math.PI * 2
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1))
    geo.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 1))

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime:  { value: 0 },
        uColor: { value: new THREE.Color('#4DD0E1') },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { geometry: geo, material: mat }
  }, [count])

  useFrame((state) => {
    if (reducedMotion) return
    material.uniforms.uTime.value = state.clock.elapsedTime
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}

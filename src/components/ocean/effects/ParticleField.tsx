'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  uniform float uTime;
  attribute float aScale;
  attribute float aSpeed;
  attribute float aOffset;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    // Gentle floating particle motion
    pos.y += sin(uTime * aSpeed + aOffset) * 0.3;
    pos.x += cos(uTime * aSpeed * 0.7 + aOffset) * 0.2;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Attenuate size with depth
    gl_PointSize = aScale * (150.0 / -mvPosition.z);
    vAlpha = smoothstep(-6.0, 4.0, pos.y) * 0.6;
  }
`

const fragmentShader = `
  varying float vAlpha;

  void main() {
    // Soft circular particle
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
    gl_FragColor = vec4(0.5, 0.85, 1.0, alpha);
  }
`

interface ParticleFieldProps {
  count: number
  reducedMotion?: boolean
}

export function ParticleField({ count, reducedMotion = false }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null!)
  const timeRef = useRef(0)

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const speeds = new Float32Array(count)
    const offsets = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 12
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1

      scales[i]  = 0.5 + Math.random() * 1.5
      speeds[i]  = 0.3 + Math.random() * 0.7
      offsets[i] = Math.random() * Math.PI * 2
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aScale',   new THREE.BufferAttribute(scales, 1))
    geo.setAttribute('aSpeed',   new THREE.BufferAttribute(speeds, 1))
    geo.setAttribute('aOffset',  new THREE.BufferAttribute(offsets, 1))

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { geometry: geo, material: mat }
  }, [count])

  useFrame((_, delta) => {
    if (reducedMotion) return
    timeRef.current += delta
    material.uniforms.uTime.value = timeRef.current
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}

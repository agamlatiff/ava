'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { oceanState } from '../hooks/globalOceanState'

const vertexShader = `
  uniform float uTime;
  uniform float uCurrentDrift;
  attribute float aScale;
  attribute float aSpeed;
  attribute float aOffset;
  attribute float aDepthFactor;
  varying float vAlpha;
  varying float vDepth;

  void main() {
    vec3 pos = position;

    // Subtle global underwater current drift (lateral + vertical surge)
    float currentSwayX = sin(uTime * 0.3 + aOffset) * 0.4 + cos(uTime * aSpeed * 0.5 + aOffset) * 0.2;
    float currentSwayY = cos(uTime * 0.25 + aOffset) * 0.3;
    float currentSwayZ = sin(uTime * 0.2 + aOffset * 1.5) * 0.2;

    pos.x += currentSwayX + uCurrentDrift * 6.0;
    pos.y += currentSwayY;
    pos.z += currentSwayZ;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Attenuate point size with camera distance
    gl_PointSize = aScale * (140.0 / -mvPosition.z);
    
    // Depth-based opacity (distant particles are softer and dimmer)
    vDepth = aDepthFactor;
    float pulse = 0.7 + 0.3 * sin(uTime * aSpeed + aOffset);
    vAlpha = smoothstep(-6.0, 4.0, pos.y) * aDepthFactor * pulse * 0.55;
  }
`

const fragmentShader = `
  varying float vAlpha;
  varying float vDepth;

  void main() {
    // Soft Gaussian particle dot (no harsh square edges)
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float softCircle = smoothstep(0.5, 0.05, dist);

    // Warm cyan-bioluminescent tint for foreground, deep azure for background
    vec3 color = mix(vec3(0.35, 0.65, 0.95), vec3(0.55, 0.92, 1.0), vDepth);
    gl_FragColor = vec4(color, softCircle * vAlpha);
  }
`

interface ParticleFieldProps {
  count: number
  reducedMotion?: boolean
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function ParticleField({ count, reducedMotion = false }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null!)
  const timeRef = useRef(0)

  // Use restrained count for sparse, elegant underwater particles
  const activeCount = Math.max(16, Math.min(count, 48))

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(activeCount * 3)
    const scales = new Float32Array(activeCount)
    const speeds = new Float32Array(activeCount)
    const offsets = new Float32Array(activeCount)
    const depthFactors = new Float32Array(activeCount)

    for (let i = 0; i < activeCount; i++) {
      const z = (pseudoRandom(i * 5 + 3) - 0.5) * 8 - 3 // z from -7 to +1
      positions[i * 3]     = (pseudoRandom(i * 5 + 1) - 0.5) * 14
      positions[i * 3 + 1] = (pseudoRandom(i * 5 + 2) - 0.5) * 10
      positions[i * 3 + 2] = z

      // Distant particles are smaller and less opaque
      const depthNorm = Math.max(0.2, (z + 7) / 8) // 0 (far) to 1 (near)
      scales[i]       = 0.4 + pseudoRandom(i * 5 + 4) * 1.2 * depthNorm
      speeds[i]       = 0.2 + pseudoRandom(i * 5 + 5) * 0.4
      offsets[i]      = pseudoRandom(i * 5 + 6) * Math.PI * 2
      depthFactors[i] = 0.3 + depthNorm * 0.7
    }

    geo.setAttribute('position',     new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aScale',       new THREE.BufferAttribute(scales, 1))
    geo.setAttribute('aSpeed',       new THREE.BufferAttribute(speeds, 1))
    geo.setAttribute('aOffset',      new THREE.BufferAttribute(offsets, 1))
    geo.setAttribute('aDepthFactor', new THREE.BufferAttribute(depthFactors, 1))

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uCurrentDrift: { value: 0 }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { geometry: geo, material: mat }
  }, [activeCount])

  useFrame((_, delta) => {
    if (reducedMotion || !pointsRef.current) return
    timeRef.current += delta
    const mat = pointsRef.current.material as THREE.ShaderMaterial
    if (mat?.uniforms?.uTime) {
      mat.uniforms.uTime.value = timeRef.current
      mat.uniforms.uCurrentDrift.value = oceanState.currentDrift
    }
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}

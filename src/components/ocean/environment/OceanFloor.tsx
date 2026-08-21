'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface OceanFloorProps {
  reducedMotion?: boolean
}

const vertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // 1. Organic seabed bowl / amphitheater:
    // Left & right peripheral reef shelves rise gently, center dips deeper for UI breathing room
    float sideShelf = smoothstep(1.5, 14.0, abs(pos.x)) * 1.6;
    
    // 2. Rolling organic dunes & multi-frequency ripples
    float dune1 = sin(pos.x * 0.14 + pos.y * 0.1) * 0.7;
    float dune2 = cos(pos.x * 0.25 - pos.y * 0.18) * 0.4;
    float dune3 = sin((pos.x + pos.y) * 0.38) * 0.22;
    
    // 3. Gentle slope dipping into deep background water
    float distanceSlope = smoothstep(2.0, 32.0, -pos.y) * -2.8;
    
    float totalElevation = sideShelf + dune1 + dune2 + dune3 + distanceSlope;
    pos.z += totalElevation;
    vElevation = totalElevation;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uSandBase;
  uniform vec3 uSandRidge;
  uniform vec3 uCausticColor;
  uniform vec3 uWaterFog;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying float vElevation;

  // Very subtle, subconscious caustics (low contrast, soft wave shimmer)
  float subtleCaustics(vec2 p, float time) {
    vec2 uv = p * 3.2;
    float c1 = sin(uv.x * 1.3 + time * 0.45) * cos(uv.y * 1.1 - time * 0.4);
    float c2 = sin(uv.x * 1.8 - time * 0.35 + c1) * cos(uv.y * 1.6 + time * 0.5);
    float c3 = sin((uv.x + uv.y) * 1.4 + time * 0.3 + c2);
    float wave = pow((c1 + c2 + c3) / 3.0 * 0.5 + 0.5, 2.5);
    return clamp(wave * 1.5, 0.0, 1.0);
  }

  void main() {
    float caustics = subtleCaustics(vUv, uTime);

    // Dune elevation shading: sunlit ridges vs deeper blue-gray crevices
    float ridgeFactor = smoothstep(-1.0, 1.5, vElevation);
    vec3 sandColor = mix(uSandBase, uSandRidge, ridgeFactor * 0.45);
    
    // Low-contrast, subconscious caustic lighting
    vec3 litTerrain = mix(sandColor, uCausticColor, caustics * 0.18);

    // ─────────────────────────────────────────────────────────────
    // Seamless atmospheric depth & vertical water haze:
    // 1. Distance fog from camera
    // 2. Vertical depth haze (deeper water dissolves floor line)
    // ─────────────────────────────────────────────────────────────
    float dist = length(vWorldPos - cameraPosition);
    float distanceFog = smoothstep(6.0, 22.0, dist);
    
    // Radial boundary fade ensuring ZERO visible plane edges
    vec2 centerOffset = (vUv - vec2(0.5)) * 2.0;
    float radialEdge = smoothstep(1.0, 0.72, length(centerOffset));

    vec3 finalColor = mix(litTerrain, uWaterFog, distanceFog);
    float alpha = mix(0.0, 0.95, radialEdge) * (1.0 - distanceFog * 0.2);

    gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 0.95));
  }
`

export function OceanFloor({ reducedMotion = false }: OceanFloorProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const timeRef = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSandBase: { value: new THREE.Color('#0A3052') },     // Deep marine blue-gray
      uSandRidge: { value: new THREE.Color('#144E7E') },    // Subtle sunlit dune ridge
      uCausticColor: { value: new THREE.Color('#64D8EB') }, // Soft subconscious caustic light
      uWaterFog: { value: new THREE.Color('#05254A') },      // Atmospheric ocean fog
    }),
    []
  )

  useFrame((_, delta) => {
    if (reducedMotion || !materialRef.current) return
    timeRef.current += delta * 0.6
    materialRef.current.uniforms.uTime.value = timeRef.current
  })

  return (
    <mesh position={[0, -5.2, -6]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[72, 72, 64, 64]} />
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

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

    // 1. Organic natural amphitheater / canyon elevation:
    // Left & right margins rise gently to frame the corners, center dips deep for UI breathing room
    float sideRise = smoothstep(1.5, 12.0, abs(pos.x)) * 1.5;
    
    // 2. Rolling organic sand dunes & natural seabed variation (zero geometric lines)
    float dune1 = sin(pos.x * 0.16 + pos.y * 0.12) * 0.65;
    float dune2 = cos(pos.x * 0.28 - pos.y * 0.2) * 0.38;
    float dune3 = sin((pos.x + pos.y) * 0.42) * 0.2;
    
    // 3. Natural slope dipping smoothly deeper into the distance
    float distanceDip = smoothstep(1.0, 28.0, -pos.y) * -3.0;
    
    float totalElevation = sideRise + dune1 + dune2 + dune3 + distanceDip;
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
  uniform vec3 uWaterColor;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying float vElevation;

  // Very subtle, low-contrast subconscious caustics
  float subtleCaustics(vec2 p, float time) {
    vec2 uv = p * 3.0;
    float c1 = sin(uv.x * 1.2 + time * 0.4) * cos(uv.y * 1.0 - time * 0.35);
    float c2 = sin(uv.x * 1.7 - time * 0.3 + c1) * cos(uv.y * 1.5 + time * 0.45);
    float c3 = sin((uv.x + uv.y) * 1.3 + time * 0.25 + c2);
    float wave = pow((c1 + c2 + c3) / 3.0 * 0.5 + 0.5, 2.2);
    return clamp(wave * 1.4, 0.0, 1.0);
  }

  void main() {
    float caustics = subtleCaustics(vUv, uTime);

    // Dune ridge lighting modulation
    float ridgeFactor = smoothstep(-1.2, 1.2, vElevation);
    vec3 sandColor = mix(uSandBase, uSandRidge, ridgeFactor * 0.42);
    
    // Low-contrast, gentle caustic highlights
    vec3 litTerrain = mix(sandColor, uCausticColor, caustics * 0.14);

    // ─────────────────────────────────────────────────────────────
    // Seamless atmospheric depth dissolution (ZERO HORIZON LINE):
    // As the seabed extends into the distance, both color AND opacity
    // dissolve 100% continuously into the open water column.
    // ─────────────────────────────────────────────────────────────
    float dist = length(vWorldPos - cameraPosition);
    
    // Continuous distance fade: 1.0 in foreground (dist <= 5) -> 0.0 in midground (dist >= 15)
    float distanceFade = smoothstep(15.0, 5.0, dist);
    
    // Vertical fade: upper terrain heights blend into deep water
    float verticalFade = smoothstep(-3.8, -5.2, vWorldPos.y);

    // Radial edge falloff ensuring mesh boundary is 100% invisible
    vec2 centerOffset = (vUv - vec2(0.5)) * 2.0;
    float radialEdge = smoothstep(1.0, 0.65, length(centerOffset));

    // Combined continuous alpha
    float finalAlpha = distanceFade * verticalFade * radialEdge * 0.92;

    // Color seamlessly matches the deep water column before fully fading
    vec3 finalColor = mix(uWaterColor, litTerrain, distanceFade);

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`

export function OceanFloor({ reducedMotion = false }: OceanFloorProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const timeRef = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSandBase:     { value: new THREE.Color('#082642') }, // Deep marine blue-gray
      uSandRidge:    { value: new THREE.Color('#0E3E68') }, // Sunlit dune ridge
      uCausticColor: { value: new THREE.Color('#58D2E8') }, // Soft subconscious caustics
      uWaterColor:   { value: new THREE.Color('#082D54') }, // Matches water column seamlessly
    }),
    []
  )

  useFrame((_, delta) => {
    if (reducedMotion || !materialRef.current) return
    timeRef.current += delta * 0.5
    materialRef.current.uniforms.uTime.value = timeRef.current
  })

  return (
    // Oversized terrain positioned naturally in lower depths
    <mesh position={[0, -5.2, -6]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[76, 76, 64, 64]} />
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

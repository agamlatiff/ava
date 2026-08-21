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

    // Organic procedural sand dunes and rolling seabed undulations
    float dune1 = sin(pos.x * 0.12 + pos.y * 0.09) * 0.8;
    float dune2 = cos(pos.x * 0.22 - pos.y * 0.16) * 0.45;
    float dune3 = sin((pos.x + pos.y) * 0.35) * 0.25;
    
    // Gentle natural curvature dipping deeper into the distance
    float distanceDrop = smoothstep(4.0, 36.0, -pos.y) * -2.2;
    
    float totalDisplacement = dune1 + dune2 + dune3 + distanceDrop;
    pos.z += totalDisplacement;
    vElevation = totalDisplacement;

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
  uniform vec3 uFogColor;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying float vElevation;

  // Organic multi-wave caustic sunlight interference
  float causticPattern(vec2 p, float time) {
    vec2 uv = p * 3.5;
    float c1 = sin(uv.x * 1.4 + time * 0.6) * cos(uv.y * 1.2 - time * 0.5);
    float c2 = sin(uv.x * 2.0 - time * 0.4 + c1) * cos(uv.y * 1.8 + time * 0.7);
    float c3 = sin((uv.x + uv.y) * 1.6 + time * 0.35 + c2);
    float wave = pow((c1 + c2 + c3) / 3.0 * 0.5 + 0.5, 3.0);
    return clamp(wave * 2.0, 0.0, 1.0);
  }

  void main() {
    float caustics = causticPattern(vUv, uTime);

    // Modulate sand color based on dune elevation and slope
    float ridgeFactor = smoothstep(-1.2, 1.2, vElevation);
    vec3 sandColor = mix(uSandBase, uSandRidge, ridgeFactor * 0.5);
    
    // Add shimmering caustic sunlight patterns to the sand
    vec3 litSand = mix(sandColor, uCausticColor, caustics * 0.28);

    // ─────────────────────────────────────────────────────────────
    // Seamless atmospheric fog blending:
    // Distance from camera completely dissolves the terrain into water fog.
    // The user NEVER sees any geometric edge of the terrain plane.
    // ─────────────────────────────────────────────────────────────
    float dist = length(vWorldPos - cameraPosition);
    float fogFactor = smoothstep(7.0, 24.0, dist);

    // Near-camera gentle edge fade (radial falloff from center)
    vec2 centerOffset = (vUv - vec2(0.5)) * 2.0;
    float radialEdge = smoothstep(1.0, 0.7, length(centerOffset));

    vec3 finalColor = mix(litSand, uFogColor, fogFactor);
    float alpha = mix(0.0, 1.0, radialEdge) * (1.0 - fogFactor * 0.15);

    gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 0.95));
  }
`

export function OceanFloor({ reducedMotion = false }: OceanFloorProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const timeRef = useRef(0)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSandBase: { value: new THREE.Color('#082A4A') },     // Deep marine blue-gray sand
      uSandRidge: { value: new THREE.Color('#104470') },    // Soft sunlit dune ridge
      uCausticColor: { value: new THREE.Color('#4DD0E1') }, // Soft turquoise caustic shimmer
      uFogColor: { value: new THREE.Color('#05254A') },      // Atmospheric water fog color
    }),
    []
  )

  useFrame((_, delta) => {
    if (reducedMotion || !materialRef.current) return
    timeRef.current += delta * 0.7
    materialRef.current.uniforms.uTime.value = timeRef.current
  })

  return (
    // Oversized rolling terrain extending far beyond frustum into distant atmospheric fog
    <mesh position={[0, -5.2, -6]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[70, 70, 64, 64]} />
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

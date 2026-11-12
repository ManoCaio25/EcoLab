import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color } from 'three';
import { CITY } from '../config/city';

export function Water({ paused, color, segments }: { paused: boolean; color: string; segments: number }) {
  const uniforms = useMemo(() => ({ time: { value: 0 }, tint: { value: new Color(color) } }), [color]);
  useFrame((_, delta) => { if (!paused && !document.hidden) uniforms.time.value += delta; });
  return <mesh position={[(CITY.canal.minX + CITY.canal.maxX) / 2, CITY.canal.waterHeight, 0]} rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[CITY.canal.maxX - CITY.canal.minX, 36, segments, segments]} />
    <shaderMaterial uniforms={uniforms}
      vertexShader={`
        uniform float time;
        varying vec2 vUv;
        varying float vWave;
        void main() {
          vUv = uv;
          vec3 p = position;
          vWave = sin(p.x * 2.8 + p.y * 1.7 + time * 1.6) * 0.5 + sin(p.y * 3.1 - time * 1.2) * 0.5;
          p.z += vWave * 0.025;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }`}
      fragmentShader={`
        uniform float time;
        uniform vec3 tint;
        varying vec2 vUv;
        varying float vWave;
        void main() {
          float ripple = sin(vUv.y * 260.0 + sin(vUv.x * 22.0 + time) * 2.0 - time * 2.0);
          float shine = pow(max(0.0, ripple), 18.0) * 0.018;
          float edge = pow(abs(vUv.x * 2.0 - 1.0), 16.0);
          vec3 color = tint * (0.77 + vWave * 0.035) + vec3(shine) + vec3(0.05, 0.08, 0.06) * edge;
          gl_FragColor = vec4(color, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`} />
  </mesh>;
}

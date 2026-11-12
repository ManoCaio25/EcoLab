import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { VEHICLES, VEHICLE_ROUTES } from '../config/routes';
import { useRouteFollower } from '../movement/useRouteFollower';

export function Vehicle({ index, paused }: { index: number; paused: boolean }) {
  const config = VEHICLES[index];
  const { group, motion } = useRouteFollower(VEHICLE_ROUTES[config.route], config.speed, config.offset, paused);
  const wheels = useRef<Group>(null);
  useFrame(() => {
    if (wheels.current) for (const wheel of wheels.current.children) wheel.rotation.x = motion.travelled / 0.23;
  });
  const van = config.kind === 'van';
  return <group ref={group}>
    <mesh position={[0, 0.38, 0]} castShadow receiveShadow><boxGeometry args={[0.96, 0.35, 2.05]} /><meshStandardMaterial color={config.color} roughness={0.35} metalness={0.25} /></mesh>
    <mesh position={[0, van ? 0.81 : 0.72, -0.12]} castShadow><boxGeometry args={[0.84, van ? 0.65 : 0.4, van ? 1.48 : 1.16]} /><meshStandardMaterial color={config.color} roughness={0.35} /></mesh>
    <mesh position={[0, van ? 0.91 : 0.77, van ? 0.635 : 0.475]}><boxGeometry args={[0.72, 0.28, 0.025]} /><meshStandardMaterial color="#284b59" roughness={0.2} metalness={0.4} /></mesh>
    {[-1, 1].map(side => <group key={side}>
      <mesh position={[side * 0.43, 0.78, van ? 0.32 : -0.09]}><boxGeometry args={[0.025, 0.25, van ? 0.43 : 0.9]} /><meshStandardMaterial color="#365967" roughness={0.2} /></mesh>
      <mesh position={[side * 0.31, 0.4, 1.03]}><boxGeometry args={[0.23, 0.11, 0.025]} /><meshStandardMaterial color="#fff5cf" emissive="#ffe7ad" emissiveIntensity={0.35} /></mesh>
      <mesh position={[side * 0.33, 0.42, -1.03]}><boxGeometry args={[0.18, 0.1, 0.025]} /><meshStandardMaterial color="#bd645b" /></mesh>
    </group>)}
    <mesh position={[0, 0.26, 1.04]}><boxGeometry args={[0.74, 0.09, 0.08]} /><meshStandardMaterial color="#8b9997" metalness={0.6} roughness={0.4} /></mesh>
    <group ref={wheels}>
      {[-1, 1].flatMap(side => [-0.65, 0.65].map(z => <group key={`${side}-${z}`} position={[side * 0.46, 0.23, z]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.23, 0.23, 0.15, 12]} /><meshStandardMaterial color="#263139" roughness={0.95} /></mesh>
        <mesh position={[side * 0.082, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.11, 0.11, 0.015, 8]} /><meshStandardMaterial color="#a9b4af" metalness={0.65} roughness={0.4} /></mesh>
      </group>))}
    </group>
  </group>;
}

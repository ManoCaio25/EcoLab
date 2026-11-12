import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { PEDESTRIANS, PEDESTRIAN_ROUTES } from '../config/routes';
import { useRouteFollower } from '../movement/useRouteFollower';

export function Pedestrian({ index, paused }: { index: number; paused: boolean }) {
  const config = PEDESTRIANS[index];
  const route = PEDESTRIAN_ROUTES[config.route];
  const stop = useMemo(() => config.stop ? { distance: route.length * 0.2, duration: 3 } : undefined, [config.stop, route]);
  const { group, motion } = useRouteFollower(route, config.speed, config.offset, paused, stop);
  const body = useRef<Group>(null);
  const limbs = useRef<Group>(null);
  useFrame(() => {
    const phase = motion.travelled * 7;
    const swing = motion.wait > 0 ? 0 : Math.sin(phase) * 0.55;
    if (limbs.current) {
      limbs.current.children[0].rotation.x = swing;
      limbs.current.children[1].rotation.x = -swing;
      limbs.current.children[2].rotation.x = -swing * 0.8;
      limbs.current.children[3].rotation.x = swing * 0.8;
    }
    if (body.current) body.current.position.y = motion.wait > 0 ? 0 : Math.abs(Math.sin(phase)) * 0.025;
  });
  return <group ref={group}>
    <group ref={body}>
      <mesh position={[0, 1.02, 0]} castShadow><boxGeometry args={[0.38, 0.5, 0.24]} /><meshStandardMaterial color={config.color} roughness={0.95} /></mesh>
      <mesh position={[0, 1.46, 0.015]} castShadow><sphereGeometry args={[0.19, 10, 8]} /><meshStandardMaterial color={config.skin} roughness={1} /></mesh>
      <mesh position={[0, 1.55, -0.03]} castShadow><sphereGeometry args={[0.19, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]} /><meshStandardMaterial color="#493d36" /></mesh>
      <mesh position={[0, 1.02, -0.17]} castShadow><boxGeometry args={[0.27, 0.32, 0.13]} /><meshStandardMaterial color="#4a6264" /></mesh>
    </group>
    <group ref={limbs}>
      {[-1, 1].map(side => <group key={`leg${side}`} position={[side * 0.105, 0.79, 0]}>
        <mesh position={[0, -0.32, 0]} castShadow><boxGeometry args={[0.14, 0.64, 0.16]} /><meshStandardMaterial color="#374a58" /></mesh>
        <mesh position={[0, -0.71, 0.06]} castShadow><boxGeometry args={[0.16, 0.13, 0.28]} /><meshStandardMaterial color="#e1dfd0" /></mesh>
      </group>)}
      {[-1, 1].map(side => <group key={`arm${side}`} position={[side * 0.26, 1.22, 0]}>
        <mesh position={[0, -0.13, 0]} castShadow><boxGeometry args={[0.13, 0.28, 0.15]} /><meshStandardMaterial color={config.color} /></mesh>
        <mesh position={[0, -0.36, 0]} castShadow><boxGeometry args={[0.11, 0.2, 0.12]} /><meshStandardMaterial color={config.skin} /></mesh>
      </group>)}
    </group>
  </group>;
}

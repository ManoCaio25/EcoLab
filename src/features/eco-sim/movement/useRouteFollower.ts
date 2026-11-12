import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { advanceMotion, createMotion, sampleRoute, type Route, type Stop } from './route';

export function useRouteFollower(route: Route, speed: number, offset: number, paused: boolean, stop?: Stop) {
  const group = useRef<Group>(null);
  const motion = useMemo(() => createMotion(route.length * offset, route.length, stop), [route, offset, stop]);
  const pose = useMemo(() => sampleRoute(route, route.length * offset), [route, offset]);
  useFrame((_, delta) => {
    if (!paused && !document.hidden) advanceMotion(motion, delta, speed, route.length, stop, motion);
    sampleRoute(route, motion.distance, pose);
    if (group.current) {
      group.current.position.set(pose.x, pose.y, pose.z);
      group.current.rotation.y = pose.heading;
    }
  });
  return { group, motion };
}

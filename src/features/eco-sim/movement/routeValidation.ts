import { BUILDINGS, CITY } from '../config/city';
import { URBAN_SURFACES } from '../config/urbanLayout';
import type { Surface } from '../types';
import { sampleRoute, type Route } from './route';

export function roundedBoxDistance(x: number, z: number, halfX: number, halfZ: number, radius: number): number {
  const qx = Math.abs(x) - halfX + radius;
  const qz = Math.abs(z) - halfZ + radius;
  return Math.min(Math.max(qx, qz), 0) + Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) - radius;
}

export function isAllowedSurface(x: number, y: number, z: number, surface: Surface): boolean {
  if (![x, y, z].every(Number.isFinite)) return false;
  const { road, sidewalk, canal, bridges } = CITY;
  const expectedHeight = surface === 'road' ? road.height : sidewalk.height;
  if (Math.abs(y - expectedHeight) > 0.015) return false;
  if (x > canal.minX && x < canal.maxX && !bridges.some(b => z >= b.minZ && z <= b.maxZ)) return false;
  if (BUILDINGS.some(b => Math.abs(x - b.x) <= b.width / 2 && Math.abs(z - b.z) <= b.depth / 2)) return false;
  if (URBAN_SURFACES.some(s => (surface === 'road' ? s.kind === 'road' : s.kind !== 'road') && Math.abs(s.height-y)<.015 && x>=s.bounds.minX && x<=s.bounds.maxX && z>=s.bounds.minZ && z<=s.bounds.maxZ)) return true;
  if (surface === 'road') return Math.abs(roundedBoxDistance(x, z, road.halfX, road.halfZ, road.radius)) <= road.halfWidth + 1e-6;
  return roundedBoxDistance(x, z, sidewalk.outerX, sidewalk.outerZ, sidewalk.radius) <= 1e-6 &&
    roundedBoxDistance(x, z, sidewalk.innerX, sidewalk.innerZ, sidewalk.radius) >= -1e-6;
}

/** Check source waypoints plus swept footprint samples every 8 cm, not just endpoints. */
export function validateRoute(route: Route, surface: Surface, halfWidth: number, halfLength: number): string[] {
  const errors: string[] = [];
  route.waypoints.forEach((point, i) => {
    if (!isAllowedSurface(point[0], route.height, point[1], surface)) errors.push(`Waypoint ${i} fora de ${surface}`);
  });
  const count = Math.ceil(route.length / 0.08);
  const pose = { x: 0, y: 0, z: 0, heading: 0 };
  for (let i = 0; i <= count; i++) {
    sampleRoute(route, route.length * i / count, pose);
    const sin = Math.sin(pose.heading), cos = Math.cos(pose.heading);
    for (const side of [-1, 0, 1]) for (const front of [-1, 0, 1]) {
      const x = pose.x + side * halfWidth * cos + front * halfLength * sin;
      const z = pose.z - side * halfWidth * sin + front * halfLength * cos;
      if (!isAllowedSurface(x, pose.y, z, surface)) {
        errors.push(`Trajetória fora de ${surface} em ${pose.x.toFixed(2)}, ${pose.z.toFixed(2)}`);
        return errors;
      }
    }
  }
  return errors;
}

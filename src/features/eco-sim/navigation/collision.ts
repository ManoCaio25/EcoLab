import { CITY } from '../config/city';
import { SOLID_OBSTACLES, URBAN_SURFACES } from '../config/urbanLayout';
import { isAllowedSurface } from '../movement/routeValidation';
import type { Bounds } from '../types';

export const BODY_RADIUS = .27;
export const EYE_HEIGHT = 1.65;
export function contains(b: Bounds, x: number, z: number) {
  return x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ;
}
export function circleIntersects(b: Bounds, x: number, z: number, radius: number) {
  const dx = x - Math.max(b.minX, Math.min(x, b.maxX));
  const dz = z - Math.max(b.minZ, Math.min(z, b.maxZ));
  return dx*dx + dz*dz <= radius*radius;
}
export function surfaceHeight(x: number, z: number): number | null {
  if (!Number.isFinite(x) || !Number.isFinite(z) || Math.abs(x) > CITY.halfWidth || Math.abs(z) > CITY.halfDepth) return null;
  if (x > CITY.canal.minX && x < CITY.canal.maxX && !CITY.bridges.some(b => z >= b.minZ && z <= b.maxZ)) return null;
  if (isAllowedSurface(x, CITY.sidewalk.height, z, 'sidewalk')) return CITY.sidewalk.height;
  if (isAllowedSurface(x, CITY.road.height, z, 'road')) return CITY.road.height;
  const surface = URBAN_SURFACES.find(s => contains(s.bounds, x, z));
  return surface?.height ?? null;
}
export function canOccupy(x: number, z: number, radius = BODY_RADIUS): boolean {
  if (!Number.isFinite(radius) || radius <= 0 || surfaceHeight(x,z) === null) return false;
  if (SOLID_OBSTACLES.some(o => circleIntersects(o.bounds,x,z,radius))) return false;
  // Footprint support at the perimeter prevents walking along an unsupported edge.
  for (let i=0; i<16; i++) {
    const angle = i*Math.PI/8;
    if (surfaceHeight(x+Math.cos(angle)*radius,z+Math.sin(angle)*radius) === null) return false;
  }
  return true;
}
export function moveWithCollisions(x: number, z: number, dx: number, dz: number) {
  if (![x,z,dx,dz].every(Number.isFinite) || !canOccupy(x,z)) return { x, z };
  const distance = Math.hypot(dx,dz);
  // Continuous path sampling, including long deltas: never test endpoints only.
  const steps = Math.max(1,Math.ceil(distance/.08));
  for (let i=0;i<steps;i++) {
    const sx=dx/steps, sz=dz/steps;
    if (canOccupy(x+sx,z+sz)) { x+=sx; z+=sz; }
    else if (canOccupy(x+sx,z)) x+=sx;
    else if (canOccupy(x,z+sz)) z+=sz;
  }
  return { x,z };
}


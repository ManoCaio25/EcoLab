import { moveWithCollisions } from './collision';
export interface NavigationState { x: number; z: number; vx: number; vz: number }
export function advanceNavigation(state: NavigationState, dx: number, dz: number, delta: number): NavigationState {
  if (![dx,dz,delta].every(Number.isFinite) || delta<0) return state;
  const magnitude=Math.hypot(dx,dz), speed=3.1, response=12;
  const tx=magnitude>0 ? dx/magnitude*speed : 0, tz=magnitude>0 ? dz/magnitude*speed : 0;
  const decay=Math.exp(-response*delta), integral=(1-decay)/response;
  const vx=tx+(state.vx-tx)*decay, vz=tz+(state.vz-tz)*decay;
  const stepX=tx*delta+(state.vx-tx)*integral, stepZ=tz*delta+(state.vz-tz)*integral;
  const next=moveWithCollisions(state.x,state.z,stepX,stepZ);
  return { ...next, vx: Math.abs(next.x-state.x)<1e-8 ? 0 : vx, vz: Math.abs(next.z-state.z)<1e-8 ? 0 : vz };
}


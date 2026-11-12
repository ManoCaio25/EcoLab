import type { Point2, Pose } from '../types';

interface Line { kind: 'line'; from: Point2; to: Point2; length: number }
interface Arc { kind: 'arc'; center: Point2; radius: number; start: number; sweep: number; length: number }
export interface Route { segments: readonly (Line | Arc)[]; length: number; height: number; waypoints: readonly Point2[] }
const TAU = Math.PI * 2;
export const wrapDistance = (distance: number, length: number) => ((distance % length) + length) % length;

/** Circular fillets preserve tangent continuity and true arc-length speed. */
export function buildRoute(points: readonly Point2[], radius: number, height: number): Route {
  if (points.length < 3 || radius <= 0 || !Number.isFinite(radius) || !Number.isFinite(height)) throw new Error('Rota inválida');
  if (points.some(p => !p.every(Number.isFinite))) throw new Error('Coordenada inválida');
  const corners = points.map((point, i) => {
    const prev = points[(i + points.length - 1) % points.length];
    const next = points[(i + 1) % points.length];
    const a = Math.hypot(point[0] - prev[0], point[1] - prev[1]);
    const b = Math.hypot(next[0] - point[0], next[1] - point[1]);
    if (a < 1e-6 || b < 1e-6) throw new Error('Waypoints duplicados');
    const ux = (point[0] - prev[0]) / a, uz = (point[1] - prev[1]) / a;
    const vx = (next[0] - point[0]) / b, vz = (next[1] - point[1]) / b;
    const turn = Math.atan2(ux * vz - uz * vx, ux * vx + uz * vz);
    if (Math.abs(turn) < 1e-5 || Math.abs(turn) > Math.PI - 1e-5) throw new Error('Curva degenerada');
    const tangent = Math.min(radius * Math.tan(Math.abs(turn) / 2), a * 0.45, b * 0.45);
    const actualRadius = tangent / Math.tan(Math.abs(turn) / 2);
    const entry: Point2 = [point[0] - ux * tangent, point[1] - uz * tangent];
    const exit: Point2 = [point[0] + vx * tangent, point[1] + vz * tangent];
    const sign = Math.sign(turn);
    const center: Point2 = [entry[0] - uz * sign * actualRadius, entry[1] + ux * sign * actualRadius];
    return { entry, exit, center, radius: actualRadius, start: Math.atan2(entry[1] - center[1], entry[0] - center[0]), sweep: turn };
  });
  const segments: (Line | Arc)[] = [];
  corners.forEach((corner, i) => {
    const from = corners[(i + corners.length - 1) % corners.length].exit;
    segments.push({ kind: 'line', from, to: corner.entry, length: Math.hypot(corner.entry[0] - from[0], corner.entry[1] - from[1]) });
    segments.push({ kind: 'arc', center: corner.center, radius: corner.radius, start: corner.start, sweep: corner.sweep, length: Math.abs(corner.sweep) * corner.radius });
  });
  return { segments, length: segments.reduce((sum, segment) => sum + segment.length, 0), height, waypoints: points };
}

/** Pass a reusable output from useFrame to avoid allocating each frame. */
export function sampleRoute(route: Route, distance: number, out: Pose = { x: 0, y: 0, z: 0, heading: 0 }): Pose {
  let remaining = wrapDistance(distance, route.length);
  let segment = route.segments[route.segments.length - 1];
  for (const candidate of route.segments) {
    segment = candidate;
    if (remaining <= candidate.length) break;
    remaining -= candidate.length;
  }
  const t = Math.min(remaining / segment.length, 1);
  out.y = route.height;
  if (segment.kind === 'line') {
    out.x = segment.from[0] + (segment.to[0] - segment.from[0]) * t;
    out.z = segment.from[1] + (segment.to[1] - segment.from[1]) * t;
    out.heading = Math.atan2(segment.to[0] - segment.from[0], segment.to[1] - segment.from[1]);
  } else {
    const angle = segment.start + segment.sweep * t;
    const sign = Math.sign(segment.sweep);
    out.x = segment.center[0] + Math.cos(angle) * segment.radius;
    out.z = segment.center[1] + Math.sin(angle) * segment.radius;
    out.heading = Math.atan2(-Math.sin(angle) * sign, Math.cos(angle) * sign);
  }
  return out;
}

export interface MotionState { distance: number; travelled: number; wait: number; nextStop: number }
export interface Stop { distance: number; duration: number }
export function createMotion(distance: number, length: number, stop?: Stop): MotionState {
  const wrapped = wrapDistance(distance, length);
  return { distance: wrapped, travelled: 0, wait: 0, nextStop: stop ? wrapDistance(stop.distance - wrapped, length) : Infinity };
}

/** Pure by default; the animation loop supplies its existing state as output. */
export function advanceMotion(state: MotionState, delta: number, speed: number, length: number, stop?: Stop, out: MotionState = { ...state }): MotionState {
  if (!Number.isFinite(delta) || delta < 0 || !Number.isFinite(speed) || speed < 0 || length <= 0) throw new Error('Passo de movimento inválido');
  if (stop && (!Number.isFinite(stop.duration) || stop.duration < 0)) throw new Error('Parada inválida');
  Object.assign(out, state);
  let time = delta;
  while (time > 1e-9) {
    if (out.wait > 0) {
      const elapsed = Math.min(time, out.wait);
      out.wait -= elapsed;
      time -= elapsed;
      continue;
    }
    if (speed === 0) break;
    const untilStop = stop ? Math.max(0, out.nextStop - out.travelled) : Infinity;
    const step = Math.min(time * speed, untilStop);
    out.distance = wrapDistance(out.distance + step, length);
    out.travelled += step;
    time -= step / speed;
    if (stop && step >= untilStop) {
      out.wait = stop.duration;
      out.nextStop += length;
    }
  }
  return out;
}

export function angleDifference(a: number, b: number): number {
  return wrapDistance(a - b + Math.PI, TAU) - Math.PI;
}

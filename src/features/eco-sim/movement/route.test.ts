import { describe, expect, it } from 'vitest';
import { advanceMotion, angleDifference, buildRoute, createMotion, sampleRoute, wrapDistance } from './route';

const route = buildRoute([[-10, -6], [10, -6], [10, 6], [-10, 6]], 2, 0.14);

describe('movimento por distância e delta time', () => {
  it('calcula comprimento real das retas e dos arcos', () => {
    expect(route.length).toBeCloseTo(64 - 16 + 4 * Math.PI, 8);
  });
  it('fecha o circuito e aceita deslocamentos negativos ou de várias voltas', () => {
    const start = sampleRoute(route, 0), afterLaps = sampleRoute(route, route.length * 5);
    expect(afterLaps.x).toBeCloseTo(start.x, 10);
    expect(afterLaps.z).toBeCloseTo(start.z, 10);
    expect(Math.abs(angleDifference(afterLaps.heading, start.heading))).toBeLessThan(1e-10);
    expect(wrapDistance(-2, route.length)).toBeCloseTo(route.length - 2);
    expect(sampleRoute(route, -2).x).toBeCloseTo(sampleRoute(route, route.length - 2).x);
  });
  it('mantém posição e orientação contínuas nas transições entre retas e curvas', () => {
    let distance = 0;
    for (const segment of route.segments) {
      distance += segment.length;
      const a = sampleRoute(route, distance - 1e-5);
      const b = sampleRoute(route, distance + 1e-5);
      expect(Math.hypot(a.x - b.x, a.z - b.z)).toBeLessThan(0.00003);
      expect(Math.abs(angleDifference(a.heading, b.heading))).toBeLessThan(0.00002);
    }
  });
  it('orienta o modelo na direção da velocidade e preserva a altura', () => {
    for (let distance = 0; distance < route.length; distance += 0.2) {
      const a = sampleRoute(route, distance), b = sampleRoute(route, distance + 0.0001);
      expect(a.y).toBe(0.14);
      const observed = Math.atan2(b.x - a.x, b.z - a.z);
      expect(Math.abs(angleDifference(a.heading, observed))).toBeLessThan(0.001);
    }
  });
  it('produz o mesmo resultado em 30, 60 e 144 FPS, incluindo paradas', () => {
    const stop = { distance: 8, duration: 2.5 };
    const run = (fps: number) => {
      let state = createMotion(3, route.length, stop);
      for (let i = 0; i < 120 * fps; i++) state = advanceMotion(state, 1 / fps, 3, route.length, stop);
      return state;
    };
    const baseline = run(60);
    for (const fps of [30, 144]) {
      expect(run(fps).distance).toBeCloseTo(baseline.distance, 7);
      expect(run(fps).travelled).toBeCloseTo(baseline.travelled, 7);
      expect(run(fps).wait).toBeCloseTo(baseline.wait, 7);
    }
  });
  it('para pelo tempo previsto e consome corretamente o tempo restante do frame', () => {
    const stop = { distance: 5, duration: 3 };
    const state = createMotion(0, route.length, stop);
    const waiting = advanceMotion(state, 3, 2, route.length, stop);
    expect(waiting.distance).toBeCloseTo(5);
    expect(waiting.wait).toBeCloseTo(2.5);
    const resumed = advanceMotion(waiting, 4, 2, route.length, stop);
    expect(resumed.distance).toBeCloseTo(8);
    expect(resumed.wait).toBe(0);
    expect(state.distance).toBe(0); // Default function leaves its input untouched.
  });
  it('um frame longo equivale aos frames menores, mesmo atravessando várias paradas', () => {
    const stop = { distance: 5, duration: 2 };
    const state = createMotion(0, route.length, stop);
    const single = advanceMotion(state, 300, 4, route.length, stop);
    let repeated = state;
    for (let i = 0; i < 3000; i++) repeated = advanceMotion(repeated, 0.1, 4, route.length, stop);
    expect(single.distance).toBeCloseTo(repeated.distance, 7);
    expect(single.travelled).toBeCloseTo(repeated.travelled, 7);
  });
  it('delta zero congela a posição e o cronômetro de parada', () => {
    const stop = { distance: 0, duration: 3 };
    const state = advanceMotion(createMotion(0, route.length, stop), 1, 2, route.length, stop);
    expect(advanceMotion(state, 0, 2, route.length, stop)).toEqual(state);
  });
  it('permite reutilizar a saída sem alterar o resultado', () => {
    const state = createMotion(0, route.length);
    const expected = advanceMotion(state, 3, 2, route.length);
    expect(advanceMotion(state, 3, 2, route.length, undefined, state)).toBe(state);
    expect(state).toEqual(expected);
    const pose = { x: 0, y: 0, z: 0, heading: 0 };
    expect(sampleRoute(route, state.distance, pose)).toBe(pose);
    expect(pose).toEqual(sampleRoute(route, state.distance));
  });
  it('rejeita entradas degeneradas', () => {
    expect(() => buildRoute([[0, 0], [0, 0], [1, 1]], 1, 0)).toThrow();
    expect(() => buildRoute([[0, 0], [1, 0], [2, 0]], 1, 0)).toThrow();
    expect(() => buildRoute([[NaN, 0], [1, 0], [2, 1]], 1, 0)).toThrow();
    expect(() => advanceMotion(createMotion(0, route.length), -1, 1, route.length)).toThrow();
  });
});

import { describe, expect, it } from 'vitest';
import { CITY, BUILDINGS } from '../config/city';
import { PEDESTRIAN_ROUTES, VEHICLE_ROUTES } from '../config/routes';
import { buildRoute, sampleRoute } from './route';
import { isAllowedSurface, validateRoute } from './routeValidation';

describe('superfícies e trajetórias da cidade', () => {
  it.each(VEHICLE_ROUTES.map((route, index) => ({ route, index })))('valida toda a carroceria na rota de veículo $index', ({ route }) => {
    expect(validateRoute(route, 'road', 0.54, 1.1)).toEqual([]);
  });
  it.each(PEDESTRIAN_ROUTES.map((route, index) => ({ route, index })))('valida o espaço corporal na rota de pedestre $index', ({ route }) => {
    expect(validateRoute(route, 'sidewalk', 0.34, 0.36)).toEqual([]);
  });
  it('permite travessia do canal somente nos tabuleiros das pontes', () => {
    expect(isAllowedSurface(5.5, CITY.road.height, 11, 'road')).toBe(true);
    expect(isAllowedSurface(5.5, CITY.road.height, -11, 'road')).toBe(true);
    expect(isAllowedSurface(5.5, CITY.sidewalk.height, 7.5, 'sidewalk')).toBe(true);
    expect(isAllowedSurface(5.5, CITY.sidewalk.height, -7.5, 'sidewalk')).toBe(true);
    expect(isAllowedSurface(5.5, CITY.road.height, 0, 'road')).toBe(false);
    expect(isAllowedSurface(5.5, CITY.sidewalk.height, 0, 'sidewalk')).toBe(false);
    expect(isAllowedSurface(5.5, CITY.road.height, -19, 'road')).toBe(true);
    expect(isAllowedSurface(5.5, CITY.road.height, -24, 'road')).toBe(false);
  });
  it('rejeita prédios, gramados, superfícies trocadas e alturas incorretas', () => {
    for (const b of BUILDINGS) expect(isAllowedSurface(b.x, CITY.road.height, b.z, 'road')).toBe(false);
    expect(isAllowedSurface(0, CITY.road.height, 0, 'road')).toBe(false);
    expect(isAllowedSurface(0, CITY.sidewalk.height, 11, 'sidewalk')).toBe(false);
    expect(isAllowedSurface(0, -0.22, 11, 'road')).toBe(false);
    expect(isAllowedSurface(NaN, 0, 0, 'road')).toBe(false);
  });
  it('identifica curvas inválidas mesmo quando os waypoints estão na rua', () => {
    const invalid = buildRoute([[-17, -11], [17, -11], [17, 11], [-17, 11]], 10, CITY.road.height);
    expect(invalid.waypoints.every(p => isAllowedSurface(p[0], invalid.height, p[1], 'road'))).toBe(true);
    expect(validateRoute(invalid, 'road', 0.54, 1.1).length).toBeGreaterThan(0);
  });
  it('os dois veículos realmente cruzam as duas pontes', () => {
    for (const route of VEHICLE_ROUTES.slice(0,2)) {
      const crossings = new Set<string>();
      for (let distance = 0; distance < route.length; distance += 0.1) {
        const point = sampleRoute(route, distance);
        if (point.x > CITY.canal.minX && point.x < CITY.canal.maxX) {
          expect(isAllowedSurface(point.x, point.y, point.z, 'road')).toBe(true);
          crossings.add(point.z > 0 ? 'south' : 'north');
        }
      }
      expect(crossings.size).toBe(2);
    }
  });
});

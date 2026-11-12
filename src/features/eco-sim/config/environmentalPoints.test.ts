import {it,expect} from 'vitest';
import {ENVIRONMENTAL_POINTS,pointById} from './environmentalPoints';
import {REGIONS} from './regions';
import {CITY} from './city';
it('mantém identificadores estáveis, únicos e desvinculados do nome',()=>{
  expect(ENVIRONMENTAL_POINTS.map(p=>p.id)).toEqual(['corrego-01','area-verde-01','residencial-01']);
  expect(new Set(ENVIRONMENTAL_POINTS.map(p=>p.id)).size).toBe(3);
  for(const point of ENVIRONMENTAL_POINTS) expect(pointById(point.id)).toBe(point);
  expect(pointById('ausente')).toBeNull();expect(pointById(null)).toBeNull();
});
it('ancora marcadores e focos nas regiões corretas e dentro da cidade',()=>{
  for(const point of ENVIRONMENTAL_POINTS) {
    const b=REGIONS.find(r=>r.id===point.regionId)!.bounds;
    for(const position of [point.position,point.focus]) {
      expect(position.every(Number.isFinite)).toBe(true);
      expect(position[0]).toBeGreaterThanOrEqual(b.minX);expect(position[0]).toBeLessThanOrEqual(b.maxX);
      expect(position[2]).toBeGreaterThanOrEqual(b.minZ);expect(position[2]).toBeLessThanOrEqual(b.maxZ);
      expect(Math.abs(position[0])).toBeLessThan(CITY.halfWidth);expect(Math.abs(position[2])).toBeLessThan(CITY.halfDepth);
    }
    expect(point.position[1]).toBeGreaterThan(point.focus[1]);
  }
});

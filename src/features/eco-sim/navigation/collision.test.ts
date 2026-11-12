import { describe,it,expect } from 'vitest';
import { canOccupy,moveWithCollisions,surfaceHeight,BODY_RADIUS,circleIntersects } from './collision';
import { BUILDINGS,CITY } from '../config/city';
import { SOLID_OBSTACLES } from '../config/urbanLayout';
describe('exploração em superfícies válidas',()=>{
  it('aceita ruas, calçadas, parque, vila e passeio ribeirinho',()=>{
    for(const [x,z] of [[-17,0],[-13.5,7.5],[-23.7,0],[25.5,3],[2,0]]) expect(canOccupy(x,z),`${x},${z}`).toBe(true);
  });
  it('bloqueia água, bordas, gramados sem caminhos e valores inválidos',()=>{
    for(const [x,z] of [[5.5,0],[31,0],[0,23],[29,15],[NaN,0],[Infinity,0]]) expect(canOccupy(x,z)).toBe(false);
    expect(surfaceHeight(5.5,0)).toBeNull();
    expect(canOccupy(2,0,-1)).toBe(false);
  });
  it('bloqueia os edifícios e todos os obstáculos sólidos',()=>{
    for(const b of BUILDINGS) expect(canOccupy(b.x,b.z)).toBe(false);
    for(const {bounds:b} of SOLID_OBSTACLES) expect(canOccupy((b.minX+b.maxX)/2,(b.minZ+b.maxZ)/2)).toBe(false);
  });
  it('permite atravessar as duas pontes com o corpo inteiro',()=>{
    for(const z of [-7.5,7.5,-11,11]) {
      const result=moveWithCollisions(1,z,9,0);
      expect(result.x).toBeCloseTo(10,8);expect(result.z).toBe(z);
    }
  });
  it('impede atravessar água e bancos mesmo com um deslocamento longo',()=>{
    const water=moveWithCollisions(2,0,15,0);
    expect(water.x).toBeLessThanOrEqual(2.55-BODY_RADIUS+.001);
    const bench=moveWithCollisions(-5,1.3,5,0);
    expect(bench.x).toBeLessThan(-4);
    expect(canOccupy(bench.x,bench.z)).toBe(true);
  });
  it('desliza junto à borda e respeita o raio corporal',()=>{
    const result=moveWithCollisions(2,0,2,2);
    expect(result.x).toBeLessThan(2.3);expect(result.z).toBeGreaterThan(1.8);
    expect(circleIntersects({minX:0,maxX:1,minZ:0,maxZ:1},1.2,.5,.27)).toBe(true);
  });
  it('preserva alturas de ruas e calçadas sem afundar nos tabuleiros',()=>{
    expect(surfaceHeight(5.5,11)).toBe(CITY.road.height);
    expect(surfaceHeight(5.5,7.5)).toBe(CITY.sidewalk.height);
  });
});

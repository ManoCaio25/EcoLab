import { BUILDINGS, CITY } from './city';
import type { Bounds } from '../types';

export interface UrbanSurface { id: string; bounds: Bounds; height: number; kind: 'road' | 'path' | 'plaza' }
const rect = (minX: number, maxX: number, minZ: number, maxZ: number): Bounds => ({ minX, maxX, minZ, maxZ });
export const URBAN_SURFACES: readonly UrbanSurface[] = [
  { id: 'rua-vila', bounds: rect(-23.1, -20.5, -11, 11), height: CITY.road.height, kind: 'road' },
  ...[-11, 11].map(z => ({ id: `acesso-vila-${z}`, bounds: rect(-23.1, -16, z - 1.3, z + 1.3), height: CITY.road.height, kind: 'road' as const })),
  { id: 'calcada-vila', bounds: rect(-24.5, -23.1, -13.7, 13.7), height: CITY.sidewalk.height, kind: 'path' },
  ...[-13, 13].map(z => ({ id: `calcada-acesso-${z}`, bounds: rect(-24.5, -18, z - .7, z + .7), height: CITY.sidewalk.height, kind: 'path' as const })),
  { id: 'praca-central', bounds: rect(-5.7, .3, .1, 5.4), height: .12, kind: 'plaza' },
  { id: 'acesso-praca', bounds: rect(-5.7, -4.3, 4.9, 6.6), height: .12, kind: 'path' },
  { id: 'passeio-corrego', bounds: rect(1.35, 2.55, -8, 8), height: CITY.sidewalk.height, kind: 'path' },
  { id: 'acesso-parque', bounds: rect(18, 28, -.8, .8), height: CITY.road.height, kind: 'path' },
  { id: 'alameda-parque', bounds: rect(24.6, 26.4, -7.8, 7.8), height: CITY.road.height, kind: 'path' },
  { id: 'praca-parque', bounds: rect(23.3, 27.7, 1.1, 5.3), height: CITY.road.height, kind: 'plaza' },
];

export const TREES: readonly (readonly [number, number, number])[] = [
  [-28.4,-17,1.2],[-23,-17,1.1],[-28.4,17,1.1],[-22,17,1.2],
  [-15,17,1.1],[-9,17,1.2],[-3,17,1.05],[.8,17,.9],[-14,-17,1.2],[-8,-17,1],[-2,-17,1.1],[.8,-17,.9],
  [21,-13,1.1],[22,-6,1.15],[28,-6,1.2],[22,5.5,1.1],[28.4,8,1.2],[20,16,1.15],[11,17,1],[15,-17,1.2],[10,-17,.9],
  [-3,4,.8],[.4,4.6,.85],[.6,-4.3,.8],[10.3,3.5,.95],
  [22,-9,1.1],[27,-10,1.2],[28,12,1.15],[23,10,1.05],
];
export const PLANTERS = [[-3,4],[.4,4.6],[.6,-4.3],[10.3,3.5]] as const;
export const BENCHES = [[-3,1.3],[-1,5.7],[11,5.6],[-11.7,-5.5],[22.6,3.1],[27.4,6.5],[-25,12.6]] as const;
export const LAMPS = [[-19.7,-8],[-19.7,1],[-19.7,10],[19.7,-8],[19.7,4],[19.7,10],[-23.7,-10],[-23.7,10],[24,-6],[27,1]] as const;
export const BINS = [[-5.9,1.5],[22.3,4.4],[-25.1,10.5],[.8,1.7]] as const;
export const SIGNS = [[20.4,1.6],[-24.8,-11.5],[.8,-1.8]] as const;

export interface Obstacle { id: string; bounds: Bounds }
export const SOLID_OBSTACLES: readonly Obstacle[] = [
  ...BUILDINGS.flatMap(b => [
    { id: b.id, bounds: rect(b.x-b.width/2-.15,b.x+b.width/2+.15,b.z-b.depth/2-.15,b.z+b.depth/2+.15) },
    { id: `${b.id}-entrada`, bounds: rect(b.x-1,b.x+1,b.z+b.depth/2,b.z+b.depth/2+1.15) },
  ]),
  ...BENCHES.map(([x,z], i) => ({ id: `banco-${i}`, bounds: rect(x-.75,x+.75,z-.25,z+.25) })),
  ...PLANTERS.map(([x,z], i) => ({ id: `canteiro-${i}`, bounds: rect(x-.83,x+.83,z-.83,z+.83) })),
  ...TREES.map(([x,z,s], i) => ({ id: `arvore-${i}`, bounds: rect(x-.17*s,x+.17*s,z-.17*s,z+.17*s) })),
  ...LAMPS.map(([x,z], i) => ({ id: `poste-${i}`, bounds: rect(x-.12,x+.12,z-.12,z+.12) })),
  ...BINS.map(([x,z], i) => ({ id: `lixeira-${i}`, bounds: rect(x-.24,x+.24,z-.24,z+.24) })),
  ...SIGNS.map(([x,z], i) => ({ id: `placa-${i}`, bounds: rect(x-.38,x+.38,z-.09,z+.09) })),
  ...CITY.bridges.flatMap((b,i) => [b.minZ+.07,b.maxZ-.07].map((z,j)=>({ id: `guarda-corpo-${i}-${j}`, bounds: rect(2.9,8.1,z-.05,z+.05) }))),
];

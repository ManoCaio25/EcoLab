import { BUILDINGS, CITY } from './city';
import type { Bounds } from '../types';

export interface UrbanSurface { id: string; bounds: Bounds; height: number; kind: 'road' | 'path' | 'plaza' }
const rect = (minX: number, maxX: number, minZ: number, maxZ: number): Bounds => ({ minX, maxX, minZ, maxZ });
export const URBAN_SURFACES: readonly UrbanSurface[] = [
  { id: 'ligacao-vila-oeste', bounds: rect(-32,-22,-12.5,-9.5), height: CITY.road.height, kind: 'road' },
  { id: 'avenida-mercado', bounds: rect(-33.5,35.5,-21.2,-16.8), height: CITY.road.height, kind: 'road' },
  { id: 'rua-escola', bounds: rect(-33.5,.5,14.5,17.5), height: CITY.road.height, kind: 'road' },
  { id: 'rua-jardins', bounds: rect(9,35.5,17.2,19.4), height: CITY.road.height, kind: 'road' },
  { id: 'rua-oeste', bounds: rect(-34,-30.5,-19,16), height: CITY.road.height, kind: 'road' },
  { id: 'rua-leste', bounds: rect(32.5,35.5,-19,18.3), height: CITY.road.height, kind: 'road' },
  ...[-17,17].map(x=>({id:`ligacao-norte-${x}`,bounds:rect(x-2.2,x+2.2,-19,-10),height:CITY.road.height,kind:'road' as const})),
  { id: 'ligacao-escola', bounds: rect(-19.2,-14.8,10,16), height: CITY.road.height, kind: 'road' },
  { id: 'ligacao-jardins', bounds: rect(14.8,19.2,10,18.3), height: CITY.road.height, kind: 'road' },
  { id: 'calcada-comercio', bounds: rect(-30,-1,-22.8,-21.3), height: CITY.sidewalk.height, kind: 'path' },
  { id: 'calcada-saude', bounds: rect(10,31,-22.8,-21.3), height: CITY.sidewalk.height, kind: 'path' },
  { id: 'praca-escola', bounds: rect(-28,-2,17.8,27.2), height: CITY.sidewalk.height, kind: 'plaza' },
  { id: 'calcada-jardins', bounds: rect(10,31,19.4,27), height: CITY.sidewalk.height, kind: 'plaza' },
  ...[-29.5,-1.8,30.8].map(x=>({id:`travessia-norte-${x}`,bounds:rect(x-.7,x+.7,-22.5,-14),height:CITY.sidewalk.height,kind:'path' as const})),
  { id: 'travessia-escola', bounds: rect(-16,-14,12.8,19), height: CITY.sidewalk.height, kind: 'path' },
  { id: 'travessia-jardins', bounds: rect(29.8,31.4,10,21), height: CITY.sidewalk.height, kind: 'path' },
  { id: 'ligacao-parque-jardins', bounds: rect(25,31,7.4,10.5), height: CITY.sidewalk.height, kind: 'path' },
  { id: 'passeio-norte', bounds: rect(-30,2.55,-16.6,-14.8), height: CITY.sidewalk.height, kind: 'path' },
  { id: 'passeio-saude-parque', bounds: rect(19.4,31.5,-16.6,-14.8), height: CITY.sidewalk.height, kind: 'path' },
  { id: 'margem-oeste-norte', bounds: rect(.9,2.55,-27,-13.3), height: CITY.sidewalk.height, kind: 'path' },
  { id: 'margem-oeste-sul', bounds: rect(.9,2.55,13.3,27), height: CITY.sidewalk.height, kind: 'path' },
  { id: 'acesso-margem-sul', bounds: rect(-3,2.55,25.5,27), height: CITY.sidewalk.height, kind: 'path' },
  { id: 'margem-leste-sul', bounds: rect(8.5,10.5,13.3,27), height: CITY.sidewalk.height, kind: 'path' },
  { id: 'margem-leste-norte', bounds: rect(8.5,10.5,-27,-13.3), height: CITY.sidewalk.height, kind: 'path' },
  { id: 'rua-vila', bounds: rect(-23.1, -20.5, -11, 11), height: CITY.road.height, kind: 'road' },
  ...[-11, 11].map(z => ({ id: `acesso-vila-${z}`, bounds: rect(-23.1, -16, z - 1.3, z + 1.3), height: CITY.road.height, kind: 'road' as const })),
  { id: 'calcada-vila', bounds: rect(-24.5, -23.1, -13.7, 13.7), height: CITY.sidewalk.height, kind: 'path' },
  ...[-13, 13].map(z => ({ id: `calcada-acesso-${z}`, bounds: rect(-24.5, -18, z - .7, z + .7), height: CITY.sidewalk.height, kind: 'path' as const })),
  { id: 'praca-central', bounds: rect(-5.7, .3, .1, 5.4), height: .12, kind: 'plaza' },
  { id: 'acesso-praca', bounds: rect(-5.7, -4.3, 4.9, 6.6), height: .12, kind: 'path' },
  { id: 'passeio-corrego', bounds: rect(1.35, 2.55, -8, 8), height: CITY.sidewalk.height, kind: 'path' },
  { id: 'acesso-parque', bounds: rect(18, 28, -.8, .8), height: CITY.sidewalk.height, kind: 'path' },
  { id: 'alameda-parque', bounds: rect(24.6, 26.4, -7.8, 7.8), height: CITY.sidewalk.height, kind: 'path' },
  { id: 'praca-parque', bounds: rect(23.3, 27.7, 1.1, 5.3), height: CITY.sidewalk.height, kind: 'plaza' },
];

export const TREES: readonly (readonly [number, number, number])[] = [
  [-28.4,-14.1,1.1],[-23,-14.1,1],[-29,13,1.1],[-22,13.8,.85],
  [-29,22,1.1],[-29,26,1],[-3,20,.8],[-.2,23,.8],[-10,-14.4,.8],[-5,-14.4,.9],[.1,-24,.75],
  [21,-13,1.1],[22,-6,1.15],[28,-6,1.2],[22,5.5,1.1],[28.4,8,1.2],[21,15,1.0],[11,15,1],[21,-14,1],[11,-14,.9],
  [-3,4,.8],[.4,4.6,.85],[.6,-4.3,.8],[10.3,3.5,.95],
  [22,-9,1.1],[27,-10,1.2],[28,12,1.15],[23,10,1.05],
  [-34.8,-25,.85],[-34.8,23,1],[-30,26,.8],[-16,25.8,.7],[-2.9,25,.7],
  [11.7,23,.75],[21,25.5,1.1],[31,25.5,.95],[31,13,.85],[30,-13,.9],
  [-.1,-5.7,.65],[-.1,0,.65],[-.1,5.9,.65],[11,10,.65],[11,-10,.65],
];
export const PLANTERS = [[-3,4],[.4,4.6],[.6,-4.3],[10.3,3.5]] as const;
export const BENCHES = [[-3,1.3],[-1,5.7],[11,5.6],[-11.7,-5.5],[22.6,3.1],[27.4,6.5],[-25,12.6],[-27,26.5],[-17,25.7],[-.1,19],[-.1,-25],[11,22],[21,21],[20,-22.3]] as const;
export const LAMPS = [[-19.7,-8],[-19.7,1],[-19.7,10],[19.7,-8],[19.7,4],[19.7,10],[-23.7,-10],[-23.7,10],[24,-6],[27,1],[-28,-20.9],[-10,-20.9],[12,-20.9],[29,-20.9],[-27.7,18.1],[-2.3,18.1],[10.3,26.5]] as const;
export const BINS = [[-5.9,1.5],[22.3,4.4],[-25.1,10.5],[.8,1.7]] as const;
export const SIGNS = [[20.4,1.6],[-24.8,-13.8],[.8,-1.8]] as const;
export const BICYCLES = [[21.1,2.4],[21.1,3],[-29,19],[-29,19.6],[30,-25],[30,-24.4]] as const;
export const SHRUBS = [[20.8,-4],[28,-3],[22,7],[-29.5,24],[-29.5,-15],[21,26.3],[30.8,23]] as const;
export const PLACE_SIGNS = [[21.4,-2.5],[-27,10]] as const;

export interface Obstacle { id: string; bounds: Bounds }
export const CAMPUS_OBSTACLES: readonly Obstacle[] = [
  ...Array.from({length:5},(_,i)=>{const x=-26.2+i*1.8;return {id:`escola-pilar-${i}`,bounds:rect(x-.07,x+.07,23.38,23.52)};}),
  {id:'playground-escada',bounds:rect(-25.9,-25.1,24.1,24.9)},
  ...[-27.5,-17.8].map(x=>({id:`escola-portao-${x}`,bounds:rect(x-.13,x+.13,17.87,18.13)})),
  {id:'quadra-norte',bounds:rect(-14.7,-4.3,19.4,19.5)},
  {id:'quadra-sul',bounds:rect(-14.7,-4.3,26.4,26.5)},
  {id:'quadra-leste',bounds:rect(-4.4,-4.3,19.5,26.4)},
  {id:'quadra-oeste-1',bounds:rect(-14.7,-14.6,19.5,21.5)},
  {id:'quadra-oeste-2',bounds:rect(-14.7,-14.6,23,26.4)},
  {id:'playground-torre',bounds:rect(-25.1,-23.9,24,25.2)},
  {id:'playground-escorregador',bounds:rect(-24.8,-24.2,25.2,26.5)},
  {id:'balanco',bounds:rect(-21.8,-19,24.2,25.5)},
];
export const SOLID_OBSTACLES: readonly Obstacle[] = [
  ...CAMPUS_OBSTACLES,
  ...BICYCLES.map(([x,z],i)=>({id:`bicicleta-${i}`,bounds:rect(x-.95,x+.95,z-.22,z+.22)})),
  ...SHRUBS.map(([x,z],i)=>({id:`arbusto-${i}`,bounds:rect(x-.85,x+.85,z-.4,z+.4)})),
  ...PLACE_SIGNS.flatMap(([x,z],i)=>[-1.4,1.4].map((dx,j)=>({id:`letreiro-${i}-${j}`,bounds:rect(x+dx-.04,x+dx+.04,z-.08,z)}))),
  ...BUILDINGS.flatMap(b => [
    { id: b.id, bounds: rect(b.x-b.width/2-.15,b.x+b.width/2+.15,b.z-b.depth/2-.15,b.z+b.depth/2+.15) },
    ...(!b.kind ? [{ id: `${b.id}-entrada`, bounds: rect(b.x-1,b.x+1,b.z+b.depth/2,b.z+b.depth/2+1.15) }] : []),
  ]),
  ...BENCHES.map(([x,z], i) => ({ id: `banco-${i}`, bounds: rect(x-.75,x+.75,z-.25,z+.25) })),
  ...PLANTERS.map(([x,z], i) => ({ id: `canteiro-${i}`, bounds: rect(x-.83,x+.83,z-.83,z+.83) })),
  ...TREES.map(([x,z,s], i) => ({ id: `arvore-${i}`, bounds: rect(x-.17*s,x+.17*s,z-.17*s,z+.17*s) })),
  ...LAMPS.map(([x,z], i) => ({ id: `poste-${i}`, bounds: rect(x-.12,x+.12,z-.12,z+.12) })),
  ...BINS.map(([x,z], i) => ({ id: `lixeira-${i}`, bounds: rect(x-.24,x+.24,z-.24,z+.24) })),
  ...SIGNS.map(([x,z], i) => ({ id: `placa-${i}`, bounds: rect(x-.38,x+.38,z-.09,z+.09) })),
  ...CITY.bridges.flatMap((b,i) => [b.minZ+.07,b.maxZ-.07].map((z,j)=>({ id: `guarda-corpo-${i}-${j}`, bounds: rect(2.9,8.1,z-.05,z+.05) }))),
];

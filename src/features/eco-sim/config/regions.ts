import type { CityRegion } from '../types';

export const REGIONS: readonly CityRegion[] = [
  { id: 'escola-sul', name: 'Escola das Águas', bounds: { minX: -30, maxX: 0, minZ: 17.5, maxZ: 28 } },
  { id: 'comercio-norte', name: 'Rua do Mercado', bounds: { minX: -36, maxX: 0, minZ: -28, maxZ: -16.8 } },
  { id: 'saude-norte', name: 'Bairro da Saúde', bounds: { minX: 10, maxX: 36, minZ: -28, maxZ: -16.8 } },
  { id: 'jardins-sul', name: 'Jardins do Córrego', bounds: { minX: 10, maxX: 36, minZ: 19.4, maxZ: 28 } },
  { id: 'centro', name: 'Centro do distrito', bounds: { minX: -20, maxX: 0.8, minZ: -14, maxZ: 14 } },
  { id: 'residencial-oeste', name: 'Vila das Águas', bounds: { minX: -30, maxX: -20, minZ: -14, maxZ: 14 } },
  { id: 'parque-leste', name: 'Parque das Nascentes', bounds: { minX: 19.2, maxX: 30, minZ: -10, maxZ: 10 } },
  { id: 'corrego-central', name: 'Margens do córrego', bounds: { minX: 0.8, maxX: 9, minZ: -22, maxZ: 22 } },
];

export function regionAt(x: number, z: number) {
  return REGIONS.find(({ bounds: b }) => x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ);
}

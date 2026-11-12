import type { EnvironmentalPoint } from '../types';

// IDs are integration keys. Labels may change without changing these IDs.
export const ENVIRONMENTAL_POINTS: readonly EnvironmentalPoint[] = [
  { id: 'corrego-01', regionId: 'corrego-central', name: 'Córrego do distrito', category: 'water',
    description: 'A água conecta toda a cidade. Este trecho será um local de observação de possíveis fontes de poluição hídrica.',
    position: [5.5, 1.1, 1.5], focus: [5.5, 0, 1.5], color: '#79dbe1' },
  { id: 'area-verde-01', regionId: 'parque-leste', name: 'Parque das Nascentes', category: 'vegetation',
    description: 'Árvores e solo permeável oferecem sombra e abrigo à vida urbana. Observe a vegetação e os caminhos do parque.',
    position: [25.5, 1.2, 3], focus: [25.5, 0.2, 3], color: '#a9e48c' },
  { id: 'residencial-01', regionId: 'residencial-oeste', name: 'Vila das Águas', category: 'residential',
    description: 'Uma pequena vizinhança junto ao centro. Este ponto permitirá relacionar condições ambientais e seus impactos sobre moradores.',
    position: [-26.7, 5.1, 0], focus: [-26.7, 1.5, 0], color: '#edc590' },
];

export function pointById(id: string | null) {
  return ENVIRONMENTAL_POINTS.find(point => point.id === id) ?? null;
}

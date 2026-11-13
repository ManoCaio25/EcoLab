import type { EnvironmentAppearance } from '../types';

// One coordinate system for rendering and route validation. Y is up; meters.
export const CITY = {
  halfWidth: 36, halfDepth: 28,
  road: { halfX: 17, halfZ: 11, radius: 3, halfWidth: 2.2, height: 0.14 },
  sidewalk: { outerX: 14.8, outerZ: 8.8, innerX: 12.4, innerZ: 6.4, radius: 0.8, height: 0.28 },
  canal: { minX: 3, maxX: 8, waterHeight: -0.22 },
  bridges: [{ minZ: -13.2, maxZ: -6.4 }, { minZ: 6.4, maxZ: 13.2 }, { minZ: -21.2, maxZ: -16.8 }],
} as const;

export type BuildingKind = 'apartment' | 'house' | 'library' | 'shop' | 'market' | 'clinic' | 'school';
export interface BuildingSpec { id: string; x: number; z: number; width: number; depth: number; height: number; color: string; accent: string; kind?: BuildingKind }
export const BUILDINGS: readonly BuildingSpec[] = [
  { id: 'residencial', x: -9, z: -3.2, width: 4.2, depth: 4.1, height: 6.6, color: '#d3d5c9', accent: '#729d91' },
  { id: 'estudio', x: -2.6, z: -3.5, width: 4.1, depth: 3.6, height: 4.1, color: '#c9b5a1', accent: '#af7558' },
  { id: 'biblioteca', x: -8.4, z: 3.4, width: 5.1, depth: 3.4, height: 3.2, color: '#d9d0bb', accent: '#617f81' },
  { id: 'cafe', x: 10.2, z: -2.8, width: 2.8, depth: 3.4, height: 3.8, color: '#becac6', accent: '#54958e' },
  { id: 'casa-01', x: -26.7, z: -6.6, width: 3.8, depth: 4.0, height: 3.1, color: '#d6c9b4', accent: '#668b86' },
  { id: 'casa-02', x: -26.7, z: 0, width: 3.8, depth: 4.0, height: 3.1, color: '#c8d2c6', accent: '#a57961' },
  { id: 'casa-03', x: -26.7, z: 6.6, width: 3.8, depth: 4.0, height: 3.1, color: '#d5c3ad', accent: '#657f8a' },
  { id: 'escola', x: -22, z: 20.6, width: 9, depth: 4.4, height: 3.4, color: '#f2dfb4', accent: '#e09b48', kind: 'school' },
  { id: 'mercado', x: -15, z: -25, width: 7, depth: 4.2, height: 3.1, color: '#e7d0b0', accent: '#c27450', kind: 'market' },
  { id: 'padaria', x: -25, z: -25, width: 6, depth: 4, height: 3.5, color: '#e0c0a5', accent: '#8c5e4c', kind: 'shop' },
  { id: 'loja', x: -5, z: -25, width: 5, depth: 4, height: 4.4, color: '#c7dad5', accent: '#468e8d', kind: 'shop' },
  { id: 'saude', x: 25, z: -25, width: 8, depth: 4.2, height: 4.1, color: '#e5ece0', accent: '#459b96', kind: 'clinic' },
  { id: 'moradia-norte', x: 14, z: -25, width: 5.2, depth: 4.2, height: 6.8, color: '#d9c8ad', accent: '#b9775b', kind: 'apartment' },
  { id: 'casa-jardim', x: 16, z: 23.4, width: 4.5, depth: 4.8, height: 3.2, color: '#f0d4b1', accent: '#bc7654', kind: 'house' },
  { id: 'moradia-sul', x: 27, z: 23, width: 5.6, depth: 4.6, height: 5.6, color: '#c5d7cd', accent: '#598b87', kind: 'apartment' },
];

export const DEFAULT_APPEARANCE: EnvironmentAppearance = {
  waterColor: '#438e98', vegetationColor: '#638c58',
};

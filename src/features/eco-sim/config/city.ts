import type { EnvironmentAppearance } from '../types';

// One coordinate system for rendering and route validation. Y is up; meters.
export const CITY = {
  halfWidth: 30, halfDepth: 22,
  road: { halfX: 17, halfZ: 11, radius: 3, halfWidth: 2.2, height: 0.14 },
  sidewalk: { outerX: 14.8, outerZ: 8.8, innerX: 12.4, innerZ: 6.4, radius: 0.8, height: 0.28 },
  canal: { minX: 3, maxX: 8, waterHeight: -0.22 },
  bridges: [{ minZ: -13.2, maxZ: -6.4 }, { minZ: 6.4, maxZ: 13.2 }],
} as const;

export const BUILDINGS = [
  { id: 'residencial', x: -9, z: -3.2, width: 4.2, depth: 4.1, height: 6.6, color: '#d3d5c9', accent: '#729d91' },
  { id: 'estudio', x: -2.6, z: -3.5, width: 4.1, depth: 3.6, height: 4.1, color: '#c9b5a1', accent: '#af7558' },
  { id: 'biblioteca', x: -8.4, z: 3.4, width: 5.1, depth: 3.4, height: 3.2, color: '#d9d0bb', accent: '#617f81' },
  { id: 'cafe', x: 10.2, z: -2.8, width: 2.8, depth: 3.4, height: 3.8, color: '#becac6', accent: '#54958e' },
  { id: 'casa-01', x: -26.7, z: -6.6, width: 3.8, depth: 4.0, height: 3.1, color: '#d6c9b4', accent: '#668b86' },
  { id: 'casa-02', x: -26.7, z: 0, width: 3.8, depth: 4.0, height: 3.1, color: '#c8d2c6', accent: '#a57961' },
  { id: 'casa-03', x: -26.7, z: 6.6, width: 3.8, depth: 4.0, height: 3.1, color: '#d5c3ad', accent: '#657f8a' },
] as const;

export const DEFAULT_APPEARANCE: EnvironmentAppearance = {
  waterColor: '#386e71', vegetationColor: '#63875b',
};

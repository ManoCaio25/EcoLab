import type { Quality } from '../types';

export const QUALITY: Record<Quality, { dpr: [number, number]; shadowSize: number; shadows: boolean; waterSegments: number }> = {
  high: { dpr: [1, 1.5], shadowSize: 2048, shadows: true, waterSegments: 40 },
  low: { dpr: [1, 1], shadowSize: 512, shadows: false, waterSegments: 16 },
};

import type { Quality } from '../types';

export const QUALITY: Record<Quality, { dpr: [number, number]; shadowSize: number; shadows: boolean; waterSegments: number }> = {
  high: { dpr: [1, 1.5], shadowSize: 2048, shadows: true, waterSegments: 40 },
  low: { dpr: [1, 1], shadowSize: 512, shadows: false, waterSegments: 16 },
};

// Only the school pilot uses these model LODs; the rest of the city is unaffected.
export const SCHOOL_QUALITY = {
  high: { tree: 'tree', grassPerBank: 35 },
  low: { tree: 'tree-low', grassPerBank: 18 },
} as const;

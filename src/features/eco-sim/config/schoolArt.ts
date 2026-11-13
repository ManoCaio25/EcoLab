import { BENCHES, TREES } from './urbanLayout';

// Rendering boundary only. Navigation and the authoritative urban layout stay unchanged.
export const SCHOOL_ART_BOUNDS = { minX: -31, maxX: 10.5, minZ: 13, maxZ: 28 };
export const schoolArtContains = (x: number, z: number) => x >= SCHOOL_ART_BOUNDS.minX && x <= SCHOOL_ART_BOUNDS.maxX && z >= SCHOOL_ART_BOUNDS.minZ && z <= SCHOOL_ART_BOUNDS.maxZ;
export const SCHOOL_TREES = TREES.filter(([x,z]) => schoolArtContains(x,z));
export const SCHOOL_BENCHES = BENCHES.filter(([x,z]) => schoolArtContains(x,z));
export const SCHOOL_ASSET_BASE = '/assets/school-pilot/';
export const SCHOOL_ASSET_BUDGET = 15_000_000;

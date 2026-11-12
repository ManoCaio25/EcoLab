export type Point2 = readonly [x: number, z: number];
export type Quality = 'high' | 'low';
export type Surface = 'road' | 'sidewalk';
export interface Pose { x: number; y: number; z: number; heading: number }
export interface EnvironmentAppearance { waterColor: string; vegetationColor: string }
export interface SceneMetrics { fps: number; p95ms: number; calls: number; triangles: number; geometries: number; textures: number }
export type CameraMode = 'overview' | 'explore';
export type Point3 = readonly [x: number, y: number, z: number];
export interface Bounds { minX: number; maxX: number; minZ: number; maxZ: number }
export interface CityRegion { id: string; name: string; bounds: Bounds }
export interface EnvironmentalPoint {
  id: string; regionId: string; name: string; description: string;
  category: 'water' | 'vegetation' | 'residential'; position: Point3; focus: Point3; color: string;
}

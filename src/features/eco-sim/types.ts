export type Point2 = readonly [x: number, z: number];
export type Quality = 'high' | 'low';
export type Surface = 'road' | 'sidewalk';
export interface Pose { x: number; y: number; z: number; heading: number }
export interface EnvironmentAppearance { waterColor: string; vegetationColor: string }
export interface SceneMetrics { fps: number; calls: number; triangles: number }

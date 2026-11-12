import { buildRoute } from '../movement/route';
import { CITY } from './city';

export const VEHICLE_ROUTES = [
  buildRoute([[-17.6, -11.6], [17.6, -11.6], [17.6, 11.6], [-17.6, 11.6]], 3.6, CITY.road.height),
  buildRoute([[-16.4, -10.4], [-16.4, 10.4], [16.4, 10.4], [16.4, -10.4]], 2.4, CITY.road.height),
];
export const PEDESTRIAN_ROUTES = [
  buildRoute([[-13.5, -7.5], [13.5, -7.5], [13.5, 7.5], [-13.5, 7.5]], 1.2, CITY.sidewalk.height),
  buildRoute([[-13.9, -7.9], [-13.9, 7.9], [13.9, 7.9], [13.9, -7.9]], 1.2, CITY.sidewalk.height),
];
export const VEHICLES = [
  { route: 0, speed: 3.6, offset: 0.22, color: '#ead3a1', kind: 'car' as const },
  { route: 1, speed: 3.1, offset: 0.7, color: '#55a6a4', kind: 'van' as const },
];
export const PEDESTRIANS = [
  { route: 0, speed: 1.05, offset: 0.08, color: '#e9ad73', skin: '#bd8868', stop: true },
  { route: 1, speed: 0.92, offset: 0.37, color: '#9cb8ce', skin: '#855c43', stop: false },
  { route: 0, speed: 1.12, offset: 0.71, color: '#d3b2c5', skin: '#dfb594', stop: false },
];

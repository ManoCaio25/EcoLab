import { buildRoute } from '../movement/route';
import { CITY } from './city';

export const VEHICLE_ROUTES = [
  buildRoute([[-17.6, -11.6], [17.6, -11.6], [17.6, 11.6], [-17.6, 11.6]], 3.6, CITY.road.height),
  buildRoute([[-16.4, -10.4], [-16.4, 10.4], [16.4, 10.4], [16.4, -10.4]], 2.4, CITY.road.height),
  buildRoute([[-32,-19],[-17,-19],[-17,-11],[-32,-11]], 1.2, CITY.road.height),
];
export const PEDESTRIAN_ROUTES = [
  buildRoute([[-13.5, -7.5], [13.5, -7.5], [13.5, 7.5], [-13.5, 7.5]], 1.2, CITY.sidewalk.height),
  buildRoute([[-13.9, -7.9], [-13.9, 7.9], [13.9, 7.9], [13.9, -7.9]], 1.2, CITY.sidewalk.height),
  buildRoute([[-16.8,18.5],[-15.3,18.5],[-15.3,24.8],[-16.8,24.8]], .4, CITY.sidewalk.height),
  buildRoute([[-28.5,-22.25],[-3,-22.25],[-3,-21.85],[-28.5,-21.85]], .2, CITY.sidewalk.height),
  buildRoute([[22,-22.25],[29,-22.25],[29,-21.85],[22,-21.85]], .2, CITY.sidewalk.height),
  buildRoute([[1.4,15],[2.05,15],[2.05,25],[1.4,25]], .25, CITY.sidewalk.height),
  buildRoute([[25.1,-5],[25.9,-5],[25.9,4.5],[25.1,4.5]], .35, CITY.sidewalk.height),
  buildRoute([[12,19.95],[30,19.95],[30,20.05],[12,20.05]], .3, CITY.sidewalk.height),
];
export const VEHICLES = [
  { route: 0, speed: 3.6, offset: 0.22, color: '#ead3a1', kind: 'car' as const },
  { route: 1, speed: 3.1, offset: 0.7, color: '#55a6a4', kind: 'van' as const },
  { route: 2, speed: 2.4, offset: 0.72, color: '#b46b50', kind: 'car' as const },
  { route: 1, speed: 3.1, offset: 0.2, color: '#d7e1cc', kind: 'car' as const },
];
const ORIGINAL_PEDESTRIANS = [
  { route: 0, speed: 1.05, offset: 0.08, color: '#e9ad73', skin: '#bd8868', stop: true },
  { route: 1, speed: 0.92, offset: 0.37, color: '#9cb8ce', skin: '#855c43', stop: false },
  { route: 0, speed: 1.12, offset: 0.71, color: '#d3b2c5', skin: '#dfb594', stop: false },
];
// Stable identities: no random colors or bodies on render, and no duplicate outfits.
const OUTFITS = [
  ['#e9ad73','#344e65','#bd8868','#493d36'],['#9cb8ce','#765e5a','#855c43','#262a29'],
  ['#d3b2c5','#eee0ba','#dfb594','#704a31'],['#edbd55','#476f78','#85583d','#252a28'],
  ['#5ab1b3','#be9470','#dca47d','#40302a'],['#b88576','#33495c','#684735','#272425'],
  ['#88ae72','#ebe2ca','#b27b55','#3c3129'],['#ebd8ab','#7b667c','#edbf98','#98633d'],
  ['#cf7666','#4a6f74','#815239','#22282c'],['#90a9c5','#b59b74','#c8946c','#725842'],
  ['#d4ad61','#5c6e53','#694b3d','#ddddca'],['#739d9b','#e2d3ac','#e8ba94','#464039'],
  ['#b495c2','#515c70','#b9825c','#342b26'],['#e7e6ce','#a16b59','#755440','#bbbbad'],
  ['#5c87ac','#d0b189','#e2ad85','#4a352c'],['#cc9b83','#5d815a','#936c52','#272725'],
  ['#b9cb7d','#796a91','#d29c73','#8b5b3c'],['#e19c50','#426877','#644b40','#b5b4a5'],
  ['#7d9fbc','#a87368','#edc4a0','#5c4233'],['#bfc9b0','#436052','#956648','#30302c'],
] as const;
export const PEDESTRIANS = OUTFITS.map(([color,pants,skin,hair],i)=>({
  ...(ORIGINAL_PEDESTRIANS[i] ?? {route: 2+Math.floor((i-3)/3)%6,speed:.72+(i%5)*.09,offset:((i*.381)%1),stop:i%3===0}),
  color,pants,skin,hair, id:`civil-${String(i+1).padStart(2,'0')}`,
  height: i>=3&&i<=5 ? [.77,.85,.82][i-3] : .94+(i%5)*.045,
  build:.9+(i%4)*.075, hairstyle:i%4, accessory:i%5, skirt:i%6===2,
}));

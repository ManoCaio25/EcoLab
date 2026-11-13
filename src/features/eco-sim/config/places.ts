import type { Point3 } from '../types';

export interface CityPlace { id: string; name: string; subtitle: string; focus: Point3; label: Point3; color: string; zoom: number }
export const PLACES: readonly CityPlace[] = [
  { id: 'escola', name: 'Escola das Águas', subtitle: 'Aprender e brincar', focus: [-16, 0, 22], label: [-22, 4.4, 21], color: '#efb85f', zoom: 2.6 },
  { id: 'canal', name: 'Passeio do Córrego', subtitle: 'Água e convivência', focus: [5.5, 0, 1], label: [5.5, .4, 21], color: '#77d5db', zoom: 2.2 },
  { id: 'vila', name: 'Vila das Águas', subtitle: 'Casas e vizinhança', focus: [-26, 1, 0], label: [-27, 4.5, -7], color: '#e7bd99', zoom: 2.5 },
  { id: 'comercio', name: 'Rua do Mercado', subtitle: 'Comércio de bairro', focus: [-15, 0, -22], label: [-15, 4.1, -24], color: '#edab7c', zoom: 2.4 },
  { id: 'saude', name: 'Unidade de Saúde', subtitle: 'Cuidado perto de casa', focus: [25, 1, -24], label: [25, 5.2, -25], color: '#91d6cd', zoom: 2.6 },
  { id: 'parque', name: 'Parque das Nascentes', subtitle: 'Sombra e encontro', focus: [25, 0, 3], label: [25, 2, 5], color: '#b8d989', zoom: 2.5 },
];
export const placeById = (id?: string) => PLACES.find(place => place.id === id);

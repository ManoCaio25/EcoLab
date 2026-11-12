import { useMemo } from 'react';
import { Path, Shape } from 'three';
import { BUILDINGS, CITY } from '../config/city';
import { Building, Blocks, type Block } from '../entities/Building';
import { Vegetation } from '../entities/Vegetation';

function rounded<T extends Path>(path: T, x: number, z: number, r: number): T {
  path.moveTo(-x + r, -z);
  path.lineTo(x - r, -z); path.absarc(x - r, -z + r, r, -Math.PI / 2, 0, false);
  path.lineTo(x, z - r); path.absarc(x - r, z - r, r, 0, Math.PI / 2, false);
  path.lineTo(-x + r, z); path.absarc(-x + r, z - r, r, Math.PI / 2, Math.PI, false);
  path.lineTo(-x, -z + r); path.absarc(-x + r, -z + r, r, Math.PI, Math.PI * 1.5, false);
  path.closePath();
  return path;
}

function Ring({ outer, inner, y, color }: { outer: [number, number, number]; inner: [number, number, number]; y: number; color: string }) {
  const shape = useMemo(() => {
    const shape = rounded(new Shape(), ...outer);
    shape.holes.push(rounded(new Path(), ...inner));
    return shape;
  }, [outer[0], outer[1], outer[2], inner[0], inner[1], inner[2]]); // numeric dependencies avoid geometry churn
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
    <shapeGeometry args={[shape, 12]} /><meshStandardMaterial color={color} roughness={0.96} />
  </mesh>;
}

export function CityEnvironment({ vegetationColor }: { vegetationColor: string }) {
  const { blocks, details } = useMemo(() => {
    const blocks: Block[] = [], details: Block[] = [];
    const add = (position: Block['position'], size: Block['size'], color: string) => blocks.push({ position, size, color });
    const detail = (position: Block['position'], size: Block['size'], color: string, rotation = 0) => details.push({ position, size, color, rotation });
    // Separate banks leave a real gap for the canal, including the diorama foundation.
    add([-10.5, -0.85, 0], [27, 1.7, 36], '#526461');
    add([16, -0.85, 0], [16, 1.7, 36], '#526461');
    add([-10.5, -0.035, 0], [27, 0.09, 36], '#92a783');
    add([16, -0.035, 0], [16, 0.09, 36], '#92a783');
    add([5.5, -1.05, 0], [5, 1.1, 36], '#41595a');
    // Masonry banks.
    for (const x of [2.85, 8.15]) {
      for (const [start, end] of [[-18, -13.2], [-6.4, 6.4], [13.2, 18]]) {
        add([x, -0.17, (start + end) / 2], [0.3, 0.9, end - start], '#bcc5b8');
        const count = Math.ceil(end - start);
        const length = (end - start) / count;
        for (let i = 0; i < count; i++) detail([x, 0.285, start + (i + 0.5) * length], [0.34, 0.06, length - 0.03], '#cdd0c1');
      }
    }
    // Two continuous decks support both the road and the separate inner sidewalk.
    CITY.bridges.forEach(({ minZ, maxZ }) => {
      const z = (minZ + maxZ) / 2;
      add([5.5, -0.05, z], [5.6, 0.38, maxZ - minZ], '#a7b6ae');
      for (const x of [3.6, 7.4]) add([x, -0.6, z], [0.45, 1, maxZ - minZ - 0.5], '#708b87');
      const outside = z > 0 ? maxZ - 0.05 : minZ + 0.05;
      const inside = z > 0 ? minZ + 0.07 : maxZ - 0.07;
      for (const railZ of [outside, inside]) {
        for (let x = 3; x <= 8; x += 0.65) detail([x, 0.65, railZ], [0.055, 0.8, 0.055], '#748e8b');
        detail([5.5, 1.06, railZ], [5.2, 0.07, 0.07], '#c4d1c7');
        detail([5.5, 0.64, railZ], [5.2, 0.045, 0.045], '#9db2a9');
      }
    });
    // Dashed center line and zebra crossings, all on the actual road height.
    for (let x = -12; x <= 12; x += 2.5) for (const z of [-11, 11]) detail([x, 0.148, z], [1.15, 0.012, 0.07], '#e5e2c4');
    for (let z = -6.5; z <= 6.5; z += 2.5) for (const x of [-17, 17]) detail([x, 0.148, z], [0.07, 0.012, 1.15], '#e5e2c4');
    for (let i = 0; i < 7; i++) for (const x of [-9, 11]) detail([x, 0.15, 9.25 + i * 0.55], [1.3, 0.014, 0.3], '#cdd3c7');
    // Sidewalk pavers.
    for (let x = -12; x <= 12; x += 1.2) for (const z of [-7.6, 7.6]) detail([x, 0.284, z], [0.022, 0.008, 2.25], '#a4b2a7');
    for (let z = -5.8; z <= 5.8; z += 1.2) for (const x of [-13.6, 13.6]) detail([x, 0.284, z], [2.25, 0.008, 0.022], '#a4b2a7');
    // Central pedestrian plaza and planters (outside pedestrian loop).
    add([-2.7, 0.06, 2.75], [6, 0.12, 5.3], '#c1c4ad');
    for (const [x, z] of [[-3, 4], [0.4, 4.6], [0.6, -4.3], [10.3, 3.5]]) {
      add([x, 0.18, z], [1.65, 0.36, 1.65], '#879b89');
      add([x, 0.38, z], [1.45, 0.06, 1.45], '#6b7c54');
    }
    // Benches and street furniture stay outside the moving pedestrian envelope.
    for (const [x, z] of [[-3, 1.3], [-1, 5.7], [11, 5.6], [-11.7, -5.5]]) {
      detail([x, 0.48, z], [1.4, 0.1, 0.42], '#9b7858');
      detail([x, 0.76, z - 0.19], [1.4, 0.42, 0.08], '#ac8b66');
      for (const dx of [-0.48, 0.48]) detail([x + dx, 0.24, z], [0.07, 0.45, 0.36], '#45615f');
    }
    for (const x of [-19.7, 19.7]) for (const z of [-8, 1, 10]) {
      detail([x, 1.8, z], [0.085, 3.6, 0.085], '#4a6363');
      detail([x + (x < 0 ? 0.4 : -0.4), 3.6, z], [0.9, 0.08, 0.12], '#4a6363');
      detail([x + (x < 0 ? 0.75 : -0.75), 3.53, z], [0.45, 0.08, 0.23], '#ece3b8');
    }
    // Flower beds along the outside of the island.
    for (const z of [-15.2, 15.2]) for (const x of [-12, -6, 0, 11, 16]) {
      add([x, 0.12, z], [2.4, 0.24, 0.75], '#77936c');
      for (let i = 0; i < 6; i++) detail([x - 0.9 + i * 0.35, 0.3, z], [0.12, 0.12, 0.16], i % 2 ? '#e2c883' : '#baab95');
    }
    return { blocks, details };
  }, []);
  return <group>
    <Blocks items={blocks} /><Blocks items={details} />
    <Ring outer={[19.35, 13.35, 5.35]} inner={[14.65, 8.65, 0.65]} y={0.09} color="#c1c5b7" />
    <Ring outer={[19.2, 13.2, 5.2]} inner={[14.8, 8.8, 0.8]} y={CITY.road.height} color="#536164" />
    <Ring outer={[14.8, 8.8, 0.8]} inner={[12.4, 6.4, 0.8]} y={CITY.sidewalk.height} color="#c8cabc" />
    {BUILDINGS.map((b, i) => <Building key={b.id} index={i} />)}
    <Vegetation color={vegetationColor} />
  </group>;
}

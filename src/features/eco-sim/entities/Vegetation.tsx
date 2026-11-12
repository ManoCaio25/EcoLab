import { useLayoutEffect, useMemo, useRef } from 'react';
import { Color, InstancedMesh, Object3D } from 'three';
import { Blocks, type Block } from './Building';

const TREES = [
  [-21, -13, 1.15], [-21, -7, 1.1], [-21, -1, 1.3], [-21, 5, 1.2], [-21, 12, 1],
  [-15, 16, 1.1], [-9, 16, 1.2], [-3, 16, 1.05], [1, 16, 0.9],
  [-14, -16, 1.2], [-8, -16, 1], [-2, -16, 1.1], [1, -16, 0.9],
  [21, -13, 1.1], [21, -6, 1.1], [21, 1, 1.25], [21, 8, 1], [20, 15, 1.15],
  [11, 16, 1], [15, -16, 1.2], [10, -16, 0.9],
  [-3, 4, 0.8], [0.4, 4.6, 0.85], [0.6, -4.3, 0.8], [10.3, 3.5, 0.95],
] as const;

export function Vegetation({ color }: { color: string }) {
  const crowns = useRef<InstancedMesh>(null);
  const trunks = useMemo<Block[]>(() => TREES.map(([x, z, s]) => ({ position: [x, 0.8 * s, z], size: [0.21 * s, 1.6 * s, 0.21 * s], color: '#77644d' })), []);
  useLayoutEffect(() => {
    if (!crowns.current) return;
    const object = new Object3D();
    const tint = new Color();
    TREES.forEach(([x, z, s], i) => {
      for (let j = 0; j < 3; j++) {
        object.position.set(x + (j === 1 ? -0.42 : j === 2 ? 0.45 : 0) * s, (j === 0 ? 2.5 : 2.04) * s, z + (j === 2 ? 0.3 : -0.15) * s);
        object.scale.set(0.98 * s, (j === 0 ? 1.18 : 0.9) * s, 0.91 * s);
        object.rotation.set(0, i * 2.4 + j, 0.1 * j);
        object.updateMatrix();
        crowns.current!.setMatrixAt(i * 3 + j, object.matrix);
        tint.set(color).multiplyScalar(0.82 + ((i + j) % 4) * 0.095);
        crowns.current!.setColorAt(i * 3 + j, tint);
      }
    });
    crowns.current.instanceMatrix.needsUpdate = true;
    if (crowns.current.instanceColor) crowns.current.instanceColor.needsUpdate = true;
    crowns.current.computeBoundingSphere();
  }, [color]);
  return <group>
    <Blocks items={trunks} />
    <instancedMesh ref={crowns} args={[undefined, undefined, TREES.length * 3]} castShadow receiveShadow>
      <icosahedronGeometry args={[1, 1]} /><meshStandardMaterial roughness={1} />
    </instancedMesh>
  </group>;
}

import { useLayoutEffect, useMemo, useRef } from 'react';
import { Color, InstancedMesh, Object3D } from 'three';
import { BUILDINGS } from '../config/city';

export interface Block {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  rotation?: number;
}

/** One draw call for many architectural blocks, with per-instance colors. */
export function Blocks({ items, roughness = 0.85, metalness = 0, shadows = true }: { items: Block[]; roughness?: number; metalness?: number; shadows?: boolean }) {
  const ref = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const object = new Object3D();
    const color = new Color();
    items.forEach((block, i) => {
      object.position.set(...block.position);
      object.scale.set(...block.size);
      object.rotation.set(0, block.rotation ?? 0, 0);
      object.updateMatrix();
      ref.current!.setMatrixAt(i, object.matrix);
      ref.current!.setColorAt(i, color.set(block.color));
    });
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
    ref.current.computeBoundingSphere();
  }, [items]);
  return <instancedMesh ref={ref} args={[undefined, undefined, items.length]} castShadow={shadows} receiveShadow>
    <boxGeometry /><meshStandardMaterial roughness={roughness} metalness={metalness} />
  </instancedMesh>;
}

export function Building({ index }: { index: number }) {
  const building = BUILDINGS[index];
  const { solid, glass } = useMemo(() => {
    const { width: w, depth: d, height: h, color, accent } = building;
    const solid: Block[] = [];
    const glass: Block[] = [];
    const add = (position: Block['position'], size: Block['size'], color: string) => solid.push({ position, size, color });
    add([0, h / 2, 0], [w, h, d], color);
    add([0, 0.15, 0], [w + 0.25, 0.3, d + 0.25], '#a7aba4');
    add([0, h + 0.08, 0], [w + 0.2, 0.16, d + 0.2], '#e4e3d7');
    add([0, h + 0.18, 0], [w - 0.25, 0.05, d - 0.25], '#56686a');
    // Parapets and rooftop HVAC / solar panels.
    for (const side of [-1, 1]) {
      add([0, h + 0.3, side * d / 2], [w + 0.18, 0.35, 0.12], color);
      add([side * w / 2, h + 0.3, 0], [0.12, 0.35, d], color);
    }
    add([-w * 0.25, h + 0.38, -d * 0.22], [0.75, 0.4, 0.65], '#b9c4c3');
    for (let i = 0; i < 3; i++) {
      add([w * 0.19, h + 0.28, -d * 0.25 + i * 0.55], [w * 0.36, 0.08, 0.44], '#355666');
      add([w * 0.19, h + 0.33, -d * 0.25 + i * 0.55], [0.025, 0.015, 0.44], '#8ba8ac');
    }
    const floors = Math.floor(h / 1.3);
    const columns = Math.max(2, Math.floor(w / 1.1));
    for (let floor = 0; floor < floors; floor++) {
      const y = 0.8 + floor * 1.3;
      add([0, y + 0.5, d / 2 + 0.06], [w + 0.06, 0.08, 0.15], '#e0dfd2');
      for (let col = 0; col < columns; col++) {
        const x = (col - (columns - 1) / 2) * (w / columns);
        for (const side of [-1, 1]) {
          add([x, y, side * (d / 2 + 0.015)], [0.77, 0.88, 0.06], '#647b7a');
          glass.push({ position: [x, y, side * (d / 2 + 0.05)], size: [0.65, 0.75, 0.04], color: (col + floor) % 4 === 0 ? '#b6c9bf' : '#426975' });
          add([x, y - 0.47, side * (d / 2 + 0.12)], [0.86, 0.09, 0.28], '#deddd0');
          add([x, y, side * (d / 2 + 0.08)], [0.035, 0.8, 0.03], '#b5c5c0');
        }
      }
      for (const side of [-1, 1]) for (let col = 0; col < 2; col++) {
        glass.push({ position: [side * (w / 2 + 0.025), y, (col - 0.5) * d * 0.5], size: [0.04, 0.78, 0.7], color: '#496d75' });
      }
    }
    add([w / 2 - 0.2, h / 2, d / 2 + 0.08], [0.42, h, 0.16], accent);
    add([0, 0.75, d / 2 + 0.13], [0.9, 1.5, 0.15], '#34575c');
    add([0, 1.65, d / 2 + 0.5], [1.8, 0.12, 1.05], accent);
    add([0, 0.09, d / 2 + 0.55], [1.8, 0.18, 1.1], '#c4c7ba');
    if (index === 2) { // Library colonnade.
      for (const x of [-1.9, -0.9, 0.9, 1.9]) add([x, 0.9, d / 2 + 0.5], [0.13, 1.8, 0.13], '#dddcca');
      add([0, 1.86, d / 2 + 0.5], [w, 0.16, 1.2], accent);
    }
    return { solid, glass };
  }, [building, index]);
  return <group position={[building.x, 0.02, building.z]}>
    <Blocks items={solid} /><Blocks items={glass} roughness={0.25} metalness={0.35} />
  </group>;
}

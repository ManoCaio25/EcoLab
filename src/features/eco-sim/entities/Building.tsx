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
    const kind=building.kind ?? (index>=4?'house':index===2?'library':index===3?'shop':'apartment');
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
    const floors = Math.max(1, Math.floor(h / 2.7));
    const columns = Math.max(2, Math.floor(w / 1.1));
    for (let floor = 0; floor < floors; floor++) {
      const y = 1.45 + floor * 2.7;
      add([0, y + 0.5, d / 2 + 0.06], [w + 0.06, 0.08, 0.15], '#e0dfd2');
      for (let col = 0; col < columns; col++) {
        const x = (col - (columns - 1) / 2) * (w / columns);
        for (const side of [-1, 1]) {
          if (floor === 0 && Math.abs(x) < .65 && side === 1) continue;
          add([x, y, side * (d / 2 + 0.015)], [0.88, 1.24, 0.06], '#647b7a');
          glass.push({ position: [x, y, side * (d / 2 + 0.05)], size: [0.76, 1.1, 0.04], color: (col + floor) % 4 === 0 ? '#a9bab0' : '#39575e' });
          add([x, y - 0.65, side * (d / 2 + 0.12)], [0.98, 0.09, 0.28], '#deddd0');
          add([x, y, side * (d / 2 + 0.08)], [0.04, 1.12, 0.03], '#b5c5c0');
          add([x, y+.12, side * (d / 2 + .085)], [.78,.035,.035], '#bdc6bc');
        }
      }
      for (const side of [-1, 1]) for (let col = 0; col < 2; col++) {
        const z=(col-.5)*d*.5;
        add([side*(w/2+.02),y,z],[.055,1.24,.88],'#62736e');
        glass.push({ position: [side * (w / 2 + 0.055), y, z], size: [0.04, 1.1, .76], color: '#49636b' });
        add([side*(w/2+.08),y,z],[.035,1.13,.035],'#b7c0b6');
      }
    }
    add([w / 2 - 0.2, h / 2, d / 2 + 0.08], [0.42, h, 0.16], accent);
    add([0, 1.03, d / 2 + 0.13], [1.05, 2.06, 0.15], '#34575c');
    add([.33, 1.05, d / 2 + .22], [.035,.22,.04], '#c3c4ae');
    add([0, 2.25, d / 2 + 0.5], [1.8, 0.12, 1.05], accent);
    for(let y=.45;y<h-.5;y+=.42) add([0,y,-d/2-.02],[w,.014,.015],'#b0b2a4');
    for(const x of [-w/2+.18,w/2-.18]) add([x,h/2,d/2+.04],[.1,h,.09],'#e1decf');
    if(kind==='house') {
      for(let i=0;i<6;i++) add([0,h+.34+i*.095,0],[w+.25-i*.52,.12,d+.25],'#8b7160');
      add([-.9,h+.62,-.9],[.38,.85,.42],'#b4a18c');
    }
    if(kind==='apartment')for(let floor=1;floor<floors;floor++){
      add([0,floor*2.7+.1,d/2+.32],[w-.5,.12,.7],'#e4dfcc');
      add([0,floor*2.7+.6,d/2+.65],[w-.5,.06,.06],accent);
      for(let x=-w/2+.4;x<w/2-.2;x+=.45)add([x,floor*2.7+.36,d/2+.65],[.035,.5,.035],accent);
    }
    if(kind==='shop'||kind==='market'){
      for(let x=-w/2+.65;x<w/2-.4;x+=1.2){
        glass.push({position:[x,1.1,d/2+.09],size:[1,1.7,.04],color:'#335c68'});
        add([x,2.35,d/2+.5],[1.16,.12,.95],Math.round(x*10)%2?'#e9dcb8':accent);
      }
      add([0,2.82,d/2+.08],[w-.4,.55,.12],accent);

    }
    if(kind==='clinic'){
      add([0,h-.65,d/2+.09],[w,.9,.1],accent);
      add([-w/2+.8,h-.65,d/2+.16],[.16,.65,.08],'#eef4df');
      add([-w/2+.8,h-.65,d/2+.16],[.6,.16,.08],'#eef4df');
      add([0,2.5,d/2+.7],[3.6,.18,1.5],accent);

    }
    if(kind==='school'){
      add([0,h+.12,0],[w+.55,.25,d+.55],'#ca8156');
      add([0,2.8,d/2+.12],[w-.4,.65,.18],accent);
      add([0,2.35,d/2+.35],[w+.1,.16,.8],'#64a7a0');
      for(let x=-w/2+.3;x<w/2;x+=1.8)add([x,1.2,d/2+.65],[.13,2.4,.13],Math.round(x)%2?'#dc9a51':'#5c9ca1');
    }
    add([0, 0.09, d / 2 + 0.55], [1.8, 0.18, 1.1], '#c4c7ba');
    if (index === 2) { // Library colonnade.
      for (const x of [-1.9, -0.9, 0.9, 1.9]) add([x, 1.1, d / 2 + 0.5], [0.13, 2.2, 0.13], '#dddcca');
      add([0, 2.27, d / 2 + 0.5], [w, 0.16, 1.2], accent);
    }
    return { solid, glass };
  }, [building, index]);
  return <group position={[building.x, 0.02, building.z]}>
    <Blocks items={solid} /><Blocks items={glass} roughness={0.25} metalness={0.35} />
  </group>;
}

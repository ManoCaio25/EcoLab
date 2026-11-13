import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, InstancedMesh, Object3D } from 'three';
import { TREES } from '../config/urbanLayout';
import { schoolArtContains } from '../config/schoolArt';
const OUTSIDE_TREES=TREES.filter(([x,z])=>!schoolArtContains(x,z));
import type { Quality } from '../types';
export function Vegetation({color,paused,quality}:{color:string;paused:boolean;quality:Quality}) {
  const crowns=useRef<InstancedMesh>(null),trunks=useRef<InstancedMesh>(null);
  const time=useRef(0);
  const object=useMemo(()=>new Object3D(),[]);
  const updateCrowns=(wind:number)=>{
    if(!crowns.current) return;
    OUTSIDE_TREES.forEach(([x,z,s],i)=>{
      const sway=Math.sin(wind*.7+i*1.7)*.035;
      for(let j=0;j<4;j++){
        object.position.set(x+(j===1?-.53:j===2?.5:0)*s+sway,(j===0?3.05:j===3?2.8:2.45)*s,z+(j===3?.62:j===2?.24:-.22)*s);
        object.scale.set((j===0?1.05:.85)*s,(j===0?1.22:.95)*s,.94*s);
        object.rotation.set(0,i*2.4+j,.1*j);
        object.updateMatrix();crowns.current!.setMatrixAt(i*4+j,object.matrix);
      }
    });
    crowns.current.instanceMatrix.needsUpdate=true;
  };
  useLayoutEffect(()=>{
    if(!crowns.current||!trunks.current)return;
    const tint=new Color();
    OUTSIDE_TREES.forEach(([x,z,s],i)=>{
      object.position.set(x,1.15*s,z);object.scale.set(.16*s,2.3*s,.16*s);object.rotation.set(0,i,0);object.updateMatrix();
      trunks.current!.setMatrixAt(i,object.matrix);
      for(let j=0;j<4;j++) crowns.current!.setColorAt(i*4+j,tint.set(color).multiplyScalar(.8+((i+j)%4)*.085));
    });
    trunks.current.instanceMatrix.needsUpdate=true;
    updateCrowns(time.current);
    if(crowns.current.instanceColor)crowns.current.instanceColor.needsUpdate=true;
    crowns.current.computeBoundingSphere();
    if(crowns.current.boundingSphere)crowns.current.boundingSphere.radius+=.1;
    trunks.current.computeBoundingSphere();
  },[color,object,quality]);
  useFrame((_,delta)=>{
    if(paused||document.hidden)return;
    time.current+=delta;
    updateCrowns(time.current);
  });
  return <group>
    <instancedMesh ref={trunks} args={[undefined,undefined,OUTSIDE_TREES.length]} castShadow receiveShadow><cylinderGeometry args={[.72,1,1,8]}/><meshStandardMaterial color="#6c5b45" roughness={1}/></instancedMesh>
    <instancedMesh ref={crowns} args={[undefined,undefined,OUTSIDE_TREES.length*4]} castShadow receiveShadow><icosahedronGeometry args={[1,quality==='high'?2:1]}/><meshStandardMaterial roughness={.95}/></instancedMesh>
  </group>;
}

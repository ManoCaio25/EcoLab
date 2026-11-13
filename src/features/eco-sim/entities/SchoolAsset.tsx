import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, Group, InstancedMesh, Matrix4, Mesh, Object3D, Vector3 } from 'three';
import type { Material } from 'three';
import { SCHOOL_ASSET_BASE } from '../config/schoolArt';

interface Props {
  file: string; node?: string; position: [number,number,number];
  size?: [number,number,number]; scale?: number; rotation?: number; material?: Material;
  anchor?: 'center' | 'origin'; shadow?: boolean;
}

export interface SchoolPlacement { position: [number,number,number]; scale: number; rotation: number }
export function SchoolAssetInstances({file,node,placements,anchor='center',shadow=true}:{file:string;node?:string;placements:SchoolPlacement[];anchor?:'center'|'origin';shadow?:boolean}){
  const {scene}=useGLTF(`${SCHOOL_ASSET_BASE}${file}.glb`);
  const group=useMemo(()=>{
    const source=node?scene.getObjectByName(node):scene;
    if(!source)throw new Error(`Peça ausente: ${file}/${node}`);
    const normalized=source.clone(true);normalized.updateMatrixWorld(true);
    const box=new Box3().setFromObject(normalized),center=box.getCenter(new Vector3());
    normalized.position.x-=anchor==='center'?center.x:0;
    normalized.position.y-=box.min.y;
    normalized.position.z-=anchor==='center'?center.z:0;
    normalized.updateMatrixWorld(true);
    const result=new Group(),transform=new Object3D(),matrix=new Matrix4();
    normalized.traverse(child=>{
      if(!(child instanceof Mesh))return;
      const instances=new InstancedMesh(child.geometry,child.material,placements.length);
      instances.castShadow=shadow;instances.receiveShadow=true;
      placements.forEach((p,i)=>{
        transform.position.fromArray(p.position);transform.rotation.set(0,p.rotation,0);transform.scale.setScalar(p.scale);transform.updateMatrix();
        matrix.multiplyMatrices(transform.matrix,child.matrixWorld);instances.setMatrixAt(i,matrix);
      });
      instances.instanceMatrix.needsUpdate=true;instances.computeBoundingSphere();result.add(instances);
    });
    return result;
  },[scene,file,node,placements,anchor,shadow]);
  useEffect(()=>()=>{group.traverse(child=>{if(child instanceof InstancedMesh)child.dispose();});},[group]);
  return <primitive object={group} dispose={null}/>;
}
// Share the loader's geometries/textures. Only transforms are cloned per placement.
export function SchoolAsset({file,node,position,size,scale=1,rotation=0,material,anchor='center',shadow=true}:Props){
  const {scene}=useGLTF(`${SCHOOL_ASSET_BASE}${file}.glb`);
  const object=useMemo(()=>{
    const source=node?scene.getObjectByName(node):scene;
    if(!source)throw new Error(`Peça ausente: ${file}/${node}`);
    const clone=source.clone(true);clone.updateMatrixWorld(true);
    const box=new Box3().setFromObject(clone), extent=box.getSize(new Vector3()),center=box.getCenter(new Vector3());
    const wrapper=new Group();wrapper.add(clone);
    clone.position.x-=anchor==='center'?center.x:0;
    clone.position.y-=box.min.y;
    clone.position.z-=anchor==='center'?center.z:0;
    if(size)wrapper.scale.set(size[0]/Math.max(extent.x,.001),size[1]/Math.max(extent.y,.001),extent.z>.001?size[2]/extent.z:1);
    clone.traverse(child=>{if(child instanceof Mesh){child.castShadow=shadow;child.receiveShadow=true;if(material)child.material=material;}});
    return wrapper;
  },[scene,node,file,size?.[0],size?.[1],size?.[2],material,anchor,shadow]);
  return <primitive object={object} position={position} rotation={[0,rotation,0]} scale={size?object.scale:scale} dispose={null}/>;
}

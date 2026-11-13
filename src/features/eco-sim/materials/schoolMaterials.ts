import { useEffect, useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial, PMREMGenerator, RepeatWrapping, SRGBColorSpace, Vector2 } from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { SCHOOL_ASSET_BASE } from '../config/schoolArt';

export function useSchoolMaterial(id:string,repeat:[number,number]=[1,1],color='#ffffff'){
  const maps=useTexture(['color','normal','arm'].map(map=>`${SCHOOL_ASSET_BASE}${id}-${map}.webp`));
  const material=useMemo(()=>{
    const [map,normal,arm]=maps.map(texture=>{
      const clone=texture.clone();clone.wrapS=clone.wrapT=RepeatWrapping;
      clone.repeat.set(...repeat);clone.anisotropy=4;clone.needsUpdate=true;return clone;
    });
    map.colorSpace=SRGBColorSpace;
    return new MeshStandardMaterial({map,normalMap:normal,aoMap:arm,roughnessMap:arm,metalnessMap:arm,
      metalness:0,roughness:1,normalScale:new Vector2(.65,.65),aoMapIntensity:.8,color});
  },[maps[0],maps[1],maps[2],repeat[0],repeat[1],color]);
  useEffect(()=>()=>{material.map?.dispose();material.normalMap?.dispose();material.aoMap?.dispose();material.dispose();},[material]);
  return material;
}

// A small, prefiltered studio environment supplies reflections only to pilot materials.
// No global scene.environment, extra lights, network HDRI or per-frame reflection render.
export function useSchoolAssetEnvironment(tree:string){
  const gl=useThree(s=>s.gl);
  const assets=useGLTF([tree,'facade','bench','fence','grass','shrub'].map(file=>`${SCHOOL_ASSET_BASE}${file}.glb`));
  const environment=useMemo(()=>{
    const generator=new PMREMGenerator(gl),room=new RoomEnvironment();
    const target=generator.fromScene(room,.04);room.dispose();generator.dispose();return target;
  },[gl]);
  useEffect(()=>{
    const materials=new Set<MeshStandardMaterial>();
    for(const asset of assets)asset.scene.traverse(child=>{
      if(child instanceof Mesh)for(const material of Array.isArray(child.material)?child.material:[child.material])if(material instanceof MeshStandardMaterial)materials.add(material);
    });
    for(const material of materials){material.envMap=environment.texture;material.envMapIntensity=.35;material.needsUpdate=true;}
    return ()=>{for(const material of materials){material.envMap=null;material.needsUpdate=true;}};
  },[assets,environment]);
  useEffect(()=>()=>environment.dispose(),[environment]);
}

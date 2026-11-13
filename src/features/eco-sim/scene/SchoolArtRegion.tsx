import { useMemo } from 'react';
import { SchoolAsset, SchoolAssetInstances, type SchoolPlacement } from '../entities/SchoolAsset';
import { SCHOOL_BENCHES, SCHOOL_TREES } from '../config/schoolArt';
import { CAMPUS_OBSTACLES, URBAN_SURFACES } from '../config/urbanLayout';
import { useSchoolAssetEnvironment, useSchoolMaterial } from '../materials/schoolMaterials';
import type { Quality } from '../types';
import { SCHOOL_QUALITY } from '../config/quality';

const treePlacements:SchoolPlacement[]=SCHOOL_TREES.map(([x,z,s],i)=>({position:[x,.02,z],scale:s*1.25,rotation:i*2.399}));

function Surface({id}:{id:string}){
  const surface=URBAN_SURFACES.find(s=>s.id===id)!;
  const b=surface.bounds,w=b.maxX-b.minX,d=b.maxZ-b.minZ;
  const material=useSchoolMaterial(surface.kind==='road'?'asphalt_02':'concrete_pavement',[w/3,d/3]);
  return <mesh position={[(b.minX+b.maxX)/2,surface.height+.004,(b.minZ+b.maxZ)/2]} rotation={[-Math.PI/2,0,0]} receiveShadow material={material}><planeGeometry args={[w,d]}/></mesh>;
}

export function SchoolArtRegion({quality}:{quality:Quality}){
  const profile=SCHOOL_QUALITY[quality];
  const grasses=useMemo(()=>['c','d','e'].map((node,index)=>({node,placements:[.45,2.66,8.38].flatMap((x,side)=>
    Array.from({length:profile.grassPerBank},(_,i)=>({position:[x+(side?0:Math.sin(i*12.3)*.16),side===1?.3:.03,14+(i+.4)*(12/profile.grassPerBank)] as [number,number,number],scale:side?.6:1.1,rotation:i*2.39})).filter((_,i)=>i%3===index))})),[profile]);
  const brick=useSchoolMaterial('red_brick',[1.5,1.5]);
  const bankBrick=useSchoolMaterial('red_brick',[7.35,.45],'#b6aea0');
  const roof=useSchoolMaterial('concrete_pavement',[3,1.5],'#aaa89c');
  const soil=useSchoolMaterial('brown_mud_leaves_01',[1,4]);
  useSchoolAssetEnvironment(profile.tree);
  return <group name="school-art-region">
    <group name="school-external-facade">
      {[18.4,22.8].map(z=><group key={z}>
        {[-25,-22,-19].map(x=><group key={x} position={[x,.28,z]} rotation={[0,z===18.4?Math.PI:0,0]}>
          <SchoolAsset file="facade" node={x===-22?'wall_door_centered_large_01':'wall_window_centered_large_01'} position={[0,0,0]} size={[3,3,.2]} material={brick}/>
          <SchoolAsset file="facade" node={x===-22?'door_centered_large_01':'window_centered_large_01'} position={[0,x===-22?0:.59,.02]} size={x===-22?[1.8,2.33,.235]:[2.22,1.745,.217]}/>
          <SchoolAsset file="facade" node="cornice01_standard_standard_01" position={[0,3,0]} size={[3,.15,.17]}/>
        </group>)}
      </group>)}
      {[-26.5,-17.5].map(x=>[19.5,21.7].map(z=><group key={`${x}/${z}`} position={[x,.28,z]} rotation={[0,x===-26.5?-Math.PI/2:Math.PI/2,0]}>
        <SchoolAsset file="facade" node="wall_window_centered_large_01" position={[0,0,0]} size={[2.2,3,.2]} material={brick}/>
        <SchoolAsset file="facade" node="window_centered_large_01" position={[0,.59,.02]} size={[1.628,1.745,.217]}/>
      </group>))}
      <mesh position={[-22,3.47,20.6]} material={roof} castShadow receiveShadow><boxGeometry args={[9,.2,4.4]}/></mesh>
      <mesh position={[-22,.31,20.6]} material={roof} receiveShadow><boxGeometry args={[9,.06,4.4]}/></mesh>
      {/* Retain the original canopy supports and their collision footprints. */}
      {Array.from({length:5},(_,i)=><mesh key={i} position={[-26.2+i*1.8,1.55,23.45]} castShadow><boxGeometry args={[.14,2.55,.14]}/><meshStandardMaterial color="#3e5551" roughness={.55}/></mesh>)}
      <mesh position={[-22,2.86,23.1]} castShadow material={roof}><boxGeometry args={[8.8,.12,.85]}/></mesh>
    </group>
    {['rua-escola','praca-escola','margem-oeste-sul','margem-leste-sul','acesso-margem-sul'].map(id=><Surface key={id} id={id}/>)}
    <SchoolAssetInstances file={profile.tree} placements={treePlacements} anchor="origin"/>
    {SCHOOL_BENCHES.map(([x,z],i)=><SchoolAsset key={`bench-${i}`} file="bench" position={[x,.28,z]} size={[1.4,.82,.48]}/>)}
    <SchoolAsset file="shrub" position={[-29.5,.26,24]} size={[1.65,.55,.75]}/>
    {CAMPUS_OBSTACLES.filter(o=>o.id.startsWith('quadra')).map(o=>{
      const b=o.bounds,w=b.maxX-b.minX,d=b.maxZ-b.minZ,horizontal=w>d,length=Math.max(w,d),count=Math.ceil(length/2);
      return Array.from({length:count},(_,i)=><SchoolAsset key={`${o.id}-${i}`} file="fence" node="modular_chainlink_fence_double"
        position={[horizontal?b.minX+(i+.5)*length/count:(b.minX+b.maxX)/2,.3,horizontal?(b.minZ+b.maxZ)/2:b.minZ+(i+.5)*length/count]}
        rotation={horizontal?0:Math.PI/2} size={[length/count,1.1,.045]}/>);
    })}
    {[2.85,8.15].map(x=><mesh key={x} position={[x,-.17,20.65]} material={bankBrick} receiveShadow><boxGeometry args={[.31,.9,14.7]}/></mesh>)}
    {[.45,8.38].map((x,side)=><group key={x}>
      <mesh position={[x,.023,20.2]} rotation={[-Math.PI/2,0,0]} material={soil} receiveShadow><planeGeometry args={[side?.2:.65,12.7]}/></mesh>
    </group>)}
    {grasses.map(({node,placements})=><SchoolAssetInstances key={node} file="grass" node={`grass_medium_02_${node}`} placements={placements} shadow={false}/>)}
  </group>;
}

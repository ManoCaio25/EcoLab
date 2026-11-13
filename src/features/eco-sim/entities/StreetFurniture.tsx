import { useLayoutEffect, useMemo, useRef } from 'react';
import { InstancedMesh, Object3D } from 'three';
import { BENCHES, BINS, LAMPS, SIGNS, BICYCLES, SHRUBS, PLACE_SIGNS } from '../config/urbanLayout';
import { schoolArtContains } from '../config/schoolArt';
import { Blocks, type Block } from './Building';
export function StreetFurniture() {
  const wheels=useRef<InstancedMesh>(null);
  useLayoutEffect(()=>{
    if(!wheels.current)return;const object=new Object3D();
    BICYCLES.forEach(([x,z],i)=>{for(const side of [-1,1]){object.position.set(x+side*.53,.39,z);object.updateMatrix();wheels.current!.setMatrixAt(i*2+(side===1?1:0),object.matrix);}});
    wheels.current.instanceMatrix.needsUpdate=true;wheels.current.computeBoundingSphere();
  },[]);
  const {wood,metal,details}=useMemo(()=>{
    const wood:Block[]=[],metal:Block[]=[],details:Block[]=[];
    for(const [x,z] of BENCHES) {
      if(schoolArtContains(x,z))continue;
      for(let i=0;i<4;i++) wood.push({position:[x,.49,z-.17+i*.11],size:[1.4,.065,.085],color:'#98744d'});
      for(let i=0;i<3;i++) wood.push({position:[x,.68+i*.105,z-.2],size:[1.4,.075,.06],color:'#aa865b'});
      for(const dx of [-.51,.51]) metal.push({position:[x+dx,.25,z],size:[.055,.48,.38],color:'#334a49'});
    }
    for(const [x,z] of LAMPS) {
      metal.push({position:[x,1.8,z],size:[.075,3.6,.075],color:'#425554'});
      metal.push({position:[x,.09,z],size:[.22,.18,.22],color:'#53625f'});
      metal.push({position:[x+.35,3.6,z],size:[.78,.08,.13],color:'#425554'});
      details.push({position:[x+.62,3.54,z],size:[.34,.07,.2],color:'#eee4bf'});
    }
    for(const [x,z] of BINS) {
      metal.push({position:[x,.4,z],size:[.44,.8,.44],color:'#375d51'});
      details.push({position:[x,.83,z],size:[.48,.06,.48],color:'#506e63'});
      details.push({position:[x,.63,z+.225],size:[.27,.13,.012],color:'#172f2a'});
      details.push({position:[x,.4,z+.226],size:[.12,.13,.012],color:'#bdd2a0'});
    }
    for(const [x,z] of SIGNS) {
      metal.push({position:[x,.85,z],size:[.06,1.7,.06],color:'#455b57'});
      details.push({position:[x,1.65,z],size:[.75,.48,.08],color:'#406e64'});
      details.push({position:[x,1.7,z+.046],size:[.48,.035,.01],color:'#d2dfbf'});
      details.push({position:[x-.09,1.59,z+.046],size:[.3,.025,.01],color:'#aecab4'});
    }
    BICYCLES.forEach(([x,z],i)=>{
      const color=i%2?'#c7905f':'#5b9ea0';
      metal.push({position:[x,.53,z],size:[1.05,.06,.06],color});
      metal.push({position:[x,.85,z],size:[.75,.05,.06],color});
      for(const dx of [-.36,.53])metal.push({position:[x+dx,.69,z],size:[.055,.62,.055],color});
      details.push({position:[x-.35,1.03,z],size:[.3,.065,.16],color:'#384c4c'});
      metal.push({position:[x+.53,1.06,z],size:[.06,.06,.45],color:'#526a64'});
      metal.push({position:[x,.4,z+.18],size:[.04,.8,.04],color:'#849a92'});
    });
    // Shrub beds leave the pedestrian routes open and soften the large lawns.
    for(const [x,z] of SHRUBS){
      if(schoolArtContains(x,z))continue;
      wood.push({position:[x,.13,z],size:[1.7,.26,.8],color:'#a3ab8f'});
      for(let i=0;i<4;i++)details.push({position:[x-.6+i*.4,.48,z],size:[.55,.55,.7],color:i%2?'#71915c':'#597c52'});
    }
    for(const [x,z] of PLACE_SIGNS)for(const dx of [-1.4,1.4])metal.push({position:[x+dx,.8,z-.04],size:[.07,1.6,.07],color:'#607e73'});
    return {wood,metal,details};
  },[]);
  return <group><Blocks items={wood}/><Blocks items={metal} roughness={.6} metalness={.3}/><Blocks items={details}/>
    <instancedMesh ref={wheels} args={[undefined,undefined,BICYCLES.length*2]} castShadow><torusGeometry args={[.34,.035,5,16]}/><meshStandardMaterial color="#344b4b" roughness={.9}/></instancedMesh>
  </group>;
}

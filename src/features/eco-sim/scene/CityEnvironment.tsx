import { useMemo } from 'react';
import { Path, Shape } from 'three';
import { BUILDINGS, CITY } from '../config/city';
import { PLANTERS, URBAN_SURFACES } from '../config/urbanLayout';
import { Building, Blocks, type Block } from '../entities/Building';
import { Vegetation } from '../entities/Vegetation';
import { StreetFurniture } from '../entities/StreetFurniture';
import type { Quality } from '../types';
function rounded<T extends Path>(path:T,x:number,z:number,r:number):T {
  path.moveTo(-x+r,-z);
  path.lineTo(x-r,-z);path.absarc(x-r,-z+r,r,-Math.PI/2,0,false);
  path.lineTo(x,z-r);path.absarc(x-r,z-r,r,0,Math.PI/2,false);
  path.lineTo(-x+r,z);path.absarc(-x+r,z-r,r,Math.PI/2,Math.PI,false);
  path.lineTo(-x,-z+r);path.absarc(-x+r,-z+r,r,Math.PI,Math.PI*1.5,false);
  path.closePath();return path;
}
function Ring({outer,inner,y,color}:{outer:[number,number,number];inner:[number,number,number];y:number;color:string}) {
  const shape=useMemo(()=>{const s=rounded(new Shape(),...outer);s.holes.push(rounded(new Path(),...inner));return s;},[outer[0],outer[1],outer[2],inner[0],inner[1],inner[2]]);
  return <mesh rotation={[-Math.PI/2,0,0]} position={[0,y,0]} receiveShadow><shapeGeometry args={[shape,20]}/><meshStandardMaterial color={color} roughness={.96}/></mesh>;
}
export function CityEnvironment({vegetationColor,paused,quality}:{vegetationColor:string;paused:boolean;quality:Quality}) {
  const {blocks,details}=useMemo(()=>{
    const blocks:Block[]=[],details:Block[]=[];
    const add=(position:Block['position'],size:Block['size'],color:string)=>blocks.push({position,size,color});
    const detail=(position:Block['position'],size:Block['size'],color:string)=>details.push({position,size,color});
    const {halfWidth:w,halfDepth:d,canal}=CITY;
    for(const [left,right] of [[-w,canal.minX],[canal.maxX,w]]) {
      add([(left+right)/2,-.85,0],[right-left,1.7,d*2],'#53625a');
      add([(left+right)/2,-.035,0],[right-left,.09,d*2],'#899879');
    }
    add([5.5,-1.05,0],[5,1.1,d*2],'#3d5550');
    for(const x of [2.85,8.15]) for(const [start,end] of [[-d,-13.2],[-6.4,6.4],[13.2,d]]) {
      add([x,-.17,(start+end)/2],[.3,.9,end-start],'#9da99b');
      for(let z=start+.3;z<end;z+=.65) detail([x,.285,z],[.35,.06,Math.min(.61,end-z)],'#c4c7b5');
      for(let y=-.5;y<.2;y+=.24) detail([x,-.02+y,(start+end)/2],[.307,.018,end-start],'#788d84');
    }
    CITY.bridges.forEach(({minZ,maxZ})=>{
      const z=(minZ+maxZ)/2;
      add([5.5,-.05,z],[5.6,.38,maxZ-minZ],'#9aa99f');
      for(const x of [3.6,7.4]) add([x,-.6,z],[.45,1,maxZ-minZ-.5],'#708b87');
      for(const railZ of [minZ+.07,maxZ-.07]) {
        for(let x=3;x<=8;x+=.65) detail([x,.65,railZ],[.055,.8,.055],'#637c77');
        detail([5.5,1.06,railZ],[5.2,.07,.07],'#bccbc0');
        detail([5.5,.64,railZ],[5.2,.045,.045],'#8fa69c');
      }
    });
    for(const s of URBAN_SURFACES) {
      const b=s.bounds;
      add([(b.minX+b.maxX)/2,s.height/2-.0006,(b.minZ+b.maxZ)/2],[b.maxX-b.minX,s.height,b.maxZ-b.minZ],s.kind==='road'?'#4d5758':s.kind==='plaza'?'#b8b6a0':'#c0c1af');
      if(s.kind!=='road') for(let z=b.minZ+.6;z<b.maxZ;z+=.9) detail([(b.minX+b.maxX)/2,s.height+.002,z],[b.maxX-b.minX,.003,.014],'#959f91');
    }
    for(let x=-12;x<=12;x+=2.5) for(const z of [-11,11]) detail([x,.148,z],[1.15,.012,.07],'#dedac0');
    for(let z=-6.5;z<=6.5;z+=2.5) for(const x of [-17,17]) detail([x,.148,z],[.07,.012,1.15],'#dedac0');
    for(let z=-9;z<10;z+=2) detail([-21.8,.148,z],[.045,.01,.8],'#c9c9ad');
    for(let i=0;i<7;i++) for(const x of [-9,11]) detail([x,.15,9.25+i*.55],[1.3,.014,.3],'#d0d1bd');
    for(let i=0;i<6;i++) detail([15.1+i*.65,.15,0],[.32,.014,1.4],'#d0d1bd');
    for(let x=-12;x<=12;x+=1.2) for(const z of [-7.6,7.6]) detail([x,.284,z],[.022,.008,2.25],'#9daa9d');
    for(let z=-5.8;z<=5.8;z+=1.2) for(const x of [-13.6,13.6]) detail([x,.284,z],[2.25,.008,.022],'#9daa9d');
    for(const [x,z] of PLANTERS) {
      add([x,.18,z],[1.65,.36,1.65],'#84917e');
      add([x,.38,z],[1.45,.06,1.45],'#576c46');
    }
    for(const x of [2.66,8.43]) for(let z=-21;z<22;z+=.7) {
      if(CITY.bridges.some(b=>z>b.minZ-.4&&z<b.maxZ+.4)) continue;
      for(let i=0;i<3;i++) detail([x+(i-1)*.055,.3+(i%2)*.07,z],[.035,.48+(i%2)*.14,.065],i%2?'#889066':'#526d4c');
    }
    for(const z of [-19.2,19.2]) for(const x of [-12,-6,0,11,16]) {
      add([x,.12,z],[2.4,.24,.75],'#73845e');
      for(let i=0;i<6;i++) detail([x-.9+i*.35,.3,z],[.12,.12,.16],i%2?'#d2bd83':'#bba495');
    }
    return {blocks,details};
  },[]);
  return <group name="city-environment">
    <Blocks items={blocks}/><Blocks items={details}/>
    <Ring outer={[19.35,13.35,5.35]} inner={[14.65,8.65,.65]} y={.09} color="#b0b7a6"/>
    <Ring outer={[19.2,13.2,5.2]} inner={[14.8,8.8,.8]} y={CITY.road.height} color="#4d5758"/>
    <Ring outer={[14.8,8.8,.8]} inner={[12.4,6.4,.8]} y={CITY.sidewalk.height} color="#c2c4b3"/>
    {BUILDINGS.map((b,i)=><Building key={b.id} index={i}/>)}
    <StreetFurniture/><Vegetation color={vegetationColor} paused={paused} quality={quality}/>
  </group>;
}

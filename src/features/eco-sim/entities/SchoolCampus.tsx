import { useMemo } from 'react';
import { Blocks, type Block } from './Building';


export function SchoolCampus(){
  const blocks=useMemo(()=>{
    const items:Block[]=[];
    const add=(position:Block['position'],size:Block['size'],color:string)=>items.push({position,size,color});
    // Small multi-sport court, with a clear entrance on its west edge.
    add([-9.5,.3,23],[10.2,.05,6.8],'#5b9d94');
    add([-9.5,.335,23],[8.9,.02,5.6],'#cb9670');
    for(const x of [-13.95,-5.05])add([x,.35,23],[.055,.012,5.6],'#f0e7cc');
    for(const z of [20.2,25.8])add([-9.5,.35,z],[8.9,.012,.055],'#f0e7cc');
    add([-9.5,.35,23],[.055,.012,5.6],'#f0e7cc');
    for(const x of [-13.6,-5.4]){
      for(const z of [22.1,23.9])add([x,1.05,z],[.07,1.4,.07],'#f2e9d4');
      add([x,1.75,23],[.07,.07,1.87],'#f2e9d4');
      for(let z=22.2;z<23.9;z+=.25)add([x,.9,z],[.025,1.1,.025],'#d6daca');
    }
    // Court fences are external GLBs in SchoolArtRegion.
    // Playground: soft surface, tower, steps, slide and two swings.
    add([-22.8,.31,25],[8,.08,3.6],'#d8b573');
    for(const x of [-25,-24])for(const z of [24.1,25.1])add([x,1,z],[.09,1.4,.09],'#689c97');
    add([-24.5,1.45,24.6],[1.2,.12,1.2],'#e8b55d');
    add([-24.5,2.45,24.6],[1.45,.18,1.45],'#c77b58');
    for(const x of [-25,-24])add([x,1.95,24.1],[.08,.95,.08],'#6a9a9a');
    for(let i=0;i<8;i++)add([-24.5,1.4-i*.13,25.25+i*.14],[.6,.09,.23],'#70b4b0');
    for(let i=0;i<5;i++)add([-25.25-i*.12,.4+i*.2,24.5],[.2,.08,.65],'#b58c5e');
    for(const x of [-21.8,-19])add([x,1.4,24.9],[.1,2.2,.1],'#dc9a55');
    add([-20.4,2.5,24.9],[3,.11,.12],'#dc9a55');
    for(const x of [-21,-19.8]){
      for(const dx of [-.23,.23])add([x+dx,1.7,24.9],[.025,1.5,.025],'#537879');
      add([x,.95,24.9],[.6,.08,.28],'#638d90');
    }
    // Low entrance posts establish the campus without closing its public access.
    for(const x of [-27.5,-17.8]){add([x,.85,18],[.25,1.1,.25],'#dfa65e');add([x,1.45,18],[.35,.12,.35],'#eee0bc');}
    return items;
  },[]);
  return <group name="school-campus"><Blocks items={blocks}/>
    <mesh rotation={[-Math.PI/2,0,0]} position={[-9.5,.36,23]}><ringGeometry args={[.94,1,40]}/><meshStandardMaterial color="#f0e7cc"/></mesh>
  </group>;
}

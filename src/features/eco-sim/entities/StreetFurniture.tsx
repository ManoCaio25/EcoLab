import { useMemo } from 'react';
import { BENCHES, BINS, LAMPS, SIGNS } from '../config/urbanLayout';
import { Blocks, type Block } from './Building';
export function StreetFurniture() {
  const {wood,metal,details}=useMemo(()=>{
    const wood:Block[]=[],metal:Block[]=[],details:Block[]=[];
    for(const [x,z] of BENCHES) {
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
    return {wood,metal,details};
  },[]);
  return <group><Blocks items={wood}/><Blocks items={metal} roughness={.6} metalness={.3}/><Blocks items={details}/></group>;
}

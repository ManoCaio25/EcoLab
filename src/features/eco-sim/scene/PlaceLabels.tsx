import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { PLACES } from '../config/places';

function Sign({text,color,position,width=6}:{text:string;color:string;position:readonly [number,number,number];width?:number}){
  const texture=useMemo(()=>{
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=160;
    const ctx=canvas.getContext('2d')!;
    ctx.fillStyle='#244b4a';ctx.fillRect(0,0,1024,160);
    ctx.fillStyle=color;ctx.fillRect(0,142,1024,18);
    ctx.fillStyle='#fff8e6';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='600 64px Segoe UI, sans-serif';
    ctx.fillText(text,512,76,960);
    const map=new CanvasTexture(canvas);map.colorSpace=SRGBColorSpace;return map;
  },[text,color]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <mesh position={position}><planeGeometry args={[width,width*160/1024]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>;
}
export function PlaceLabels(){return <group name="place-signs">
  <Sign text="ESCOLA DAS ÁGUAS" color="#efb85f" position={[-22,3.18,22.94]} width={5.2}/>
  <Sign text="MERCADO • RIBEIRINHO" color="#edab7c" position={[-15,2.85,-22.735]} width={6.2}/>
  <Sign text="PADARIA" color="#edab7c" position={[-25,2.85,-22.835]} width={4.8}/>
  <Sign text="SAÚDE • DISTRITO" color="#91d6cd" position={[25,3.48,-22.75]} width={5.2}/>
  <Sign text="CAFÉ" color="#91d6cd" position={[10.2,2.85,-.98]} width={2}/>
  <Sign text="LIVRARIA" color="#91d6cd" position={[-5,2.85,-22.835]} width={4}/>
  {PLACES.filter(p=>p.id==='parque'||p.id==='vila').map(p=><Sign key={p.id} text={p.name.toLocaleUpperCase('pt-BR')} color={p.color} position={p.id==='parque'?[21.4,1.7,-2.5]:[-27,2.1,10]} width={p.id==='parque'?4:3.6}/>)}
</group>;}

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, Group, InstancedMesh, Matrix4, Object3D } from 'three';
import { PEDESTRIANS, PEDESTRIAN_ROUTES } from '../config/routes';
import { advanceMotion, createMotion, sampleRoute } from '../movement/route';

type Part = { actor:number; shape:'box'|'round'; position:[number,number,number]; size:[number,number,number]; color:string; limb?:number; pivot?:number };
/** The entire population shares two geometries/materials; matrices animate outside React. */
export function Pedestrians({ paused }: { paused:boolean }) {
  const boxes=useRef<InstancedMesh>(null),rounds=useRef<InstancedMesh>(null);
  const actors=useRef<(Group|null)[]>([]);
  const object=useMemo(()=>new Object3D(),[]),root=useMemo(()=>new Object3D(),[]),matrix=useMemo(()=>new Matrix4(),[]);
  const citizens=useMemo(()=>PEDESTRIANS.map(config=>{
    const route=PEDESTRIAN_ROUTES[config.route];
    const stop=config.stop?{distance:route.length*.2,duration:2.5}:undefined;
    return {config,route,stop,motion:createMotion(route.length*config.offset,route.length,stop),pose:sampleRoute(route,route.length*config.offset),amplitude:1};
  }),[]);
  const parts=useMemo(()=>{
    const result:Part[]=[];
    PEDESTRIANS.forEach((c,actor)=>{
      const add=(shape:Part['shape'],position:Part['position'],size:Part['size'],color:string,limb?:number,pivot?:number)=>result.push({actor,shape,position,size,color,limb,pivot});
      add('round',[0,1.04,0],[.24*c.build,.32,.16],c.color);
      add('round',[0,1.47,.015],[.18,.21,.17],c.skin);
      add('round',[0,1.61,-.025],[.185,.105,.17],c.hair);
      if(c.hairstyle===1)add('round',[0,1.4,-.14],[.17,.23,.08],c.hair);
      if(c.hairstyle===2)for(const side of [-1,1])add('round',[side*.14,1.58,-.02],[.11,.13,.14],c.hair);
      if(c.hairstyle===3)add('round',[0,1.55,-.2],[.09,.12,.1],c.hair);
      if(c.skirt)add('box',[0,.77,0],[.46,.3,.31],c.pants);
      for(const side of [-1,1]){
        add('box',[side*.105,.48,0],[.14,.6,.16],c.pants,side,.79);
        add('box',[side*.105,.09,.06],[.17,.13,.27],actor%3?'#e8e3d0':'#37474c',side,.79);
        add('box',[side*.25,1.08,0],[.13,.29,.16],c.color,-side,1.22);
        add('box',[side*.25,.86,0],[.105,.18,.12],c.skin,-side,1.22);
      }
      if(c.accessory===0)add('box',[0,1.05,-.2],[.3,.36,.14],actor%2?'#ba8657':'#376c6c');
      if(c.accessory===1){add('box',[0,1.67,.04],[.38,.07,.34],c.pants);add('box',[0,1.64,.22],[.32,.035,.16],c.pants);}
      if(c.accessory===2)add('box',[.31,.65,.02],[.18,.3,.24],'#ceb781');
      if(c.accessory===3){add('box',[0,1.5,.185],[.29,.065,.025],'#30464e');add('box',[0,1.29,.13],[.13,.18,.04],'#e8c077');}
      if(c.accessory===4)add('box',[0,1.06,.165],[.38,.07,.025],'#e9e5cc');
    });
    return {box:result.filter(p=>p.shape==='box'),round:result.filter(p=>p.shape==='round')};
  },[]);
  const update=()=>{
    for(const [shape,mesh] of [['box',boxes.current],['round',rounds.current]] as const){
      if(!mesh)continue;
      parts[shape].forEach((part,i)=>{
        const c=citizens[part.actor],h=c.config.height;
        root.position.set(c.pose.x,c.pose.y,c.pose.z);root.rotation.set(0,c.pose.heading,0);root.scale.setScalar(h);root.updateMatrix();
        let [x,y,z]=part.position;
        const swing=Math.sin(c.motion.travelled*7)*.45*c.amplitude;
        const angle=part.limb?swing*part.limb:0;
        if(part.pivot!==undefined){const d=y-part.pivot;y=part.pivot+d*Math.cos(angle);z+=d*Math.sin(angle);}
        else y+=Math.abs(Math.sin(c.motion.travelled*7))*.016*c.amplitude;
        object.position.set(x,y,z);object.rotation.set(angle,0,0);object.scale.set(...part.size);object.updateMatrix();
        matrix.multiplyMatrices(root.matrix,object.matrix);mesh.setMatrixAt(i,matrix);
      });
      mesh.instanceMatrix.needsUpdate=true;
    }
    citizens.forEach((c,i)=>{const actor=actors.current[i];if(actor){actor.position.set(c.pose.x,c.pose.y,c.pose.z);actor.rotation.y=c.pose.heading;}});
  };
  useLayoutEffect(()=>{
    const color=new Color();
    for(const [shape,mesh] of [['box',boxes.current],['round',rounds.current]] as const){
      if(!mesh)continue;parts[shape].forEach((part,i)=>mesh.setColorAt(i,color.set(part.color)));
      if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;
    }
    update();
  },[parts]);
  useFrame((_,delta)=>{
    if(paused||document.hidden)return;
    citizens.forEach(c=>{
      advanceMotion(c.motion,Math.min(delta,.1),c.config.speed,c.route.length,c.stop,c.motion);
      sampleRoute(c.route,c.motion.distance,c.pose);
      c.amplitude+=((c.motion.wait>0?0:1)-c.amplitude)*(1-Math.exp(-delta*10));
    });update();
  });
  return <group name="citizens">
    <instancedMesh ref={boxes} args={[undefined,undefined,parts.box.length]} frustumCulled={false} castShadow><boxGeometry/><meshStandardMaterial roughness={.95}/></instancedMesh>
    <instancedMesh ref={rounds} args={[undefined,undefined,parts.round.length]} frustumCulled={false} castShadow><sphereGeometry args={[1,10,8]}/><meshStandardMaterial roughness={.95}/></instancedMesh>
    {PEDESTRIANS.map((c,i)=><group key={c.id} name={`pedestrian-${i}`} ref={value=>{actors.current[i]=value;}}/>)}
  </group>;
}

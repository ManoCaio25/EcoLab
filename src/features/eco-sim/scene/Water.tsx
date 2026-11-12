import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color } from 'three';
import { CITY } from '../config/city';
export function Water({paused,color,segments}:{paused:boolean;color:string;segments:number}) {
  const uniforms=useMemo(()=>({time:{value:0},tint:{value:new Color(color)}}),[color]);
  useFrame((_,delta)=>{if(!paused&&!document.hidden)uniforms.time.value+=delta;});
  return <mesh name="water" position={[(CITY.canal.minX+CITY.canal.maxX)/2,CITY.canal.waterHeight,0]} rotation={[-Math.PI/2,0,0]}>
    <planeGeometry args={[CITY.canal.maxX-CITY.canal.minX,CITY.halfDepth*2,segments,segments*2]}/>
    <shaderMaterial uniforms={uniforms} vertexShader={`
      uniform float time;
      varying vec2 vUv;
      varying vec3 vWorld;
      void main(){
        vUv=uv;
        vec3 p=position;
        p.z+=sin(p.x*2.3+p.y*.8+time*.9)*.018+sin(p.y*2.4-time*1.1)*.012;
        vWorld=(modelMatrix*vec4(p,1.)).xyz;
        gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);
      }`} fragmentShader={`
      uniform float time;
      uniform vec3 tint;
      varying vec2 vUv;
      varying vec3 vWorld;
      void main(){
        float wave=sin(vWorld.z*2.4-time*1.1);
        vec3 normal=normalize(vec3(cos(vWorld.x*2.3+vWorld.z*.8+time*.9)*.055,1.,cos(vWorld.z*2.4-time*1.1)*.045));
        vec3 view=normalize(cameraPosition-vWorld);
        float fresnel=pow(1.-max(dot(normal,view),0.),4.);
        vec3 light=normalize(vec3(-.5,1.,.4));
        float spec=pow(max(dot(normal,normalize(view+light)),0.),180.);
        float edge=pow(abs(vUv.x*2.-1.),12.);
        vec3 water=mix(tint*.65,vec3(.43,.62,.66),fresnel*.75);
        water+=spec*.48+wave*.008+edge*vec3(.055,.065,.025);
        gl_FragColor=vec4(water,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`}/>
  </mesh>;
}

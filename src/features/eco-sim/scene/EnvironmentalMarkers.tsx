import { Html } from '@react-three/drei';
import type { EnvironmentalPoint } from '../types';

export function EnvironmentalMarkers({points,selectedId,onSelect}:{points:readonly EnvironmentalPoint[];selectedId:string|null;onSelect:(id:string)=>void}) {
  return <group name="environmental-markers">{points.map(point=>{
    const selected=point.id===selectedId;
    return <group key={point.id} name={`poi-${point.id}`} position={[...point.position]}>
      <mesh onClick={event=>{event.stopPropagation();onSelect(point.id);}}>
        <sphereGeometry args={[.68,12,8]}/><meshBasicMaterial transparent opacity={0} depthWrite={false}/>
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]}>
        <torusGeometry args={[selected?.55:.43,.045,6,32]}/><meshBasicMaterial color={point.color}/>
      </mesh>
      <mesh position={[0,.28,0]}>
        <octahedronGeometry args={[selected?.28:.22,0]}/><meshStandardMaterial color={point.color} emissive={point.color} emissiveIntensity={.3} roughness={.4}/>
      </mesh>
      <mesh position={[0,-.25,0]}><cylinderGeometry args={[.015,.015,.5,6]}/><meshBasicMaterial color={point.color}/></mesh>
      {selected&&<Html center position={[0,.95,0]} style={{pointerEvents:'none'}} occlude><span className="marker-label">{point.name}</span></Html>}
    </group>;
  })}</group>;
}

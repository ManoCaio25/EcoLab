import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OrthographicCamera } from 'three';
import { pointById } from '../config/environmentalPoints';
import { placeById } from '../config/places';
import type { CameraCommand } from '../navigation/cameraState';
export type { CameraCommand } from '../navigation/cameraState';

export function CameraRig({ command }: { command: CameraCommand }) {
  const controls=useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const {camera,size,invalidate}=useThree();
  const baseZoom=Math.min(size.width/96,size.height/68);
  useEffect(()=>{
    if(!(camera instanceof OrthographicCamera)) return;
    const orbit=controls.current;
    if(orbit) { orbit.enableDamping=false; orbit.update(); }
    if(command.action==='reset' || command.action==='focus') {
      const point=command.action==='focus' ? pointById(command.pointId ?? null) : null;
      const place=command.action==='focus'?placeById(command.placeId):undefined;
      const target=place?.focus ?? point?.focus ?? [0,0,0];
      camera.position.set(target[0]+44,target[1]+40,target[2]+48);
      camera.zoom=baseZoom*(place?.zoom ?? (point ? 2.3 : 1));
      orbit?.target.set(...target); camera.lookAt(...target);
    } else camera.zoom=Math.max(baseZoom*.75,Math.min(baseZoom*3.4,camera.zoom*(command.action==='in' ? 1.2 : 1/1.2)));
    camera.updateProjectionMatrix(); orbit?.update();
    if(orbit) orbit.enableDamping=true;
    invalidate();
  },[camera,baseZoom,command,invalidate]);
  return <OrbitControls ref={controls} makeDefault enablePan={false}
    minZoom={baseZoom*.75} maxZoom={baseZoom*3.4} minPolarAngle={Math.PI/5} maxPolarAngle={Math.PI/3}
    minAzimuthAngle={Math.PI/12} maxAzimuthAngle={Math.PI*5/12}
    enableDamping dampingFactor={.1} rotateSpeed={.5} zoomSpeed={.7} />;
}

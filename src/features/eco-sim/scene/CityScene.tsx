import { memo, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { CityEnvironment } from './CityEnvironment';
import { Water } from './Water';
import { CameraRig, type CameraCommand } from './CameraRig';
import { ExplorationCamera } from './ExplorationCamera';
import { EnvironmentalMarkers } from './EnvironmentalMarkers';
import { ENVIRONMENTAL_POINTS } from '../config/environmentalPoints';
import { Vehicle } from '../entities/Vehicle';
import { Pedestrian } from '../entities/Pedestrian';
import { QUALITY } from '../config/quality';
import { DEFAULT_APPEARANCE } from '../config/city';
import { PEDESTRIAN_ROUTES, VEHICLE_ROUTES } from '../config/routes';
import { validateRoute } from '../movement/routeValidation';
import { MetricsSampler, SceneReady } from '../components/SceneStatus';
import type { CameraMode, Quality, SceneMetrics } from '../types';

const validationErrors = [
  ...VEHICLE_ROUTES.flatMap(route => validateRoute(route, 'road', 0.54, 1.1)),
  ...PEDESTRIAN_ROUTES.flatMap(route => validateRoute(route, 'sidewalk', 0.34, 0.36)),
];
const Environment = memo(CityEnvironment);

// Read-only diagnostics, queried only by the local browser verification script.
function Diagnostics() {
  const {gl,scene,camera}=useThree();
  useEffect(()=>{
    const inspect=(event:Event)=>{
      const detail=(event as CustomEvent).detail;
      const rect=gl.domElement.getBoundingClientRect();
      Object.assign(detail,{camera:{type:camera.type,position:camera.position.toArray(),rotation:camera.rotation.toArray(),zoom:'zoom' in camera?camera.zoom:1},render:{...gl.info.render},memory:{...gl.info.memory},
        points:ENVIRONMENTAL_POINTS.map(p=>{const v=new Vector3(...p.position).project(camera);return {id:p.id,world:p.position,screen:[rect.x+(v.x+1)*rect.width/2,rect.y+(1-v.y)*rect.height/2],depth:v.z};}),
        actors:['vehicle-0','vehicle-1','pedestrian-0','pedestrian-1','pedestrian-2'].map(name=>({name,position:scene.getObjectByName(name)?.position.toArray()}))});
    };
    gl.domElement.addEventListener('ecolab:inspect',inspect);
    return ()=>gl.domElement.removeEventListener('ecolab:inspect',inspect);
  },[gl,scene,camera]);
  return null;
}

function ContextEvents({ onLost }: { onLost: (lost: boolean) => void }) {
  const gl = useThree(state => state.gl);
  useEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); onLost(true); };
    const restored = () => onLost(false);
    gl.domElement.addEventListener('webglcontextlost', lost);
    gl.domElement.addEventListener('webglcontextrestored', restored);
    return () => {
      gl.domElement.removeEventListener('webglcontextlost', lost);
      gl.domElement.removeEventListener('webglcontextrestored', restored);
    };
  }, [gl, onLost]);
  return null;
}

interface Props {
  paused: boolean; quality: Quality; debug: boolean; cameraCommand: CameraCommand;
  cameraMode: CameraMode; selectedId: string|null; onSelect: (id:string)=>void; onOverview: ()=>void;
  onReady: () => void; onMetrics: (metrics: SceneMetrics) => void; onContextLost: (lost: boolean) => void;
}

export default memo(function CityScene({ paused, quality, debug, cameraCommand, cameraMode, selectedId, onSelect, onOverview, onReady, onMetrics, onContextLost }: Props) {
  const config = QUALITY[quality];
  if (validationErrors.length) throw new Error(validationErrors.join('\n'));
  return <Canvas orthographic camera={{ position: [38, 34, 43], zoom: 14, near: 0.1, far: 180 }}
    dpr={config.dpr} shadows={config.shadows ? 'soft' : false}
    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    fallback={<div className="scene-fallback" role="alert">WebGL 2 indisponível. Ative a aceleração gráfica para explorar a cidade.</div>}>
    {cameraMode==='explore'&&<color attach="background" args={['#b8cbd0']}/>}
    <hemisphereLight args={['#dceaf0', '#65725a', 1.8]} />
    <directionalLight position={[-18, 35, 15]} intensity={2.8} color="#fff0d9" castShadow={config.shadows}
      shadow-mapSize={[config.shadowSize, config.shadowSize]} shadow-camera-left={-40} shadow-camera-right={40}
      shadow-camera-top={36} shadow-camera-bottom={-36} shadow-camera-near={1} shadow-camera-far={100} shadow-radius={3}
      shadow-normalBias={0.05} shadow-bias={-0.0001} />
    <directionalLight position={[18, 12, -18]} intensity={0.65} color="#9ccdd8" />
    <Environment vegetationColor={DEFAULT_APPEARANCE.vegetationColor} paused={paused} quality={quality} />
    <Water paused={paused} color={DEFAULT_APPEARANCE.waterColor} segments={config.waterSegments} />
    {[0, 1].map(index => <Vehicle key={index} index={index} paused={paused} />)}
    {[0, 1, 2].map(index => <Pedestrian key={index} index={index} paused={paused} />)}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.72, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} /><shadowMaterial opacity={0.18} />
    </mesh>
    <EnvironmentalMarkers points={ENVIRONMENTAL_POINTS} selectedId={selectedId} onSelect={onSelect}/>
    {cameraMode==='overview'?<CameraRig command={cameraCommand}/>:<ExplorationCamera onExit={onOverview}/>}
    <Diagnostics/>
    <SceneReady onReady={onReady} />
    <MetricsSampler enabled={debug} onMetrics={onMetrics} />
    <ContextEvents onLost={onContextLost} />
  </Canvas>;
});

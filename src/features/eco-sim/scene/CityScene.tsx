import { memo, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { CityEnvironment } from './CityEnvironment';
import { Water } from './Water';
import { CameraRig, type CameraCommand } from './CameraRig';
import { Vehicle } from '../entities/Vehicle';
import { Pedestrian } from '../entities/Pedestrian';
import { QUALITY } from '../config/quality';
import { DEFAULT_APPEARANCE } from '../config/city';
import { PEDESTRIAN_ROUTES, VEHICLE_ROUTES } from '../config/routes';
import { validateRoute } from '../movement/routeValidation';
import { MetricsSampler, SceneReady } from '../components/SceneStatus';
import type { Quality, SceneMetrics } from '../types';

const validationErrors = [
  ...VEHICLE_ROUTES.flatMap(route => validateRoute(route, 'road', 0.54, 1.1)),
  ...PEDESTRIAN_ROUTES.flatMap(route => validateRoute(route, 'sidewalk', 0.34, 0.36)),
];
const Environment = memo(CityEnvironment);

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
  onReady: () => void; onMetrics: (metrics: SceneMetrics) => void; onContextLost: (lost: boolean) => void;
}

export default memo(function CityScene({ paused, quality, debug, cameraCommand, onReady, onMetrics, onContextLost }: Props) {
  const config = QUALITY[quality];
  if (validationErrors.length) throw new Error(validationErrors.join('\n'));
  return <Canvas orthographic camera={{ position: [38, 34, 43], zoom: 14, near: 0.1, far: 180 }}
    dpr={config.dpr} shadows={config.shadows ? 'soft' : false}
    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    fallback={<div className="scene-fallback" role="alert">WebGL 2 indisponível. Ative a aceleração gráfica para explorar a cidade.</div>}>
    <hemisphereLight args={['#e1f5f0', '#758c80', 2.2]} />
    <directionalLight position={[-18, 30, 15]} intensity={3.3} color="#fff0d1" castShadow={config.shadows}
      shadow-mapSize={[config.shadowSize, config.shadowSize]} shadow-camera-left={-34} shadow-camera-right={34}
      shadow-camera-top={30} shadow-camera-bottom={-30} shadow-camera-near={1} shadow-camera-far={85}
      shadow-normalBias={0.05} shadow-bias={-0.0001} />
    <directionalLight position={[18, 12, -18]} intensity={0.65} color="#9ccdd8" />
    <Environment vegetationColor={DEFAULT_APPEARANCE.vegetationColor} />
    <Water paused={paused} color={DEFAULT_APPEARANCE.waterColor} segments={config.waterSegments} />
    {[0, 1].map(index => <Vehicle key={index} index={index} paused={paused} />)}
    {[0, 1, 2].map(index => <Pedestrian key={index} index={index} paused={paused} />)}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.72, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} /><shadowMaterial opacity={0.18} />
    </mesh>
    <CameraRig command={cameraCommand} />
    <SceneReady onReady={onReady} />
    <MetricsSampler enabled={debug} onMetrics={onMetrics} />
    <ContextEvents onLost={onContextLost} />
  </Canvas>;
});

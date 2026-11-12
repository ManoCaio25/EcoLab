import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OrthographicCamera } from 'three';

export interface CameraCommand { id: number; action: 'reset' | 'in' | 'out' }

export function CameraRig({ command }: { command: CameraCommand }) {
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const { camera, size, invalidate } = useThree();
  const baseZoom = Math.min(size.width / (size.width < 760 ? 68 : 72), size.height / 48);
  useEffect(() => {
    if (!(camera instanceof OrthographicCamera)) return;
    camera.position.set(38, 34, 43);
    camera.zoom = baseZoom;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    controls.current?.target.set(0, 0, 0);
    controls.current?.update();
    invalidate();
  }, [camera, baseZoom, invalidate]);
  useEffect(() => {
    if (!(camera instanceof OrthographicCamera)) return;
    if (command.action === 'reset') {
      // Flush the residual orbit velocity before restoring the exact initial view.
      // Otherwise damping keeps rotating after the reset button is pressed.
      if (controls.current) {
        controls.current.enableDamping = false;
        controls.current.update();
      }
      camera.position.set(38, 34, 43);
      camera.zoom = baseZoom;
      controls.current?.target.set(0, 0, 0);
      camera.lookAt(0, 0, 0);
    } else {
      camera.zoom = Math.max(baseZoom * 0.75, Math.min(baseZoom * 1.8, camera.zoom * (command.action === 'in' ? 1.2 : 1 / 1.2)));
    }
    camera.updateProjectionMatrix();
    controls.current?.update();
    if (controls.current) controls.current.enableDamping = true;
    invalidate();
  }, [command, camera, baseZoom, invalidate]);
  return <OrbitControls ref={controls} makeDefault enablePan={false}
    minZoom={baseZoom * 0.75} maxZoom={baseZoom * 1.8}
    minPolarAngle={Math.PI / 5} maxPolarAngle={Math.PI / 3}
    minAzimuthAngle={Math.PI / 12} maxAzimuthAngle={Math.PI * 5 / 12}
    enableDamping dampingFactor={0.1} rotateSpeed={0.5} zoomSpeed={0.7} />;
}

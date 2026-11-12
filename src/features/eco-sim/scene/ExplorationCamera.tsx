import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import type { PerspectiveCamera as Camera } from 'three';
import { advanceNavigation, type NavigationState } from '../navigation/movement';
import { EYE_HEIGHT, surfaceHeight } from '../navigation/collision';

export function ExplorationCamera({ onExit }: { onExit: () => void }) {
  const ref=useRef<Camera>(null);
  const gl=useThree(s=>s.gl);
  const motion=useRef<NavigationState>({x:-13.5,z:7.5,vx:0,vz:0});
  const keys=useRef(new Set<string>());
  const angles=useRef({yaw:-Math.PI/2,pitch:0});
  useEffect(()=>{
    const canvas=gl.domElement;
    canvas.tabIndex=0;
    canvas.focus({preventScroll:true});
    let dragging=false, ownedLock=false, disposed=false;
    const clear=()=>{ keys.current.clear(); motion.current.vx=0; motion.current.vz=0; dragging=false; };
    const down=(event:KeyboardEvent)=>{
      if (event.code==='Escape') { clear(); onExit(); return; }
      if (event.target instanceof HTMLElement && event.target.closest('input,select,textarea,[role="combobox"],button')) return;
      if (document.activeElement!==canvas && document.pointerLockElement!==canvas) return;
      if (['KeyW','KeyA','KeyS','KeyD'].includes(event.code)) { event.preventDefault(); keys.current.add(event.code); }
    };
    const up=(event:KeyboardEvent)=>keys.current.delete(event.code);
    const pointerDown=(event:PointerEvent)=>{
      if (event.button!==0) return;
      canvas.focus({preventScroll:true}); dragging=true;
      // Drag remains available when pointer lock is denied or unsupported.
      canvas.requestPointerLock?.()?.catch(()=>{});
    };
    const pointerUp=()=>{dragging=false;};
    const mouse=(event:MouseEvent)=>{
      if (document.pointerLockElement!==canvas && !dragging) return;
      angles.current.yaw-=event.movementX*.0023;
      angles.current.pitch=Math.max(-1.2,Math.min(1.2,angles.current.pitch-event.movementY*.0023));
    };
    const lock=()=>{
      if (document.pointerLockElement===canvas) ownedLock=true;
      else if (ownedLock && !disposed) { clear(); onExit(); }
    };
    const visibility=()=>{ if(document.hidden) clear(); };
    window.addEventListener('keydown',down);
    window.addEventListener('keyup',up);
    window.addEventListener('blur',clear);
    document.addEventListener('visibilitychange',visibility);
    document.addEventListener('pointerlockchange',lock);
    document.addEventListener('mousemove',mouse);
    window.addEventListener('pointerup',pointerUp);
    canvas.addEventListener('pointerdown',pointerDown);
    canvas.addEventListener('blur',clear);
    return ()=>{
      disposed=true; clear();
      window.removeEventListener('keydown',down); window.removeEventListener('keyup',up); window.removeEventListener('blur',clear);
      document.removeEventListener('visibilitychange',visibility); document.removeEventListener('pointerlockchange',lock);
      document.removeEventListener('mousemove',mouse); window.removeEventListener('pointerup',pointerUp);
      canvas.removeEventListener('pointerdown',pointerDown); canvas.removeEventListener('blur',clear);
      if(document.pointerLockElement===canvas) document.exitPointerLock();
      canvas.removeAttribute('tabindex');
    };
  },[gl,onExit]);
  useFrame((_,delta)=>{
    if(!ref.current || document.hidden) return;
    const forward=Number(keys.current.has('KeyW'))-Number(keys.current.has('KeyS'));
    const right=Number(keys.current.has('KeyD'))-Number(keys.current.has('KeyA'));
    const {yaw,pitch}=angles.current;
    motion.current=advanceNavigation(motion.current, -Math.sin(yaw)*forward+Math.cos(yaw)*right, -Math.cos(yaw)*forward-Math.sin(yaw)*right,Math.min(delta,.1));
    const {x,z}=motion.current;
    const y=(surfaceHeight(x,z) ?? .28)+EYE_HEIGHT;
    ref.current.position.set(x,y,z);
    ref.current.rotation.set(pitch,yaw,0,'YXZ');
  });
  return <PerspectiveCamera ref={ref} makeDefault name="exploration-camera" position={[-13.5,1.93,7.5]} fov={65} near={.06} far={160} />;
}


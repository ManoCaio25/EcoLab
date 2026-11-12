import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { SceneMetrics } from '../types';

export function SceneReady({ onReady }: { onReady: () => void }) {
  const ready = useRef(false);
  useEffect(() => { ready.current = false; }, [onReady]);
  useFrame(() => {
    if (!ready.current) { ready.current = true; onReady(); }
  });
  return null;
}

export function MetricsSampler({ enabled, onMetrics }: { enabled: boolean; onMetrics: (metrics: SceneMetrics) => void }) {
  const sample = useRef({ time: 0, frames: 0 });
  useFrame(({ gl }, delta) => {
    if (!enabled || document.hidden) { sample.current.time = 0; sample.current.frames = 0; return; }
    sample.current.time += delta;
    sample.current.frames++;
    if (sample.current.time >= 0.75) {
      onMetrics({ fps: Math.round(sample.current.frames / sample.current.time), calls: gl.info.render.calls, triangles: gl.info.render.triangles });
      sample.current.time = 0;
      sample.current.frames = 0;
    }
  });
  return null;
}

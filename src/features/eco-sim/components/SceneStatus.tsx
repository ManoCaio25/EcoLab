import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { SceneMetrics } from '../types';
import { summarizeFrames } from '../performance/metrics';

export function SceneReady({ onReady }: { onReady: () => void }) {
  const ready = useRef(false);
  useEffect(() => { ready.current = false; }, [onReady]);
  useFrame(() => {
    if (!ready.current) { ready.current = true; onReady(); }
  });
  return null;
}

export function MetricsSampler({ enabled, onMetrics }: { enabled: boolean; onMetrics: (metrics: SceneMetrics) => void }) {
  const sample = useRef({ time: 0, frames: [] as number[] });
  useFrame(({ gl }, delta) => {
    if (!enabled || document.hidden) { sample.current.time = 0; sample.current.frames.length = 0; return; }
    sample.current.time += delta;
    sample.current.frames.push(delta*1000);
    if (sample.current.time >= 1.5) {
      const summary=summarizeFrames(sample.current.frames);
      onMetrics({ fps: Math.round(summary.fps), p95ms: summary.p95ms, calls: gl.info.render.calls, triangles: gl.info.render.triangles, geometries: gl.info.memory.geometries, textures: gl.info.memory.textures });
      sample.current.time = 0;
      sample.current.frames.length = 0;
    }
  });
  return null;
}

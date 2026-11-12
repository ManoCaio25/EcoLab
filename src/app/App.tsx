import { lazy, Suspense, useCallback, useState } from 'react';
import { LinearProgress } from '@mui/material';
import { SceneErrorBoundary } from '../components/SceneErrorBoundary';
import { Icon, SimulationControls, ZoomControls } from '../features/eco-sim/components/SimulationControls';
import type { Quality, SceneMetrics } from '../features/eco-sim/types';
import type { CameraCommand } from '../features/eco-sim/scene/CameraRig';

const CityScene = lazy(() => import('../features/eco-sim/scene/CityScene'));

export function App() {
  const [paused, setPaused] = useState(false);
  const [quality, setQuality] = useState<Quality>('high');
  const [debug, setDebug] = useState(false);
  const [ready, setReady] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [metrics, setMetrics] = useState<SceneMetrics | null>(null);
  const [cameraCommand, setCameraCommand] = useState<CameraCommand>({ id: 0, action: 'reset' });
  const camera = useCallback((action: CameraCommand['action']) => setCameraCommand(prev => ({ id: prev.id + 1, action })), []);
  const onReady = useCallback(() => setReady(true), []);
  return <div className="app-shell">
    <header className="app-header">
      <a className="brand" href="./" aria-label="EcoLab, início"><span className="brand-symbol"><Icon name="leaf" size={26} /></span><span>Eco<span className="brand-light">Lab</span><small>OBSERVAR. ENTENDER. TRANSFORMAR.</small></span></a>
      <div className="header-center"><span className="module-tag">ECOSIM</span><span className="header-separator" />Prova técnica — EcoSim 3D</div>
      <div className="prototype-badge"><span className="status-dot" />PROTÓTIPO 01<span className="version">v0.1</span></div>
    </header>

    <main className="workspace">
      <div className="scene-viewport" role="region" aria-label="Cidade 3D interativa com quatro edifícios, canal, duas pontes, dois veículos e três pedestres">
        <SceneErrorBoundary>
          <Suspense fallback={<div className="scene-loading">Preparando a cidade…<LinearProgress color="primary" /></div>}>
            <CityScene paused={paused} quality={quality} debug={debug} cameraCommand={cameraCommand} onReady={onReady} onMetrics={setMetrics} onContextLost={setContextLost} />
          </Suspense>
        </SceneErrorBoundary>
      </div>

      <section className="scene-intro">
        <div className="eyebrow intro-eyebrow"><span className="tiny-line" />LABORATÓRIO URBANO</div>
        <h1>A cidade <br />está <span>viva.</span></h1>
        <p>Um novo olhar sobre os espaços<br className="desktop-break" /> que compartilhamos.</p>
        <div className="district-label"><span className="district-number">01</span><div>Distrito Ribeirinho<small>CENA EXPLORÁVEL · 3D</small></div></div>
      </section>

      <SimulationControls paused={paused} setPaused={setPaused} quality={quality} setQuality={setQuality} debug={debug} setDebug={setDebug} camera={camera} />
      <div className="view-tools"><span className="view-label"><Icon name="layers" size={15} />VISTA ISOMÉTRICA</span><ZoomControls camera={camera} /></div>
      <div className="scene-compass" aria-hidden="true"><span>N</span><svg width="38" height="38" viewBox="0 0 38 38"><path d="M19 3 26 29 19 24 12 29Z" fill="#87cdb7" /><path d="m19 3 7 26-7-5Z" fill="#4d7774" /></svg></div>

      {debug && <output className="metrics"><b>{metrics ? metrics.fps : '—'} <span>FPS</span></b><span>{metrics ? `${metrics.calls} draw calls · ${(metrics.triangles / 1000).toFixed(1)}k triângulos` : 'Medindo…'}</span></output>}
      {contextLost && <div className="context-warning" role="alert">A conexão com a GPU foi interrompida. Aguardando recuperação; se persistir, recarregue a página.</div>}

      <section className="city-summary" aria-label="Elementos da cidade">
        <div className="summary-title"><Icon name="sun" size={19} /><span>Pequena cidade.<br /><strong>Grandes possibilidades.</strong></span></div>
        <div className="summary-stat"><b>04</b><span>edifícios</span></div><div className="summary-stat"><b>02</b><span>veículos</span></div><div className="summary-stat"><b>03</b><span>pedestres</span></div>
        <div className="summary-note"><span className="status-dot" />Rotas predefinidas<small>Movimento contínuo em superfícies válidas</small></div>
      </section>
    </main>

    <footer className="app-footer">
      <div className="scene-legend"><span><i className="legend-vegetation" />Vegetação</span><span><i className="legend-water" />Água</span><span><i className="legend-road" />Mobilidade</span></div>
      <span className="model-status" role="status"><span className={`status-dot ${!ready || contextLost ? 'paused' : ''}`} />{contextLost ? 'Renderização interrompida' : ready ? 'Modelos procedurais prontos' : 'Preparando modelos 3D…'}</span>
      <span className="footer-caption">EXPLORAR HOJE. TRANSFORMAR AMANHÃ.<Icon name="arrow" size={14} /></span>
    </footer>
  </div>;
}

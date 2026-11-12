import { lazy, Suspense, useCallback, useReducer, useState } from 'react';
import { LinearProgress } from '@mui/material';
import { SceneErrorBoundary } from '../components/SceneErrorBoundary';
import { Icon, SimulationControls, ZoomControls } from '../features/eco-sim/components/SimulationControls';
import { EnvironmentalPanel } from '../features/eco-sim/components/EnvironmentalPanel';
import { ENVIRONMENTAL_POINTS } from '../features/eco-sim/config/environmentalPoints';
import { BUILDINGS } from '../features/eco-sim/config/city';
import { cameraReducer, INITIAL_CAMERA, type CameraCommand } from '../features/eco-sim/navigation/cameraState';
import type { CameraMode, Quality, SceneMetrics } from '../features/eco-sim/types';

const CityScene=lazy(()=>import('../features/eco-sim/scene/CityScene'));
export function App() {
  const [paused,setPaused]=useState(false),[quality,setQuality]=useState<Quality>('high'),[debug,setDebug]=useState(false);
  const [ready,setReady]=useState(false),[contextLost,setContextLost]=useState(false);
  const [metrics,setMetrics]=useState<SceneMetrics|null>(null);
  const [view,dispatch]=useReducer(cameraReducer,INITIAL_CAMERA);
  const camera=useCallback((action:CameraCommand['action'])=>{if(action==='focus')dispatch({type:'focus'});else dispatch({type:'camera',action});},[]);
  const setMode=useCallback((mode:CameraMode)=>dispatch({type:'mode',mode}),[]);
  const onSelect=useCallback((id:string)=>dispatch({type:'select',id}),[]);
  const onOverview=useCallback(()=>dispatch({type:'camera',action:'reset'}),[]);
  const onFocus=useCallback(()=>dispatch({type:'focus'}),[]);
  const onReady=useCallback(()=>setReady(true),[]);
  const exploring=view.mode==='explore';
  return <div className="app-shell">
    <header className="app-header">
      <a className="brand" href="./" aria-label="EcoLab, início"><span className="brand-symbol"><Icon name="leaf" size={26}/></span><span>Eco<span className="brand-light">Lab</span><small>OBSERVAR. ENTENDER. TRANSFORMAR.</small></span></a>
      <div className="header-center"><span className="module-tag">ECOLAB LIVE</span><span className="header-separator"/>Um distrito, muitas conexões</div>
      <div className="prototype-badge"><span className="status-dot"/>CIDADE EXPLORÁVEL<span className="version">ETAPA 02</span></div>
    </header>
    <main className={`workspace ${exploring?'exploring':''}`}>
      <div className="scene-viewport" role="region" aria-label="Cidade 3D com centro, vila residencial, parque e córrego">
        <SceneErrorBoundary><Suspense fallback={<div className="scene-loading">Preparando a cidade…<LinearProgress color="primary"/></div>}>
          <CityScene paused={paused} quality={quality} debug={debug} cameraCommand={view.command} cameraMode={view.mode} selectedId={view.selectedId} onSelect={onSelect} onOverview={onOverview} onReady={onReady} onMetrics={setMetrics} onContextLost={setContextLost}/>
        </Suspense></SceneErrorBoundary>
      </div>
      <section className="scene-intro">
        <div className="eyebrow intro-eyebrow"><span className="tiny-line"/>LABORATÓRIO URBANO</div>
        <h1>Um lugar para<br/><span>olhar de perto.</span></h1>
        <p>Explore as conexões entre a água,<br/>a natureza e a vida na cidade.</p>
        <div className="district-label"><span className="district-number">01</span><div>Distrito Ribeirinho<small>7 EDIFÍCIOS · 4 REGIÕES</small></div></div>
      </section>
      <EnvironmentalPanel points={ENVIRONMENTAL_POINTS} selectedId={view.selectedId} onSelect={onSelect} onFocus={onFocus} onOverview={onOverview}/>
      <SimulationControls paused={paused} setPaused={setPaused} quality={quality} setQuality={setQuality} debug={debug} setDebug={setDebug} camera={camera} mode={view.mode} setMode={setMode}/>
      <div className="view-tools"><span className="view-label"><Icon name="layers" size={15}/>{exploring?'AO NÍVEL DA RUA':'VISÃO GERAL · ISOMÉTRICA'}</span>{!exploring&&<ZoomControls camera={camera}/>}</div>
      {exploring&&<div className="exploration-hint" role="status">W A S D <span>caminhar</span> · Mouse <span>olhar</span> · Esc <span>sair</span></div>}
      {debug&&<output className="metrics" aria-label="Desempenho da cena"><b>{metrics?.fps??'—'} <span>FPS</span></b><span>{metrics?`p95 ${metrics.p95ms.toFixed(1)} ms · ${metrics.calls} draw calls`:'Medindo…'}</span><span>{metrics?`${(metrics.triangles/1000).toFixed(1)}k triângulos · ${metrics.geometries} geometrias`:''}</span></output>}
      {contextLost&&<div className="context-warning" role="alert">A conexão com a GPU foi interrompida. Aguarde a recuperação ou recarregue a página.</div>}
      <section className="city-summary" aria-label="Elementos da cidade">
        <div className="summary-title"><Icon name="sun" size={19}/><span>Observe o presente.<br/><strong>Imagine outros futuros.</strong></span></div>
        <div className="summary-stat"><b>{String(BUILDINGS.length).padStart(2,'0')}</b><span>edifícios</span></div><div className="summary-stat"><b>02</b><span>veículos</span></div><div className="summary-stat"><b>03</b><span>pedestres</span></div>
      </section>
    </main>
    <footer className="app-footer"><div className="scene-legend"><span><i className="legend-vegetation"/>Vegetação</span><span><i className="legend-water"/>Água</span><span><i className="legend-road"/>Mobilidade</span></div>
      <span className="model-status" role="status"><span className={`status-dot ${!ready||contextLost?'paused':''}`}/>{contextLost?'Renderização interrompida':ready?'Modelos procedurais prontos':'Preparando modelos 3D…'}</span>
      <span className="footer-caption">EXPLORAR HOJE. TRANSFORMAR AMANHÃ.<Icon name="arrow" size={14}/></span>
    </footer>
  </div>;
}

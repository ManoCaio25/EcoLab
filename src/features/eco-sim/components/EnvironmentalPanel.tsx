import { Button } from '@mui/material';
import type { EnvironmentalPoint } from '../types';
import { REGIONS } from '../config/regions';
export function EnvironmentalPanel({points,selectedId,onSelect,onFocus,onOverview}:{points:readonly EnvironmentalPoint[];selectedId:string|null;onSelect:(id:string)=>void;onFocus:()=>void;onOverview:()=>void}) {
  const selected=points.find(p=>p.id===selectedId);
  return <aside className="environmental-panel" aria-label="Pontos ambientais">
    <div className="eyebrow">PONTOS AMBIENTAIS</div>
    <p className="panel-description">Escolha um lugar para observar.</p>
    <div className="point-list">{points.map((point,index)=><button key={point.id} type="button" className={`point-option ${selectedId===point.id?'selected':''}`} aria-pressed={selectedId===point.id} onClick={()=>onSelect(point.id)}>
      <span className="point-number" style={{color:point.color}}>0{index+1}</span><span>{point.name}<small>{point.category==='water'?'Água':point.category==='vegetation'?'Vegetação':'Moradores'}</small></span><span aria-hidden="true">↗</span>
    </button>)}</div>
    {selected&&<div className="point-detail" aria-live="polite">
      <span className="region-tag">{REGIONS.find(r=>r.id===selected.regionId)?.name}</span>
      <h2>{selected.name}</h2><p>{selected.description}</p>
      <Button fullWidth variant="contained" size="small" onClick={onFocus}>Aproximar deste ponto</Button>
      <Button fullWidth size="small" onClick={onOverview}>Voltar à visão geral</Button>
    </div>}
  </aside>;
}

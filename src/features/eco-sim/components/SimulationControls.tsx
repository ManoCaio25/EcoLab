import { Button, FormControlLabel, MenuItem, Select, Switch, Tooltip, IconButton } from '@mui/material';
import type { CameraMode, Quality } from '../types';
import type { CameraCommand } from '../scene/CameraRig';

export function Icon({ name, size = 20 }: { name: 'pause' | 'play' | 'reset' | 'plus' | 'minus' | 'leaf' | 'layers' | 'arrow' | 'sun'; size?: number }) {
  const paths = {
    pause: <><path d="M8 5v14M16 5v14" strokeWidth="3" /></>,
    play: <path d="m8 5 11 7-11 7Z" />,
    reset: <><path d="M4 10a8 8 0 1 1 1 7M4 4v6h6" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    leaf: <><path d="M5 17C2 8 10 3 20 4c1 10-5 17-12 14M5 21 16 9" /></>,
    layers: <><path d="m12 3 10 5-10 5L2 8Zm-9 9 9 5 9-5M3 16l9 5 9-5" /></>,
    arrow: <path d="M5 19 19 5M5 5h14v14" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

interface Props {
  paused: boolean; setPaused: (value: boolean) => void;
  quality: Quality; setQuality: (value: Quality) => void;
  debug: boolean; setDebug: (value: boolean) => void;
  camera: (action: CameraCommand['action']) => void;
  mode: CameraMode; setMode: (mode:CameraMode)=>void;
}

export function SimulationControls({ paused, setPaused, quality, setQuality, debug, setDebug, camera, mode, setMode }: Props) {
  return <aside className="control-panel" aria-label="Controles da cidade">
    <div className="panel-heading"><span className="eyebrow">CONTROLE DA CENA</span><Icon name="layers" size={17} /></div>
    <div className="camera-mode-buttons" role="group" aria-label="Modo de câmera">
      <Button fullWidth variant={mode==='overview'?'contained':'outlined'} aria-pressed={mode==='overview'} onClick={()=>setMode('overview')}>Visão geral</Button>
      <Button fullWidth variant={mode==='explore'?'contained':'outlined'} aria-pressed={mode==='explore'} onClick={()=>setMode('explore')}>Explorar cidade</Button>
    </div>
    <div className="control-divider" />
    <div className="control-state"><span className={`status-dot ${paused ? 'paused' : ''}`} />{paused ? 'Animação pausada' : 'Cidade em movimento'}</div>
    <Button fullWidth variant="contained" className="pause-button" startIcon={<Icon name={paused ? 'play' : 'pause'} size={16} />} onClick={() => setPaused(!paused)}>
      {paused ? 'Continuar animação' : 'Pausar animação'}
    </Button>
    <div className="control-divider" />
    <label className="field-label" htmlFor="quality-select">Qualidade gráfica</label>
    <Select id="quality-select" value={quality} onChange={event => setQuality(event.target.value as Quality)} size="small" fullWidth inputProps={{ 'aria-label': 'Qualidade gráfica' }}>
      <MenuItem value="high">Alta · com sombras</MenuItem><MenuItem value="low">Reduzida · mais leve</MenuItem>
    </Select>
    <FormControlLabel className="fps-switch" label="Exibir FPS" labelPlacement="start" control={<Switch size="small" checked={debug} onChange={event => setDebug(event.target.checked)} slotProps={{ input: { 'aria-label': 'Exibir FPS' } }} />} />
    <Button fullWidth variant="outlined" color="inherit" startIcon={<Icon name="reset" size={16} />} onClick={() => camera('reset')}>{mode==='explore'?'Voltar à visão geral':'Redefinir câmera'}</Button>
    <div className="camera-help">{mode==='overview'?<>Arraste para girar<br/>Use a rolagem para aproximar</>:<>W A S D para caminhar<br/>Clique na cena e mova o mouse para olhar<br/>Se necessário, arraste para olhar<br/>Esc para voltar à visão geral</>}</div>
  </aside>;
}

export function ZoomControls({ camera }: { camera: Props['camera'] }) {
  return <div className="zoom-controls" aria-label="Zoom da câmera">
    <Tooltip title="Aproximar"><IconButton aria-label="Aproximar" onClick={() => camera('in')}><Icon name="plus" /></IconButton></Tooltip>
    <span className="zoom-divider" />
    <Tooltip title="Afastar"><IconButton aria-label="Afastar" onClick={() => camera('out')}><Icon name="minus" /></IconButton></Tooltip>
  </div>;
}

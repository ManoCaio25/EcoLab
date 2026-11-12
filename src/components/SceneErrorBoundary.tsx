import { Component, type ReactNode } from 'react';
import { Button } from '@mui/material';

export class SceneErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  componentDidCatch(error: Error) { console.error('Falha ao iniciar a cena EcoLab:', error); }
  render() {
    if (this.state.error) return <div className="scene-fallback" role="alert">
      <h2>Não foi possível iniciar a cidade 3D.</h2>
      <p>Confira se a aceleração gráfica está habilitada e tente um navegador com WebGL 2.</p>
      <Button variant="outlined" onClick={() => window.location.reload()}>Tentar novamente</Button>
    </div>;
    return this.props.children;
  }
}

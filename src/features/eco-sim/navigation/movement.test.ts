import {it,expect} from 'vitest';
import {advanceNavigation,type NavigationState} from './movement';
it('deslocamento e aceleração equivalem em 30, 60 e 144 FPS',()=>{
  const run=(fps:number)=>{
    let state:NavigationState={x:-13.5,z:7.5,vx:0,vz:0};
    for(let i=0;i<fps*2;i++)state=advanceNavigation(state,1,0,1/fps);
    for(let i=0;i<fps;i++)state=advanceNavigation(state,0,0,1/fps);
    return state;
  };
  for(const fps of [30,144]){
    expect(run(fps).x).toBeCloseTo(run(60).x,7);
    expect(run(fps).vx).toBeCloseTo(run(60).vx,7);
  }
});
it('normaliza diagonais e ignora deltas inválidos',()=>{
  const state={x:-17,z:0,vx:0,vz:0};
  const diagonal=advanceNavigation(state,1,1,.1),straight=advanceNavigation(state,1,0,.1);
  expect(Math.hypot(diagonal.x-state.x,diagonal.z)).toBeCloseTo(Math.abs(straight.x-state.x),8);
  expect(advanceNavigation(state,1,0,-1)).toBe(state);
  expect(advanceNavigation(state,1,0,NaN)).toBe(state);
});

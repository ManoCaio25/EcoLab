import {it,expect} from 'vitest';
import {cameraReducer,INITIAL_CAMERA} from './cameraState';
it('troca os modos, retorna por reset e ignora zoom durante exploração',()=>{
  const explore=cameraReducer(INITIAL_CAMERA,{type:'mode',mode:'explore'});
  expect(explore.mode).toBe('explore');
  expect(cameraReducer(explore,{type:'camera',action:'in'})).toBe(explore);
  const reset=cameraReducer(explore,{type:'camera',action:'reset'});
  expect(reset.mode).toBe('overview');expect(reset.command.id).toBe(2);
});
it('seleciona por ID válido e aproxima no modo geral mesmo partindo de exploração',()=>{
  let state=cameraReducer(INITIAL_CAMERA,{type:'mode',mode:'explore'});
  expect(cameraReducer(state,{type:'select',id:'inexistente'})).toBe(state);
  state=cameraReducer(state,{type:'select',id:'corrego-01'});
  const focus=cameraReducer(state,{type:'focus'});
  expect(focus.mode).toBe('overview');expect(focus.command.pointId).toBe('corrego-01');expect(focus.command.action).toBe('focus');
  expect(cameraReducer(focus,{type:'camera',action:'reset'}).selectedId).toBeNull();
});

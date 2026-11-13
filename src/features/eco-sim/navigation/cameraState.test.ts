import {it,expect} from 'vitest';
import {cameraReducer,INITIAL_CAMERA} from './cameraState';
import {PLACES} from '../config/places';
it('troca os modos, retorna por reset e ignora zoom durante exploração',()=>{
  const explore=cameraReducer(INITIAL_CAMERA,{type:'mode',mode:'explore'});
  expect(explore.mode).toBe('explore');
  expect(cameraReducer(explore,{type:'camera',action:'in'})).toBe(explore);
  const reset=cameraReducer(explore,{type:'camera',action:'reset'});
  expect(reset.mode).toBe('overview');expect(reset.command.id).toBe(2);
});
it('visita todos os lugares, sai da exploração e rejeita IDs desconhecidos',()=>{
  const exploring=cameraReducer(INITIAL_CAMERA,{type:'mode',mode:'explore'});
  for(const place of PLACES){const state=cameraReducer(exploring,{type:'visit',id:place.id});expect(state.mode).toBe('overview');expect(state.command.placeId).toBe(place.id);expect(state.selectedId).toBeNull();}
  expect(cameraReducer(exploring,{type:'visit',id:'inexistente'})).toBe(exploring);
});
it('seleciona por ID válido e aproxima no modo geral mesmo partindo de exploração',()=>{
  let state=cameraReducer(INITIAL_CAMERA,{type:'mode',mode:'explore'});
  expect(cameraReducer(state,{type:'select',id:'inexistente'})).toBe(state);
  state=cameraReducer(state,{type:'select',id:'corrego-01'});
  const focus=cameraReducer(state,{type:'focus'});
  expect(focus.mode).toBe('overview');expect(focus.command.pointId).toBe('corrego-01');expect(focus.command.action).toBe('focus');
  expect(cameraReducer(focus,{type:'camera',action:'reset'}).selectedId).toBeNull();
});

import { pointById } from '../config/environmentalPoints';
import { placeById } from '../config/places';
import type { CameraMode } from '../types';
export interface CameraCommand { id: number; action: 'reset' | 'in' | 'out' | 'focus'; pointId?: string; placeId?: string }
export interface CameraState { mode: CameraMode; selectedId: string | null; command: CameraCommand }
export type CameraAction = { type: 'visit'; id: string } | { type: 'mode'; mode: CameraMode } | { type: 'select'; id: string } | { type: 'focus' } | { type: 'camera'; action: 'reset' | 'in' | 'out' };
export const INITIAL_CAMERA: CameraState = { mode:'overview', selectedId:null, command:{id:0,action:'reset'} };
export function cameraReducer(state: CameraState, action: CameraAction): CameraState {
  if(action.type==='visit')return placeById(action.id)?{mode:'overview',selectedId:null,command:{id:state.command.id+1,action:'focus',placeId:action.id}}:state;
  if (action.type==='select') return pointById(action.id) ? { ...state,selectedId:action.id } : state;
  if (action.type==='focus') return state.selectedId ? { ...state,mode:'overview',command:{id:state.command.id+1,action:'focus',pointId:state.selectedId} } : state;
  if (action.type==='mode') return { ...state,mode:action.mode,command:{id:state.command.id+1,action:'reset'} };
  if (action.action==='reset') return { ...INITIAL_CAMERA,command:{id:state.command.id+1,action:'reset'} };
  if (state.mode==='explore') return state;
  return { ...state,command:{id:state.command.id+1,action:action.action} };
}


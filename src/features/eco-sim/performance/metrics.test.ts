import {it,expect} from 'vitest';
import {summarizeFrames} from './metrics';
it('calcula FPS pela duração e p95 por ordem, sem mutar as amostras',()=>{
  const samples=[...Array<number>(95).fill(10),...Array<number>(5).fill(50)];
  expect(summarizeFrames(samples)).toEqual({fps:100000/1200,p95ms:10});
  expect(samples[99]).toBe(50);
  expect(summarizeFrames([NaN,0,-1])).toEqual({fps:0,p95ms:0});
});

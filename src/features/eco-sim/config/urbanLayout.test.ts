import {it,expect} from 'vitest';
import {VEHICLE_ROUTES,PEDESTRIAN_ROUTES,VEHICLES,PEDESTRIANS} from './routes';
import {sampleRoute} from '../movement/route';
import {validateRoute} from '../movement/routeValidation';
import {canOccupy,moveWithCollisions,contains} from '../navigation/collision';
import {SOLID_OBSTACLES} from './urbanLayout';
it('preserva os agentes e rotas originais ao acrescentar a população da etapa 2.5',()=>{
  expect(VEHICLE_ROUTES.slice(0,2).map(r=>r.waypoints)).toEqual([
    [[-17.6,-11.6],[17.6,-11.6],[17.6,11.6],[-17.6,11.6]],
    [[-16.4,-10.4],[-16.4,10.4],[16.4,10.4],[16.4,-10.4]],
  ]);
  expect(PEDESTRIAN_ROUTES.slice(0,2).map(r=>r.waypoints)).toEqual([
    [[-13.5,-7.5],[13.5,-7.5],[13.5,7.5],[-13.5,7.5]],
    [[-13.9,-7.9],[-13.9,7.9],[13.9,7.9],[13.9,-7.9]],
  ]);
  expect(VEHICLES.slice(0,2).map(v=>v.speed)).toEqual([3.6,3.1]);
  expect(PEDESTRIANS.slice(0,3).map(p=>p.speed)).toEqual([1.05,.92,1.12]);
  for(const r of VEHICLE_ROUTES)expect(validateRoute(r,'road',.54,1.1)).toEqual([]);
  for(const r of PEDESTRIAN_ROUTES)expect(validateRoute(r,'sidewalk',.34,.36)).toEqual([]);
});
it('mantém novos obstáculos fora do espaço ocupado pelas rotas',()=>{
  for(const [routes,width,length] of [[VEHICLE_ROUTES,.54,1.1],[PEDESTRIAN_ROUTES,.34,.36]] as const)for(const route of routes){
    for(let d=0;d<route.length;d+=.08){
      const p=sampleRoute(route,d),s=Math.sin(p.heading),c=Math.cos(p.heading);
      for(const side of [-1,0,1])for(const front of [-1,0,1]){
        const x=p.x+side*width*c+front*length*s,z=p.z-side*width*s+front*length*c;
        expect(SOLID_OBSTACLES.find(o=>contains(o.bounds,x,z))?.id,`Rota ${routes.indexOf(route)}: ${x},${z}`).toBeUndefined();
      }
    }
  }
});
it('conecta vila, parque, praça e córrego à posição inicial de exploração',()=>{
  const queue:[number,number][]=[[-13.5,7.5]],visited=new Set(['-13.5,7.5']);
  const targets=[[-23.5,0],[25.5,3],[2,0],[-5,3],[-16,23.5],[-15,-22],[25,-22],[20,20.5]];
  for(let i=0;i<queue.length;i++){
    const [x,z]=queue[i];
    for(const [dx,dz] of [[.5,0],[-.5,0],[0,.5],[0,-.5]]){
      const nx=x+dx,nz=z+dz,key=`${nx},${nz}`;
      if(visited.has(key)||!canOccupy(nx,nz))continue;
      const step=moveWithCollisions(x,z,dx,dz);
      if(Math.hypot(step.x-nx,step.z-nz)>.001)continue;
      visited.add(key);queue.push([nx,nz]);
    }
  }
  for(const [x,z] of targets)expect(visited.has(`${x},${z}`),`Área desconectada: ${x},${z}`).toBe(true);
});
it('distribui vinte civis com identidades e aparências distintas em todos os percursos',()=>{
  expect(PEDESTRIANS).toHaveLength(20);
  expect(new Set(PEDESTRIANS.map(p=>p.id)).size).toBe(20);
  expect(new Set(PEDESTRIANS.map(({color,pants,skin,hair,height,hairstyle,accessory})=>JSON.stringify({color,pants,skin,hair,height,hairstyle,accessory}))).size).toBe(20);
  expect(new Set(PEDESTRIANS.map(p=>p.route)).size).toBe(PEDESTRIAN_ROUTES.length);
  for(const p of PEDESTRIANS){expect(p.route).toBeLessThan(PEDESTRIAN_ROUTES.length);expect(p.height).toBeGreaterThan(.7);}
});

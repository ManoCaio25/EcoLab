import {mkdir,writeFile,readFile,stat} from 'node:fs/promises';
import {resolve,join,dirname,sep} from 'node:path';
import {createHash} from 'node:crypto';
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import {dedup,prune,weld,simplify,textureCompress,getBounds} from '@gltf-transform/functions';
import {MeshoptSimplifier} from 'meshoptimizer';
import sharp from 'sharp';
const root=resolve('.local/school-pilot/sources'),out=resolve('public/assets/school-pilot');
const ids=['modular_factory_facade','island_tree_02','shrub_01','grass_medium_02','painted_wooden_bench','modular_chainlink_fence'];
const surfaces=['red_brick','asphalt_02','concrete_pavement','brown_mud_leaves_01'];
const masks={island_tree_02:['leaves_alpha','island_tree_02_leaves'],modular_chainlink_fence:['wire_alpha','modular_chainlink_fence_wire'],shrub_01:['Alpha','shrub_01'],grass_medium_02:['Alpha','grass_medium_02']};
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS);
async function obtain(url,path){
  if(!new URL(url).hostname.endsWith('polyhaven.org')&&!new URL(url).hostname.endsWith('polyhaven.com'))throw Error('Host inesperado');
  const dest=resolve(path);if(!dest.startsWith(root+sep))throw Error('Destino fora da pasta de fontes');
  try{await stat(dest);return;}catch{}
  const response=await fetch(url,{signal:AbortSignal.timeout(120000)});if(!response.ok)throw Error(`${response.status} ${url}`);
  await mkdir(dirname(dest),{recursive:true});await writeFile(dest,Buffer.from(await response.arrayBuffer()));
}
async function metadata(id){await mkdir(join(root,id),{recursive:true});const path=join(root,id,'files.json');try{return JSON.parse(await readFile(path,'utf8'));}catch{}
  const data=await(await fetch('https://api.polyhaven.com/files/'+id)).json();await writeFile(path,JSON.stringify(data,null,2));return data;}
if(process.argv.includes('--download')){
  await mkdir(out,{recursive:true});
  for(const id of ids){const d=await metadata(id),f=d.gltf['1k'].gltf;
    await obtain(f.url,join(root,id,'source.gltf'));
    const entries=Object.entries(f.include??{});for(let i=0;i<entries.length;i+=4)await Promise.all(entries.slice(i,i+4).map(([path,file])=>obtain(file.url,join(root,id,path))));console.log('Fonte disponível',id);
    if(masks[id])await obtain(d[masks[id][0]]['1k'].png.url,join(root,id,masks[id][0]+'.png'));
  }
  for(const id of surfaces){const d=await metadata(id);for(const [map,key] of [['color','Diffuse'],['normal','nor_gl'],['arm','arm']]){
    const f=d[key]['1k'].jpg;await obtain(f.url,join(root,id,map+'.jpg'));
    await sharp(join(root,id,map+'.jpg')).resize(1024,1024,{fit:'inside'}).webp({quality:85}).toFile(join(out,id+'-'+map+'.webp'));
  }console.log('PBR',id);}
  const license=await(await fetch('https://polyhaven.com/license')).text();await writeFile(join(root,'polyhaven-license.html'),license);
}
if(process.argv.includes('--inspect')){
  for(const id of ids){const doc=await io.read(join(root,id,'source.gltf'));
    console.log(id,JSON.stringify(doc.getRoot().listNodes().filter(n=>n.getMesh()).map(n=>({name:n.getName(),bounds:getBounds(n),tri:n.getMesh().listPrimitives().reduce((s,p)=>s+(p.getIndices()?.getCount()??p.getAttribute('POSITION').getCount())/3,0)}))));
  }
}
if(process.argv.includes('--build')){
  await MeshoptSimplifier.ready;
  const manifest=[];
  const jobs=[['island_tree_02','tree',.055,.03],['island_tree_02','tree-low',.02,.06],['shrub_01','shrub',.08,.03],['grass_medium_02','grass',.3,.02],['painted_wooden_bench','bench',1,.001],['modular_chainlink_fence','fence',.4,.01],['modular_factory_facade','facade',1,.001]];
  for(const [id,name,ratio,error] of jobs){
    const doc=await io.read(join(root,id,'source.gltf'));
    // The provider's glTF references JPEG color maps; attach its separate opacity mask.
    if(masks[id]){
      const material=doc.getRoot().listMaterials().find(m=>m.getName()===masks[id][1]);
      if(!material)throw Error(`Material com máscara ausente: ${id}`);
      const texture=material.getBaseColorTexture();
      const alpha=await sharp(join(root,id,masks[id][0]+'.png')).resize(1024,1024).removeAlpha().greyscale().raw().toBuffer();
      const rgb=await sharp(texture.getImage()).resize(1024,1024).removeAlpha().png().toBuffer();
      const rgba=await sharp(rgb).joinChannel(alpha,{raw:{width:1024,height:1024,channels:1}}).png().toBuffer();
      texture.setImage(rgba).setMimeType('image/png');material.setAlphaMode('MASK').setAlphaCutoff(.35);
    }
    if(name==='facade'){
      const selectedNames=new Set(['wall_window_centered_large_01','window_centered_large_01','wall_door_centered_large_01','door_centered_large_01','wall_standard_standard_01','cornice01_standard_standard_01','base_standard_standard_01']);
      const nodes=doc.getRoot().listNodes().filter(n=>n.getMesh());
      const selected=nodes.filter(n=>selectedNames.has(n.getName()));
      if(!selected.length)throw Error('Selecionar módulos de fachada após inspeção');
      for(const n of nodes)if(!selected.includes(n))n.dispose();
    }
    if(name==='fence')for(const n of doc.getRoot().listNodes())if(n.getMesh()&&!['modular_chainlink_fence_double','modular_chainlink_fence_post'].includes(n.getName()))n.dispose();
    await doc.transform(prune(),dedup(),weld());
    if(ratio<1)await doc.transform(simplify({simplifier:MeshoptSimplifier,ratio,error,lockBorder:false}));
    await doc.transform(prune(),textureCompress({encoder:sharp,targetFormat:'webp',resize:[name==='tree-low'?512:1024,name==='tree-low'?512:1024],quality:83}));
    const path=join(out,name+'.glb');await io.write(path,doc);
    const tris=doc.getRoot().listMeshes().reduce((s,m)=>s+m.listPrimitives().reduce((a,p)=>a+(p.getIndices()?.getCount()??p.getAttribute('POSITION').getCount())/3,0),0);
    const info={file:name+'.glb',source:id,url:'https://polyhaven.com/a/'+id,license:'CC0-1.0',triangles:tris,bytes:(await stat(path)).size,sha256:createHash('sha256').update(await readFile(path)).digest('hex'),nodes:doc.getRoot().listNodes().filter(n=>n.getMesh()).map(n=>({name:n.getName(),bounds:getBounds(n)}))};manifest.push(info);console.log(name,tris,info.bytes);
  }
  await writeFile(join(out,'manifest.json'),JSON.stringify({generatedAt:new Date().toISOString(),models:manifest,surfaces:surfaces.map(id=>({id,url:'https://polyhaven.com/a/'+id,license:'CC0-1.0',maps:['color','normal','arm']}))},null,2));
}

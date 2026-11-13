import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { SCHOOL_ASSET_BUDGET, SCHOOL_BENCHES, SCHOOL_TREES } from './schoolArt';
import { BENCHES, TREES } from './urbanLayout';
import { BUILDINGS, CITY } from './city';

const folder=resolve('public/assets/school-pilot');
const manifest=JSON.parse(readFileSync(resolve(folder,'manifest.json'),'utf8')) as {
  models:{file:string;bytes:number;sha256:string;license:string;url:string;triangles:number}[];
  surfaces:{id:string;maps:string[];license:string;url:string}[];
};
describe('prova visual da escola',()=>{
  it('mantém a implantação, a área da cidade e os pontos de mobiliário existentes',()=>{
    expect([CITY.halfWidth,CITY.halfDepth]).toEqual([36,28]);
    expect(BUILDINGS.find(b=>b.id==='escola')).toMatchObject({x:-22,z:20.6,width:9,depth:4.4,height:3.4});
    for(const placement of SCHOOL_TREES)expect(TREES).toContain(placement);
    for(const placement of SCHOOL_BENCHES)expect(BENCHES).toContain(placement);
  });
  it('distribui apenas os assets documentados e respeita o orçamento de download',()=>{
    const files=readdirSync(folder);
    expect(files.reduce((sum,file)=>sum+statSync(resolve(folder,file)).size,0)).toBeLessThanOrEqual(SCHOOL_ASSET_BUDGET);
    const expected=['manifest.json',...manifest.models.map(m=>m.file),...manifest.surfaces.flatMap(s=>s.maps.map(m=>`${s.id}-${m}.webp`))];
    expect(files.sort()).toEqual(expected.sort());
    for(const model of manifest.models){
      const data=readFileSync(resolve(folder,model.file));
      expect(data.subarray(0,4).toString()).toBe('glTF');
      expect(data.length).toBe(model.bytes);
      expect(createHash('sha256').update(data).digest('hex')).toBe(model.sha256);
    }
    for(const asset of [...manifest.models,...manifest.surfaces]){
      expect(asset.license).toBe('CC0-1.0');
      expect(new URL(asset.url).hostname).toBe('polyhaven.com');
    }
  });
  it('reduz efetivamente a geometria da árvore no perfil econômico',()=>{
    expect(manifest.models.find(m=>m.file==='tree-low.glb')!.triangles).toBeLessThan(manifest.models.find(m=>m.file==='tree.glb')!.triangles*.5);
  });
  it('preserva transparência real nas texturas de folhas, grama e alambrado',()=>{
    for(const file of ['tree.glb','tree-low.glb','grass.glb','fence.glb','shrub.glb']){
      const buffer=readFileSync(resolve(folder,file)),jsonLength=buffer.readUInt32LE(12);
      const gltf=JSON.parse(buffer.subarray(20,20+jsonLength).toString()) as {
        materials:{alphaMode?:string;pbrMetallicRoughness:{baseColorTexture:{index:number}}}[];
        textures:{source?:number;extensions?:{EXT_texture_webp?:{source:number}}}[];
        images:{bufferView:number}[];bufferViews:{byteOffset:number;byteLength:number}[];
      };
      const masked=gltf.materials.filter(m=>m.alphaMode==='MASK');
      expect(masked.length,file).toBeGreaterThan(0);
      for(const material of masked){
        const texture=gltf.textures[material.pbrMetallicRoughness.baseColorTexture.index];
        const source=texture.extensions?.EXT_texture_webp?.source??texture.source!;
        const view=gltf.bufferViews[gltf.images[source].bufferView];
        const image=buffer.subarray(28+jsonLength+view.byteOffset,28+jsonLength+view.byteOffset+view.byteLength);
        expect(image.subarray(8,12).toString(),file).toBe('WEBP');
        // Lossy WebP with transparency has an extended header and the alpha feature flag.
        expect(image.subarray(12,16).toString(),file).toBe('VP8X');
        expect(image[20]&0x10,file).toBe(0x10);
      }
    }
  });
});

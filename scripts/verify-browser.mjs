import { spawn } from 'node:child_process';
import { mkdir, writeFile, readdir, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { readFile } from 'node:fs/promises';

const stage = process.argv.includes('--baseline') ? 'baseline' : 'stage2';
const capture = process.argv.find(arg => arg.startsWith('--capture='))?.split('=')[1];
const quick = process.argv.includes('--quick');
const school = process.argv.includes('--school');
const output = resolve(school ? '.local/school-pilot' : capture ? '.local/etapa-2-5' : '.local/etapa-2');
const evidence = capture ?? stage;
await mkdir(join(output, 'temp'), { recursive: true });
const browser = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', [
  '--headless=new', '--remote-debugging-port=9224', `--user-data-dir=${join(output, 'browser')}`,
  '--no-first-run', '--no-default-browser-check', '--disable-background-networking',
  '--disable-extensions', '--hide-scrollbars', 'about:blank',
], { windowsHide: true, stdio: 'ignore', env: { ...process.env, TEMP: join(output, 'temp'), TMP: join(output, 'temp') } });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
const pending = new Map();
const errors = [], failedRequests = [], checks = [];
let serial = 0;
const check = (name, passed, details) => { checks.push({ name, passed, details }); console.log(`${passed ? 'PASS' : 'FAIL'} ${name}`); };
function send(method, params = {}) {
  const id = ++serial;
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`Timeout: ${method}`)); }, 60000);
    pending.set(id, { resolve: value => { clearTimeout(timeout); resolve(value); }, reject: error => { clearTimeout(timeout); reject(error); } });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
const click = label => evaluate(`(() => { const element = [...document.querySelectorAll('button,input')].find(e => e.getAttribute('aria-label') === ${JSON.stringify(label)} || e.textContent.trim() === ${JSON.stringify(label)}); if (!element) throw Error('Controle ausente: ' + ${JSON.stringify(label)}); element.click(); return true; })()`);
async function quality(low) {
  await evaluate(`document.querySelector('#quality-select').dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))`);
  await delay(150);
  await evaluate(`document.querySelector('[role="option"][data-value="${low ? 'low' : 'high'}"]').click()`);
  await delay(1500);
}
async function screenshot(name) {
  const options={format:'png'};
  if(name==='mobile') { const {cssContentSize}=await send('Page.getLayoutMetrics'); options.captureBeyondViewport=true; options.clip={x:0,y:0,width:cssContentSize.width,height:cssContentSize.height,scale:1}; }
  const result = await send('Page.captureScreenshot', options);
  await writeFile(join(output, `${evidence}-${name}.png`), Buffer.from(result.data, 'base64'));
}
async function sample() {
  return evaluate(`new Promise(resolve => {
    const samples = []; let start, previous;
    function frame(time) {
      if (start === undefined) start = time;
      if (previous !== undefined) samples.push(time - previous);
      previous = time;
      if (time - start < ${quick ? 500 : 10000}) { requestAnimationFrame(frame); return; }
      const ordered = [...samples].sort((a,b) => a-b);
      resolve({ fps: samples.length * 1000 / samples.reduce((a,b)=>a+b,0), p95ms: ordered[Math.ceil(ordered.length * .95)-1], frames: samples.length, panel: document.querySelector('.metrics')?.textContent, diagnostics: (()=>{ const detail={}; document.querySelector('canvas').dispatchEvent(new CustomEvent('ecolab:inspect', {detail})); return detail; })() });
    } requestAnimationFrame(frame);
  })`);
}
async function buildSizes(dir) {
  const files = [];
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, item.name);
    if (item.isDirectory()) files.push(...await buildSizes(path));
    else files.push({ path: path.replaceAll('\\', '/'), bytes: (await stat(path)).size, gzipBytes: gzipSync(await readFile(path)).length });
  }
  return files;
}
try {
  let tabs;
  for (let i = 0; i < 60; i++) {
    try { tabs = await (await fetch('http://127.0.0.1:9224/json', { signal: AbortSignal.timeout(1500) })).json(); break; } catch { await delay(250); }
  }
  if (!tabs) throw Error('Navegador não iniciou');
  socket = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const call = pending.get(message.id); pending.delete(message.id);
      if (message.error) call?.reject(new Error(JSON.stringify(message.error))); else call?.resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params.args.map(a => a.value ?? a.description));
    if (message.method === 'Network.loadingFailed') failedRequests.push(message.params);
    if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) failedRequests.push(message.params.response);
  };
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Network.setCacheDisabled',{cacheDisabled:true});
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://127.0.0.1:4173'+(school?'?review=1':'') });
  for (let i = 0; i < 240; i++) { if (await evaluate(`document.querySelector('.model-status')?.textContent.includes('prontos')`)) break; await delay(250); }
  check('Cena carregada', await evaluate(`document.querySelector('.model-status')?.textContent.includes('prontos')`));
  if(school&&evidence!=='before'){
    const artReady=`(()=>{const detail={};document.querySelector('canvas')?.dispatchEvent(new CustomEvent('ecolab:inspect',{detail}));return detail.schoolArtReady;})()`;
    for(let i=0;i<240;i++){if(await evaluate(artReady))break;await delay(250);}
    check('Assets externos da escola carregados',await evaluate(artReady));
  }
  await click('Exibir FPS'); await delay(3000);
  // Match stage 1's actual drawing area, not just the browser viewport.
  if(stage==='stage2') {
    await evaluate(`(()=>{const style=document.createElement('style');style.id='benchmark-viewport';style.textContent='.scene-viewport { left:0!important;right:0!important;top:0!important;bottom:0!important; }';document.head.append(style);})()`);
    await delay(1500);
  }
  const benchmarkCanvas=await evaluate(`(()=>{const c=document.querySelector('canvas');const r=c.getBoundingClientRect();return {cssWidth:r.width,cssHeight:r.height,bufferWidth:c.width,bufferHeight:c.height};})()`);
  if(school){await click('Visitar Escola das Águas');await delay(1500);}
  const performance = {};
  for (const profile of ['high', 'low']) {
    if (profile === 'low') await quality(true);
    performance[profile] = [];
    for (let run = 0; run < (quick ? 1 : 3); run++) { performance[profile].push(await sample()); console.log(`${stage} ${profile} amostra ${run + 1}`); }
    await screenshot(profile);
  }
  await quality(false);
  if(stage==='stage2'){await evaluate(`document.querySelector('#benchmark-viewport').remove()`);await delay(600);}
  if(school){await click('Redefinir câmera');await delay(400);}
  if (stage === 'stage2') {
    const inspect = () => evaluate(`(() => { const detail={}; document.querySelector('canvas').dispatchEvent(new CustomEvent('ecolab:inspect',{detail})); return detail; })()`);
    const initial = await inspect();
    check('Visão geral ortográfica', initial.camera.type === 'OrthographicCamera', initial.camera);
    await click('Aproximar'); await delay(400);
    check('Zoom isométrico', (await inspect()).camera.zoom > initial.camera.zoom);
    await click('Redefinir câmera'); await delay(400);
    check('Reset da visão geral', Math.abs((await inspect()).camera.zoom-initial.camera.zoom)<.001);
    const drag={x:720,y:430};
    await send('Input.dispatchMouseEvent',{type:'mousePressed',...drag,button:'left',clickCount:1});
    await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:800,y:460,button:'left',buttons:1});
    await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:800,y:460,button:'left',clickCount:1});await delay(400);
    const rotated=await inspect();
    check('Rotação isométrica e projeção dos marcadores',JSON.stringify(rotated.camera.position)!==JSON.stringify(initial.camera.position)&&JSON.stringify(rotated.points[0].screen)!==JSON.stringify(initial.points[0].screen)&&JSON.stringify(rotated.points[0].world)===JSON.stringify(initial.points[0].world));
    await click('Redefinir câmera');await delay(400);
    check('Reset elimina inércia de rotação',Math.hypot(...(await inspect()).camera.position.map((n,i)=>n-initial.camera.position[i]))<.001);
    // Actual raycasting: click the projected marker, not the panel button.
    const point=(await inspect()).points.find(p=>p.id==='corrego-01');
    await send('Input.dispatchMouseEvent',{type:'mousePressed',x:point.screen[0],y:point.screen[1],button:'left',clickCount:1});
    await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:point.screen[0],y:point.screen[1],button:'left',clickCount:1});
    await delay(300);
    check('Marcador 3D selecionado por raycast',await evaluate(`document.querySelector('.point-detail h2')?.textContent==='Córrego do distrito'`));
    for(const label of ['Córrego do distrito','Parque das Nascentes','Vila das Águas']) {
      await evaluate(`([...document.querySelectorAll('.point-option')].find(e=>e.textContent.includes(${JSON.stringify(label)}))).click()`);
      check(`Seleção: ${label}`,await evaluate(`document.querySelector('.point-detail h2')?.textContent===${JSON.stringify(label)}`));
      await click('Aproximar deste ponto');await delay(400);
      check(`Enquadramento: ${label}`,(await inspect()).camera.zoom>initial.camera.zoom);
      await screenshot(label==='Córrego do distrito'?'creek':label==='Vila das Águas'?'residential':'park');
    }
    if(capture && capture!=='before'){
      check('Atalhos visíveis e livres de sobreposição',await evaluate(`Array.from(document.querySelectorAll('.place-buttons button')).every(button=>{const r=button.getBoundingClientRect();return document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button')===button;})`));
      for(const [id,label] of [['school','Escola das Águas'],['canal','Passeio do Córrego'],['village','Vila das Águas'],['market','Rua do Mercado'],['health','Unidade de Saúde'],['park','Parque das Nascentes']]){
        const target=await evaluate(`(()=>{const b=document.querySelector('[aria-label="Visitar ${label}"]').getBoundingClientRect();return {x:b.x+b.width/2,y:b.y+b.height/2};})()`);
        await send('Input.dispatchMouseEvent',{type:'mousePressed',...target,button:'left',clickCount:1});
        await send('Input.dispatchMouseEvent',{type:'mouseReleased',...target,button:'left',clickCount:1});await delay(400);
        const view=await inspect();
        check(`Visita rápida: ${label}`,view.camera.type==='OrthographicCamera'&&view.camera.zoom>initial.camera.zoom);
        await screenshot(id);
      }
      check('Vinte civis e quatro veículos na cena',(await inspect()).actors.length===24);
    }
    await click('Redefinir câmera');await delay(400);
    await click('Pausar animação');await delay(300);
    const beforePause=await inspect();
    const rect=await evaluate(`(()=>{const r=document.querySelector('canvas').getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,scale:1};})()`);
    const pausedImage=(await send('Page.captureScreenshot',{format:'png',clip:rect})).data;
    await delay(700);
    const afterPause=await inspect();
    check('Pausa preserva posições de todos os agentes',JSON.stringify(beforePause.actors)===JSON.stringify(afterPause.actors));
    check('Pausa congela água e vegetação',pausedImage===(await send('Page.captureScreenshot',{format:'png',clip:rect})).data);
    await click('Continuar animação');await delay(3600);
    check('Movimento retomado',JSON.stringify((await inspect()).actors)!==JSON.stringify(afterPause.actors));
    if(capture && capture!=='before'){
      const resumed=await inspect();
      check('Todos os civis e veículos retomam movimento',resumed.actors.every((actor,i)=>actor.position?.every(Number.isFinite)&&Math.hypot(...actor.position.map((n,j)=>n-afterPause.actors[i].position[j]))>.01));
    }
    const memoryBefore=(await inspect()).memory;
    await click('Explorar cidade');await delay(500);
    const start=await inspect();
    check('Câmera em perspectiva à altura de pedestre',start.camera.type==='PerspectiveCamera'&&Math.abs(start.camera.position[1]-1.93)<.02,start.camera);
    await screenshot('explore-start');
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'w',code:'KeyW',windowsVirtualKeyCode:87});await delay(1100);
    await send('Input.dispatchKeyEvent',{type:'keyUp',key:'w',code:'KeyW',windowsVirtualKeyCode:87});await delay(400);
    const moved=await inspect();
    check('WASD desloca a câmera',moved.camera.position[0]>start.camera.position[0]+2,moved.camera.position);
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'w',code:'KeyW',windowsVirtualKeyCode:87});await delay(10000);
    await send('Input.dispatchKeyEvent',{type:'keyUp',key:'w',code:'KeyW',windowsVirtualKeyCode:87});await delay(300);
    const edge=await inspect();
    check('Travessia da ponte e bloqueio no fim da superfície',edge.camera.position[0]>8&&edge.camera.position[0]<19.2,edge.camera.position);
    const canvasRect=await evaluate(`(()=>{const r=document.querySelector('canvas').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
    await send('Input.dispatchMouseEvent',{type:'mouseMoved',...canvasRect});
    await send('Input.dispatchMouseEvent',{type:'mousePressed',...canvasRect,button:'left',clickCount:1});await delay(200);
    await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:canvasRect.x+90,y:canvasRect.y+20,button:'left',buttons:1});
    await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:canvasRect.x+90,y:canvasRect.y+20,button:'left',clickCount:1});await delay(200);
    check('Mouse altera a direção',JSON.stringify((await inspect()).camera.rotation)!==JSON.stringify(edge.camera.rotation));
    await screenshot('explore-bridge');
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await delay(400);
    check('Esc retorna à visão geral',(await inspect()).camera.type==='OrthographicCamera');
    for(let i=0;i<4;i++){await click('Explorar cidade');await delay(80);await click('Voltar à visão geral');await delay(100);}
    const memoryAfter=(await inspect()).memory;
    check('Trocas de câmera não acumulam geometrias ou texturas',memoryAfter.geometries<=memoryBefore.geometries&&memoryAfter.textures<=memoryBefore.textures,{before:memoryBefore,after:memoryAfter});
    await click('Explorar cidade');await delay(400);
    if(!quick){performance.explore=[];for(let i=0;i<3;i++){performance.explore.push(await sample());console.log(`explore amostra ${i+1}`);}}
    await click('Voltar à visão geral');await delay(300);
    await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});await delay(700);
    check('Layout móvel sem transbordamento horizontal',await evaluate('document.documentElement.scrollWidth===390'));
    await screenshot('mobile');
    await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await delay(500);
    await screenshot('desktop');
  }
  const reviewFrames=[];
  if(school){
    await click('Pausar animação');await delay(400);
    for(const [name,kind,position,target] of [
      ['fixed-isometric','orthographic',[19,30,57],[-14,0,21]],
      ['fixed-facade','perspective',[-13,2.6,27],[-23,1.8,21]],
      ['fixed-canal','perspective',[10,2.6,26],[-7,1.6,22]],
    ]){
      const frame=await evaluate(`(()=>{const detail=${JSON.stringify({kind,position,target})};document.querySelector('canvas').dispatchEvent(new CustomEvent('ecolab:review',{detail}));return detail;})()`);
      if(!frame.png)throw Error('Captura comparável indisponível');
      await writeFile(join(output,`${evidence}-${name}.png`),Buffer.from(frame.png.split(',')[1],'base64'));
      delete frame.png;reviewFrames.push({name,...frame});
    }
  }
  const hardware = await evaluate(`(() => { const canvas=document.querySelector('canvas'); const gl=canvas.getContext('webgl2'); const ext=gl.getExtension('WEBGL_debug_renderer_info'); return { renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER), userAgent:navigator.userAgent, dpr:devicePixelRatio }; })()`);
  check('Console sem erros', errors.length === 0, errors);
  check('Carregamento sem falhas', failedRequests.length === 0, failedRequests);
  const report = { stage:evidence, quick, school, reviewFrames, measuredAt: new Date().toISOString(), viewport: [1440,1000], benchmarkCanvas, sampleSeconds:quick?.5:10, samplesPerProfile:quick?1:3, hardware, performance, checks, build: await buildSizes(resolve('dist')) };
  await writeFile(join(output, `${evidence}${quick?'-quick':''}-results.json`), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ stage:evidence,checks:checks.length,failed:checks.filter(c=>!c.passed),performance:Object.fromEntries(Object.entries(performance).map(([key,rows])=>[key,rows.map(({fps,p95ms,diagnostics})=>({fps,p95ms,render:diagnostics?.render}))])) }, null, 2));
  if (checks.some(c => !c.passed)) process.exitCode = 1;
} finally {
  if (socket?.readyState === WebSocket.OPEN) { try { await send('Browser.close'); } catch {} socket.close(); }
  browser.kill();
}

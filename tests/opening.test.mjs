import test from 'node:test';
import {hoverPose} from '../src/ground.js';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { OpeningState, stripVertex, pouchVertex, extractionPose, assemblyTiming, cardPose, DURATION, clamp, smooth, out, mix } from '../src/opening-state.js';

test('manual tear is monotonic, bounded, and holds after release', () => {
  const s = new OpeningState(); s.pull(.35); s.tick(10); assert.equal(s.cut, .35);
  s.pull(.1); assert.equal(s.cut, .35); s.pull(10); assert.equal(s.cut, 1); assert.equal(s.phase, 'lifting');
});
test('one click visits tear, lift, light, cards, assembly and completion in order', () => {
  const s = new OpeningState(), seen = [s.phase]; s.open();
  for (let t = 0; t < 7; t += .02) { const f = s.tick(.02); if (seen.at(-1) !== f.phase) seen.push(f.phase); }
  assert.deepEqual(seen, ['sealed', 'tearing', 'lifting', 'lighting', 'cards', 'assembling', 'done']);
});
test('repeat clicks cannot reset a started opening', () => {
  const s = new OpeningState(); s.open(); s.tick(.4); const t = s.time; s.open(); assert.equal(s.time, t);
  s.tick(.5); assert.equal(s.phase, 'lifting'); s.open(); assert.equal(s.phase, 'lifting');
});
test('a click completes a partly torn seal without jumping backwards', () => {
  const s = new OpeningState(); s.pull(.6); s.open(); s.tick(.1); assert.ok(s.cut > .6); assert.ok(s.cut < 1);
});
test('skip terminates and reset clears progress from every phase', () => {
  for (const time of [0, .4, 1, 1.6, 2.4, 4, 6]) {
    const s = new OpeningState(); s.open(); for (let t = 0; t < time; t += .02) s.tick(.02);
    s.skip(); assert.equal(s.tick(5).phase, 'done'); s.reset(); assert.deepEqual(s.frame(), {phase:'sealed',cut:0,lift:0,light:0,cards:0,assembly:0});
  }
});
test('strip stays finite and its uncut edge is fixed until it detaches', () => {
  for (let cut = 0; cut <= 1; cut += .025) {
    const right = stripVertex(.625, 0, cut, 0); assert.equal(right[0], .625);
    for (let x = -.625; x <= .625; x += .025) assert.ok(stripVertex(x, .1, cut, .5).every(Number.isFinite));
  }
  assert.deepEqual(stripVertex(-.625, .1, 0, 0),[-.625,.1,0]);
  assert.ok(stripVertex(-.625, .1, 1, 1)[1] > 1);
});

const textureAssets = ['data:image/png;base64,test'];
const code = fs.readFileSync(new URL('../src/opening.js', import.meta.url),'utf8');
function harness({ hash = '', reduced = false, failGPU = false } = {}) {
  let now = 0, id = 0, created = 0, disposed = 0; const rafs = new Map(), loads = [];
  class Element {
    constructor(name='') {this.name=name;this.hidden=false;this.inert=false;this.dataset={};this.events={};this.clientWidth=1200;this.clientHeight=800;this.style={setProperty(){}};this.classes=new Set();this.classList={add:(...x)=>x.forEach(v=>this.classes.add(v)),remove:(...x)=>x.forEach(v=>this.classes.delete(v))};}
    addEventListener(n,f){(this.events[n]??=[]).push(f)}
    emit(n,e={}){for(const f of this.events[n]||[])f({target:this,button:0,preventDefault(){},...e})}
    dispatchEvent(e){this.emit(e.type,e)}
    querySelector(s){return this.children?.[s]||null} querySelectorAll(s){return this.multiple?.[s]||[]}
    focus(){this.focused=true} scrollIntoView(){this.scrolled=true} setPointerCapture(){} hasPointerCapture(){return false}
    closest(s){return s==='button' && ['abrir-pack','pular','rever'].includes(this.name)?this:null}
    getBoundingClientRect(){return {left:0,top:200,width:400,height:620,right:400,bottom:820}}
    animate(frames,options){this.animation={frames,options,cancelled:false};return {pause(){},currentTime:0,cancel:()=>{this.animation.cancelled=true}}}
  }
  const ids=Object.fromEntries(['site','abrir-pack','pular','rever','aviso','sobre','projetos','acervo','inicio','contato'].map(n=>[n,new Element(n)]));
  const opening=new Element(),canvas=new Element(),model=new Element(),burst=new Element(),label=new Element();
  const cards=[new Element(),new Element(),new Element()];
  opening.children={'canvas':canvas,'.opening-model':model,'.opening-radiance':burst};opening.multiple={'.opening-card':cards};
  model.children={'.opening-model__body':new Element(),'.opening-model__strip':new Element(),'.opening-model__mouth':new Element()};
  ids['abrir-pack'].children={'.pack-open__label':label};ids.site.children={'.header':new Element()};ids.sobre.children={'.hero__portrait':new Element(),'.hero__identity':new Element(),'.hero__bio':new Element()};
  const document=new Element();document.body=new Element();document.documentElement=new Element();document.currentScript={src:'https://portfolio.test/portfolio/assets/js/opening.js'};document.getElementById=n=>ids[n];
  const motion=new Element();motion.matches=reduced;const globalEvents=new Element();
  const context={opening,site:ids.site,document,location:{href:'https://portfolio.test/portfolio/',hash},innerWidth:1200,innerHeight:800,
    OpeningState,hoverPose,clamp,smooth,out,mix,DURATION,extractionPose,assemblyTiming,cardPose,URL,textureAssets,console:{error(){},warn(){},info(){}},CustomEvent:class{constructor(type){this.type=type}},
    matchMedia:()=>motion,performance:{now:()=>now},requestAnimationFrame:f=>{rafs.set(++id,f);return id},cancelAnimationFrame:i=>rafs.delete(i),
    addEventListener:globalEvents.addEventListener.bind(globalEvents),scrollTo(){},
    loadImage:url=>new Promise((resolve,reject)=>loads.push({url,resolve,reject})),
    OpeningScene:class{constructor(){if(failGPU)throw Error('GPU unavailable');created++}dispose(){disposed++}resize(){}hit(x,y){return {seal:y<330}}draw(){return {seal:{x:500,y:280},cards:[0,1,2].map(i=>({x:400+i*200,y:300,width:180,height:240}))}}}
  };
  context.window=context;vm.runInNewContext(code.slice(code.indexOf('function setup()'))+'\nsetup();',context);
  function advance(seconds){for(let t=0;t<seconds;t+=.02){now+=20;const batch=[...rafs.values()];rafs.clear();batch.forEach(f=>f(now))}}
  async function textures(){loads.forEach(l=>l.resolve({width:100,height:100}));for(let i=0;i<8;i++)await Promise.resolve()}
  return {ids,opening,canvas,model,cards,label,motion,globalEvents,document,rafs,loads,advance,textures,get created(){return created},get disposed(){return disposed}};
}

test('opening textures use embedded bytes independent of origin or GitHub subpath', () => {
  const h=harness();assert.ok(h.loads[0].url.startsWith('data:image/'));
});
test('CSS 3D click completes while textures are still loading', () => {
  const h=harness();h.ids['abrir-pack'].emit('click',{detail:0});h.advance(6);
  assert.equal(h.opening.hidden,true);assert.equal(h.ids.site.inert,false);assert.equal(h.rafs.size,0);
  assert.ok(h.ids.sobre.children['.hero__portrait'].animation);assert.ok(h.ids.projetos.animation);assert.ok(h.ids.acervo.animation);
});
test('WebGL path renders and returns actual sections to their final state', async () => {
  const h=harness();await h.textures();assert.equal(h.created,1);assert.equal(h.opening.dataset.renderer,'webgl2');
  h.ids['abrir-pack'].emit('click',{detail:0});h.advance(6);assert.equal(h.disposed,1);assert.equal(h.ids.site.inert,false);assert.ok(h.ids.inicio.focused);
});
test('GPU failure keeps the complete CSS 3D sequence functional', async () => {
  const h=harness({failGPU:true});await h.textures();assert.equal(h.opening.dataset.renderer,'css-3d');
  h.ids['abrir-pack'].emit('click',{detail:0});h.advance(6);assert.equal(h.opening.hidden,true);
});
test('skip during texture loading prevents stale GPU initialization', async () => {
  const h=harness();h.ids.pular.emit('click');await h.textures();assert.equal(h.created,0);assert.ok(h.ids.projetos.scrolled);assert.equal(h.rafs.size,0);
});
test('context loss midway preserves the sequence and completes it', async () => {
  const h=harness();await h.textures();h.ids['abrir-pack'].emit('click',{detail:0});h.advance(1);h.canvas.emit('webglcontextlost');
  assert.equal(h.opening.dataset.renderer,'css-3d');h.advance(6);assert.equal(h.ids.site.inert,false);
});
test('replay resets the whole sequence and Escape never traps focus', () => {
  const h=harness();h.ids['abrir-pack'].emit('click',{detail:0});h.advance(2);h.globalEvents.emit('keydown',{key:'Escape'});
  assert.equal(h.opening.hidden,true);h.ids.rever.emit('click');assert.equal(h.opening.hidden,false);assert.equal(h.opening.dataset.phase,'sealed');
  h.ids['abrir-pack'].emit('click',{detail:0});h.advance(6);assert.equal(h.rafs.size,0);assert.equal(h.ids.site.inert,false);
});
test('manual drag holds its partial tear and can resume to completion', () => {
  const h=harness();h.opening.emit('pointerdown',{target:h.canvas,pointerId:1,clientX:200,clientY:220});
  h.opening.emit('pointermove',{pointerId:1,clientX:350,clientY:220});h.advance(.5);
  h.opening.emit('pointerup',{target:h.canvas,pointerId:1});h.advance(1);assert.equal(h.opening.dataset.phase,'tearing');
  h.opening.emit('pointerdown',{target:h.canvas,pointerId:2,clientX:50,clientY:220});h.opening.emit('pointermove',{pointerId:2,clientX:380,clientY:220});h.advance(6);assert.equal(h.opening.hidden,true);
});
test('wheel never opens the pack; reduced motion releases the page', () => {
  const h=harness();h.opening.emit('wheel',{deltaY:900,deltaMode:0});h.advance(6);assert.equal(h.opening.hidden,false);assert.equal(h.opening.dataset.phase,'sealed');
  const q=harness();q.motion.emit('change',{matches:true});assert.equal(q.opening.hidden,true);assert.equal(q.ids.site.inert,false);
});
test('direct anchors and reduced motion never lock the site', () => {
  for(const options of [{hash:'#projetos'},{reduced:true}]){const h=harness(options);assert.equal(h.ids.site.inert,false);assert.equal(h.rafs.size,0);assert.equal(h.loads.length,0)}
});

test('pointer click on the keyboard control cannot open the pack',()=>{
  const h=harness();h.ids['abrir-pack'].emit('click',{detail:1});h.advance(5);
  assert.equal(h.opening.dataset.phase,'sealed');assert.equal(h.opening.hidden,false);
});
test('body drag rotates without tearing',()=>{
  const h=harness();h.opening.emit('pointerdown',{target:h.canvas,pointerId:1,clientX:200,clientY:500});
  h.opening.emit('pointermove',{pointerId:1,clientX:700,clientY:500});h.advance(1);
  assert.equal(h.opening.dataset.phase,'sealed');assert.equal(h.opening.hidden,false);
});

test('pouch perimeter stays sealed while its center opens',()=>{
  for(const lift of [0,.25,.5,1]) {
    for(const x of [-.625,.625]) for(const y of [-.95,0,.95]) for(const back of [false,true]) {
      const p=pouchVertex(x,y,lift,back);
      assert.ok(Math.abs(p[2]-.004)<1e-8);
      assert.ok(Math.abs(p[1]-y)<1e-8);
    }
    assert.ok(pouchVertex(0,0,lift)[2]>.09);
  }
  assert.ok(pouchVertex(0,.95,1)[2]>.2);
  assert.ok(Math.abs(pouchVertex(0,.95,0)[2]-.004)<1e-8);
});

test('all cards start inside and fully clear the lip before fanning',()=>{
  for(let i=0;i<3;i++) {
    const start=extractionPose(0,i);assert.ok(start.y+1.09/2<.9);
    for(let p=0;p<=1;p+=.01) {
      const pose=extractionPose(p,i);
      assert.ok(Math.abs(pose.z)<=.025);
      if(pose.fan>0) assert.ok(pose.y-1.09/2>.9);
    }
    assert.equal(extractionPose(1,i).fan,1);
  }
});


test('assembly is continuous and every card reaches its target',()=>{
 for(let i=0;i<3;i++){
  const a={x:0,y:0,escala:1,giro:.2,inclina:.1},b={x:100,y:150,escala:1.1,giro:0,inclina:0},c={x:300,y:200,escala:2,giro:0,inclina:0};
  let prev=cardPose(a,b,c,assemblyTiming(0,i));
  for(let t=.001;t<=1;t+=.001){const p=cardPose(a,b,c,assemblyTiming(t,i));assert.ok(Object.values(p).every(Number.isFinite));assert.ok(Math.abs(p.x-prev.x)<5);prev=p;}
  const end=cardPose(a,b,c,assemblyTiming(1,i));assert.equal(end.x,c.x);assert.equal(end.y,c.y);assert.equal(end.escala,c.escala);
 }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
function setup(reduce=false){
 const events={},queue=[];let captured=false,clock=1000;
 const front={inert:false,setAttribute(){},click(){this.clicked=true}};
 const turn={style:{}};
 const card={clientWidth:300,style:{setProperty(){}},classList:{add(){},remove(){}},
 querySelector:s=>s==='.piece__open'?front:turn,
 addEventListener:(s,f)=>events[s]=f,setPointerCapture(){captured=true},
 hasPointerCapture:()=>captured,releasePointerCapture(){captured=false},
 getBoundingClientRect:()=>({left:0,top:0,width:300,height:450})};
 vm.runInNewContext(readFileSync(new URL('../docs/assets/js/posters.js',import.meta.url),'utf8'),{
 document:{querySelectorAll:()=>[card]},matchMedia:q=>({matches:q.includes('prefers-reduced-motion')?reduce:false}),performance:{now:()=>clock},
 requestAnimationFrame:fn=>{queue.push(fn);return queue.length}});
 const send=(name,extra={})=>{const e={pointerId:1,isPrimary:true,button:0,clientX:0,clientY:0,detail:1,
 preventDefault(){this.prevented=true},stopPropagation(){},stopImmediatePropagation(){this.stopped=true},...extra};events[name](e);return e};
 const flush=()=>{let n=0;while(queue.length){assert.ok(n++<300);clock+=16;queue.shift()(clock)}};
 return {send,flush,front,turn,card};
}
test('drag turns to the YDHC reverse without opening the lightbox',()=>{
 const h=setup();h.send('pointerdown');h.send('pointermove',{clientX:230});h.send('pointerup',{clientX:230});
 const click=h.send('click');assert.equal(click.prevented,true);assert.equal(click.stopped,true);
 h.flush();assert.equal(h.front.inert,true);assert.match(h.turn.style.transform,/rotateY\(180deg\)/);
});
test('a normal click remains available and vertical scrolling does not turn cards',()=>{
 const h=setup();h.send('pointerdown');h.send('pointermove',{clientY:60});h.send('pointerup');h.flush();
 assert.equal(h.send('click').prevented,undefined);assert.equal(h.front.inert,false);
});
test('keyboard rotation and return work with reduced motion',()=>{
 const h=setup(true);h.send('keydown',{key:'ArrowRight'});h.flush();assert.equal(h.front.inert,true);
 h.send('keydown',{key:'Home'});h.flush();assert.equal(h.front.inert,false);
 h.send('keydown',{key:'Enter',target:h.card});assert.equal(h.front.clicked,true);
});
test('cancelled gestures release capture and settle',()=>{
 const h=setup();h.send('pointerdown');h.send('pointermove',{clientX:200});h.send('pointercancel');h.flush();
 assert.match(h.turn.style.transform,/rotateY\(180deg\)/);
});

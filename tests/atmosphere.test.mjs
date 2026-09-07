import test from 'node:test';
import assert from 'node:assert/strict';
import {createAtmosphere,renderOpeningLayers} from '../src/atmosphere.js';
test('background finishes before opaque and transparent packet objects are drawn',()=>{
 const calls=[],bg={},objects={},camera={};
 const renderer={autoClear:true,clear(){calls.push('clear')},clearDepth(){calls.push('depth')},render(scene,c){assert.equal(c,camera);assert.equal(this.autoClear,false);calls.push(scene===bg?'background':'packet')}};
 renderOpeningLayers(renderer,bg,objects,camera);
 assert.deepEqual(calls,['clear','background','depth','packet']);assert.equal(renderer.autoClear,true);
 const atmosphere=createAtmosphere();assert.equal(atmosphere.material.depthWrite,false);assert.equal(atmosphere.material.depthTest,false);atmosphere.geometry.dispose();atmosphere.material.dispose();
});
test('renderer state is restored on rendering failure',()=>{
 const renderer={autoClear:true,clear(){},render(){throw Error('context lost')}};
 assert.throws(()=>renderOpeningLayers(renderer,{},{},{}));assert.equal(renderer.autoClear,true);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {groundShadow,hoverPose,createGround,GROUND_Y} from '../src/ground.js';
test('shadow spreads and fades as the booster rises, away from upper-left key light',()=>{
 const low=groundShadow(1.3,0),high=groundShadow(1.7,0);
 assert.ok(high.width>low.width);assert.ok(high.depth>low.depth);
 assert.ok(high.strength<low.strength);assert.ok(high.x>low.x);assert.ok(high.z<low.z);
});
test('booster motion is continuous across the loop and stays above the floor',()=>{
 assert.ok(Math.abs(hoverPose(0).y-hoverPose(6.8).y)<1e-10);
 for(let t=0;t<14;t+=.01){const p=hoverPose(t);assert.ok(-.05+p.y-1>GROUND_Y);assert.ok(Math.abs(p.y-hoverPose(t+.01).y)<.001)}
 const floor=createGround();assert.equal(floor.position.y,GROUND_Y);assert.equal(floor.material.depthTest,true);assert.equal(floor.material.depthWrite,false);floor.geometry.dispose();floor.material.dispose();
});

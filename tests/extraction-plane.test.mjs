import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {extractionPose} from '../src/opening-state.js';
test('mouth clipping follows front, side and rear packet rotations',()=>{
 for(const yaw of [-Math.PI,-1.5,0,1.5,Math.PI]) for(const pitch of [-.4,0,.4]) {
  const packet=new THREE.Group();packet.position.set(.2,-.15,.1);packet.rotation.set(pitch,yaw,.025);packet.updateMatrixWorld(true);
  const plane=new THREE.Plane(new THREE.Vector3(0,1,0),-.9).applyMatrix4(packet.matrixWorld);
  for(let i=0;i<3;i++) for(let t=0;t<.72;t+=.02){
   const pose=extractionPose(t,i);
   for(const x of [-.39,0,.39]) for(const dy of [-.545,0,.545]){
    const local=new THREE.Vector3(x,pose.y+dy,pose.z);
    const distance=plane.distanceToPoint(packet.localToWorld(local.clone()));
    assert.ok(Math.abs(distance-(local.y-.9))<1e-10);
   }
  }
 }
});

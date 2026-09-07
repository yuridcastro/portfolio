import * as THREE from 'three';
export const GROUND_Y = -1.48;
export function hoverPose(time) {
  const phase=time*Math.PI*2/6.8;
  return {y:.045*Math.sin(phase),roll:.006*Math.sin(phase+.65)};
}
// Area-light approximation: penumbra grows with distance from the floor.
export function groundShadow(height,yaw) {
  const h=Math.max(.08,height);
  return {x:h*1.4/4,z:-h*2.2/4,
    width:.32+.13*h+.18*Math.abs(Math.cos(yaw)),
    depth:.30+.16*h+.12*Math.abs(Math.sin(yaw)),
    strength:.62/(1+.28*h)};
}
export function createGround(){
  const material=new THREE.ShaderMaterial({
    uniforms:{opacity:{value:1},center:{value:new THREE.Vector2()},spread:{value:new THREE.Vector2(.6,.5)},strength:{value:.4}},
    transparent:true,depthWrite:false,toneMapped:false,
    vertexShader:`varying vec3 world;void main(){vec4 p=modelMatrix*vec4(position,1.);world=p.xyz;gl_Position=projectionMatrix*viewMatrix*p;}`,
    fragmentShader:`varying vec3 world;uniform float opacity,strength;uniform vec2 center,spread;
    void main(){
      vec2 p=world.xz;
      float pool=exp(-dot((p-vec2(-.35,.15))/vec2(3.8,4.),(p-vec2(-.35,.15))/vec2(3.8,4.)));
      vec3 floorColor=mix(vec3(.035,.077,.11),vec3(.19,.29,.35),pool*.78);
      vec2 q=(p-center)/spread;
      float soft=exp(-dot(q,q)*.75);
      float core=exp(-dot(q,q)*2.5);
      floorColor*=1.-strength*(.74*soft+.26*core);
      float distanceFade=1.-smoothstep(6.,17.,length(p));
      gl_FragColor=vec4(floorColor,opacity*distanceFade);
    }`
  });
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(48,48),material);
  mesh.rotation.x=-Math.PI/2;mesh.position.y=GROUND_Y;mesh.renderOrder=-20;
  return mesh;
}

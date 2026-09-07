import * as THREE from 'three';

// A full-screen atmosphere behind the physical scene; no image textures.
export function createAtmosphere() {
  const material = new THREE.ShaderMaterial({
    uniforms: {time:{value:0},aspect:{value:1},opacity:{value:1}},
    depthTest:false, depthWrite:false, transparent:true, toneMapped:false,
    vertexShader: `varying vec2 vUv;
      void main(){vUv=uv;gl_Position=vec4(position.xy,1.0,1.0);}`,
    fragmentShader: `
      varying vec2 vUv;
      uniform float time, aspect, opacity;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){
        vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),
                   mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);
      }
      float fbm(vec2 p){
        float n=0.,a=.5;
        for(int i=0;i<4;i++){n+=a*noise(p);p=mat2(.8,-.6,.6,.8)*p*2.03+7.1;a*=.5;}
        return n;
      }
      void main(){
        vec2 uv=vUv,p=vec2((uv.x-.5)*aspect,uv.y);
        // Broad overhead light from upper left, matching the foil's softbox.
        float coneWidth=.12+(1.-uv.y)*.55;
        float beam=exp(-pow((p.x+.17)/coneWidth,2.)*1.7);
        float overhead=exp(-dot(vec2((p.x+.19)*1.25,(uv.y-.91)*.7),
                                 vec2((p.x+.19)*1.25,(uv.y-.91)*.7))*3.);
        vec3 color=mix(vec3(.018,.047,.080),vec3(.095,.205,.285),beam*.72);
        color+=vec3(.21,.29,.34)*overhead*.62;
        // Two slow layers of warped noise, strongest at the edges of the light.
        vec2 drift=vec2(time*.013,-time*.009);
        vec2 q=vec2(fbm(p*2.5+drift),fbm(p*2.5-drift+4.8));
        float smoke=fbm(p*4.4+q*1.7+drift);
        float veil=smoothstep(.32,.76,smoke);
        float edge=1.-exp(-p.x*p.x*5.);
        color+=vec3(.14,.20,.24)*veil*(.12+.20*edge)*(.25+beam);
        // A continuous studio floor, softly lit without a hard horizon line.
        float floorLight=exp(-pow(p.x*1.1,2.)-pow((uv.y-.10)*5.,2.));
        color+=vec3(.075,.13,.17)*floorLight;
        float vignette=1.-.32*smoothstep(.35,1.,length(vec2(p.x*.62,uv.y-.5)));
        gl_FragColor=vec4(color*vignette,opacity);
      }`
  });
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(2,2),material);
  mesh.frustumCulled=false;mesh.renderOrder=-1000;
  return mesh;
}

// Separate passes are necessary: Three renders transparent objects after opaque
// objects regardless of renderOrder. A background in that queue hides the pouch.
export function renderOpeningLayers(renderer, atmosphere, objects, camera) {
  const autoClear = renderer.autoClear;
  renderer.autoClear = false;
  try {
    renderer.clear();
    renderer.render(atmosphere, camera);
    renderer.clearDepth();
    renderer.render(objects, camera);
  } finally { renderer.autoClear = autoClear; }
}

import * as THREE from 'three';
import {extractionHandoff} from './extraction-handoff.js';
import {createGround,groundShadow,hoverPose,GROUND_Y} from './ground.js';
import {createAtmosphere, renderOpeningLayers} from './atmosphere.js';
import { clamp, smooth, out, mix, stripVertex, pouchVertex, extractionPose, assemblyTiming, cardPose, shufflePose, revealPose } from './opening-state.js';
const W = 1.25, H = 1.90, TOP = .90;
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const timeout = setTimeout(() => reject(new Error('Image load timeout')), 10000);
    image.onload = () => { clearTimeout(timeout); resolve(image); };
    image.onerror = () => { clearTimeout(timeout); reject(new Error('Image unavailable')); };
    image.src = url;
  });
}
function imageTexture(image) {
  const t = new THREE.Texture(image); t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true;
  t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = false;
  return t;
}
function surface(width, height, crop, sx = 48, sy = 56) {
  const geo = new THREE.PlaneGeometry(width, height, sx, sy);
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, mix(crop[0], crop[2], uv.getX(i)), 1 - mix(crop[1], crop[3], 1 - uv.getY(i)));
  }
  return geo;
}
function cardTexture(image, title, note, i) {
  const c = document.createElement('canvas'); c.width = 640; c.height = 900;
  const x = c.getContext('2d');
  const metal = x.createLinearGradient(0, 0, 640, 900);
  metal.addColorStop(0, '#f9fafc'); metal.addColorStop(.48, '#c4cad7'); metal.addColorStop(.68, '#ffffff'); metal.addColorStop(1, '#a4aec0');
  x.fillStyle = metal; x.fillRect(0, 0, 640, 900);
  x.fillStyle = '#161616'; x.fillRect(20, 20, 600, 56);
  x.font = 'bold 25px Arial'; x.fillStyle = '#fff'; x.fillText('YDHC', 42, 57); x.fillText('0' + (i + 1), 554, 57);
  x.fillStyle = '#e8ebf2'; x.fillRect(28, 96, 584, 590);
  const fit = Math.min(584 / image.width, 590 / image.height);
  const w = image.width * fit, h = image.height * fit;
  x.drawImage(image, 28 + (584 - w) / 2, 96 + (590 - h) / 2, w, h);
  x.fillStyle = '#131620'; x.font = 'bold 48px Arial'; x.fillText(title, 34, 765);
  x.font = '25px Arial'; x.fillText(note, 34, 824);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const CARD_W = .758;
export class OpeningScene {
  constructor(canvas, images) {
    this.canvas = canvas; this.resources = []; this.lastTime = 0;
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'default' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.localClippingEnabled = true;
    this.mouthPlane = new THREE.Plane(new THREE.Vector3(0,1,0), -TOP);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.02;
    this.renderer.shadowMap.enabled = false;
    this.renderer.shadowMap.type = THREE.VSMShadowMap;
    this.scene = new THREE.Scene();
    this.atmosphere = createAtmosphere();
    this.atmosphereScene = new THREE.Scene(); this.atmosphereScene.add(this.atmosphere);
    this.camera = new THREE.PerspectiveCamera(34, 1, .1, 40);
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    // Reflection source matches the high, cool softbox visible in the backdrop.
    const environment = new THREE.Scene();
    environment.background = new THREE.Color(0x40566d);
    const softbox = new THREE.Mesh(new THREE.PlaneGeometry(4, 3), new THREE.MeshBasicMaterial({color:0xc9e4ff,side:THREE.DoubleSide}));
    softbox.position.set(-1.4,3,2); softbox.lookAt(0,0,0); environment.add(softbox);
    this.env = pmrem.fromScene(environment, .14); this.scene.environment = this.env.texture;
    softbox.geometry.dispose();softbox.material.dispose();pmrem.dispose();
    this.scene.add(new THREE.HemisphereLight(0xc4dff4,0x4a8ebd,1.15));
    const key = new THREE.SpotLight(0xd5ecff,64,14,Math.PI*.24,.85,2);
    key.position.set(-1.4,4,2.2);key.target.position.set(0,-.3,0);
    key.castShadow=false;key.shadow.mapSize.set(1024,1024);key.shadow.bias=-.0004;key.shadow.normalBias=.012;key.shadow.radius=5;key.shadow.blurSamples=12;
    this.scene.add(key,key.target);
    const fill = new THREE.DirectionalLight(0xcfe7fa,1.35);fill.position.set(0,2.5,5);this.scene.add(fill);
    const bounce=new THREE.PointLight(0x72b9ed,4.5,5,2);bounce.position.set(0,-1.15,1.1);this.scene.add(bounce);
    const rim = new THREE.DirectionalLight(0x87b8df,.8);rim.position.set(1,2,-3);this.scene.add(rim);
    this.floor=createGround();this.scene.add(this.floor);
    this.pack = new THREE.Group(); this.scene.add(this.pack);
    this.map = imageTexture(images[0]);
    const foil = new THREE.MeshStandardMaterial({ map: this.map, color: 0xffffff, metalness: .24, roughness: .58, side: THREE.DoubleSide, envMapIntensity: 1.05 });
    this.front = new THREE.Mesh(surface(W, H, [.001, .078, .499, .999]), foil);
    this.front.position.y = -.05; this.pack.add(this.front);
    this.frontBase = this.front.geometry.attributes.position.array.slice();
    this.back = new THREE.Mesh(surface(W, H, [.501, .078, .999, .999], 48, 56), foil.clone());
    this.back.rotation.y = Math.PI;
    this.back.position.set(0, -.05, 0); this.pack.add(this.back);
    this.backBase = this.back.geometry.attributes.position.array.slice();
    this.backStrip = new THREE.Mesh(surface(W, .2, [.501, .001, .999, .078], 64, 4), foil.clone());
    this.backStrip.rotation.y = Math.PI; this.backStrip.position.set(0, 1, -.004); this.pack.add(this.backStrip);
    const bottom = new THREE.Mesh(new THREE.PlaneGeometry(W, .008), new THREE.MeshStandardMaterial({color:0xbababa, metalness:.65, roughness:.4, side:THREE.DoubleSide}));
    bottom.rotation.x = Math.PI/2; bottom.position.set(0,-1,0); this.pack.add(bottom);
    this.raycaster = new THREE.Raycaster();
    // A heat-sealed edge is only 0.008 units thick, not a broad gray wall.
    this.sides = [-1, 1].map(sign => {
      const side = new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,H,8,1,false), new THREE.MeshStandardMaterial({ color: 0xd8e0e5, metalness: .3, roughness: .6, emissive:0x263745, emissiveIntensity:.12, side: THREE.DoubleSide }));
      side.position.set(sign * W / 2, -.05, 0); this.pack.add(side); return side;
    });
    this.strip = new THREE.Mesh(surface(W, .2, [.001, .001, .499, .078], 64, 4), foil.clone());
    this.strip.position.set(0,1,.004); this.pack.add(this.strip); this.stripBase = this.strip.geometry.attributes.position.array.slice();
    // Bridge the two foil faces around the entire torn strip perimeter.
    this.rimIndices=[];
    for(let c=0;c<=64;c++) this.rimIndices.push(c);
    for(let r=1;r<=4;r++) this.rimIndices.push(r*65+64);
    for(let c=63;c>=0;c--) this.rimIndices.push(4*65+c);
    for(let r=3;r>=1;r--) this.rimIndices.push(r*65);
    const rimGeo=new THREE.BufferGeometry(), triangles=[];
    rimGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(this.rimIndices.length*6),3));
    for(let i=0;i<this.rimIndices.length;i++){const a=i*2,b=((i+1)%this.rimIndices.length)*2;triangles.push(a,b,a+1,b,b+1,a+1);}
    rimGeo.setIndex(triangles);
    this.sealRim=new THREE.Mesh(rimGeo,new THREE.MeshStandardMaterial({color:0xd9e1e7,metalness:.3,roughness:.6,side:THREE.DoubleSide,transparent:true}));
    this.pack.add(this.sealRim);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: { opacity: { value: 0 }, tint: { value: new THREE.Color(0xcce7ff) } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: 'varying vec2 vUv; uniform float opacity; uniform vec3 tint; void main(){vec2 p=(vUv-.5)*vec2(1.,1.45);float a=exp(-dot(p,p)*16.);gl_FragColor=vec4(tint,a*opacity);}',
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
    });
    this.glow = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.3), glowMaterial); this.glow.position.set(0, TOP, .22); this.pack.add(this.glow);
    this.light = new THREE.PointLight(0xcce7ff, 0, 8, 2); this.light.position.set(0, TOP, .4); this.pack.add(this.light);
    this.cards = images.slice(1,4).map((img, i) => {
      const group = new THREE.Group();
      const edge = new THREE.Mesh(new THREE.BoxGeometry(.78, 1.09, .023), new THREE.MeshStandardMaterial({ color: 0x8292b9, metalness: .8, roughness: .24 })); group.add(edge);
      const texture = cardTexture(img, ['Yuri de Castro', 'Projetos', 'Pôsteres'][i], ['', '', ''][i], i);
      const front = new THREE.Mesh(new THREE.PlaneGeometry(.758, 1.066,32,40), new THREE.MeshStandardMaterial({ map: texture, metalness: .12, roughness: .38 }));
      front.position.z = .014; group.add(front);
      const reverse=new THREE.Mesh(new THREE.PlaneGeometry(.758,1.066,32,40),new THREE.MeshStandardMaterial({map:imageTexture(images[4]),roughness:.55,metalness:.15}));
      reverse.rotation.y=Math.PI;reverse.position.z=-.014;group.add(reverse);
      group.userData.faces=[front,reverse];group.userData.edge=edge;
      for(const face of [front,reverse]) {face.userData.base=face.geometry.attributes.position.array.slice();face.material.side=THREE.FrontSide;face.frustumCulled=false;}
      group.visible = false; this.scene.add(group); return group;
    });
    this.pack.traverse(node=>{if(node.isMesh && node.material.type!=='ShaderMaterial') node.castShadow=true;});
    this.resize();
  }
  resize() {
    const w = Math.max(1, this.canvas.clientWidth), h = Math.max(1, this.canvas.clientHeight);
    this.renderer.setSize(w, h, false); this.camera.aspect = w / h;
    this.camera.position.set(0, .12, Math.max(4.6, 1.8 / (2 * Math.tan(17 * Math.PI / 180) * this.camera.aspect)));
    this.cameraDistance=this.camera.position.z;
    this.camera.updateProjectionMatrix();
  }
  project(point) {
    const p = point.clone().project(this.camera);
    return { x: (p.x * .5 + .5) * this.canvas.clientWidth, y: (.5 - p.y * .5) * this.canvas.clientHeight };
  }
  draw(frame, pointer, elapsed) {
    const { cut, lift, light, cards, assembly } = frame;
    const hover=hoverPose(elapsed);
    const handoff=extractionHandoff(cards);
    this.pack.position.y = -.05 + hover.y - handoff.drop - out(assembly) * 1.5;
    this.camera.position.z=this.cameraDistance + smooth(light)*1.8;
    this.camera.position.y=.12+smooth(light)*.18;
    const dt = Math.max(0,Math.min(.06,elapsed-this.lastTime));this.lastTime=elapsed;
    const follow=1-Math.exp(-dt*22);
    this.yaw = this.yaw===undefined ? (pointer.rotation||0) : mix(this.yaw,pointer.rotation||0,follow);
    this.pitch = this.pitch===undefined ? (pointer.pitch||0) : mix(this.pitch,pointer.pitch||0,follow);
    this.pack.rotation.set(.03 + this.pitch + pointer.y * .035, this.yaw + pointer.x * .05, -.025 + hover.roll + cut * .025);
    const pos = this.front.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = this.frontBase[i * 3], y = this.frontBase[i * 3 + 1];
      pos.setXYZ(i, ...pouchVertex(x,y,lift));
    }
    pos.needsUpdate = true; this.front.geometry.computeVertexNormals();
    const back = this.back.geometry.attributes.position;
    for (let i = 0; i < back.count; i++) {
      const x = this.backBase[i * 3], y = this.backBase[i * 3 + 1];
      back.setXYZ(i, ...pouchVertex(x,y,lift,true));
    }
    back.needsUpdate = true; this.back.geometry.computeVertexNormals();
    const strip = this.strip.geometry.attributes.position;
    for (let i = 0; i < strip.count; i++) {
      const v = stripVertex(this.stripBase[i * 3], this.stripBase[i * 3 + 1], cut, lift, W);
      strip.setXYZ(i, ...v);
    }
    strip.needsUpdate = true; this.strip.geometry.computeVertexNormals();
    this.strip.rotation.z = -out(lift) * 1.4;
    this.strip.position.x = out(lift) * 1.1;
    this.strip.material.transparent = true; this.strip.material.opacity = 1 - smooth(clamp((lift - .5) * 2));
    this.strip.visible = lift < 1;
    this.backStrip.visible = lift < 1;
    const bs = this.backStrip.geometry.attributes.position;
    for(let i=0;i<bs.count;i++) { const v=stripVertex(-this.stripBase[i*3],this.stripBase[i*3+1],cut,lift,W); bs.setXYZ(i,-v[0],v[1],-v[2]); }
    bs.needsUpdate = true; this.backStrip.geometry.computeVertexNormals();
    this.backStrip.position.x = this.strip.position.x; this.backStrip.rotation.z = out(lift)*1.4;
    this.backStrip.material.transparent = true; this.backStrip.material.opacity = this.strip.material.opacity;
    this.strip.updateMatrix();this.backStrip.updateMatrix();
    const rimPos=this.sealRim.geometry.attributes.position;
    this.rimIndices.forEach((index,n)=>{
      const backIndex=Math.floor(index/65)*65+64-index%65;
      const a=new THREE.Vector3().fromBufferAttribute(strip,index).applyMatrix4(this.strip.matrix);
      const b=new THREE.Vector3().fromBufferAttribute(bs,backIndex).applyMatrix4(this.backStrip.matrix);
      rimPos.setXYZ(n*2,a.x,a.y,a.z);rimPos.setXYZ(n*2+1,b.x,b.y,b.z);
    });
    rimPos.needsUpdate=true;this.sealRim.geometry.computeVertexNormals();
    this.sealRim.visible=lift<1;this.sealRim.material.opacity=this.strip.material.opacity;
    const luminous = smooth(lift) * .05 + smooth(light) * .28;
    this.glow.material.uniforms.opacity.value = luminous * (1 - out(assembly));
    this.light.intensity = luminous * .45 * (1 - out(assembly));
    // Use packet-local coordinates for extraction; depth testing hides the stack
    // behind the actual foil faces, regardless of the packet's rotation.
    this.pack.updateMatrixWorld(true);
    // A pack-local clipping plane removes every fragment still inside the pouch.
    // It follows pitch/yaw, so even a rear view cannot expose cards through foil.
    // Recess the safety cut inside the open pouch. The real foil lip now
    // occludes the card instead of an invisible plane across the opening.
    const cavityDepth = .12 * smooth(clamp((lift - .75) / .25));
    this.mouthPlane.set(new THREE.Vector3(0,1,0),-(TOP-cavityDepth)).applyMatrix4(this.pack.matrixWorld);
    this.cards.forEach((card,i)=>{
      const pose=extractionPose(clamp(cards/.28),i),reveal=revealPose(cards,i);
      pose.fan=reveal.spread;
      const slot=[0,-1,1][i],narrow=this.camera.aspect<.85;
      const timing=assemblyTiming(assembly,i);
      const opacidade=1-Math.max(timing.saida,i===0?timing.troca:0);
      card.visible=(lift>.75 || cards>0) && opacidade>.003;
      const inside=this.pack.localToWorld(new THREE.Vector3(0,pose.y,pose.z));
      inside.y+=handoff.drop;
      const destination=new THREE.Vector3(slot*(narrow?.59:1.03)*pose.fan,.48+(i===1?.06:0)*pose.fan,.45+(2-reveal.order)*.05);
      card.position.copy(inside).lerp(destination,handoff.table);
      card.position.y+=Math.sin(pose.fan*Math.PI)*.35;
      card.quaternion.copy(this.pack.quaternion).slerp(new THREE.Quaternion(),handoff.table);
      card.rotateY(reveal.angle);
      card.scale.setScalar(1);
      if(assembly>0 && this.assemblyPilha && this.assemblyHero) {
        // A profundidade agora vem da posição na pilha, e é ela que o corte
        // troca. 0,045 de passo deixa folga sobre a espessura de uma carta.
        const shuffle=shufflePose(assembly,i);
        const PLANO=.47-shuffle.ordem*.045;
        // Converte retângulos de tela em unidades de mundo no plano z=PLANO.
        const u=2*(this.camera.position.z-PLANO)*Math.tan(17*Math.PI/180)/this.canvas.clientHeight;
        const paraMundo=(r,folgaX=0,folgaY=0)=>({
          x:(r.x+folgaX-this.canvas.clientWidth/2)*u,
          y:this.camera.position.y+(this.canvas.clientHeight/2-(r.y+folgaY))*u,
          escala:(r.width*u)/CARD_W
        });
        // Vaga na pilha: leque bem fechado, a do meio por cima e reta.
        // A protagonista fica reta e por cima; as outras duas espiam atrás.
        const desloc=[0,-15,14][i], giroPilha=[0,-.08,.065][i];
        // O ponto de partida é onde o leque já deixou a carta.
        const inicio={x:card.position.x,y:card.position.y,escala:1,giro:0,inclina:0};
        const pilha={...paraMundo(this.assemblyPilha,desloc,0),giro:giroPilha,inclina:0};
        const hero ={...paraMundo(this.assemblyHero),giro:0,inclina:0};
        const p=cardPose(inicio,pilha,hero,timing);
        card.position.set(p.x+shuffle.x*CARD_W*p.escala,p.y-shuffle.y*CARD_W*p.escala,PLANO);
        card.rotation.set(p.inclina,0,p.giro+shuffle.angle);
        card.scale.set(p.escala,p.escala*mix(1,(this.assemblyHero.height/this.assemblyHero.width)/ (1.066/.758),timing.cresce),1);
        // A carta de trás não precisa de espessura durante o crescimento,
        // senão a borda metálica aparece do tamanho de uma parede.
        card.userData.edge.visible=timing.cresce<.02;
      } else {
        card.userData.edge.visible=true;
        // Keep the packet quaternion until extraction is complete.
      }
      card.traverse(object=>{if(object.material){object.material.transparent=assembly>0;object.material.opacity=opacidade;object.material.clippingPlanes=cards<.28 && assembly===0?[this.mouthPlane]:[];}});
    });
    this.pack.visible = assembly < .9;
    const shadow=groundShadow(this.pack.position.y-GROUND_Y,this.yaw);
    const ground=this.floor.material.uniforms;
    ground.center.value.set(shadow.x,shadow.z);
    ground.spread.value.set(shadow.width,shadow.depth);
    ground.strength.value=shadow.strength*(1-smooth(clamp((cards-.72)/.28)));
    ground.opacity.value=1-assemblyTiming(assembly).troca;
    const air=this.atmosphere.material.uniforms;
    air.time.value=elapsed;air.aspect.value=this.camera.aspect;
    air.opacity.value=1-assemblyTiming(assembly).troca;
    this.scene.updateMatrixWorld(true);
    renderOpeningLayers(this.renderer, this.atmosphereScene, this.scene, this.camera);
    return {
      seal: this.project(this.pack.localToWorld(new THREE.Vector3(-W * .42, 1.24, .02))),
      cards: this.cards.map(card => {
        const center = this.project(card.getWorldPosition(new THREE.Vector3()));
        const edge = this.project(card.localToWorld(new THREE.Vector3(.39, .545, 0)));
        return { x: center.x, y: center.y, width: Math.max(70, Math.abs(edge.x - center.x) * 2), height: Math.max(90, Math.abs(edge.y - center.y) * 2) };
      })
    };
  }
  setAssemblyTargets(pilha,hero) {this.assemblyPilha=pilha;this.assemblyHero=hero;}
  hit(x, y) {
    this.raycaster.setFromCamera(new THREE.Vector2(x / this.canvas.clientWidth * 2 - 1, 1 - y / this.canvas.clientHeight * 2), this.camera);
    const hits = this.raycaster.intersectObjects([this.front,this.back,this.strip,this.backStrip]);
    if(!hits.length) return null;
    const hit = hits[0], local = this.pack.worldToLocal(hit.point.clone());
    return { seal: local.y > .80, x: local.x, y: local.y };
  }
  dispose() {
    const geometries = new Set(), materials = new Set(), textures = new Set([this.map]);
    this.scene.traverse(node => {
      if (node.shadow) node.shadow.dispose();
      if (node.geometry) geometries.add(node.geometry);
      if (node.material) for (const m of [node.material].flat()) { materials.add(m); if (m.map) textures.add(m.map); }
    });
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose());
    this.atmosphere.geometry.dispose(); this.atmosphere.material.dispose();
    this.env.dispose(); this.renderer.dispose();
  }
}

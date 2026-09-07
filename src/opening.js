import { OpeningState, clamp, smooth, out, mix, DURATION, extractionPose, assemblyTiming, cardPose } from './opening-state.js';
import { OpeningScene, loadImage } from './opening-scene.js';
import {hoverPose} from './ground.js';
import textureAssets from './texture-assets.js';

const opening = document.querySelector('.opening');
const site = document.getElementById('site');
if (opening && site) {
  try { setup(); }
  catch (error) {
    opening.hidden = true; site.inert = false;
    document.documentElement.classList.remove('pre-abertura');
    document.body.classList.remove('is-locked', 'is-assembling');
    console.error('Opening initialization failed; portfolio remains accessible.', error);
  }
}
function setup() {
  const button = document.getElementById('abrir-pack');
  const skip = document.getElementById('pular');
  const replay = document.getElementById('rever');
  const status = document.getElementById('aviso');
  const canvas = opening.querySelector('canvas');
  const fallback = opening.querySelector('.opening-model');
  const fallbackCards = [...opening.querySelectorAll('.opening-card')];
  const burst = opening.querySelector('.opening-radiance');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const sceneState = new OpeningState();
  const scriptURL = document.currentScript?.src || new URL('assets/js/opening.js', location.href).href;
  const imageRoot = new URL('../img/', scriptURL);
  let gpu = null, generation = 0, drag = null, running = false, raf = 0, ignoreClick = false;
  let last = 0, elapsed = 0, assembled = false, animations = [], cutTarget = 0;
  let pointer = { x: 0, y: 0, rotation: -.15, pitch: 0, near: false }, frameRects = [];
  let alvoPilha=null, alvoHero=null;
  let pointerClient = {x:-1000,y:-1000};
  const hint = opening.querySelector('.seal-hint');
  const halo = opening.querySelector('.seal-cursor');
  const caption = button.querySelector('.pack-open__label');
  const sections = [document.getElementById('sobre'), document.getElementById('projetos'), document.getElementById('acervo')];
  // Fail open even if boot or later rendering throws. The default HTML is usable.
  function finish(scrollToProjects = false) {
    running = false; generation++; cancelAnimationFrame(raf);
    animations.forEach(a => a.cancel()); animations = [];
    sections.forEach(section=>{if(section){section.style.opacity='';section.style.clipPath='';}});
    sceneState.skip();
    opening.hidden = true;
    site.inert = false;
    document.documentElement.classList.remove('pre-abertura');
    document.body.classList.remove('is-locked', 'is-assembling');
    if (gpu) { try { gpu.dispose(); } catch {} gpu = null; }
    if (scrollToProjects) document.getElementById('projetos').scrollIntoView({ behavior: 'instant' });
    (scrollToProjects ? document.getElementById('projetos') : document.getElementById('inicio'))?.focus({ preventScroll: true });
    if (status) status.textContent = 'Portfólio aberto.';
    document.dispatchEvent(new CustomEvent('ydhc:portfolio-ready'));
  }
  function fallbackMode() {
    if (gpu) { try { gpu.dispose(); } catch {} gpu = null; }
    canvas.hidden = true; fallback.hidden = false;
    opening.dataset.renderer = 'css-3d';
  }
  function drawFallback(f) {
    const body = fallback.querySelector('.opening-model__body');
    const strip = fallback.querySelector('.opening-model__strip');
    const mouth = fallback.querySelector('.opening-model__mouth');
    fallback.style.transform = `translate(-50%,-50%) perspective(1000px) rotateY(${pointer.rotation * 180/Math.PI}deg) rotateX(${pointer.pitch * 180/Math.PI}deg) translateY(${hoverPose(elapsed).y*140 + smooth(clamp((f.cards-.72)/.28)) * 220 + f.assembly * 280}px)`;
    body.style.transform = `rotateX(${-smooth(f.lift) * 12}deg)`;
    strip.style.transform = `translate3d(${f.cut * 18 + out(f.lift) * 130}px,${-f.cut * 8 - out(f.lift) * 160}px,${f.cut * 60}px) rotateY(${-f.cut * 70}deg) rotateZ(${-out(f.lift) * 50}deg)`;
    strip.style.clipPath = `inset(0 0 0 ${f.cut * 82}%)`;
    strip.style.opacity = 1 - smooth(f.lift);
    mouth.style.opacity = smooth(f.lift);
    const r = fallback.getBoundingClientRect();
    const seal = { x: r.left + r.width * .14, y: r.top - 28 };
    const w = opening.clientWidth, h = opening.clientHeight;
    const cardWidth = Math.min(210, w * .29), cardHeight = cardWidth * 1.4;
    frameRects = fallbackCards.map((card, i) => {
      const pose=extractionPose(f.cards,i),fan=pose.fan;
      const mouthY=r.top+r.height*.10;
      let x=w/2+[0,-1,1][i]*cardWidth*1.10*fan;
      let y=mix(mouthY+cardHeight/2+4,mouthY-cardHeight/2-12,pose.lift);
      y=mix(y,h*.43,fan)-Math.sin(fan*Math.PI)*20;
      let width=cardWidth,height=cardHeight;
      let giro=0;
      if(f.assembly>0 && alvoPilha && alvoHero) {
        const tempo=assemblyTiming(f.assembly,i);
        const desloc=[0,-15,14][i];
        const inicio={x,y,escala:1,giro:0,inclina:0};
        const pilha={x:alvoPilha.x+desloc,y:alvoPilha.y,escala:alvoPilha.width/cardWidth,giro:[0,-4.6,3.7][i],inclina:0};
        const hero ={x:alvoHero.x,y:alvoHero.y,escala:alvoHero.width/cardWidth,giro:0,inclina:0};
        const p=cardPose(inicio,pilha,hero,tempo);
        x=p.x;y=p.y;giro=p.giro;
        width=cardWidth*p.escala;height=cardHeight*p.escala*mix(1,(alvoHero.height/alvoHero.width)/(cardHeight/cardWidth),tempo.cresce);
      }
      const occluded=fan>0?0:clamp((y+height/2-mouthY)/height)*100;
      card.style.clipPath=`inset(0 0 ${occluded}% 0)`;
      card.style.width=width+'px';card.style.height=height+'px';
      card.style.left=x+'px';card.style.top=y+'px';
      const tm=assemblyTiming(f.assembly,i);
      card.style.opacity=f.cards>0 ? 1-Math.max(tm.saida, i===0?tm.troca:0) : 0;
      card.style.zIndex=String(i===0?6:5);
      card.style.transform=`translate(-50%,-50%) rotate(${giro}deg)`;
      return {x,y,width,height};
    });
    return seal;
  }
  function assemble() {
    assembled = true;
    document.documentElement.classList.remove('pre-abertura');
    document.body.classList.add('is-assembling');
    site.inert = true;
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Um único destino, e dentro da tela. #projetos e #acervo ficam centenas
    // de pixels abaixo da dobra com a página no topo, então mandar carta para
    // lá era mandar para fora do campo de visão.
    // O alvo é o retrato do hero e não a seção inteira: ele tem quase a mesma
    // proporção da carta e a mesma foto, então a troca acontece entre duas
    // imagens iguais no mesmo lugar da tela, que é o que o olho aceita.
    const heroEl = sections[0];
    const retrato = heroEl?.querySelector('.hero__portrait img') || heroEl?.querySelector('.hero__portrait');
    const r = retrato?.getBoundingClientRect();
    alvoHero = r && r.height
      ? { x: r.left + r.width / 2, y: r.top + r.height / 2, width: r.width, height: r.height }
      : { x: innerWidth * .72, y: innerHeight * .42, width: 300, height: 375 };

    // A pilha assenta na vertical do retrato, no tamanho de uma carta real.
    const largura = Math.min(230, innerWidth * .3);
    alvoPilha = { x: (alvoHero.x + innerWidth / 2) / 2, y: Math.min(alvoHero.y, innerHeight * .46),
                  width: largura, height: largura * 1.4 };
    gpu?.setAssemblyTargets?.(alvoPilha, alvoHero);

    if (!heroEl?.animate) return;
    const t = DURATION.assemble * 1000;
    const entra = (el, de, ate, transform = 'translateY(18px)') => {
      if (!el?.animate) return;
      animations.push(el.animate([
        { opacity: 0, transform, offset: 0 },
        { opacity: 0, transform, offset: de },
        { opacity: 1, transform: 'none', offset: ate },
        { opacity: 1, transform: 'none', offset: 1 }
      ], { duration: t, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'both' }));
    };

    // O retrato troca de lugar com a carta: sem deslocamento, só nitidez,
    // no mesmo instante em que a carta some.
    const molduraRetrato = heroEl.querySelector('.hero__portrait');
    if (molduraRetrato?.animate) animations.push(molduraRetrato.animate([
      { opacity: 0, filter: 'blur(0)', transform: 'none', offset: 0 },
      { opacity: 0, filter: 'blur(0)', transform: 'none', offset: .70 },
      { opacity: 1, filter: 'blur(0)', transform: 'none', offset: .87 },
      { opacity: 1, filter: 'blur(0)', transform: 'none', offset: 1 }
    ], { duration: t, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'both' }));

    // O nome e a bio crescem a partir do retrato que acabou de assentar.
    entra(heroEl.querySelector('.hero__identity'), .78, .90, 'translateX(-16px)');
    entra(heroEl.querySelector('.hero__bio'), .82, .94);

    // O resto não voa: a página se desdobra para baixo.
    [sections[1], sections[2], document.getElementById('contato')].forEach((el, i) => {
      if (!el?.animate) return;
      animations.push(el.animate([
        { opacity: 0, transform: 'translateY(30px)', offset: 0 },
        { opacity: 0, transform: 'translateY(30px)', offset: .84 },
        { opacity: 1, transform: 'none', offset: 1 }
      ], { duration: t, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'both' }));
    });

    const cabecalho = site.querySelector('.header');
    if (cabecalho?.animate) animations.push(cabecalho.animate([
      { opacity: 0, transform: 'translateY(-100%)', offset: 0 },
      { opacity: 0, transform: 'translateY(-100%)', offset: .86 },
      { opacity: 1, transform: 'none', offset: 1 }
    ], { duration: t, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'both' }));

    animations.forEach(a => { a.pause(); a.currentTime = 0; });
    status.textContent = 'Montando o portfólio.';
  }
  function tick(now) {
    if (!running) return;
    const dt = Math.min(.06, Math.max(0, (now - last) / 1000)); last = now; elapsed += dt;
    try {
      if (['sealed', 'tearing'].includes(sceneState.phase) && !sceneState.auto) {
        const cut = mix(sceneState.cut, cutTarget, 1 - Math.exp(-dt * 16));
        if (cutTarget >= 1 && cut > .99) sceneState.pull(1); else if (cut > .001) sceneState.pull(cut);
      }
      const f = sceneState.tick(dt);
      opening.dataset.phase = f.phase;
      opening.style.setProperty('--scene-opacity',String(1-assemblyTiming(f.assembly,1).troca)); 
      let seal;
      if (gpu) {
        try { const rendered = gpu.draw(f, pointer, elapsed); seal = rendered.seal; frameRects = rendered.cards; }
        catch (error) { console.warn('Pack renderer unavailable; retaining opening controls.', error); fallbackMode(); }
      }
      if (!gpu) seal = drawFallback(f);
      const interactive = ['sealed', 'tearing'].includes(f.phase);
      const nearby = interactive && !drag && hitAt(pointerClient.x,pointerClient.y)?.seal;
      pointer.near = !!nearby;
      if(hint) {
        hint.style.left = clamp(seal.x, 20, opening.clientWidth-110)+'px';
        hint.style.top = clamp(seal.y-12, 80, opening.clientHeight-60)+'px';
        hint.style.opacity = nearby ? '1' : '0';
      }
      if(halo) { halo.style.left = pointerClient.x+'px'; halo.style.top=pointerClient.y+'px'; halo.style.opacity = nearby || drag?.mode==='tear' ? '1':'0'; }
      canvas.style.cursor = drag ? 'grabbing' : nearby ? 'ew-resize' : 'grab';
      button.hidden = !interactive;
      burst.style.opacity = ((smooth(f.light) * .16 + smooth(f.lift) * .04) * (1 - smooth(f.assembly))).toFixed(3);
      if (f.phase === 'assembling' && !assembled) assemble();
      if (assembled) animations.forEach(a => { a.currentTime = f.assembly * DURATION.assemble * 1000; });
      if (f.phase === 'done') { finish(); return; }
      raf = requestAnimationFrame(tick);
    } catch (error) { console.error('Opening failed; portfolio remains accessible.', error); finish(); }
  }
  async function initGPU(token) {
    try {
      const images = await Promise.all(textureAssets.map(url => loadImage(url)));
      if (!running || token !== generation || sceneState.phase !== 'sealed') return;
      canvas.hidden = false;
      const candidate = new OpeningScene(canvas, images);
      if (!running || token !== generation) { candidate.dispose(); return; }
      gpu = candidate; fallback.hidden = true; fallbackCards.forEach(c => c.style.opacity = 0);
      opening.dataset.renderer = 'webgl2';
    } catch (error) { if (running && token === generation) { console.info('Using CSS 3D opening.', error.message); fallbackMode(); } }
  }
  function begin() {
    if (reduce.matches) { finish(); return; }
    if (running) finish();
    const token = ++generation;
    sceneState.reset();alvoPilha=null;alvoHero=null; pointerClient={x:-1000,y:-1000}; running = true; assembled = false; cutTarget = 0; drag = null; ignoreClick = false; elapsed = 0;
    pointer = { x: 0, y: 0, rotation: -.15, pitch: 0, near: false };
    window.scrollTo({ top: 0, behavior: 'instant' });
    site.inert = true; document.body.classList.add('is-locked');
    document.documentElement.classList.remove('pre-abertura');
    opening.hidden = false; button.hidden = false; opening.dataset.phase = 'sealed';
    fallbackMode();
    last = performance.now(); raf = requestAnimationFrame(tick);
    skip.focus({ preventScroll: true });
    initGPU(token);
  }
  function open() { if (running) { sceneState.open(); drag = null; } }
  function hitAt(x,y) {
    if(gpu) return gpu.hit(x,y);
    const r=fallback.getBoundingClientRect();
    if(x<r.left || x>r.right || y<r.top || y>r.bottom) return null;
    return {seal:y<r.top+r.height*.17};
  }
  function startDrag(event) {
    if (!running || !['sealed','tearing'].includes(sceneState.phase) || event.button !== 0 || event.target.closest('button,a')) return;
    const hit=hitAt(event.clientX,event.clientY);
    if(!hit) return;
    const mode=hit.seal ? 'tear':'rotate';
    drag={id:event.pointerId,x:event.clientX,y:event.clientY,from:cutTarget,rotation:pointer.rotation,pitch:pointer.pitch,mode};
    opening.setPointerCapture(event.pointerId);
    event.preventDefault();
  }
  opening.addEventListener('pointerdown',startDrag);
  opening.addEventListener('pointermove',event=>{
    pointerClient={x:event.clientX,y:event.clientY};
    pointer.x=(event.clientX/opening.clientWidth-.5)*2;
    pointer.y=(.5-event.clientY/opening.clientHeight)*2;
    if(!drag || event.pointerId!==drag.id) return;
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    if(drag.mode==='rotate') {
      pointer.rotation=drag.rotation+dx*.009;
      pointer.pitch=clamp(drag.pitch+dy*.003,-.4,.4);
    } else {
      cutTarget=Math.max(cutTarget,clamp(drag.from+dx/Math.min(330,opening.clientWidth*.55)));
    }
  });
  const release=event=>{
    if(!drag || event.pointerId!==drag.id) return;
    if(opening.hasPointerCapture?.(event.pointerId)) opening.releasePointerCapture(event.pointerId);
    drag=null;
  };
  opening.addEventListener('pointerup',release);
  opening.addEventListener('pointercancel',release);
  opening.addEventListener('lostpointercapture',()=>{drag=null;});
  opening.addEventListener('pointerleave',()=>{if(!drag) pointerClient={x:-1000,y:-1000};});
  // This control is visible only with keyboard focus. Pointer clicks never open the pack.
  button.addEventListener('click',event=>{if(event.detail===0) open();});
  opening.addEventListener('wheel',event=>{if(running && !event.ctrlKey) event.preventDefault();},{passive:false});
  skip.addEventListener('click', () => finish(true));
  replay.hidden = false; replay.addEventListener('click', () => {
    if (reduce.matches) { status.textContent = 'A animação está desativada pela preferência de movimento reduzido.'; return; }
    begin();
  });
  addEventListener('keydown', event => { if (event.key === 'Escape' && running) finish(); });
  addEventListener('resize', () => {
    if(running && assembled) { finish(); return; }
    if (gpu) try { gpu.resize(); } catch { fallbackMode(); }
  }, { passive: true });
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); if (running) fallbackMode(); });
  document.addEventListener('visibilitychange', () => { last = performance.now(); });
  document.addEventListener('ydhc:sair-da-abertura', () => finish());
  reduce.addEventListener('change', event => { if (event.matches && running) finish(); });
  // Anchor links return to the requested section, without forcing the intro again.
  if (location.hash || reduce.matches) {
    opening.hidden = true; site.inert = false;
    document.documentElement.classList.remove('pre-abertura');
  } else begin();
}

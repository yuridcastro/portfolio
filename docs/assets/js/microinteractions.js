/* Progressive enhancement: content and native gestures work without this file. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set();
  let started = false;
  const animate = (el, frames, options) => {
    if (reduce.matches || !el.animate) return;
    const animation = el.animate(frames, options);
    animations.add(animation);
    animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
  };
  const start = () => {
    if (started) return;
    started = true;
    const panels = [...document.querySelectorAll('.project, .contact-card')];
    panels.forEach(panel => {
      panel.classList.add('metal-edge');
      let frame=0, angle=0, target=0, previous=0, initialized=false;
      const reset=()=>{
        if(frame)cancelAnimationFrame(frame);
        frame=0;previous=0;
        panel.classList.remove('edge-follow');
      };
      const follow=now=>{
        frame=0;
        const dt=previous?Math.min(64,now-previous):16;previous=now;
        // Take the shortest route across 0/360 degrees, with time-based damping.
        const distance=((target-angle+540)%360)-180;
        angle+=distance*(1-Math.exp(-dt/240));
        angle=(angle+360)%360;
        panel.style.setProperty('--edge-angle',angle+'deg');
        if(Math.abs(distance)>.15)frame=requestAnimationFrame(follow);
        else previous=0;
      };
      panel.addEventListener('pointermove',event=>{
        if(event.pointerType!=='mouse'||reduce.matches)return;
        const rect=panel.getBoundingClientRect();
        target=(Math.atan2(event.clientY-rect.top-rect.height/2,event.clientX-rect.left-rect.width/2)*180/Math.PI+450)%360;
        if(!initialized){angle=target;initialized=true;panel.style.setProperty('--edge-angle',angle+'deg');}
        panel.classList.add('edge-follow');
        if(!frame)frame=requestAnimationFrame(follow);
      });
      panel.addEventListener('pointerleave', reset);
      reduce.addEventListener('change', reset);
      panel.addEventListener('animationend', event => {
        if (event.animationName === 'metal-edge-pass') panel.classList.remove('edge-arrive');
      });
    });
    if (!('IntersectionObserver' in window)) return;
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        reveal.unobserve(entry.target);
        const el = entry.target;
        if (reduce.matches) return;
        if (el.classList.contains('metal-edge')) el.classList.add('edge-arrive');
        const parent = el.parentElement;
        const index = parent ? [...parent.children].indexOf(el) : 0;
        animate(el, [{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}], {
          duration:520, delay:Math.min(index,2)*65, easing:'cubic-bezier(.2,.7,.2,1)', fill:'backwards'
        });
      });
    }, {threshold:.12});
    document.querySelectorAll('.head, .poster-heading, .contact-invite, .project, .contact-card, .case-story section > h2, .case-story section > p').forEach(el => reveal.observe(el));
    const breathe = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('motion-paused', !entry.isIntersecting));
    }, {rootMargin:'60px'});
    document.querySelectorAll('.device-stage').forEach(el => breathe.observe(el));
  };
  reduce.addEventListener('change', () => {
    if (!reduce.matches) return;
    animations.forEach(a => a.cancel()); animations.clear();
    document.querySelectorAll('.edge-arrive').forEach(el => el.classList.remove('edge-arrive'));
  });
  // Let the card-to-portrait handoff finish before starting page effects.
  document.addEventListener('ydhc:portfolio-ready', start, {once:true});
  if (!window.YDHC_ABERTURA || (document.querySelector('.opening')?.hidden && !document.getElementById('site')?.inert)) start();
  else {
    // Also recover if WebGL initialization fails before it can signal readiness.
    const site = document.getElementById('site');
    if (site && 'MutationObserver' in window) {
      const watch = new MutationObserver(() => {
        const opening = document.querySelector('.opening');
        if (!site.inert && (!opening || opening.hidden)) { start(); watch.disconnect(); }
      });
      watch.observe(site, {attributes:true,attributeFilter:['inert']});
    }
  }
})();

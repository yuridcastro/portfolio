(() => {
  const chapters = [...document.querySelectorAll('.case-chapter')];
  const links = [...document.querySelectorAll('.case-index a')];
  if (!chapters.length) return;
  let queued = false;
  const update = () => {
    queued = false;
    let current = chapters[0];
    for (const chapter of chapters) if (chapter.getBoundingClientRect().top <= innerHeight * .32) current = chapter;
    for (const link of links) {
      if (link.hash === '#' + current.id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, {passive:true});
  addEventListener('resize', update, {passive:true});
  update();
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-entering'); observer.unobserve(entry.target); }
    }), {threshold:0, rootMargin:'0px 0px -40px 0px'});
    chapters.forEach(chapter => observer.observe(chapter));
  }
})();

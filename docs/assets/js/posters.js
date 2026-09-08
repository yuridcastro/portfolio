/* Direct manipulation of solid CSS 3D poster cards. No GPU context per card. */
(() => {
  document.querySelectorAll('.poster-track').forEach(track => {
    let drag = null, suppressUntil = 0;
    track.addEventListener('dragstart', e => e.preventDefault());
    track.addEventListener('pointerdown', e => {
      e.stopPropagation();
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { id:e.pointerId, x:e.clientX, left:track.scrollLeft, moved:false };
    }, true);
    track.addEventListener('pointermove', e => {
      if (!drag || drag.id !== e.pointerId) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) < 7) return;
      drag.moved = true;
      track.setPointerCapture(e.pointerId);
      track.classList.add('is-dragging');
      track.scrollLeft = drag.left - dx;
      e.preventDefault(); e.stopPropagation();
    }, true);
    const release = e => {
      if (!drag || drag.id !== e.pointerId) return;
      const moved=drag.moved;
      if (moved) suppressUntil = performance.now() + 450;
      drag = null; track.classList.remove('is-dragging');
      if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
      if (moved && e.type !== 'pointercancel' && track.children?.length) {
        const first=track.children[0].offsetLeft;
        const max=Math.max(0,track.scrollWidth-track.clientWidth);
        const positions=[...track.children].map(card=>Math.min(max,Math.max(0,card.offsetLeft-first)));
        const left=positions.reduce((nearest,value)=>Math.abs(value-track.scrollLeft)<Math.abs(nearest-track.scrollLeft)?value:nearest,positions[0]);
        track.scrollTo({left,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
      }
    };
    track.addEventListener('pointerup', release);
    track.addEventListener('pointercancel', release);
    track.addEventListener('lostpointercapture', release);
    track.addEventListener('click', e => {
      if (e.detail && performance.now() < suppressUntil) { e.preventDefault(); e.stopImmediatePropagation(); }
    }, true);
  });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // No toque, arrastar a carta e rolar a trilha disputam o mesmo gesto e o
  // carrossel fica preso. Em ponteiro grosso a carta não gira: o swipe rola
  // a trilha e o toque abre o pôster no visor.
  const toque = matchMedia('(hover: none), (pointer: coarse)').matches;
  document.querySelectorAll('.poster-card').forEach(card => {
    // Carousel cards are links, not independently rotatable controls.
    if (card.closest?.('.poster-track')) {
      card.removeAttribute('tabindex'); card.removeAttribute('role'); card.removeAttribute('aria-label');
      return;
    }
    if (toque) { card.removeAttribute('tabindex'); card.removeAttribute('role');
                 card.removeAttribute('aria-label'); return; }
    const turn = card.querySelector('.poster-card__turn');
    const front = card.querySelector('.piece__open');
    let yaw = 0, pitch = 0, targetYaw = 0, targetPitch = 0;
    let gesture = null, frame = 0, previous = 0, suppressUntil = 0;
    const paint = () => {
      turn.style.transform = `rotateX(${pitch}deg) rotateY(${yaw}deg)`;
      const frontVisible = Math.cos(yaw * Math.PI / 180) >= 0;
      front.inert = !frontVisible;
      front.setAttribute('aria-hidden', String(!frontVisible));
      card.style.setProperty('--shine-x', `${50 + Math.sin(yaw * Math.PI / 180) * 38}%`);
      card.style.setProperty('--shine-y', `${35 - pitch * 2}%`);
      card.style.setProperty('--shadow-width', .52 + Math.abs(Math.cos(yaw * Math.PI / 180)) * .48);
    };
    const animate = time => {
      frame = 0;
      const dt = previous ? Math.min(50, time - previous) : 16;
      previous = time;
      const follow = reduced.matches ? 1 : 1 - Math.exp(-dt / (gesture?.dragging ? 42 : 100));
      yaw += (targetYaw - yaw) * follow;
      pitch += (targetPitch - pitch) * follow;
      if (Math.abs(targetYaw - yaw) < .03 && Math.abs(targetPitch - pitch) < .03) {
        yaw = targetYaw; pitch = targetPitch; previous = 0; paint(); return;
      }
      paint(); frame = requestAnimationFrame(animate);
    };
    const update = () => { if (!frame) frame = requestAnimationFrame(animate); };
    const settle = () => {
      targetYaw = Math.round(targetYaw / 180) * 180;
      targetPitch = 0; update();
    };
    card.addEventListener('dragstart', e => e.preventDefault());
    card.addEventListener('pointerdown', e => {
      if (!e.isPrimary || e.button !== 0 || gesture) return;
      gesture = { id: e.pointerId, x: e.clientX, y: e.clientY, yaw: targetYaw, dragging: false };
    });
    card.addEventListener('pointermove', e => {
      if (gesture && e.pointerId === gesture.id) {
        const dx = e.clientX - gesture.x, dy = e.clientY - gesture.y;
        if (!gesture.dragging) {
          if (Math.abs(dy) > 9 && Math.abs(dy) > Math.abs(dx)) { gesture = null; return; }
          if (Math.abs(dx) < 7) return;
          gesture.dragging = true; card.setPointerCapture(e.pointerId);
          card.classList.add('is-handling');
        }
        targetYaw = gesture.yaw + dx / Math.max(180, card.clientWidth) * 240;
        targetPitch = Math.max(-16, Math.min(16, -dy * .12));
        update();
      } else if (!gesture && e.pointerType === 'mouse' && !reduced.matches) {
        const r = card.getBoundingClientRect();
        targetYaw = Math.round(targetYaw / 180) * 180 + ((e.clientX - r.left) / r.width - .5) * 16;
        targetPitch = -((e.clientY - r.top) / r.height - .5) * 12; update();
      }
    });
    const release = e => {
      if (!gesture || e.pointerId !== gesture.id) return;
      const dragged = gesture.dragging;
      gesture = null;
      if (dragged) suppressUntil = performance.now() + 450;
      if (card.hasPointerCapture(e.pointerId)) card.releasePointerCapture(e.pointerId);
      card.classList.remove('is-handling'); settle();
    };
    card.addEventListener('pointerup', release);
    card.addEventListener('pointercancel', release);
    card.addEventListener('lostpointercapture', release);
    card.addEventListener('pointerleave', () => {
      if (!gesture?.dragging) { gesture = null; settle(); }
    });
    card.addEventListener('click', e => {
      if (performance.now() < suppressUntil && e.detail !== 0) {
        e.preventDefault(); e.stopImmediatePropagation();
      }
    }, true);
    card.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault(); e.stopPropagation();
        targetYaw = Math.round(targetYaw / 180) * 180 + (e.key === 'ArrowRight' ? 180 : -180);
        targetPitch = 0; update();
      } else if (e.key === 'Home' || e.key === 'Escape') {
        e.preventDefault(); targetYaw = Math.round(targetYaw / 360) * 360; targetPitch = 0; update();
      } else if (e.key === 'Enter' && e.target === card) {
        e.preventDefault(); front.click();
      }
    });
    paint();
  });
})();

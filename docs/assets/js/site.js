/* =========================================================
   YDHC — comportamento do site
   1. Navegação  2. Acervo (lightbox)  3. Copiar e-mail
   A abertura fica em opening.js
   ========================================================= */
(() => {
  const $  = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
  const semMovimento = matchMedia('(prefers-reduced-motion: reduce)');
  const avisar = (txt) => { const el = $('#aviso'); if (el) el.textContent = txt; };

  const abertura = document.querySelector('.opening');

  /* ---------- 1. Navegação ---------- */
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const destino = document.getElementById(id);
    if (!destino) return;
    e.preventDefault();
    if (abertura && !abertura.hidden) document.dispatchEvent(new CustomEvent('ydhc:sair-da-abertura'));
    destino.scrollIntoView({ behavior: semMovimento.matches ? 'instant' : 'smooth', block: 'start' });
    if (destino.tabIndex === -1) destino.focus({ preventScroll: true });
    history.replaceState(null, '', `#${id}`);
  }));

  // seção atual + progresso de leitura
  const elos = $$('[data-nav]');
  const secoes = elos.map((a) => document.getElementById(a.getAttribute('href').split('#')[1])).filter(Boolean);
  const barra = $('.progress');

  if (secoes.length || barra) {
    let agendado = false;
    const medir = () => {
      agendado = false;
      if (barra) {
        const total = document.documentElement.scrollHeight - innerHeight;
        barra.style.setProperty('--read', total > 0 ? Math.min(1, scrollY / total) : 0);
      }
      if (!secoes.length) return;
      const linha = scrollY + innerHeight * 0.35;
      let atual = secoes[0];
      for (const s of secoes) if (s.offsetTop <= linha) atual = s;
      elos.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href').endsWith(`#${atual.id}`))));
    };
    addEventListener('scroll', () => { if (!agendado) { agendado = true; requestAnimationFrame(medir); } }, { passive: true });
    addEventListener('resize', medir, { passive: true });
    medir();
  }

  // Posters: one stable horizontal track, no automatic advance.
  const track = $('#poster-track');
  if (track) {
    const cards = [...track.children];
    const previous = $('#poster-prev'), next = $('#poster-next');
    const position = $('#poster-position');
    const updateTrack = () => {
      const rect = track.getBoundingClientRect();
      const visible = cards.map((card, i) => ({ i, rect: card.getBoundingClientRect() }))
        .filter(({ rect: c }) => c.right > rect.left + 12 && c.left < rect.right - 12);
      if (visible.length) position.textContent = `${visible[0].i + 1}–${visible.at(-1).i + 1} de ${cards.length}`;
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    };
    const advance = (direction) => {
      const step = cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
      const count = Math.max(1, Math.floor((track.clientWidth + 24) / step));
      track.scrollBy({ left: direction * step * count, behavior: semMovimento.matches ? 'instant' : 'smooth' });
    };
    previous.addEventListener('click', () => advance(-1));
    next.addEventListener('click', () => advance(1));
    track.addEventListener('keydown', (event) => {
      if (event.target !== track) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); advance(event.key === 'ArrowRight' ? 1 : -1);
      }
      if (event.key === 'Home' || event.key === 'End') {
        event.preventDefault(); track.scrollTo({ left: event.key === 'Home' ? 0 : track.scrollWidth, behavior: 'instant' });
      }
    });
    let trackFrame = 0;
    track.addEventListener('scroll', () => {
      if (!trackFrame) trackFrame = requestAnimationFrame(() => { trackFrame = 0; updateTrack(); });
    }, { passive: true });
    addEventListener('resize', updateTrack, { passive: true });
    updateTrack();
  }

  /* ---------- 2. Acervo ---------- */
  const visor = $('#visor');
  const gatilhos = $$('.piece__open');

  if (visor && gatilhos.length && visor.showModal) {
    const imagem = $('#visor-img');
    const titulo = $('#visor-titulo');
    const contador = $('#visor-contador');
    const trilho = $('#visor-trilho');
    let i = 0, origem = null;

    // trilho de miniaturas
    gatilhos.forEach((g, n) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = `<img src="${$('img', g).src}" alt="" loading="lazy">`;
      b.setAttribute('aria-label', `Ver ${g.dataset.titulo}`);
      b.addEventListener('click', () => mostrar(n));
      trilho.append(b);
    });
    const minis = [...trilho.children];

    const precarregar = (n) => {
      const alvo = gatilhos[(n + gatilhos.length) % gatilhos.length];
      if (alvo) new Image().src = alvo.href;
    };

    function mostrar(n) {
      i = (n + gatilhos.length) % gatilhos.length;
      const g = gatilhos[i];
      imagem.src = g.href;
      imagem.alt = $('img', g).alt;
      titulo.textContent = g.dataset.titulo;
      contador.textContent = `${String(i + 1).padStart(2, '0')} de ${gatilhos.length}`;
      minis.forEach((m, k) => m.setAttribute('aria-current', String(k === i)));
      minis[i]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: semMovimento.matches ? 'instant' : 'smooth' });
      precarregar(i + 1); precarregar(i - 1);
    }

    gatilhos.forEach((g, n) => g.addEventListener('click', (e) => {
      e.preventDefault();
      origem = g;
      mostrar(n);
      visor.showModal();
      document.body.classList.add('no-scroll');
      $('.viewer__close').focus();
    }));

    $('.viewer__close').addEventListener('click', () => visor.close());
    $('#visor-ant').addEventListener('click', () => mostrar(i - 1));
    $('#visor-prox').addEventListener('click', () => mostrar(i + 1));
    visor.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); mostrar(i - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); mostrar(i + 1); }
    });
    visor.addEventListener('close', () => {
      document.body.classList.remove('no-scroll');
      origem?.focus({ preventScroll: true });
    });
    // clique fora fecha
    visor.addEventListener('click', (e) => { if (e.target === visor) visor.close(); });
    // arrastar no celular
    let toqueX = null;
    visor.addEventListener('touchstart', (e) => { toqueX = e.changedTouches[0].clientX; }, { passive: true });
    visor.addEventListener('touchend', (e) => {
      if (toqueX === null) return;
      const d = e.changedTouches[0].clientX - toqueX;
      if (Math.abs(d) > 60) mostrar(d < 0 ? i + 1 : i - 1);
      toqueX = null;
    }, { passive: true });
  }

  /* ---------- 3. Copiar e-mail ---------- */
  $$('[data-copiar]').forEach((botao) => {
    const original = botao.textContent;
    botao.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(botao.dataset.copiar);
        botao.dataset.state = 'done';
        botao.textContent = 'E-mail copiado';
        avisar('E-mail copiado.');
        setTimeout(() => { botao.textContent = original; delete botao.dataset.state; }, 2200);
      } catch {
        location.href = `mailto:${botao.dataset.copiar}`;
      }
    });
  });
})();

/* =========================================================
   4. Mockups vivos
   A animação de CSS cuida da subida. Aqui entram as duas coisas
   que ela não faz: pausar quem está fora da tela e reagir ao
   cursor, que é o que separa um objeto animado de um objeto vivo.
   ========================================================= */
(() => {
  const palcos = [...document.querySelectorAll('.device-stage')];
  if (!palcos.length) return;

  const quieto = matchMedia('(prefers-reduced-motion: reduce)');
  const fino   = matchMedia('(min-width: 701px) and (pointer: fine)');
  if (quieto.matches) return;

  document.documentElement.classList.add('js-vivo');

  // Só anima o que está à vista.
  if ('IntersectionObserver' in window) {
    const olho = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => { if(e.isIntersecting) { e.target.classList.add('is-vivo'); olho.unobserve(e.target); } });
    }, { threshold: .15 });
    palcos.forEach((p) => olho.observe(p));
  } else {
    palcos.forEach((p) => p.classList.add('is-vivo'));
  }

  if (!fino.matches) return;

  // Inclinação que segue o cursor. Escrevo em custom properties em vez de
  // em transform, senão eu sobrescreveria a animação do CSS.
  const MAX_Y = .7, MAX_X = .45;
  const TAU_ENTRA = 220, TAU_VOLTA = 380;  // ms; volta mais macia que a ida

  palcos.forEach((palco) => {
    const aparelho = palco.querySelector('.floating-device');
    if (!aparelho) return;

    let alvoX = 0, alvoY = 0, alvoE = 1;
    let x = 0, y = 0, e = 1;
    let quadro = 0, dentro = false, anterior = 0;

    const pintar = (agora) => {
      quadro = 0;
      // Amortecimento por tempo e não por quadro, senão a inclinação fica
      // lenta em máquina fraca e seca em tela de 120Hz.
      const dt = anterior ? Math.min(60, agora - anterior) : 16;
      anterior = agora;
      const passo = 1 - Math.exp(-dt / (dentro ? TAU_ENTRA : TAU_VOLTA));
      x += (alvoX - x) * passo;
      y += (alvoY - y) * passo;
      e += (alvoE - e) * passo;
      aparelho.style.setProperty('--lean-x', x.toFixed(2) + 'deg');
      aparelho.style.setProperty('--lean-y', y.toFixed(2) + 'deg');
      aparelho.style.setProperty('--lean-scale', e.toFixed(4));
      const parado = Math.abs(alvoX - x) < .02 && Math.abs(alvoY - y) < .02 && Math.abs(alvoE - e) < .0005;
      if (parado && !dentro) {
        aparelho.style.removeProperty('--lean-x');
        aparelho.style.removeProperty('--lean-y');
        aparelho.style.removeProperty('--lean-scale');
        x = y = 0; e = 1; anterior = 0; return;
      }
      quadro = requestAnimationFrame(pintar);
    };
    const rodar = () => { if (!quadro) quadro = requestAnimationFrame(pintar); };

    palco.addEventListener('pointermove', (ev) => {
      if (ev.pointerType !== 'mouse') return;
      const r = palco.getBoundingClientRect();
      const nx = (ev.clientX - r.left) / r.width  - .5;
      const ny = (ev.clientY - r.top)  / r.height - .5;
      dentro = true;
      alvoY =  nx * 2 * MAX_Y;
      alvoX = -ny * 2 * MAX_X;
      alvoE = 1;
      rodar();
    });

    palco.addEventListener('pointerleave', () => {
      dentro = false; alvoX = 0; alvoY = 0; alvoE = 1; rodar();
    });
  });
})();

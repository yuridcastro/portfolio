export const clamp = (x, min = 0, max = 1) => Math.max(min, Math.min(max, x));
export const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
export const out = x => 1 - (1 - clamp(x)) ** 3;
export const mix = (a, b, t) => a + (b - a) * t;
export const DURATION = { tear: .82, lift: .52, light: .30, cards: 1.65, assemble: 2.7 };
export class OpeningState {
  constructor() { this.reset(); }
  reset() { this.phase = 'sealed'; this.time = 0; this.cut = 0; this.auto = false; this.from = 0; }
  pull(amount) {
    if (!['sealed', 'tearing'].includes(this.phase) || this.auto) return;
    this.phase = 'tearing'; this.cut = Math.max(this.cut, clamp(amount));
    if (this.cut >= .995) { this.cut = 1; this.phase = 'lifting'; this.time = 0; }
  }
  open() {
    if (!['sealed', 'tearing'].includes(this.phase) || this.auto) return;
    this.phase = 'tearing'; this.auto = true; this.from = this.cut; this.time = 0;
  }
  skip() { this.phase = 'done'; this.time = 0; }
  tick(dt) {
    if (this.phase === 'sealed' || this.phase === 'done') return this.frame();
    if (this.phase === 'tearing') {
      if (this.auto) {
        this.time += dt;
        this.cut = mix(this.from, 1, smooth(this.time / DURATION.tear));
        if (this.time >= DURATION.tear) { this.phase = 'lifting'; this.time = 0; this.cut = 1; }
      }
      return this.frame();
    }
    const order = ['lifting', 'lighting', 'cards', 'assembling', 'done'];
    const lengths = { lifting: DURATION.lift, lighting: DURATION.light, cards: DURATION.cards, assembling: DURATION.assemble };
    this.time += dt;
    while (this.phase !== 'done' && this.time >= lengths[this.phase]) {
      this.time -= lengths[this.phase]; this.phase = order[order.indexOf(this.phase) + 1];
    }
    return this.frame();
  }
  frame() {
    const p = this.phase;
    const later = ['lighting', 'cards', 'assembling', 'done'].includes(p);
    return {
      phase: p, cut: this.cut,
      lift: p === 'lifting' ? clamp(this.time / DURATION.lift) : later ? 1 : 0,
      light: p === 'lighting' ? clamp(this.time / DURATION.light) : ['cards', 'assembling', 'done'].includes(p) ? 1 : 0,
      cards: p === 'cards' ? clamp(this.time / DURATION.cards) : ['assembling', 'done'].includes(p) ? 1 : 0,
      assembly: p === 'assembling' ? clamp(this.time / DURATION.assemble) : p === 'done' ? 1 : 0
    };
  }
}
// The strip curls behind the cut, instead of disappearing as a rigid rectangle.
export function stripVertex(x, y, cut, lift, width = 1.25) {
  const edge = -width / 2 + width * cut;
  const distance = Math.max(0, edge - x);
  const theta = Math.min(4.6, distance * 7.5);
  return [distance ? edge - Math.sin(theta) / 7.5 : x,
    y + Math.sin(theta * .55) * .08 + out(lift) * 1.25,
    (1 - Math.cos(theta)) / 7.5 + out(lift) * .45];
}

// Front and back share the same sealed perimeter, with volume only inside it.
export function pouchVertex(x, y, lift, back = false, width = 1.25, height = 1.9) {
  const u = clamp((y + height / 2) / height);
  const across = Math.max(0, Math.cos(x / width * Math.PI));
  const belly = across * Math.sin(u * Math.PI);
  const opening = across * u ** 6 * smooth(lift);
  return [x, y - (back ? 0 : opening * .045),
    .004 + belly * (back ? .075 : .10) + opening * (back ? .12 : .20)];
}

// Cards remain within the foil until their lower edge clears the mouth.
export function extractionPose(progress, index) {
  const lift = smooth(clamp((progress / .72 - index * .10) / .80));
  return { y: mix(.24, 1.53, lift), z: [.025,0,-.025][index],
    fan: smooth(clamp((progress - .72) / .28)), lift };
}

// Uma carta que se deforma em fita torcida lê como falha de render, e três
// destinos empilhados na vertical não cabem na mesma tela. Aqui as cartas
// convergem rígidas para UMA pilha no centro, a pilha assenta, e a carta de
// cima cresce até ocupar exatamente o retângulo do hero. É a coincidência
// desses dois retângulos na tela que faz o olho ler "isto virou aquilo".
// A protagonista é a carta 0, a do retrato: ela é a única que tem o mesmo
// conteúdo que o destino, e morph só lê como morph quando o conteúdo continua.
export function assemblyTiming(t, index = 0) {
  const meio = index === 0;
  const atraso = meio ? .09 : index * .05;
  return {
    voo:      smooth(clamp((t - atraso) / .36)),
    assento:  smooth(clamp((t - .40) / .18)),
    // As laterais somem por baixo da do meio; a do meio só sai na troca.
    saida:    meio ? 0 : smooth(clamp((t - .44) / .16)),
    cresce:   smooth(clamp((t - .56) / .28)),
    troca:    smooth(clamp((t - .70) / .17)),
    desdobra: smooth(clamp((t - .78) / .22))
  };
}

// Voo em arco até a vaga na pilha, e depois crescimento até o hero. Sem
// deformação de malha: a carta continua sendo uma carta o tempo todo.
export function cardPose(inicio, pilha, hero, tempo) {
  const v = tempo.voo, c = tempo.cresce;
  const arco = Math.sin(v * Math.PI);
  const x = mix(mix(inicio.x, pilha.x, v), hero.x, c);
  const y = mix(mix(inicio.y, pilha.y, v), hero.y, c) - arco * .14 * (1 - c);
  const escala = mix(mix(inicio.escala, pilha.escala, v), hero.escala, c);
  // Gira para ficar de frente durante o voo e assenta reta ao chegar.
  const giro = mix(inicio.giro, pilha.giro, v) * (1 - c) + arco * .10;
  const inclina = mix(inicio.inclina, 0, v) * (1 - c);
  return { x, y, escala, giro, inclina, arco };
}

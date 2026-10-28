// ============ MENU ============
const nav = document.querySelector('.nav');
const marcarRolagem = () => nav.classList.toggle('rolou', window.scrollY > 20);
window.addEventListener('scroll', marcarRolagem, { passive: true });
marcarRolagem();
const btnMenu = document.querySelector('.btn-menu');
btnMenu.addEventListener('click', () => {
  const aberto = nav.classList.toggle('aberto');
  btnMenu.setAttribute('aria-expanded', aberto);
});
document.querySelectorAll('.nav-menu a').forEach((a) =>
  a.addEventListener('click', () => nav.classList.remove('aberto')));

// ============ TABELA COMPARATIVA ============
// um ícone por categoria (traço ciano, mesmo estilo dos cards de serviço)
const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const ICONES = {
  // mira com seta: atrair o público certo
  'Aquisição e mídia': svg('<circle cx="11" cy="13" r="8"/><circle cx="11" cy="13" r="4"/><path d="M11 13l9-9M16 4h4v4"/>'),
  // pessoas: relacionamento com leads e clientes
  'CRM e relacionamento': svg('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>'),
  // banco de dados
  'Inteligência de dados': svg('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'),
  // gráfico subindo com brilho: previsão
  'Inteligência preditiva': svg('<path d="M3 17l5-5 4 4 7-8"/><path d="M15 8h4v4"/><path d="M5 3v4M3 5h4"/>'),
  // elos: marketing e comercial conectados
  'Marketing + comercial': svg('<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>'),
  // olho: visão completa
  'Visão 360 do seu negócio': svg('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  // foguete: crescimento
  'Crescimento contínuo': svg('<path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.1 2.1 0 0 0-2.9-.1z"/><path d="M12 15l-3-3a22 22 0 0 1 2-4A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2z"/><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/>'),
};
const CELULAS = {
  s: '<svg class="icone-sim" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.7 2.7L16 9.8"/></svg>',
  n: '<svg class="icone-nao" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M9 9l6 6M15 9l-6 6"/></svg>',
  p: '<span class="parcial">Parcial</span>',
};
document.querySelectorAll('.t-row[data-r]').forEach((row) => {
  const nome = row.textContent.trim();
  const [a, b, c] = row.dataset.r.split(' ');
  row.setAttribute('role', 'row');
  row.innerHTML =
    `<div class="t-cell t-feat" role="cell">${ICONES[nome] || ''}${nome}</div>` +
    `<div class="t-cell t-hl" role="cell" data-col="ARTTICO">${CELULAS[a]}</div>` +
    `<div class="t-cell" role="cell" data-col="Agência tradicional">${CELULAS[b]}</div>` +
    `<div class="t-cell" role="cell" data-col="Soluções isoladas">${CELULAS[c]}</div>`;
});

// ============ ESTRELAS ============
const ESTRELA = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7.3L12 17.6l-6.3 3.9 1.7-7.3L2 9.5l7.1-.6z"/></svg>';
document.querySelectorAll('.estrelas').forEach((el) => { el.innerHTML = ESTRELA.repeat(5); });

// ============ DEPOIMENTOS (duplica pra marquee infinito) ============
const track = document.querySelector('.dep-track');
track.innerHTML += track.innerHTML;
[...track.children].slice(track.children.length / 2).forEach((li) => li.setAttribute('aria-hidden', 'true'));

// ============ APARECER AO ROLAR + CONTADORES ============
function contar(el) {
  const alvo = +el.dataset.alvo;
  const inicio = performance.now();
  const dur = 1600;
  (function passo(t) {
    const p = Math.min(1, (t - inicio) / dur);
    el.textContent = Math.round(alvo * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(passo);
  })(inicio);
}
const obs = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => {
    if (!e.isIntersecting) return;
    if (e.target.classList.contains('contador')) contar(e.target);
    else e.target.classList.add('visivel');
    obs.unobserve(e.target);
  });
}, { threshold: 0.2 });
document.querySelectorAll('.reveal, .contador').forEach((el) => obs.observe(el));

// ============ CARDS DE SERVIÇO EMPILHANDO ============
// conforme o próximo card cobre o anterior, o de baixo encolhe e escurece um pouco
const cardsServico = [...document.querySelectorAll('.servicos-cards .card')];
function empilharCards() {
  cardsServico.forEach((card, i) => {
    const prox = cardsServico[i + 1];
    let cobertura = 0;
    if (prox) {
      const a = card.getBoundingClientRect(), b = prox.getBoundingClientRect();
      cobertura = Math.max(0, Math.min(1, (a.bottom - b.top) / a.height));
    }
    // quanto mais cards por cima, mais ele recua
    const depois = cardsServico.slice(i + 2).filter((c) => c.getBoundingClientRect().top <= card.getBoundingClientRect().top + 60).length;
    const recuo = cobertura + depois * 0.6;
    card.style.setProperty('--escala', (1 - recuo * 0.045).toFixed(4));
    card.style.setProperty('--brilho', (1 - recuo * 0.22).toFixed(3));
  });
}
if (cardsServico.length) {
  window.addEventListener('scroll', () => requestAnimationFrame(empilharCards), { passive: true });
  window.addEventListener('resize', empilharCards);
  empilharCards();
}

// ============ CARROSSEL DO QUEM SOMOS ============
// troca de foto a cada 4,5 s; só roda enquanto a seção está visível
const carrossel = document.querySelector('.quem-carrossel');
if (carrossel) {
  const fotosEquipe = [...carrossel.querySelectorAll('img')];
  let atual = 0;
  let timer = null;
  const proxima = () => {
    fotosEquipe[atual].classList.remove('ativa');
    atual = (atual + 1) % fotosEquipe.length;
    fotosEquipe[atual].classList.add('ativa');
  };
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !timer) timer = setInterval(proxima, 4500);
    if (!e.isIntersecting && timer) { clearInterval(timer); timer = null; }
  }, { threshold: 0.2 }).observe(carrossel);
}

// ============ CARROSSEL DA EQUIPE ============
// setas andam um card por vez; ficam apagadas quando não há mais pra onde ir
const trilho = document.querySelector('.time-trilho');
if (trilho) {
  const setas = document.querySelectorAll('.time-seta');
  const passo = () => {
    const card = trilho.querySelector('.time-card');
    return card.offsetWidth + parseFloat(getComputedStyle(card.parentElement).gap || 0);
  };
  const atualizarSetas = () => {
    const fim = trilho.scrollWidth - trilho.clientWidth - 2;
    setas[0].disabled = trilho.scrollLeft <= 2;
    setas[1].disabled = trilho.scrollLeft >= fim;
  };
  setas.forEach((b) => b.addEventListener('click', () => trilho.scrollBy({ left: passo() * +b.dataset.dir })));
  trilho.addEventListener('scroll', () => requestAnimationFrame(atualizarSetas), { passive: true });
  window.addEventListener('resize', atualizarSetas);
  atualizarSetas();

  // arrastar com o mouse (no celular o dedo já arrasta nativamente)
  let arrastando = false, inicioX = 0, inicioScroll = 0;
  trilho.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    arrastando = true;
    inicioX = e.clientX;
    inicioScroll = trilho.scrollLeft;
    trilho.classList.add('arrastando');
    trilho.setPointerCapture(e.pointerId);
  });
  trilho.addEventListener('pointermove', (e) => {
    if (!arrastando) return;
    trilho.scrollLeft = inicioScroll - (e.clientX - inicioX);
  });
  const soltar = () => {
    if (!arrastando) return;
    arrastando = false;
    // encaixa no card mais próximo
    const p = passo();
    const alvo = Math.round(trilho.scrollLeft / p) * p;
    trilho.classList.remove('arrastando');
    trilho.scrollTo({ left: alvo });
  };
  trilho.addEventListener('pointerup', soltar);
  trilho.addEventListener('pointercancel', soltar);
  trilho.addEventListener('dragstart', (e) => e.preventDefault());
}

// ============ GALERIA: fotos se abrem com o scroll ============
const galeria = document.querySelector('.galeria');
const texto = document.querySelector('.galeria-texto');
const fotos = [...document.querySelectorAll('.g-foto')];
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

function medirFotos() {
  const vw = window.innerWidth;
  const k = Math.min(1, (vw - 32) / 800);
  fotos.forEach((f) => {
    f.style.width = f.dataset.w * k + 'px';
    f.style.height = f.dataset.h * k + 'px';
  });
}

function animarGaleria() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const topo = galeria.getBoundingClientRect().top;
  const p = clamp((-topo - 60) / 1000);
  // no celular as fotos se espalham menos na horizontal e mais na vertical
  const fx = vw < 640 ? vw / 1440 * 1.15 : vw / 1440;
  const fy = vw < 640 ? vh / 900 * 1.1 : vh / 900;
  fotos.forEach((f) => {
    const s = 1 - p * (1 - f.dataset.s);
    const x = f.dataset.x * fx * p;
    const y = f.dataset.y * fy * p;
    f.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${s})`;
  });
  texto.style.opacity = clamp((p - 0.45) / 0.5);
}

medirFotos();
animarGaleria();
window.addEventListener('scroll', () => requestAnimationFrame(animarGaleria), { passive: true });
window.addEventListener('resize', () => { medirFotos(); animarGaleria(); });

// ============ FUNDOS EM DEGRADÊ ============
// O degradê do Framer do fundo da página recriado sem imagem.
// Cores medidas numa grade de pontos da imagem original — só verde e azul, o vermelho é sempre ~0.
// O desenho passa uma curva suave pelos pontos e aplica um grão leve antes de arredondar as cores,
// o que evita as "faixas" típicas de degradê escuro.
const DEGRADES = {
  // página inteira: 41 linhas (0% a 100% da altura, a cada 2,5%) × 7 colunas em posições irregulares
  pagina: {
    xs: [0, .15, .3, .5, .7, .85, 1],
    grao: 2.5,
    G: [
      [2,2,2,2,2,3,6],
      [2,2,2,2,3,6,10],
      [2,2,2,3,6,11,14],
      [2,2,2,6,11,16,20],
      [2,2,5,9,15,19,24],
      [2,4,7,12,19,23,26],
      [4,6,9,14,20,24,26],
      [4,7,11,16,21,25,27],
      [5,8,11,17,21,25,27],
      [5,8,12,17,22,25,27],
      [5,8,11,18,22,25,27],
      [6,9,12,18,23,25,27],
      [7,10,13,19,24,26,27],
      [7,11,14,20,24,26,27],
      [8,11,16,20,25,26,27],
      [10,13,18,22,25,27,27],
      [11,15,20,24,26,27,27],
      [12,18,21,25,26,27,27],
      [17,20,23,25,27,27,27],
      [18,21,24,26,26,27,27],
      [20,22,25,26,26,26,26],
      [20,23,24,25,26,25,25],
      [19,21,23,24,24,24,23],
      [18,19,20,21,21,21,20],
      [13,16,17,19,19,19,19],
      [10,12,12,13,13,13,13],
      [6,7,9,10,11,11,11],
      [4,5,6,6,8,8,10],
      [4,4,5,6,6,7,8],
      [3,4,4,5,6,6,7],
      [3,4,4,5,6,6,8],
      [4,4,5,6,6,8,11],
      [4,5,6,6,9,10,12],
      [5,5,7,8,11,12,13],
      [6,7,8,11,12,13,15],
      [6,8,10,12,14,17,19],
      [9,10,12,13,18,19,21],
      [10,12,13,17,20,21,23],
      [11,13,16,19,21,23,24],
      [13,15,18,21,23,25,25],
      [13,17,20,22,24,25,27]
    ],
    B: [
      [29,29,29,29,29,32,38],
      [29,29,29,29,32,38,46],
      [29,29,29,32,39,48,52],
      [29,29,30,39,48,55,61],
      [29,30,35,45,54,60,70],
      [29,34,40,49,60,66,74],
      [34,38,45,52,61,70,74],
      [33,40,47,55,63,71,77],
      [35,42,48,57,64,71,77],
      [36,43,48,57,65,72,77],
      [37,43,48,58,66,73,77],
      [38,44,49,58,68,73,77],
      [40,45,50,60,69,73,77],
      [40,47,51,61,70,74,77],
      [43,48,55,62,72,75,77],
      [46,50,58,65,73,76,77],
      [47,54,61,69,75,77,77],
      [50,59,63,71,75,77,77],
      [56,61,67,73,76,77,77],
      [59,63,70,73,75,76,77],
      [61,65,71,73,75,75,75],
      [62,66,69,72,73,72,72],
      [60,63,67,70,69,70,67],
      [58,60,62,63,64,63,62],
      [51,55,57,59,59,59,59],
      [46,49,50,51,50,51,51],
      [38,41,44,46,48,48,48],
      [33,37,39,39,42,43,45],
      [33,34,36,38,39,40,43],
      [31,33,33,36,38,39,41],
      [31,33,34,36,39,39,43],
      [33,34,35,38,39,43,47],
      [33,35,37,39,44,46,49],
      [36,37,39,43,47,49,51],
      [38,39,43,47,49,51,54],
      [38,43,46,49,52,56,60],
      [44,47,49,51,58,60,63],
      [47,49,51,57,61,63,66],
      [48,51,55,60,63,67,69],
      [50,54,59,62,66,70,72],
      [50,57,62,65,70,72,77]
    ],
  }
};

// Catmull-Rom: curva suave que passa exatamente pelos pontos medidos
const curva = (p0, p1, p2, p3, t) => p1 + .5 * t * (p2 - p0 + t * (2 * p0 - 5 * p1 + 4 * p2 - p3 + t * (3 * (p1 - p2) + p3 - p0)));
function interpolar(vals, f) {
  const n = vals.length;
  const i = Math.min(n - 2, Math.max(0, Math.floor(f)));
  const v = (k) => vals[Math.max(0, Math.min(n - 1, k))];
  return curva(v(i - 1), v(i), v(i + 1), v(i + 2), f - i);
}
// posição horizontal (0 a 1) → índice fracionário da coluna da grade
function indiceColuna(u, xs, n) {
  if (!xs) return u * (n - 1);
  for (let i = 1; i < xs.length; i++) {
    if (u <= xs[i]) return i - 1 + (u - xs[i - 1]) / (xs[i] - xs[i - 1]);
  }
  return xs.length - 1;
}

function desenharDegrade(tela, d, W, H) {
  const linhas = d.G.length;
  const colunas = d.G[0].length;
  // 1) cada linha da grade interpolada na horizontal para todas as colunas de pixel
  const linG = new Float32Array(linhas * W);
  const linB = new Float32Array(linhas * W);
  for (let x = 0; x < W; x++) {
    const f = indiceColuna(W > 1 ? x / (W - 1) : 0, d.xs, colunas);
    for (let k = 0; k < linhas; k++) {
      linG[k * W + x] = interpolar(d.G[k], f);
      linB[k * W + x] = interpolar(d.B[k], f);
    }
  }
  // 2) na vertical, entre as linhas, com grão
  tela.width = W;
  tela.height = H;
  const ctx = tela.getContext('2d');
  const img = ctx.createImageData(W, H);
  const px = img.data;
  let semente = 1234567;
  const aleatorio = () => { semente ^= semente << 13; semente ^= semente >>> 17; semente ^= semente << 5; return (semente >>> 0) / 4294967296; };
  const forca = d.grao * 2; // soma de 3 sorteios tem desvio 0,5 → desvio final = d.grao
  for (let y = 0; y < H; y++) {
    const f = (H > 1 ? y / (H - 1) : 0) * (linhas - 1);
    const i = Math.min(linhas - 2, Math.floor(f));
    const t = f - i;
    const a = Math.max(0, i - 1) * W, b = i * W, c = (i + 1) * W, e = Math.min(linhas - 1, i + 2) * W;
    for (let x = 0; x < W; x++) {
      const grao = (aleatorio() + aleatorio() + aleatorio() - 1.5) * forca;
      const g = curva(linG[a + x], linG[b + x], linG[c + x], linG[e + x], t) + grao * .6;
      const bl = curva(linB[a + x], linB[b + x], linB[c + x], linB[e + x], t) + grao;
      const o = (y * W + x) * 4;
      px[o] = 0;
      px[o + 1] = g < 0 ? 0 : g > 255 ? 255 : g + .5;
      px[o + 2] = bl < 0 ? 0 : bl > 255 ? 255 : bl + .5;
      px[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

// Cada fundo: a caixa com o canvas, a grade e como calcular a resolução interna a partir do tamanho na tela
const FUNDOS = [
  {
    // página inteira: o degradê estica para cobrir a página toda
    caixa: document.querySelector('.fundo'),
    tamanho: (w, h) => { const s = Math.min(1, Math.sqrt(3.5e6 / (w * h))); return [w * s, h * s]; },
    grade: DEGRADES.pagina,
  },
];

function desenharFundos() {
  FUNDOS.forEach((f) => {
    if (!f.caixa) return;
    const w = f.caixa.offsetWidth, h = f.caixa.offsetHeight;
    if (!w || !h) return;
    const [W, H] = f.tamanho(w, h).map(Math.round);
    if (f.desenhado === W + 'x' + H) return;
    f.desenhado = W + 'x' + H;
    desenharDegrade(f.caixa.querySelector('canvas'), f.grade, W, H);
  });
}

// desenha depois que a página já apareceu (até lá ficam degradês CSS de reserva)
(window.requestIdleCallback || ((f) => setTimeout(f, 50)))(desenharFundos);
let esperaFundo;
const observarTamanho = new ResizeObserver(() => {
  clearTimeout(esperaFundo);
  esperaFundo = setTimeout(desenharFundos, 200);
});
FUNDOS.forEach((f) => f.caixa && observarTamanho.observe(f.caixa));

// ============ HERO: LUZES ANIMADAS (WebGL) ============
// Baseado na arte de referência (ciano, azul e verde-azulado sobre azul-marinho quase preto): focos de luz
// desfocados que passeiam pela hero inteira. O cursor repele a luz ao passar por cima.
// Pausa fora da tela; com "reduzir movimento", fica parado e sem interação.
(function () {
  const tela = document.querySelector('.hero-liquido');
  if (!tela) return;
  const gl = tela.getContext('webgl', { antialias: false, premultipliedAlpha: false });
  if (!gl) return; // sem WebGL fica o degradê CSS de reserva

  const vert = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
  const frag = `
precision highp float;
uniform vec2 res;
uniform float t;
uniform vec2 mouse;   // posição do cursor (mesmas coordenadas de p)
uniform float forca;  // 0 = cursor fora da hero, 1 = dentro

// sorteio sem padrões visíveis (hash de Dave Hoskins)
float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }

// cores medidas na imagem de referência
const vec3 MARINHO = vec3(0.000, 0.012, 0.129);  // #000321
const vec3 CIANO   = vec3(0.020, 0.706, 0.765);  // #05b4c3
const vec3 AZUL    = vec3(0.000, 0.502, 0.784);  // #0080c8
const vec3 AZUL2   = vec3(0.000, 0.325, 0.635);  // #0053a2
const vec3 TEAL    = vec3(0.000, 0.506, 0.612);  // #00819c

// foco de luz desfocado (bokeh grande)
float foco(vec2 p, vec2 c, float r){ vec2 d = p - c; return exp(-dot(d, d) / (r * r)); }

// feixe de luz diagonal suave
float feixe(vec2 p, vec2 origem, vec2 dir, float largura){
  vec2 n = vec2(-dir.y, dir.x);
  float d = dot(p - origem, n);
  float ao_longo = dot(p - origem, dir);
  return exp(-(d * d) / (largura * largura)) * smoothstep(-0.2, 0.6, ao_longo);
}

void main(){
  vec2 uv = gl_FragCoord.xy / res;
  uv.y = 1.0 - uv.y;                     // y para baixo, como na imagem
  float asp = res.x / res.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  float tt = t * 0.4;   // velocidade das luzes

  // repulsão: a luz perto do cursor é empurrada para fora (deslocamento suave, sem emenda no centro)
  vec2 dm = p - mouse;
  float d2 = dot(dm, dm);
  float raio = 0.90;
  float campo = forca * exp(-d2 / (raio * raio));
  vec2 q = p - dm * 0.9 * campo;

  // centro de cada foco: percorre a hero inteira em trajetórias (Lissajous) com ritmos diferentes
  #define CENTRO(fx, fy, ph) vec2(asp * (0.5 + 0.46 * sin(tt * fx + ph)), 0.5 + 0.44 * cos(tt * fy + ph * 1.7))

  // em tela estreita (celular) os focos encolhem junto com a largura, senão viram um “zoom” que cobre tudo
  float esc = clamp(asp, 0.5, 1.0);

  vec3 luz = vec3(0.0);
  luz += CIANO * 0.95 * foco(q, CENTRO(0.31, 0.23, 0.0), 0.36 * esc);
  luz += AZUL  * 0.85 * foco(q, CENTRO(0.21, 0.29, 1.9), 0.38 * esc);
  luz += AZUL2 * 0.75 * foco(q, CENTRO(0.26, 0.17, 3.6), 0.34 * esc);
  luz += TEAL  * 0.85 * foco(q, CENTRO(0.17, 0.27, 5.1), 0.38 * esc);
  luz += CIANO * 0.45 * foco(q, CENTRO(0.37, 0.33, 2.7), 0.20 * esc);
  luz += AZUL  * 0.40 * foco(q, CENTRO(0.29, 0.41, 4.4), 0.18 * esc);

  luz *= mix(0.5, 1.0, (esc - 0.5) * 2.0);  // celular mais escuro

  // vazio arredondado onde o cursor está: a luz “foge” dele
  luz *= 1.0 - 0.7 * forca * exp(-d2 / (0.51 * 0.51));

  // soma das luzes com compressão suave (não estoura no branco)
  vec3 cor = MARINHO + (1.0 - exp(-luz * 0.95));

  // dither imperceptível (±0,5 tom) só para evitar faixas no degradê escuro
  cor += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(cor, 1.0);
}`;

  const sh = (tipo, src) => {
    const s = gl.createShader(tipo);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  let prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (e) {
    console.warn('Gradiente da hero indisponível:', e.message);
    return;
  }
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uRes = gl.getUniformLocation(prog, 'res');
  const uT = gl.getUniformLocation(prog, 't');
  const uMouse = gl.getUniformLocation(prog, 'mouse');
  const uForca = gl.getUniformLocation(prog, 'forca');

  // cursor: posição e força suavizadas, para a luz fugir com inércia
  const hero = tela.closest('.hero');
  const alvo = { x: -10, y: -10, f: 0 };
  const cur = { x: -10, y: -10, f: 0 };
  hero.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const r = tela.getBoundingClientRect();
    alvo.x = (e.clientX - r.left) / r.height; // mesma escala de p (largura em unidades de altura)
    alvo.y = (e.clientY - r.top) / r.height;
    alvo.f = 1;
    if (cur.f === 0) { cur.x = alvo.x; cur.y = alvo.y; }
  });
  hero.addEventListener('pointerleave', () => { alvo.f = 0; });

  // resolução cheia (até 1,5x) para o grão ficar fino; o shader é leve
  function ajustar() {
    const esc = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.round(tela.clientWidth * esc));
    const h = Math.max(1, Math.round(tela.clientHeight * esc));
    if (tela.width !== w || tela.height !== h) {
      tela.width = w; tela.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  const parado = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visivel = true, rodando = false, inicio = performance.now();
  const desenhar = (agora) => {
    ajustar();
    gl.uniform2f(uRes, tela.width, tela.height);
    gl.uniform1f(uT, 40 + (agora - inicio) / 1000);
    cur.x += (alvo.x - cur.x) * 0.12;
    cur.y += (alvo.y - cur.y) * 0.12;
    cur.f += (alvo.f - cur.f) * 0.06;
    if (cur.f < 0.001) cur.f = 0;
    gl.uniform2f(uMouse, cur.x, cur.y);
    gl.uniform1f(uForca, cur.f);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const quadro = (agora) => {
    if (!visivel || document.hidden || parado.matches) { rodando = false; return; }
    desenhar(agora);
    requestAnimationFrame(quadro);
  };
  const tocar = () => {
    if (rodando || parado.matches) return;
    rodando = true;
    requestAnimationFrame(quadro);
  };

  desenhar(performance.now());
  tela.classList.add('pronto');
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; if (visivel) tocar(); }).observe(tela);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tocar(); });
  window.addEventListener('resize', () => { if (!rodando) desenhar(performance.now()); });
  tocar();
})();

// ============ DEPOIMENTOS EM VÍDEO: abre o vídeo do Instagram num pop-up ============
const videoModal = document.querySelector('.video-modal');
if (videoModal) {
  const videoFrame = videoModal.querySelector('iframe');
  const fecharVideo = () => {
    videoModal.hidden = true;
    videoFrame.src = '';
    document.body.style.overflow = '';
  };
  document.querySelectorAll('.video-dep').forEach((btn) =>
    btn.addEventListener('click', () => {
      videoFrame.src = `https://www.instagram.com/p/${btn.dataset.post}/embed/`;
      videoModal.hidden = false;
      document.body.style.overflow = 'hidden';
    })
  );
  videoModal.querySelector('.video-modal-fechar').addEventListener('click', fecharVideo);
  videoModal.addEventListener('click', (e) => { if (e.target === videoModal) fecharVideo(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !videoModal.hidden) fecharVideo(); });
}

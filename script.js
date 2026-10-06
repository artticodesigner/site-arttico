// ============ MENU ============
const nav = document.querySelector('.nav');
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
  n: '<svg class="icone-nao" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>',
  p: '<span class="parcial">Parcial</span>',
};
document.querySelectorAll('.t-row[data-r]').forEach((row) => {
  const nome = row.textContent.trim();
  const [a, b, c] = row.dataset.r.split(' ');
  row.setAttribute('role', 'row');
  row.innerHTML =
    `<div class="t-cell t-feat" role="cell">${ICONES[nome] || ''}${nome}</div>` +
    `<div class="t-cell t-hl" role="cell">${CELULAS[a]}</div>` +
    `<div class="t-cell" role="cell">${CELULAS[b]}</div>` +
    `<div class="t-cell" role="cell">${CELULAS[c]}</div>`;
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

// ============ FUNDO EM DEGRADÊ ============
// Recriado a partir do degradê do Framer: cores medidas numa grade de 41 linhas (0% a 100% da altura
// da página, a cada 2,5%) por 7 colunas (posições em FUNDO_X). Só verde e azul — o vermelho é sempre 0.
// O desenho interpola de forma suave entre os pontos e põe um grão leve antes de arredondar as cores,
// o que evita as "faixas" típicas de degradê escuro.
const FUNDO_X = [0, .15, .3, .5, .7, .85, 1];
const FUNDO_G = [
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
];
const FUNDO_B = [
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
];

// Catmull-Rom: curva suave que passa exatamente pelos pontos medidos
const curva = (p0, p1, p2, p3, t) => p1 + .5 * t * (p2 - p0 + t * (2 * p0 - 5 * p1 + 4 * p2 - p3 + t * (3 * (p1 - p2) + p3 - p0)));
function interpolar(vals, f) {
  const n = vals.length;
  const i = Math.min(n - 2, Math.max(0, Math.floor(f)));
  const v = (k) => vals[Math.max(0, Math.min(n - 1, k))];
  return curva(v(i - 1), v(i), v(i + 1), v(i + 2), f - i);
}
function indiceColuna(u) {
  for (let i = 1; i < FUNDO_X.length; i++) {
    if (u <= FUNDO_X[i]) return i - 1 + (u - FUNDO_X[i - 1]) / (FUNDO_X[i] - FUNDO_X[i - 1]);
  }
  return FUNDO_X.length - 1;
}

const fundo = document.querySelector('.fundo');
const tela = fundo.querySelector('canvas');
let tamanhoDesenhado = '';

function desenharFundo() {
  const w = fundo.offsetWidth;
  const h = fundo.offsetHeight;
  if (!w || !h) return;
  // resolução interna limitada (~3,5 mi de pixels); o degradê é suave, então ampliar não perde nitidez
  const esc = Math.min(1, Math.sqrt(3.5e6 / (w * h)));
  const W = Math.round(w * esc);
  const H = Math.round(h * esc);
  if (tamanhoDesenhado === W + 'x' + H) return;
  tamanhoDesenhado = W + 'x' + H;

  const linhas = FUNDO_G.length;
  // 1) cada linha da grade interpolada na horizontal para todas as colunas de pixel
  const linG = new Float32Array(linhas * W);
  const linB = new Float32Array(linhas * W);
  const idx = new Float32Array(W);
  for (let x = 0; x < W; x++) idx[x] = indiceColuna(W > 1 ? x / (W - 1) : 0);
  for (let k = 0; k < linhas; k++) {
    for (let x = 0; x < W; x++) {
      linG[k * W + x] = interpolar(FUNDO_G[k], idx[x]);
      linB[k * W + x] = interpolar(FUNDO_B[k], idx[x]);
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
  for (let y = 0; y < H; y++) {
    const f = (H > 1 ? y / (H - 1) : 0) * (linhas - 1);
    const i = Math.min(linhas - 2, Math.floor(f));
    const t = f - i;
    const a = Math.max(0, i - 1) * W, b = i * W, c = (i + 1) * W, d = Math.min(linhas - 1, i + 2) * W;
    for (let x = 0; x < W; x++) {
      const grao = (aleatorio() + aleatorio() + aleatorio() - 1.5) * 5; // desvio ~2,5 tons, como o original
      const g = curva(linG[a + x], linG[b + x], linG[c + x], linG[d + x], t) + grao * .6;
      const bl = curva(linB[a + x], linB[b + x], linB[c + x], linB[d + x], t) + grao;
      const o = (y * W + x) * 4;
      px[o] = 0;
      px[o + 1] = g < 0 ? 0 : g > 255 ? 255 : g + .5;
      px[o + 2] = bl < 0 ? 0 : bl > 255 ? 255 : bl + .5;
      px[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

// desenha depois que a página já apareceu (até lá fica o degradê CSS de reserva)
(window.requestIdleCallback || ((f) => setTimeout(f, 50)))(desenharFundo);
let esperaFundo;
new ResizeObserver(() => {
  clearTimeout(esperaFundo);
  esperaFundo = setTimeout(desenharFundo, 200);
}).observe(fundo);

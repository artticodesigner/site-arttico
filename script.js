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

// ============ FUNDOS EM DEGRADÊ ============
// Os degradês do Framer (fundo da página e da seção do Instagram) recriados sem imagem.
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
  },
  // seção do Instagram: imagem original 2480×3508, grade de 29 linhas × 21 colunas
  insta: {
    proporcao: 2480 / 3508,
    grao: 4,
    G: [
      [3,3,3,3,3,4,5,6,7,9,12,16,20,25,34,51,65,81,98,115,127],
      [3,3,3,3,4,4,6,7,10,13,17,21,26,32,43,65,80,97,113,128,138],
      [3,3,3,4,4,6,8,10,14,19,23,29,36,45,59,79,102,119,133,145,153],
      [3,3,3,4,6,7,10,15,20,25,32,40,50,62,80,97,121,139,151,161,168],
      [3,3,4,5,7,9,14,19,25,33,42,52,63,78,99,117,141,157,167,173,174],
      [3,3,4,5,8,12,17,23,31,41,53,64,75,90,113,132,155,170,176,176,176],
      [3,4,4,6,9,14,19,27,37,49,61,73,86,102,122,143,162,176,177,176,173],
      [3,4,5,6,10,15,21,29,41,54,67,80,95,111,130,148,164,176,175,170,164],
      [3,4,5,7,10,16,22,31,43,57,70,83,99,116,132,147,159,168,165,155,147],
      [3,4,5,7,10,15,22,31,43,57,70,84,99,114,128,140,149,155,149,138,130],
      [3,4,5,6,10,15,21,30,42,55,69,83,97,109,120,128,133,136,131,120,110],
      [3,4,5,6,9,14,21,29,41,54,68,80,93,103,110,113,118,113,110,100,90],
      [3,4,5,7,10,15,21,29,41,54,67,79,89,97,100,98,102,94,86,79,69],
      [4,4,6,8,11,16,22,31,43,55,67,78,86,91,90,85,82,76,69,61,52],
      [4,5,7,10,14,19,26,35,47,59,70,78,84,86,83,76,67,58,48,43,36],
      [5,6,9,14,20,26,33,42,54,64,73,80,83,82,76,68,58,46,35,28,23],
      [5,8,12,20,29,38,47,54,66,75,79,83,83,78,71,61,49,37,27,20,16],
      [7,10,17,28,39,52,65,74,83,92,96,90,84,75,66,54,41,30,22,16,11],
      [8,13,23,36,49,65,80,92,98,105,108,104,93,77,62,48,35,25,18,12,8],
      [10,16,29,44,60,76,93,109,119,121,117,109,96,79,58,42,30,21,14,9,7],
      [11,19,34,50,68,86,104,118,129,133,128,115,96,78,59,40,27,18,12,8,5],
      [12,22,37,55,74,93,109,123,131,134,130,119,101,80,61,41,26,16,10,6,5],
      [13,23,40,58,77,95,110,122,128,130,124,112,95,75,56,39,25,15,9,6,5],
      [14,24,42,60,78,94,107,117,122,122,115,104,87,69,51,36,24,14,9,6,5],
      [14,25,42,60,77,91,102,109,112,110,104,94,79,63,48,35,23,15,9,7,5],
      [14,25,43,60,76,87,96,100,101,100,94,84,72,58,46,34,25,17,11,8,6],
      [14,25,43,60,75,84,89,92,92,90,84,76,66,56,46,36,27,20,14,10,8],
      [14,25,43,60,74,82,85,86,85,82,77,71,63,55,47,39,31,24,18,14,11],
      [14,25,43,60,72,80,82,82,80,77,73,67,61,55,49,41,34,27,21,16,13]
    ],
    B: [
      [34,34,34,34,35,36,37,39,42,45,49,54,61,69,77,84,97,111,125,140,152],
      [34,34,34,35,36,37,39,42,45,50,56,63,72,81,90,98,111,125,139,154,164],
      [34,34,35,36,37,39,43,47,52,59,68,77,88,100,113,122,132,145,158,171,178],
      [34,34,35,37,39,42,47,53,61,71,82,93,107,120,132,146,155,165,176,184,188],
      [34,35,36,38,41,45,51,60,71,83,97,111,127,140,151,164,172,180,188,193,194],
      [34,35,36,39,43,48,57,68,80,95,111,128,145,162,171,183,188,191,195,196,196],
      [34,35,37,40,44,51,61,74,88,105,124,143,161,178,190,197,199,196,197,195,193],
      [35,35,38,41,46,53,65,78,94,113,133,153,171,186,195,200,201,197,195,190,185],
      [35,36,38,41,46,54,66,80,97,117,138,158,176,189,196,200,201,193,186,179,173],
      [35,36,38,41,46,54,66,79,97,117,138,159,176,188,194,198,198,184,175,164,155],
      [35,35,38,41,45,53,65,78,96,115,137,157,174,185,191,194,187,172,158,145,136],
      [35,36,38,41,45,52,64,77,94,113,134,154,169,180,185,185,171,161,143,127,118],
      [35,36,38,41,46,53,64,77,94,113,133,151,165,173,176,173,157,145,127,109,101],
      [36,37,39,43,48,55,67,80,97,115,134,150,162,167,167,160,145,129,111,93,84],
      [36,38,41,46,51,60,72,86,103,120,138,151,159,161,157,147,132,116,99,80,72],
      [37,40,45,50,58,68,80,96,112,129,143,154,158,156,148,135,118,102,85,71,62],
      [39,42,49,56,65,75,88,108,123,138,151,158,158,151,139,123,106,89,75,62,54],
      [41,46,54,63,73,84,98,117,133,145,154,161,157,146,131,113,95,79,66,54,48],
      [43,49,59,70,82,97,110,126,145,156,159,157,149,139,123,104,86,71,58,48,44],
      [45,53,64,77,92,107,121,135,149,161,163,159,147,130,115,96,78,64,52,45,41],
      [47,55,68,83,100,115,130,144,154,160,160,155,142,124,104,86,71,58,48,42,39],
      [48,58,71,88,105,121,135,148,156,159,155,145,129,112,94,77,65,54,46,41,38],
      [50,59,74,91,108,123,136,147,154,155,149,138,123,106,89,73,61,52,44,40,37],
      [50,60,75,92,108,122,133,142,147,147,141,130,116,100,84,70,60,51,44,40,38],
      [51,60,75,92,107,119,128,135,137,136,131,122,109,95,81,69,59,51,45,41,39],
      [51,60,76,92,106,116,123,127,128,126,121,113,103,91,79,69,60,53,47,43,40],
      [51,61,76,92,105,113,118,120,120,118,113,107,98,88,79,70,62,56,51,46,43],
      [51,61,77,93,105,111,114,115,114,111,108,102,95,88,80,73,66,60,55,50,47],
      [50,61,76,92,103,110,111,111,110,107,104,99,93,87,81,75,68,63,58,53,50]
    ],
  },
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
  {
    // Instagram: mantém a proporção da imagem original e cobre a seção (object-fit: cover no CSS)
    caixa: document.querySelector('.insta-fundo'),
    tamanho: (w, h) => {
      const p = DEGRADES.insta.proporcao;
      const largura = Math.max(w, h * p) * .7;
      return [largura, largura / p];
    },
    grade: DEGRADES.insta,
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

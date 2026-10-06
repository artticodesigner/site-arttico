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

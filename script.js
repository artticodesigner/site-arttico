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
const ICONE_ALVO = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2"/></svg>';
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
    `<div class="t-cell t-feat" role="cell">${ICONE_ALVO}${nome}</div>` +
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

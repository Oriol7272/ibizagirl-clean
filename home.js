// ==== HOME LOGIC ====
// Requiere content-data2.js que expone FULL_IMAGES = [{src, ...}, ...]

function yyyymmdd() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

// RNG determinista por día (pool diario estable)
function mulberry32(a) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffleDeterministic(arr, seed) {
  const random = mulberry32(seed);
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pickDeterministic(arr, n, seed) {
  return shuffleDeterministic(arr, seed).slice(0, n);
}

// --- Banner (hero) usando FULL ---
function setHeroFromFull(full) {
  const hero = document.getElementById('hero');
  if (!hero || !Array.isArray(full) || full.length === 0) return;
  const seed = yyyymmdd();
  const { src } = pickDeterministic(full, 1, seed)[0];
  hero.style.backgroundImage = `url("${src}")`;
  hero.setAttribute('data-src', src);
}

// --- Carrusel muy ligero (cambia cada 6s) ---
function renderCarousel(full) {
  const el = document.getElementById('carousel');
  if (!el || !Array.isArray(full) || full.length === 0) return;

  const img = document.createElement('img');
  img.alt = 'Carousel';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  el.appendChild(img);

  const seed = yyyymmdd();
  const order = shuffleDeterministic(full, seed);
  let i = 0;

  function swap() {
    const next = order[i % order.length].src;
    img.src = next;
    i++;
  }
  swap();
  setInterval(swap, 6000);
}

// --- Grid 5x30 (150) del pool FULL ---
function renderGrid(full) {
  const grid = document.getElementById('photo-grid');
  if (!grid || !Array.isArray(full) || full.length === 0) return;

  const seed = yyyymmdd();
  const picks = pickDeterministic(full, 150, seed + 13);

  grid.innerHTML = '';
  for (const item of picks) {
    const im = document.createElement('img');
    im.loading = 'lazy';
    im.decoding = 'async';
    im.src = item.src;
    grid.appendChild(im);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  if (!Array.isArray(window.FULL_IMAGES) || window.FULL_IMAGES.length === 0) {
    console.error('⚠️ FULL_IMAGES no disponible.');
    return;
  }
  console.log('[IBG] /full pool size:', window.FULL_IMAGES.length);
  setHeroFromFull(window.FULL_IMAGES);
  renderCarousel(window.FULL_IMAGES);
  renderGrid(window.FULL_IMAGES);
});

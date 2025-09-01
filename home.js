// ==== HOME LOGIC ====
// Requiere decorative-data.js (DECORATIVE_IMAGES) + content-data2.js (FULL_IMAGES)

function yyyymmdd() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
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

// === Banner rotatorio con DECORATIVE_IMAGES ===
function runHeroRotation(intervalMs = 7000) {
  const hero = document.getElementById("hero");
  const list = Array.isArray(window.DECORATIVE_IMAGES) ? window.DECORATIVE_IMAGES : [];
  if (!hero || list.length === 0) return;

  const seed = yyyymmdd();
  const order = shuffleDeterministic(list, seed);
  let i = 0;
  function setBg() {
    const src = order[i % order.length].src;
    hero.style.backgroundImage = `url("${src}")`;
    i++;
  }
  setBg();
  setInterval(setBg, intervalMs);
}

// === Carrusel usando FULL_IMAGES ===
function runCarousel() {
  if (!Array.isArray(window.FULL_IMAGES)) return;
  const el = document.getElementById("carousel");
  if (!el) return;
  const img = document.createElement("img");
  img.alt = "Carousel";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  el.appendChild(img);

  const seed = yyyymmdd();
  const order = shuffleDeterministic(window.FULL_IMAGES, seed + 101);
  let i = 0;
  function swap() {
    img.src = order[i % order.length].src;
    i++;
  }
  swap();
  setInterval(swap, 6000);
}

// === Grid 5x30 desde FULL_IMAGES ===
function renderGrid() {
  if (!Array.isArray(window.FULL_IMAGES)) return;
  const grid = document.getElementById("photo-grid");
  if (!grid) return;

  const seed = yyyymmdd();
  const picks = pickDeterministic(window.FULL_IMAGES, 150, seed + 13);
  grid.innerHTML = "";
  picks.forEach(item => {
    const im = document.createElement("img");
    im.loading = "lazy";
    im.decoding = "async";
    im.src = item.src;
    grid.appendChild(im);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  runHeroRotation(7000); // cada 7s
  runCarousel();
  renderGrid();
  if (Array.isArray(window.FULL_IMAGES)) {
    console.log("[IBG] /full pool size:", window.FULL_IMAGES.length);
  }
});

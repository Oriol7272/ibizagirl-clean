// ==== HOME LOGIC ====
// Requiere decorative-data.js (DECORATIVE_IMAGES) y content-data2.js (FULL_IMAGES)

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

// --- Banner con DECORATIVE_IMAGES ---
function setHero() {
  const hero = document.getElementById("hero");
  if (!hero || !Array.isArray(window.DECORATIVE_IMAGES)) return;
  const seed = yyyymmdd();
  const { src } = pickDeterministic(window.DECORATIVE_IMAGES, 1, seed)[0];
  hero.style.backgroundImage = `url("${src}")`;
}

// --- Carrusel usando FULL_IMAGES ---
function renderCarousel() {
  if (!Array.isArray(window.FULL_IMAGES)) return;
  const el = document.getElementById("carousel");
  const img = document.createElement("img");
  img.alt = "Carousel";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  el.appendChild(img);

  const seed = yyyymmdd();
  const order = shuffleDeterministic(window.FULL_IMAGES, seed);
  let i = 0;
  function swap() {
    img.src = order[i % order.length].src;
    i++;
  }
  swap();
  setInterval(swap, 6000);
}

// --- Grid 5x30 desde FULL_IMAGES ---
function renderGrid() {
  if (!Array.isArray(window.FULL_IMAGES)) return;
  const grid = document.getElementById("photo-grid");
  const seed = yyyymmdd();
  const picks = pickDeterministic(window.FULL_IMAGES, 150, seed + 13);
  grid.innerHTML = "";
  picks.forEach(item => {
    const im = document.createElement("img");
    im.loading = "lazy";
    im.src = item.src;
    grid.appendChild(im);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setHero();
  renderCarousel();
  renderGrid();
});

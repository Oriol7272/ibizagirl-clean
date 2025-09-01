// ==== HOME LOGIC ====
// Usa content-data2.js (array con imágenes FULL)

function pickRandom(arr, n) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function renderCarousel(images) {
  const carousel = document.getElementById("carousel");
  carousel.innerHTML = "";
  const img = document.createElement("img");
  img.src = images[Math.floor(Math.random() * images.length)].src;
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  carousel.appendChild(img);
}

function renderGrid(images) {
  const grid = document.getElementById("photo-grid");
  grid.innerHTML = "";
  const picks = pickRandom(images, 150); // 5x30 = 150
  picks.forEach(item => {
    const img = document.createElement("img");
    img.src = item.src;
    grid.appendChild(img);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  if (typeof FULL_IMAGES !== "undefined") {
    renderCarousel(FULL_IMAGES);
    renderGrid(FULL_IMAGES);
  } else {
    console.error("⚠️ No se encontró FULL_IMAGES en content-data2.js");
  }
});

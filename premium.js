// ==== PREMIUM LOGIC ====
// Usa content-data3.js + content-data4.js (arrays de imágenes UNCENSORED)

function pickRandom(arr, n) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function renderPremiumGrid(images) {
  const grid = document.getElementById("premium-grid");
  grid.innerHTML = "";
  const picks = pickRandom(images, 100);

  picks.forEach(item => {
    const wrapper = document.createElement("div");
    wrapper.className = "thumb-wrapper";

    const img = document.createElement("img");
    img.src = item.src;
    img.classList.add("blurred");

    const btn = document.createElement("button");
    btn.className = "paypal-btn";
    btn.innerText = "€0.10";
    btn.addEventListener("click", () => {
      alert("💳 Simulación: aquí se conecta con PayPal OneShot para desbloquear");
      img.classList.remove("blurred");
    });

    wrapper.appendChild(img);
    wrapper.appendChild(btn);
    grid.appendChild(wrapper);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  if (typeof UNCENSORED_PART1 !== "undefined" && typeof UNCENSORED_PART2 !== "undefined") {
    const all = UNCENSORED_PART1.concat(UNCENSORED_PART2);
    renderPremiumGrid(all);
  } else {
    console.error("⚠️ No se encontraron imágenes UNCENSORED en content-data3/4.js");
  }
});

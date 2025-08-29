(function () {
  try {
    var ENV  = (window.__ENV||{});
    var BASE = ENV.BASE || "https://ibizagirl.pics";
    // Los módulos content-data3 y 4 definen arrays globales:
    // window.IBG_PREMIUM_PART1, window.IBG_PREMIUM_PART2 (nombres de archivo .webp)
    var a = Array.isArray(window.IBG_PREMIUM_PART1) ? window.IBG_PREMIUM_PART1 : [];
    var b = Array.isArray(window.IBG_PREMIUM_PART2) ? window.IBG_PREMIUM_PART2 : [];
    var all = a.concat(b);
    var files = all.slice(0, 100); // 100 thumbs

    var grid = document.getElementById("premium-grid");
    if (!grid) { console.warn("premium-grid no encontrado"); return; }

    grid.innerHTML = "";
    files.forEach(function(name){
      // Asegura .webp (ya vienen en .webp según repo)
      var src = name.endsWith(".webp") ? name : (name + ".webp");
      // Ruta absoluta
      var url = BASE.replace(/\/+$/,"") + "/uncensored/" + src;

      var card = document.createElement("div");
      card.className = "card";

      var wrap = document.createElement("div");
      wrap.className = "thumb-wrap";

      var img = document.createElement("img");
      img.loading = "lazy";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      img.src = url;
      img.alt = name;

      // Capa overlay con icono PayPal y precio
      var overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.innerHTML = '<div class="pay"><span class="pp"></span><span class="price">0,10€</span></div>';

      // Evento de compra individual (requiere paypal_buy SDK)
      overlay.addEventListener("click", function(e){
        e.preventDefault();
        if (!window.paypal_buy || !window.paypal_buy.Buttons) {
          console.warn("paypal_buy SDK no cargado (sin PAYPAL_CLIENT_ID)");
          return;
        }
        alert("Compra individual simulada (integrar createOrder/capture en backend)");
      });

      wrap.appendChild(img);
      wrap.appendChild(overlay);
      card.appendChild(wrap);
      grid.appendChild(card);
    });

    console.info("[premium-thumbs] render:", files.length, "base:", BASE);
  } catch (e) {
    console.error("[premium-thumbs] error", e);
  }
})();

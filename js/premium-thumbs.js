(function () {
  try {
    var ENV  = (window.__ENV||{});
    var BASE = (ENV.BASE||"https://ibizagirl.pics").replace(/\/+$/,"");

    // Recolecta ANY arrays globales IBG_PREMIUM*
    var all = [];
    for (var k in window) {
      if (Object.prototype.hasOwnProperty.call(window,k) &&
          /^IBG_PREMIUM/i.test(k) &&
          Array.isArray(window[k])) {
        all = all.concat(window[k]);
      }
    }
    if (!all.length) {
      console.warn("[premium-thumbs] No encontré arrays IBG_PREMIUM* en window");
    }

    var files = all.slice(0, 100);
    var grid = document.getElementById("premium-grid");
    if (!grid) { console.warn("premium-grid no encontrado"); return; }

    grid.innerHTML = "";
    files.forEach(function(name){
      var src = (typeof name === "string" && name.endsWith(".webp")) ? name : (String(name||"") + ".webp");
      var url = BASE + "/uncensored/" + src;

      var card = document.createElement("div");
      card.className = "card";

      var wrap = document.createElement("div");
      wrap.className = "thumb-wrap";

      var img = document.createElement("img");
      img.loading = "lazy"; img.decoding = "async"; img.referrerPolicy = "no-referrer";
      img.src = url; img.alt = src;

      var overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.innerHTML = '<div class="pay"><span class="pp"></span><span class="price">0,10€</span></div>';
      overlay.addEventListener("click", function(e){
        e.preventDefault();
        if (!window.paypal_buy || !window.paypal_buy.Buttons) {
          console.warn("paypal_buy SDK no cargado (sin PAYPAL_CLIENT_ID)"); return;
        }
        alert("Compra individual simulada (integrar order/capture)");
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

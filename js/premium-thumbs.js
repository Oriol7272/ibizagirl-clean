(function () {
  try {
    var ENV  = (window.__ENV||{});
    var BASE = (ENV.BASE||"https://ibizagirl.pics").replace(/\/+$/,"");

    function ensureWebp(name){
      var s = String(name||"").trim();
      if (!s) return "";
      // si viene absoluta, solo forzamos la extensión
      var m = s.match(/^(https?:\/\/[^?#]+?)(\.[a-zA-Z0-9]+)?([?#].*)?$/);
      if (m) {
        var base = m[1], q = m[3]||"";
        if (!/\.webp$/i.test(base)) base = base.replace(/\.[a-zA-Z0-9]+$/,'') + ".webp";
        return base + q;
      }
      // relativa: quitamos carpeta y extensión, y mandamos a /uncensored/*.webp
      s = s.split('/').pop().replace(/\.[a-zA-Z0-9]+$/,'') + ".webp";
      return BASE + "/uncensored/" + s;
    }

    // juntar arrays posibles
    var all = []
      .concat(
        (window.PREMIUM_IMAGES_PART1||[]),
        (window.PREMIUM_IMAGES_PART2||[]),
        (window.IBG_PREMIUM_PART1||[]),
        (window.IBG_PREMIUM_PART2||[]),
        (window.IBG_PREMIUM||[])
      );

    if (!all.length) console.warn("[premium-thumbs] No encontré arrays premium");

    var grid = document.getElementById("premium-grid");
    if (!grid) { console.warn("premium-grid no encontrado"); return; }
    grid.innerHTML = "";

    var price = (ENV.PAYPAL_ONESHOT_PRICE_EUR_IMAGE||"0.10");

    all.slice(0,100).forEach(function(entry){
      var url = ensureWebp(entry);
      var card = document.createElement("div"); card.className = "card";
      var wrap = document.createElement("div"); wrap.className = "thumb-wrap";

      var img = document.createElement("img");
      img.loading = "lazy"; img.decoding = "async"; img.referrerPolicy = "no-referrer";
      img.src = url; img.alt = String(entry||"");

      var overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.innerHTML = '<div class="pay"><span class="pp"></span><span class="price">'+price.replace('.',',')+'€</span></div>';
      overlay.addEventListener("click", function(e){
        e.preventDefault();
        if (!window.paypal || !window.paypal.Buttons) {
          console.warn("PayPal SDK no listo"); return;
        }
        alert("Compra individual simulada (pendiente order/capture)");
      });

      wrap.appendChild(img);
      wrap.appendChild(overlay);
      card.appendChild(wrap);
      grid.appendChild(card);
    });

    console.info("[premium-thumbs] render ok:", Math.min(100, all.length), "base:", BASE);
  } catch (e) {
    console.error("[premium-thumbs] error", e);
  }
})();

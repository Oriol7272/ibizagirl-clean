(function () {
  try {
    var ENV  = (window.__ENV||{});
    var BASE = (ENV.BASE||"https://ibizagirl.pics").replace(/\/+$/,"");

    function absolutize(p){
      if (!p) return "";
      if (/^https?:\/\//i.test(p)) return p;
      if (p[0] === "/") return BASE + p;
      return BASE + "/" + p;
    }

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
    all.slice(0,100).forEach(function(path){
      var url = absolutize(String(path));
      var card = document.createElement("div"); card.className = "card";
      var wrap = document.createElement("div"); wrap.className = "thumb-wrap";

      var img = document.createElement("img");
      img.loading = "lazy"; img.decoding = "async"; img.referrerPolicy = "no-referrer";
      img.src = url; img.alt = path;

      var overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.innerHTML = '<div class="pay"><span class="pp"></span><span class="price">'+price.replace('.',',')+'€</span></div>';
      overlay.addEventListener("click", function(e){
        e.preventDefault();
        if (!window.paypal_buy || !window.paypal_buy.Buttons) {
          console.warn("paypal_buy SDK no cargado (PAYPAL_CLIENT_ID?)"); return;
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

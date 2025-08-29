(function () {
  try {
    var ENV  = (window.__ENV||{});
    var BASE = (ENV.BASE||"https://ibizagirl.pics").replace(/\/+$/,"");

    function resolvePrimary(entry){
      var s = String(entry||"").trim();
      if (!s) return "";
      if (/^https?:\/\//i.test(s)) {
        if (!/\.(webp|jpg|jpeg|png|gif)(\?|$)/i.test(s)) {
          s = s.replace(/(\.[a-zA-Z0-9]+)?(\?.*)?$/,".webp$2");
        }
        return s;
      }
      var file = s.split('/').pop().replace(/\.[a-zA-Z0-9]+$/,'') + ".webp";
      return BASE + "/uncensored/" + file;
    }

    function withFallback(img, entry){
      img.onerror = function(){
        var name = String(entry||"").trim().split('/').pop().replace(/\.[a-zA-Z0-9]+$/,'') + ".webp";
        if (img.dataset.fallbackTried==="1") return;
        img.dataset.fallbackTried="1";
        img.src = BASE + "/full/" + name;
      };
    }

    var all = []
      .concat(
        (window.IBG_PREMIUM_PART1||[]),
        (window.IBG_PREMIUM_PART2||[]),
        (window.IBG_PREMIUM||[])
      );

    var grid = document.getElementById("premium-grid");
    if (!grid) { console.warn("premium-grid no encontrado"); return; }
    grid.innerHTML = "";

    var price = (ENV.PAYPAL_ONESHOT_PRICE_EUR_IMAGE||"0.10");

    all.slice(0,100).forEach(function(entry){
      var url = resolvePrimary(entry);
      var card = document.createElement("div"); card.className = "card";
      var wrap = document.createElement("div"); wrap.className = "thumb-wrap";

      var img = document.createElement("img");
      img.loading="lazy"; img.decoding="async"; img.referrerPolicy="no-referrer";
      img.src = url; img.alt = String(entry||"");
      withFallback(img, entry);

      var overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.innerHTML = '<div class="pay"><span class="pp"></span><span class="price">'+price.replace('.',',')+'€</span></div>';
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

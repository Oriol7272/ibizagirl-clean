(function(){
  var ENV = window.__ENV || {};
  var BASE = ENV.BASE || "https://ibizagirl.pics";
  var files = (window.IBG_PREMIUM_P1||[]).concat(window.IBG_PREMIUM_P2||[]);

  var grid = document.getElementById("premium-grid") || document.body;

  function makeCard(src){
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
    overlay.innerHTML = '<div class="pay"><span class="pp"></span><span class="price">'+(ENV.ONESHOT_PRICE_IMAGE_EUR||"0.10")+'</span></div>';
    overlay.addEventListener("click", function(e){
      e.preventDefault();
      if (!window.IBG_PP){ alert("PayPal no está listo aún."); return; }
      window.IBG_PP.openBuy(ENV.ONESHOT_PRICE_IMAGE_EUR, "Imagen: "+src);
    });

    wrap.appendChild(img);
    wrap.appendChild(overlay);
    card.appendChild(wrap);
    return card;
  }

  files.forEach(function(name){
    var src = (typeof name === "string" && name.endsWith(".webp")) ? name : (String(name||"") + ".webp");
    grid.appendChild(makeCard(src));
  });

  console.info("[premium-thumbs] render ok:", files.length, "base:", BASE);
})();

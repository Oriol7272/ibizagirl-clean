(function(){
  try{
    var ENV = (window.__ENV||{});
    var BASE = (ENV.BASE||"https://ibizagirl.pics").replace(/\/+$/,"");

    // Colectar arrays globales IBG_PREMIUM*
    var all = [];
    for (var k in window){
      if (Object.prototype.hasOwnProperty.call(window,k) && /^IBG_PREMIUM/i.test(k) && Array.isArray(window[k])){
        all = all.concat(window[k]);
      }
    }
    var files = all.slice(0, 100);
    var grid = document.getElementById("premium-grid");
    if (!grid){ console.warn("[premium-thumbs] premium-grid no encontrado"); return; }
    grid.innerHTML="";

    function priceLabel(eur){
      try{ return Number(eur).toFixed(2).replace('.',',')+"€"; }catch(_){ return eur||"0,10€"; }
    }

    function onThumbClick(src){
      var p = ENV.ONESHOT_PRICE_IMAGE_EUR || "0.10";
      if (!window.IBG_Pay || !window.IBG_Pay.buy){ alert("PayPal no está listo aún."); return; }
      window.IBG_Pay.buy(p, "Imagen: "+src);
    }

    files.forEach(function(name){
      var src = (typeof name==="string" && name.endsWith(".webp")) ? name : (String(name||"")+".webp");
      var url = BASE + "/uncensored/" + src;

      var card = document.createElement("div");
      card.className="card";
      var wrap = document.createElement("div");
      wrap.className="thumb-wrap";

      var img = document.createElement("img");
      img.loading="lazy"; img.decoding="async"; img.referrerPolicy="no-referrer";
      img.src=url; img.alt=src;

      var overlay = document.createElement("div");
      overlay.className="overlay";
      overlay.innerHTML = '<div class="pay"><span class="pp"></span><span class="price">'+priceLabel(ENV.ONESHOT_PRICE_IMAGE_EUR)+'</span></div>';
      overlay.addEventListener("click", function(e){ e.preventDefault(); onThumbClick(src); });

      wrap.appendChild(img); wrap.appendChild(overlay); card.appendChild(wrap); grid.appendChild(card);
    });

    // Botones packs / lifetime / suscripciones
    function bind(id, fn){ var el=document.getElementById(id); if (el) el.addEventListener("click", fn); }
    bind("btn-pack-10", function(){ var p=ENV.ONESHOT_PRICE_VIDEO_EUR||"0.30"; if (!IBG_Pay) return alert("PayPal…"); IBG_Pay.buy(p, "Pack 10 imágenes"); });
    bind("btn-pack-5v", function(){ var p=ENV.ONESHOT_PRICE_VIDEO_EUR||"0.30"; if (!IBG_Pay) return alert("PayPal…"); IBG_Pay.buy(p, "Pack 5 vídeos"); });
    bind("btn-lifetime", function(){ var p=ENV.ONESHOT_PRICE_LIFETIME_EUR||"100.00"; if (!IBG_Pay) return alert("PayPal…"); IBG_Pay.buy(p, "Acceso lifetime"); });

    bind("btn-month", function(){ var pid=ENV.PAYPAL_PLAN_ID_MONTHLY||""; if (!pid) return alert("Plan mensual no configurado"); IBG_Pay.subscribe(pid); });
    bind("btn-year",  function(){ var pid=ENV.PAYPAL_PLAN_ID_ANNUAL ||""; if (!pid) return alert("Plan anual no configurado");   IBG_Pay.subscribe(pid); });

    console.info("[premium-thumbs] render ok:", files.length, "base:", BASE);
  }catch(e){ console.error("[premium-thumbs] error", e); }
})();

(function(){
  try{
    var ENV = window.__ENV||{};
    var BASE = (ENV.IBG_ASSETS_BASE_URL||"https://ibizagirl.pics").replace(/\/+$/,"");

    // Colecta arrays globales IBG_PREMIUM* (content-data3/4)
    var all=[];
    for (var k in window){
      if (Object.prototype.hasOwnProperty.call(window,k) && /^IBG_PREMIUM/i.test(k) && Array.isArray(window[k])){
        all = all.concat(window[k]);
      }
    }
    var files = all; // muéstralas todas

    var grid = document.getElementById("premium-grid");
    if (!grid){ console.warn("[premium] premium-grid no existe"); return; }
    grid.innerHTML = "";

    function ensureHost(){
      var id="pp-host";
      var host=document.getElementById(id);
      if (!host){
        host=document.createElement("div");
        host.id=id;
        host.style="position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:9999";
        host.innerHTML = '<div style="background:#111;color:#fff;padding:16px;border-radius:12px;min-width:320px">'
          + '<div id="pp-mount"></div>'
          + '<div style="text-align:right;margin-top:8px"><button id="pp-close">Cerrar</button></div>'
          + '</div>';
        document.body.appendChild(host);
        host.querySelector("#pp-close").onclick=function(){ host.remove(); };
      }
      return host;
    }

    function openOrder(priceEUR, label){
      // Requiere: window.pp.Buttons (namespace único del SDK)
      if (!window.pp || !window.pp.Buttons){ alert("PayPal no está listo todavía."); return; }
      var host=ensureHost(); var mount=host.querySelector("#pp-mount"); mount.innerHTML="";
      var val = String(priceEUR||ENV.ONESHOT_PRICE_IMAGE_EUR||"0.10");
      window.pp.Buttons({
        createOrder: function(data, actions){
          return actions.order.create({
            purchase_units: [{ amount: { currency_code: "EUR", value: val }, description: label||"IBG item" }]
          });
        },
        onApprove: function(data, actions){
          return actions.order.capture().then(function(d){ alert("Pago OK: "+d.id); host.remove(); });
        },
        onError: function(err){ console.error(err); alert("Pago cancelado"); host.remove(); }
      }).render(mount);
    }

    function openSubscription(planId){
      if (!planId){ alert("Plan no configurado"); return; }
      if (!window.pp || !window.pp.Buttons){ alert("PayPal no está listo todavía."); return; }
      var host=ensureHost(); var mount=host.querySelector("#pp-mount"); mount.innerHTML="";
      window.pp.Buttons({
        createSubscription: function(data, actions){ return actions.subscription.create({ plan_id: planId }); },
        onApprove: function(d){ alert("Suscripción OK: "+(d.subscriptionID||"")); host.remove(); },
        onError: function(err){ console.error(err); alert("Error de suscripción"); host.remove(); }
      }).render(mount);
    }

    // Thumbs + compra individual
    files.forEach(function(name){
      var src = (typeof name==="string" && name.endsWith(".webp")) ? name : (String(name||"")+".webp");
      var url = BASE + "/uncensored/" + src;

      var card=document.createElement("div"); card.className="card";
      var wrap=document.createElement("div"); wrap.className="thumb-wrap";
      var img=document.createElement("img");
      img.loading="lazy"; img.decoding="async"; img.referrerPolicy="no-referrer";
      img.src=url; img.alt=src;

      var overlay=document.createElement("div"); overlay.className="overlay";
      overlay.innerHTML='<div class="pay"><span class="pp"></span><span class="price">'+(ENV.ONESHOT_PRICE_IMAGE_EUR||"0,10€")+'</span></div>';
      overlay.addEventListener("click", function(e){ e.preventDefault(); openOrder(ENV.ONESHOT_PRICE_IMAGE_EUR, "Imagen: "+src); });

      wrap.appendChild(img); wrap.appendChild(overlay);
      card.appendChild(wrap);
      grid.appendChild(card);
    });

    // Botones de packs y lifetime (si existen en el HTML con estos IDs)
    var byId=function(id){ return document.getElementById(id); };
    var b10 = byId("btn-pack-10");
    var b50 = byId("btn-pack-50");
    var blf = byId("btn-lifetime");
    var bm  = byId("btn-month");
    var by  = byId("btn-year");

    if (b10) b10.addEventListener("click", function(){ openOrder("1.00", "Pack 10 imágenes"); });
    if (b50) b50.addEventListener("click", function(){ openOrder("4.00", "Pack 50 imágenes"); });
    if (blf) blf.addEventListener("click", function(){ openOrder(ENV.ONESHOT_PRICE_LIFETIME_EUR||"100.00", "IBG Lifetime"); });

    if (bm)  bm.addEventListener("click", function(){ openSubscription(ENV.PAYPAL_PLAN_ID_MONTHLY||""); });
    if (by)  by.addEventListener("click", function(){ openSubscription(ENV.PAYPAL_PLAN_ID_ANNUAL||""); });

    console.info("[premium-thumbs] render ok:", files.length, "base:", BASE);
  }catch(e){ console.error("[premium-thumbs] error", e); }
})();

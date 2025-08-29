(function () {
  try {
    var ENV  = window.__ENV||{};
    var BASE = (ENV.BASE||"").replace(/\/+$/,"");
    if (!BASE){ console.warn("[premium-thumbs] BASE vacío"); return; }

    // Recolecta arrays IBG_PREMIUM*
    var all=[]; for (var k in window) if (/^IBG_PREMIUM/i.test(k) && Array.isArray(window[k])) all=all.concat(window[k]);
    var files = all.slice(0,100);
    var grid = document.getElementById("premium-grid"); if (!grid){ console.warn("premium-grid no encontrado"); return; }
    grid.innerHTML = "";

    function ensurePPHost(){
      var host = document.getElementById("pp-buy-host");
      if (!host){
        host = document.createElement("div");
        host.id="pp-buy-host";
        host.style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.5);z-index:9999";
        host.innerHTML='<div style="background:#111;padding:16px;border-radius:12px"><div id="pp-buy-btn"></div><div style="text-align:center;margin-top:8px"><button id="pp-buy-close">Cerrar</button></div></div>';
        document.body.appendChild(host);
        host.querySelector("#pp-buy-close").onclick=function(){ host.remove(); };
      }
      return host;
    }

    function openBuy(price, label){
      if (!window.pp || !window.pp.Buttons){ alert("PayPal no está listo aún."); return; }
      var host=ensurePPHost(), mount=host.querySelector("#pp-buy-btn"); mount.innerHTML="";
      var p=String(price||ENV.ONESHOT_PRICE_IMAGE_EUR||"0.10");
      window.pp.Buttons({
        createOrder: function(d,actions){ return actions.order.create({ purchase_units:[{ amount:{ currency_code:'EUR', value:p }, description: label||'IBG item' }] }); },
        onApprove:   function(d,actions){ return actions.order.capture().then(function(r){ alert("Pago OK: "+r.id); host.remove(); }); },
        onError:     function(err){ console.error(err); alert("Pago cancelado"); host.remove(); }
      }).render(mount);
    }

    function bindPack(btnId, price, label){
      var el = document.getElementById(btnId); if (!el) return;
      el.addEventListener('click', function(e){ e.preventDefault(); openBuy(price, label); });
    }

    // Render de thumbs
    files.forEach(function(name){
      var src = (typeof name==="string" && name.endsWith(".webp")) ? name : (String(name||"")+".webp");
      var url = BASE + "/uncensored/" + src;

      var card=document.createElement("div"); card.className="card";
      var wrap=document.createElement("div"); wrap.className="thumb-wrap";
      var img=document.createElement("img"); img.loading="lazy"; img.decoding="async"; img.referrerPolicy="no-referrer"; img.src=url; img.alt=src;

      var overlay=document.createElement("div"); overlay.className="overlay";
      var priceChip=(ENV.ONESHOT_PRICE_IMAGE_EUR?String(ENV.ONESHOT_PRICE_IMAGE_EUR).replace('.',',')+"€":"0,10€");
      overlay.innerHTML='<div class="pay"><span class="pp"></span><span class="price">'+priceChip+'</span></div>';
      overlay.addEventListener("click", function(e){ e.preventDefault(); openBuy(ENV.ONESHOT_PRICE_IMAGE_EUR, "Imagen: "+src); });

      wrap.appendChild(img); wrap.appendChild(overlay); card.appendChild(wrap); grid.appendChild(card);
    });

    // Packs (ajusta IDs si ya los tienes en el DOM)
    bindPack("btn-pack10-img", ENV.PAYPAL_ONESHOT_PACK10_IMAGES_EUR||ENV.ONESHOT_PRICE_IMAGE_EUR||"0.10", "Pack 10 imágenes");
    bindPack("btn-pack5-vid",  ENV.PAYPAL_ONESHOT_PACK5_VIDEOS_EUR||ENV.ONESHOT_PRICE_VIDEO_EUR||"0.30", "Pack 5 vídeos");
    bindPack("btn-lifetime",   ENV.ONESHOT_PRICE_LIFETIME_EUR||"100.00", "Lifetime");

    // Suscripciones (lazy-load SDK subs)
    function bindSub(btnId, planId){
      if (!planId) return;
      var el=document.getElementById(btnId); if (!el) return;
      el.addEventListener('click', function(){
        if (!window.__loadPayPalSubsSDK){ alert("PayPal no está listo aún."); return; }
        window.__loadPayPalSubsSDK().then(function(){
          var host=ensurePPHost(), mount=host.querySelector("#pp-buy-btn"); mount.innerHTML="";
          window.pp.Buttons({
            createSubscription: function(d,actions){ return actions.subscription.create({ plan_id: planId }); },
            onApprove: function(d){ alert("Suscripción OK: "+d.subscriptionID); host.remove(); },
            onError:   function(err){ console.error(err); alert("Error suscripción"); host.remove(); }
          }).render(mount);
        }).catch(function(err){
          console.error(err); alert("No se pudo cargar PayPal Subscriptions.\nActiva 'Subscriptions' en tu app LIVE de PayPal y recarga.");
        });
      });
    }
    bindSub("btn-month", ENV.PAYPAL_PLAN_ID_MONTHLY||"");
    bindSub("btn-year",  ENV.PAYPAL_PLAN_ID_ANNUAL||"");

    console.info("[premium-thumbs] render ok:", files.length, "base:", BASE);
  } catch(e){ console.error("[premium-thumbs] error", e); }
})();

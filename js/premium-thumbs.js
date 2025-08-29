(function(){
  try{
    var ENV  = window.__ENV || {};
    var BASE = ENV.BASE || "https://ibizagirl.pics";
    var files = (window.IBG_PREMIUM_P1||[]).concat(window.IBG_PREMIUM_P2||[]);
    var grid = document.getElementById("premium-grid");
    if (!grid){ return; }

    function ensurePPHost(){
      var host = document.getElementById("pp-buy-host");
      if (!host){
        host = document.createElement("div");
        host.id="pp-buy-host";
        host.style.cssText = "position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);z-index:9999;";
        host.innerHTML = '<div style="background:#111;border-radius:12px;padding:16px;min-width:320px;">'
          + '<div id="pp-buy-btn"></div>'
          + '<div style="text-align:right;margin-top:8px;"><button id="pp-buy-close" style="padding:8px 12px;border-radius:8px;">Cerrar</button></div>'
          + '</div>';
        document.body.appendChild(host);
        host.querySelector("#pp-buy-close").onclick = function(){ host.remove(); };
      }
      return host;
    }

    function openBuy(price, label){
      if (!window.paypal || !window.paypal.Buttons){ alert("PayPal no está listo aún."); return; }
      var host = ensurePPHost();
      var mount = host.querySelector("#pp-buy-btn");
      mount.innerHTML = "";
      var p = String(price || ENV.ONESHOT_PRICE_IMAGE_EUR || "0.10");
      try{
        window.paypal.Buttons({
          createOrder: function(data, actions){
            return actions.order.create({
              purchase_units: [{ amount: { currency_code: 'EUR', value: p }, description: label||'IBG item' }]
            });
          },
          onApprove: function(data, actions){ return actions.order.capture().then(function(d){ alert("Pago OK: "+d.id); host.remove(); }); },
          onError: function(err){ console.error(err); alert("Pago cancelado"); host.remove(); }
        }).render(mount);
      }catch(e){ console.error(e); alert("PayPal no disponible"); host.remove(); }
    }

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
      overlay.innerHTML = '<div class="pay"><span class="pp"></span><span class="price">'+(ENV.ONESHOT_PRICE_IMAGE_EUR||"0.10")+'</span></div>';
      overlay.addEventListener("click", function(e){ e.preventDefault(); openBuy(ENV.ONESHOT_PRICE_IMAGE_EUR, "Imagen: "+src); });

      wrap.appendChild(img);
      wrap.appendChild(overlay);
      card.appendChild(wrap);
      grid.appendChild(card);
    });

    // Suscripciones
    function bindSub(btnId, planId){
      if (!planId) return;
      var el = document.getElementById(btnId);
      if (!el) return;
      el.addEventListener('click', function(){
        if (!window.paypal || !window.paypal.Buttons){ alert("PayPal (subs) no está listo."); return; }
        var host = ensurePPHost();
        var mount = host.querySelector("#pp-buy-btn");
        mount.innerHTML = "";
        window.paypal.Buttons({
          createSubscription: function(data, actions){ return actions.subscription.create({ plan_id: planId }); },
          onApprove: function(d){ alert("Suscripción OK: "+(d && (d.subscriptionID||d.id))); host.remove(); },
          onError: function(err){ console.error(err); alert("Error suscripción"); host.remove(); }
        }).render(mount);
      });
    }
    bindSub("btn-month", ENV.PAYPAL_PLAN_ID_MONTHLY||"");
    bindSub("btn-year",  ENV.PAYPAL_PLAN_ID_ANNUAL||"");

    console.info("[premium-thumbs] render ok:", files.length, "base:", BASE);
  } catch (e) {
    console.error("[premium-thumbs] error", e);
  }
})();

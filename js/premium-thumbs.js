(function(){
  try{
    var E = (window.__ENV||{});
    var BASE = E.BASE || "https://ibizagirl-assets.s3.eu-north-1.amazonaws.com";
    var grid = document.getElementById("premium-grid");
    if (!grid){ console.warn("[premium-thumbs] no hay #premium-grid"); return; }

    // Toma los arrays que ya tienes en content-data3/4.js
    var files = (window.IBG_PREMIUM_P1||[]).concat(window.IBG_PREMIUM_P2||[]);

    function ensurePPHost(){
      var host = document.getElementById("pp-host");
      if (!host){
        host = document.createElement("div");
        host.id = "pp-host";
        host.style.cssText = "position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;";
        host.innerHTML =
          '<div style="background:#111;padding:16px 16px 12px;border-radius:14px;min-width:320px;box-shadow:0 10px 30px rgba(0,0,0,.5)">'+
            '<div id="pp-buy-btn" style="min-height:45px"></div>'+
            '<div style="text-align:center;margin-top:12px">'+
              (E.PAYPAL_PLAN_ID_MONTHLY?'<button id="pp-sub-month" style="margin:0 6px">Mensual</button>':'')+
              (E.PAYPAL_PLAN_ID_ANNUAL ?'<button id="pp-sub-year"  style="margin:0 6px">Anual</button>':'')+
              '<button id="pp-buy-close" style="margin-left:6px">Cerrar</button>'+
            '</div>'+
          '</div>';
        document.body.appendChild(host);
        host.querySelector("#pp-buy-close").onclick = function(){ host.remove(); };
        if (E.PAYPAL_PLAN_ID_MONTHLY){
          host.querySelector("#pp-sub-month").onclick = function(){
            if (!window.paypal || !paypal.Buttons) { alert("PayPal no está listo"); return; }
            var mount = host.querySelector("#pp-buy-btn"); mount.innerHTML = "";
            paypal.Buttons({
              createSubscription: function(data, actions){ return actions.subscription.create({ plan_id: E.PAYPAL_PLAN_ID_MONTHLY }); },
              onApprove: function(d){ alert("Suscripción mensual OK: "+d.subscriptionID); host.remove(); },
              onError: function(err){ console.error(err); alert("Error suscripción mensual"); host.remove(); }
            }).render(mount);
          };
        }
        if (E.PAYPAL_PLAN_ID_ANNUAL){
          host.querySelector("#pp-sub-year").onclick = function(){
            if (!window.paypal || !paypal.Buttons) { alert("PayPal no está listo"); return; }
            var mount = host.querySelector("#pp-buy-btn"); mount.innerHTML = "";
            paypal.Buttons({
              createSubscription: function(data, actions){ return actions.subscription.create({ plan_id: E.PAYPAL_PLAN_ID_ANNUAL }); },
              onApprove: function(d){ alert("Suscripción anual OK: "+d.subscriptionID); host.remove(); },
              onError: function(err){ console.error(err); alert("Error suscripción anual"); host.remove(); }
            }).render(mount);
          };
        }
      }
      return host;
    }

    function openBuy(price, label){
      if (!window.paypal || !paypal.Buttons) { alert("PayPal no está listo"); return; }
      var host = ensurePPHost();
      var mount = host.querySelector("#pp-buy-btn"); mount.innerHTML = "";
      var p = (price || E.ONESHOT_PRICE_IMAGE_EUR || "0.10");
      paypal.Buttons({
        createOrder: function(data, actions){
          return actions.order.create({
            purchase_units: [{ amount: { currency_code: 'EUR', value: String(p) }, description: label||'IBG item' }]
          });
        },
        onApprove: function(data, actions){ return actions.order.capture().then(function(d){ alert("Pago OK: "+d.id); host.remove(); }); },
        onError: function(err){ console.error(err); alert("Pago cancelado"); host.remove(); }
      }).render(mount);
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
      overlay.innerHTML = '<div class="pay"><span class="pp"></span><span class="price">'+(E.ONESHOT_PRICE_IMAGE_EUR||"0,10€")+'</span></div>';
      overlay.addEventListener("click", function(e){ e.preventDefault(); openBuy(E.ONESHOT_PRICE_IMAGE_EUR, "Imagen: "+src); });

      wrap.appendChild(img);
      wrap.appendChild(overlay);
      card.appendChild(wrap);
      grid.appendChild(card);
    });

    console.info("[premium-thumbs] render ok:", files.length, "base:", BASE);
  } catch(e){
    console.error("[premium-thumbs] error", e);
  }
})();

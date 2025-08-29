(function(){
  var ENV = window.__ENV||{};
  if (!ENV) return;

  function ensureHost(){
    var host = document.getElementById("pp-buy-host");
    if (!host){
      host = document.createElement("div");
      host.id="pp-buy-host";
      host.style.cssText="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);z-index:99999;";
      host.innerHTML = '<div style="background:#111;color:#fff;border-radius:12px;padding:16px;min-width:320px;">'
        +'<div id="pp-mount"></div>'
        +'<div style="text-align:right;margin-top:10px;"><button id="pp-close" style="padding:8px 12px;border-radius:8px;">Cerrar</button></div>'
        +'</div>';
      document.body.appendChild(host);
      host.querySelector("#pp-close").onclick=function(){ host.remove(); };
    }
    return host;
  }
  function ensureButtons(){
    if (!window.paypal || !window.paypal.Buttons){
      alert("PayPal aún no está listo."); return false;
    }
    return true;
  }

  // Compra suelta
  function openBuy(price, label){
    if (!ensureButtons()) return;
    var host=ensureHost(), mount=host.querySelector("#pp-mount"); mount.innerHTML="";
    var p = String(price||ENV.ONESHOT_PRICE_IMAGE_EUR||"0.10");
    window.paypal.Buttons({
      createOrder: function(_, actions){
        return actions.order.create({ purchase_units:[{ amount:{ currency_code:'EUR', value:p }, description: label||'IBG item' }]});
      },
      onApprove: function(d, a){ return a.order.capture().then(function(x){ alert("Pago OK: "+x.id); host.remove(); }); },
      onError: function(e){ console.error(e); alert("Pago cancelado"); host.remove(); }
    }).render(mount);
  }

  // Pack: cantidad * precio unitario
  function openPack(count, unitPrice, label){
    if (!ensureButtons()) return;
    var qty = Math.max(1, parseInt(count||"1",10));
    var up  = parseFloat(String(unitPrice||ENV.ONESHOT_PRICE_IMAGE_EUR||"0.10").replace(",","."));
    var total = (qty*up).toFixed(2);
    var host=ensureHost(), mount=host.querySelector("#pp-mount"); mount.innerHTML="";
    window.paypal.Buttons({
      createOrder: function(_, actions){
        return actions.order.create({ purchase_units:[{ amount:{ currency_code:'EUR', value:String(total) }, description: (label||"Pack")+" ("+qty+" × "+up.toFixed(2)+")" }]});
      },
      onApprove: function(d, a){ return a.order.capture().then(function(x){ alert("Pack OK: "+x.id); host.remove(); }); },
      onError: function(e){ console.error(e); alert("Pago cancelado"); host.remove(); }
    }).render(mount);
  }

  // Lifetime (one-shot grande)
  function openLifetime(price){
    if (!ensureButtons()) return;
    var p = String(price||ENV.ONESHOT_PRICE_LIFETIME_EUR||"100.00");
    var host=ensureHost(), mount=host.querySelector("#pp-mount"); mount.innerHTML="";
    window.paypal.Buttons({
      createOrder: function(_, actions){
        return actions.order.create({ purchase_units:[{ amount:{ currency_code:'EUR', value:p }, description:'IBG Lifetime' }]});
      },
      onApprove: function(d, a){ return a.order.capture().then(function(x){ alert("Lifetime OK: "+x.id); host.remove(); }); },
      onError: function(e){ console.error(e); alert("Pago cancelado"); host.remove(); }
    }).render(mount);
  }

  // Suscripción: plan id
  function openSub(planId){
    if (!ensureButtons()) return;
    var pid = String(planId||"");
    if (!pid){ alert("Plan no disponible."); return; }
    var host=ensureHost(), mount=host.querySelector("#pp-mount"); mount.innerHTML="";
    window.paypal.Buttons({
      createSubscription: function(_, actions){ return actions.subscription.create({ plan_id: pid }); },
      onApprove: function(d){ alert("Suscripción OK: "+(d && (d.subscriptionID||d.id))); host.remove(); },
      onError: function(e){ console.error(e); alert("Error suscripción"); host.remove(); }
    }).render(mount);
  }

  // Auto-binding por data-attributes
  function bind(){
    // Buy (thumbs): data-pp="buy" data-price="0.10" data-label="Imagen: xyz.webp"
    document.querySelectorAll('[data-pp="buy"]').forEach(function(el){
      el.addEventListener("click", function(ev){
        ev.preventDefault();
        openBuy(el.getAttribute("data-price")||ENV.ONESHOT_PRICE_IMAGE_EUR, el.getAttribute("data-label")||"IBG item");
      });
    });

    // Pack: data-pp="pack" data-count="10" data-unit="0.10"
    document.querySelectorAll('[data-pp="pack"]').forEach(function(el){
      el.addEventListener("click", function(ev){
        ev.preventDefault();
        openPack(el.getAttribute("data-count")||"10", el.getAttribute("data-unit")||ENV.ONESHOT_PRICE_IMAGE_EUR, el.getAttribute("data-label")||"Pack");
      });
    });

    // Lifetime: data-pp="lifetime" data-price="100.00"
    document.querySelectorAll('[data-pp="lifetime"]').forEach(function(el){
      el.addEventListener("click", function(ev){
        ev.preventDefault();
        openLifetime(el.getAttribute("data-price")||ENV.ONESHOT_PRICE_LIFETIME_EUR);
      });
    });

    // Subs: data-pp="sub" data-plan="PLAN_ID"
    document.querySelectorAll('[data-pp="sub"]').forEach(function(el){
      el.addEventListener("click", function(ev){
        ev.preventDefault(); openSub(el.getAttribute("data-plan")||"");
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();

  // Exponer por si quieres llamar desde consola
  window.IBGPP = { openBuy, openPack, openLifetime, openSub };
})();

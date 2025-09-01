(function(){
  var ENV = window.__ENV || {};

  function ensureHost(){
    var host = document.getElementById("pp-modal");
    if (!host){
      host = document.createElement("div");
      host.id = "pp-modal";
      host.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center";
      host.innerHTML =
        '<div style="background:#111;border-radius:14px;max-width:420px;width:90%;padding:18px;box-shadow:0 10px 30px rgba(0,0,0,.35)">' +
          '<div id="pp-mount"></div>' +
          '<div style="text-align:right;margin-top:12px"><button id="pp-close" style="background:#333;color:#fff;border:0;padding:8px 12px;border-radius:8px;cursor:pointer">Cerrar</button></div>' +
        '</div>';
      document.body.appendChild(host);
      host.querySelector("#pp-close").onclick = function(){ host.remove(); };
    }
    return host;
  }

  function renderBuy(amount, description){
    if (!window.paypal_buy || !window.paypal_buy.Buttons) { alert("PayPal (buy) no está listo todavía."); return; }
    var h = ensureHost(); var m = h.querySelector("#pp-mount"); m.innerHTML="";
    window.paypal_buy.Buttons({
      createOrder: function(data, actions){
        return actions.order.create({
          purchase_units: [{ amount: { currency_code: 'EUR', value: String(amount) }, description: description || 'IBG item'}]
        });
      },
      onApprove: function(data, actions){
        return actions.order.capture().then(function(d){ alert("Pago OK: "+d.id); h.remove(); });
      },
      onError: function(err){ console.error(err); alert("Pago cancelado"); h.remove(); }
    }).render(m);
  }

  function openBuy(price, label){
    var p = price || ENV.ONESHOT_PRICE_IMAGE_EUR || "0.10";
    renderBuy(p, label || "Imagen premium");
  }

  function openPack(count, unit, label){
    var c = Number(count||0), u = Number(unit||0);
    var total = (c*u).toFixed(2);
    renderBuy(total, label || ("Pack x" + c));
  }

  function openLifetime(price){
    var p = price || ENV.ONESHOT_PRICE_LIFETIME_EUR || "100.00";
    renderBuy(p, "Lifetime");
  }

  function openSub(planId){
    if (!planId) { alert("Plan no disponible"); return; }
    if (!window.paypal_subs || !window.paypal_subs.Buttons) { alert("PayPal (subs) no está listo todavía."); return; }
    var h = ensureHost(); var m = h.querySelector("#pp-mount"); m.innerHTML="";
    window.paypal_subs.Buttons({
      createSubscription: function(data, actions){
        return actions.subscription.create({ plan_id: planId });
      },
      onApprove: function(d){ alert("Suscripción OK: "+(d.subscriptionID||d.id)); h.remove(); },
      onError: function(err){ console.error(err); alert("Error suscripción"); h.remove(); }
    }).render(m);
  }

  // Auto-bind de botones declarativos (data-pp="..."):
  function bindDeclarative(){
    document.querySelectorAll("[data-pp]").forEach(function(btn){
      var t = btn.getAttribute("data-pp");
      if (btn.__ppBound) return; btn.__ppBound = true;

      btn.addEventListener("click", function(e){
        e.preventDefault();
        if (t === "buy")       return openBuy(btn.getAttribute("data-price"), btn.getAttribute("data-label"));
        if (t === "pack")      return openPack(btn.getAttribute("data-count"), btn.getAttribute("data-unit"), btn.getAttribute("data-label"));
        if (t === "lifetime")  return openLifetime(btn.getAttribute("data-price"));
        if (t === "sub")       return openSub(btn.getAttribute("data-plan"));
      });
    });
  }

  // Exponer en global y bind inicial
  window.IBG_PP = { openBuy, openPack, openLifetime, openSub };
  document.addEventListener("DOMContentLoaded", bindDeclarative);
})();

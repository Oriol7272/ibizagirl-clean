(function(){
  if (window.__IBG_PAYPAL_LOADER__) return;
  window.__IBG_PAYPAL_LOADER__ = true;

  var ENV = (window.__ENV||{});
  var CID = ENV.PAYPAL_CLIENT_ID||"";
  if (!CID){ console.warn("[paypal] sin PAYPAL_CLIENT_ID, no cargo SDKs"); return; }

  // Un solo SDK válido para orders (capture) y subscriptions (vault)
  var sdk = "https://www.paypal.com/sdk/js"
          + "?client-id="+encodeURIComponent(CID)
          + "&components=buttons,hosted-fields,marks,subscriptions"
          + "&currency=EUR"
          + "&intent=capture"
          + "&vault=true";
  var s = document.createElement("script");
  s.src = sdk; s.async = true; s.defer = true;
  s.onload = function(){ console.info("[paypal-loader] SDK listo (vault=true)"); };
  document.head.appendChild(s);

  // API sencilla para compras sueltas (packs/lifetime)
  window.IBG_Pay = {
    buy: function(amount, description){
      if (!window.paypal || !amount) return alert("PayPal no está listo todavía.");
      var host = document.getElementById("pp-modal");
      if (!host){
        host = document.createElement("div");
        host.id="pp-modal";
        host.style="position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:99999";
        host.innerHTML='<div style="background:#111;padding:16px;border-radius:12px;min-width:320px"><div id="pp-mount"></div><div style="text-align:right;margin-top:8px"><button id="pp-close">Cerrar</button></div></div>';
        document.body.appendChild(host);
        host.querySelector("#pp-close").onclick=function(){ host.remove(); };
      }
      var mount = host.querySelector("#pp-mount"); mount.innerHTML="";
      paypal.Buttons({
        createOrder: function(d, actions){
          return actions.order.create({
            purchase_units: [{ amount: { currency_code:'EUR', value: String(amount) }, description: description||'IBG item' }]
          });
        },
        onApprove: function(d, actions){
          return actions.order.capture().then(function(rec){
            alert("Pago OK: "+rec.id); host.remove();
          });
        },
        onError: function(err){ console.error(err); alert("Pago cancelado"); host.remove(); }
      }).render(mount);
    },
    subscribe: function(planId){
      if (!window.paypal || !planId) return alert("PayPal (subs) no está listo.");
      var host = document.getElementById("pp-modal");
      if (!host){
        host = document.createElement("div");
        host.id="pp-modal";
        host.style="position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:99999";
        host.innerHTML='<div style="background:#111;padding:16px;border-radius:12px;min-width:320px"><div id="pp-mount"></div><div style="text-align:right;margin-top:8px"><button id="pp-close">Cerrar</button></div></div>';
        document.body.appendChild(host);
        host.querySelector("#pp-close").onclick=function(){ host.remove(); };
      }
      var mount = host.querySelector("#pp-mount"); mount.innerHTML="";
      paypal.Buttons({
        style:{ label:'subscribe' },
        createSubscription: function(d, actions){ return actions.subscription.create({ plan_id: planId }); },
        onApprove: function(data){ alert("Suscripción OK: "+data.subscriptionID); host.remove(); },
        onError: function(err){ console.error(err); alert("Error suscripción"); host.remove(); }
      }).render(mount);
    }
  };
})();

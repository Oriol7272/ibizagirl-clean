(function(){
  var ENV = window.__ENV||{};

  function ensureHost(){
    var host=document.getElementById("pp-host");
    if (!host){
      host=document.createElement("div");
      host.id="pp-host";
      host.style.cssText="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.7);z-index:99999;";
      host.innerHTML='<div style="background:#111;padding:16px;border-radius:12px;color:#fff;">'
        +'<div id="pp-mount"></div>'
        +'<div style="text-align:right"><button id="pp-close">Cerrar</button></div>'
        +'</div>';
      document.body.appendChild(host);
      host.querySelector("#pp-close").onclick=function(){ host.remove(); };
    }
    return host;
  }

  function ensureNS(ns){
    if (!window[ns] || !window[ns].Buttons){
      alert("PayPal aún no está listo ("+ns+")");
      return false;
    }
    return true;
  }

  function openBuy(price,label){
    if (!ensureNS("pp_buy")) return;
    var host=ensureHost(), m=host.querySelector("#pp-mount"); m.innerHTML="";
    var p=String(price||ENV.ONESHOT_PRICE_IMAGE_EUR||"0.10");
    window.pp_buy.Buttons({
      createOrder:(_,a)=>a.order.create({ purchase_units:[{ amount:{ currency_code:"EUR", value:p }, description:label||"IBG item"}]}),
      onApprove:(d,a)=>a.order.capture().then(x=>{ alert("Pago OK: "+x.id); host.remove(); })
    }).render(m);
  }

  function openPack(count,unit,label){
    if (!ensureNS("pp_buy")) return;
    var qty=parseInt(count||"1",10), up=parseFloat(unit||ENV.ONESHOT_PRICE_IMAGE_EUR||"0.10");
    var total=(qty*up).toFixed(2);
    var host=ensureHost(), m=host.querySelector("#pp-mount"); m.innerHTML="";
    window.pp_buy.Buttons({
      createOrder:(_,a)=>a.order.create({ purchase_units:[{ amount:{ currency_code:"EUR", value:total }, description:(label||"Pack")+" ("+qty+"×"+up.toFixed(2)+")"}]}),
      onApprove:(d,a)=>a.order.capture().then(x=>{ alert("Pack OK: "+x.id); host.remove(); })
    }).render(m);
  }

  function openLifetime(price){
    if (!ensureNS("pp_buy")) return;
    var p=String(price||ENV.ONESHOT_PRICE_LIFETIME_EUR||"100.00");
    var host=ensureHost(), m=host.querySelector("#pp-mount"); m.innerHTML="";
    window.pp_buy.Buttons({
      createOrder:(_,a)=>a.order.create({ purchase_units:[{ amount:{ currency_code:"EUR", value:p }, description:"IBG Lifetime"}]}),
      onApprove:(d,a)=>a.order.capture().then(x=>{ alert("Lifetime OK: "+x.id); host.remove(); })
    }).render(m);
  }

  function openSub(planId){
    if (!ensureNS("pp_subs")) return;
    if (!planId){ alert("Sin plan definido"); return; }
    var host=ensureHost(), m=host.querySelector("#pp-mount"); m.innerHTML="";
    window.pp_subs.Buttons({
      createSubscription:(_,a)=>a.subscription.create({ plan_id:planId }),
      onApprove:d=>{ alert("Subscripción OK: "+(d.subscriptionID||d.id)); host.remove(); }
    }).render(m);
  }

  function bind(){
    document.querySelectorAll('[data-pp="buy"]').forEach(el=>el.onclick=()=>openBuy(el.dataset.price,el.dataset.label));
    document.querySelectorAll('[data-pp="pack"]').forEach(el=>el.onclick=()=>openPack(el.dataset.count,el.dataset.unit,el.dataset.label));
    document.querySelectorAll('[data-pp="lifetime"]').forEach(el=>el.onclick=()=>openLifetime(el.dataset.price));
    document.querySelectorAll('[data-pp="sub"]').forEach(el=>el.onclick=()=>openSub(el.dataset.plan));
  }
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded",bind); else bind();
})();

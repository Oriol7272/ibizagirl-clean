document.addEventListener("paypal:sdk-ready", function(){
  try {
    var monthly = (window.ENV && window.ENV.PAYPAL_PLAN_MONTHLY_1499) || "";
    var yearly  = (window.ENV && window.ENV.PAYPAL_PLAN_ANNUAL_4999) || "";
    var pImg    = (window.ENV && window.ENV.PAYPAL_ONESHOT_PRICE_EUR_IMAGE)    || "0.10";
    var pVid    = (window.ENV && window.ENV.PAYPAL_ONESHOT_PRICE_EUR_VIDEO)    || "0.30";
    var pLife   = (window.ENV && window.ENV.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME) || "100.00";

    function render(id, cfg){ if(document.getElementById(id)){ paypal.Buttons(cfg).render("#"+id); } }

    if (window.paypal && monthly) render("btn-monthly", {
      style:{layout:"vertical",shape:"pill",label:"subscribe"},
      createSubscription:(d,a)=>a.subscription.create({ plan_id: monthly }),
      onApprove:(d)=>{ const el=document.getElementById("status-monthly"); if(el){ el.textContent="✅ Mensual activa: "+d.subscriptionID; } }
    });

    if (window.paypal && yearly) render("btn-yearly", {
      style:{layout:"vertical",shape:"pill",label:"subscribe"},
      createSubscription:(d,a)=>a.subscription.create({ plan_id: yearly }),
      onApprove:(d)=>{ const el=document.getElementById("status-yearly"); if(el){ el.textContent="✅ Anual activa: "+d.subscriptionID; } }
    });

    if (window.paypal) render("btn-img", {
      style:{layout:"vertical",shape:"rect",label:"pay"},
      createOrder:(d,a)=>a.order.create({ purchase_units:[{ amount:{ value: pImg, currency_code:"EUR" }, description:"Compra de imagen suelta" }] }),
      onApprove:(d,a)=>a.order.capture().then(()=>{ const el=document.getElementById("status-img"); if(el){ el.textContent="✅ Imagen desbloqueada"; } }),
      onError:(err)=>{ console.error(err); const el=document.getElementById("status-img"); if(el){ el.textContent="❌ Error en pago (imagen)"; } }
    });

    if (window.paypal) render("btn-video", {
      style:{layout:"vertical",shape:"rect",label:"pay"},
      createOrder:(d,a)=>a.order.create({ purchase_units:[{ amount:{ value: pVid, currency_code:"EUR" }, description:"Compra de vídeo suelto" }] }),
      onApprove:(d,a)=>a.order.capture().then(()=>{ const el=document.getElementById("status-video"); if(el){ el.textContent="✅ Vídeo desbloqueado"; } })
    });

    if (window.paypal) render("btn-lifetime", {
      style:{layout:"vertical",shape:"rect",label:"pay"},
      createOrder:(d,a)=>a.order.create({ purchase_units:[{ amount:{ value: pLife, currency_code:"EUR" }, description:"Acceso Lifetime" }] }),
      onApprove:(d,a)=>a.order.capture().then(()=>{ const el=document.getElementById("status-lifetime"); if(el){ el.textContent="✅ Acceso Lifetime activado"; } }),
      onError:(err)=>{ console.error(err); const el=document.getElementById("status-lifetime"); if(el){ el.textContent="❌ Error en pago (lifetime)"; } }
    });

  } catch(e){ console.error("[premium-paypal] error", e); }
});

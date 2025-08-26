document.addEventListener("paypal:sdk-ready", function(){
  try {
    var monthly  = (window.ENV && window.ENV.PAYPAL_PLAN_MONTHLY_1499) || "";
    var yearly   = (window.ENV && window.ENV.PAYPAL_PLAN_ANNUAL_4999) || "";
    var pImg     = (window.ENV && window.ENV.PAYPAL_ONESHOT_PRICE_EUR_IMAGE)    || "0.10";
    var pVid     = (window.ENV && window.ENV.PAYPAL_ONESHOT_PRICE_EUR_VIDEO)    || "0.30";
    var pLife    = (window.ENV && window.ENV.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME) || "100.00";

    // Subscripción mensual
    if (window.paypal && monthly && document.getElementById("btn-monthly")) {
      paypal.Buttons({
        style:{layout:"vertical",shape:"pill",label:"subscribe"},
        createSubscription:(d,a)=>a.subscription.create({ plan_id: monthly }),
        onApprove:(d)=>{ const el=document.getElementById("status-monthly"); if(el){ el.textContent="✅ Mensual activa: "+d.subscriptionID; } }
      }).render("#btn-monthly");
    }

    // Subscripción anual
    if (window.paypal && yearly && document.getElementById("btn-yearly")) {
      paypal.Buttons({
        style:{layout:"vertical",shape:"pill",label:"subscribe"},
        createSubscription:(d,a)=>a.subscription.create({ plan_id: yearly }),
        onApprove:(d)=>{ const el=document.getElementById("status-yearly"); if(el){ el.textContent="✅ Anual activa: "+d.subscriptionID; } }
      }).render("#btn-yearly");
    }

    // Pago único: Imagen
    if (window.paypal && document.getElementById("btn-img")) {
      paypal.Buttons({
        style:{layout:"vertical",shape:"rect",label:"pay"},
        createOrder:(d,a)=>a.order.create({
          purchase_units:[{ amount:{ value: pImg, currency_code:"EUR" }, description:"Compra de imagen suelta" }]
        }),
        onApprove:(d,a)=>a.order.capture().then(()=>{
          const el=document.getElementById("status-img"); if(el){ el.textContent="✅ Imagen desbloqueada"; }
        }),
        onError:(err)=>{ console.error(err); const el=document.getElementById("status-img"); if(el){ el.textContent="❌ Error en pago (imagen)"; } }
      }).render("#btn-img");
    }

    // Pago único: Vídeo
    if (window.paypal && document.getElementById("btn-video")) {
      paypal.Buttons({
        style:{layout:"vertical",shape:"rect",label:"pay"},
        createOrder:(d,a)=>a.order.create({
          purchase_units:[{ amount:{ value: pVid, currency_code:"EUR" }, description:"Compra de vídeo suelto" }]
        }),
        onApprove:(d,a)=>a.order.capture().then(()=>{
          const el=document.getElementById("status-video"); if(el){ el.textContent="✅ Vídeo desbloqueado"; }
        }),
        onError:(err)=>{ console.error(err); const el=document.getElementById("status-video"); if(el){ el.textContent="❌ Error en pago (vídeo)"; } }
      }).render("#btn-video");
    }

    // Pago único: Lifetime
    if (window.paypal && document.getElementById("btn-lifetime")) {
      paypal.Buttons({
        style:{layout:"vertical",shape:"rect",label:"pay"},
        createOrder:(d,a)=>a.order.create({
          purchase_units:[{ amount:{ value: pLife, currency_code:"EUR" }, description:"Acceso Lifetime" }]
        }),
        onApprove:(d,a)=>a.order.capture().then(()=>{
          const el=document.getElementById("status-lifetime"); if(el){ el.textContent="✅ Acceso Lifetime activado"; }
        }),
        onError:(err)=>{ console.error(err); const el=document.getElementById("status-lifetime"); if(el){ el.textContent="❌ Error en pago (lifetime)"; } }
      }).render("#btn-lifetime");
    }

  } catch(e){ console.error("[premium-paypal] error", e); }
});

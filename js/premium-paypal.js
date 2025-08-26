document.addEventListener("paypal:sdk-ready", function(){
  try{
    var env = (window.ENV||{});
    var monthly = env.PAYPAL_PLAN_MONTHLY_1499||"";
    var yearly  = env.PAYPAL_PLAN_ANNUAL_4999||"";
    var pImg    = env.PAYPAL_ONESHOT_PRICE_EUR_IMAGE||"0.10";
    var pVid    = env.PAYPAL_ONESHOT_PRICE_EUR_VIDEO||"0.30";
    var pLife   = env.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME||"100.00";
    function render(id,cfg){ var n=document.getElementById(id); if(n && window.paypal){ paypal.Buttons(cfg).render("#"+id); } }
    if(monthly) render("btn-monthly",{style:{layout:"vertical",shape:"pill",label:"subscribe"},
      createSubscription:(d,a)=>a.subscription.create({plan_id:monthly}),
      onApprove:(d)=>{ var e=document.getElementById("status-monthly"); if(e) e.textContent="✅ Mensual: "+d.subscriptionID; }});
    if(yearly) render("btn-yearly",{style:{layout:"vertical",shape:"pill",label:"subscribe"},
      createSubscription:(d,a)=>a.subscription.create({plan_id:yearly}),
      onApprove:(d)=>{ var e=document.getElementById("status-yearly"); if(e) e.textContent="✅ Anual: "+d.subscriptionID; }});
    render("btn-img",{style:{layout:"vertical",shape:"rect",label:"pay"},
      createOrder:(d,a)=>a.order.create({purchase_units:[{amount:{value:pImg,currency_code:"EUR"},description:"Imagen suelta"}]}),
      onApprove:(d,a)=>a.order.capture().then(()=>{ var e=document.getElementById("status-img"); if(e) e.textContent="✅ Imagen desbloqueada"; })});
    render("btn-video",{style:{layout:"vertical",shape:"rect",label:"pay"},
      createOrder:(d,a)=>a.order.create({purchase_units:[{amount:{value:pVid,currency_code:"EUR"},description:"Vídeo suelto"}]}),
      onApprove:(d,a)=>a.order.capture().then(()=>{ var e=document.getElementById("status-video"); if(e) e.textContent="✅ Vídeo desbloqueado"; })});
    render("btn-lifetime",{style:{layout:"vertical",shape:"rect",label:"pay"},
      createOrder:(d,a)=>a.order.create({purchase_units:[{amount:{value:pLife,currency_code:"EUR"},description:"Acceso Lifetime"}]}),
      onApprove:(d,a)=>a.order.capture().then(()=>{ var e=document.getElementById("status-lifetime"); if(e) e.textContent="✅ Lifetime activo"; })});
  }catch(e){ console.error("[premium-paypal] error", e); }
});

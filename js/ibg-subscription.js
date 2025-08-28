(function(){
  const ENV = (window.__ENV||{});
  console.log("[subscription] ENV", ENV);

  function ensureSDK(cb){
    if (window.paypal && window.paypal.Buttons){ cb(); return; }
    const iv = setInterval(()=>{ if(window.paypal && window.paypal.Buttons){ clearInterval(iv); cb(); } }, 100);
    setTimeout(()=>clearInterval(iv), 10000);
  }

  function mountPlan(buttonId, planId){
    const el = document.getElementById(buttonId);
    if(!el || !planId){ return; }
    ensureSDK(() => {
      try{
        window.paypal.Buttons({
          style:{ layout:"horizontal", color:"gold", shape:"pill", height: 40 },
          createSubscription: function(data, actions){
            return actions.subscription.create({ plan_id: planId });
          },
          onApprove: function(data){ alert("¡Gracias! Suscripción "+data.subscriptionID); },
        }).render("#"+buttonId);
      }catch(e){ console.error("[subscription] render error", e); }
    });
  }

  // Botones del menú superior (suscripciones)
  document.getElementById('sub-month')?.addEventListener('click', () => {
    const plan = ENV.PAYPAL_PLAN_ID_MONTHLY || "";
    if(!plan){ alert("Plan mensual no configurado"); return; }
    const id = "paypal-sub-month";
    let h = document.getElementById(id);
    if(!h){ h = document.createElement("div"); h.id=id; h.style.position="fixed"; h.style.top="12px"; h.style.right="12px"; document.body.appendChild(h); }
    mountPlan(id, plan);
  });

  document.getElementById('sub-year')?.addEventListener('click', () => {
    const plan = ENV.PAYPAL_PLAN_ID_ANNUAL || "";
    if(!plan){ alert("Plan anual no configurado"); return; }
    const id = "paypal-sub-year";
    let h = document.getElementById(id);
    if(!h){ h = document.createElement("div"); h.id=id; h.style.position="fixed"; h.style.top="64px"; h.style.right="12px"; document.body.appendChild(h); }
    mountPlan(id, plan);
  });

  document.getElementById('lifetime')?.addEventListener('click', () => {
    alert("El pago 'Lifetime' se ofrece como compra única en cada tarjeta.");
  });
})();

(function(){
  const ENV = window.__ENV || {};
  const PLAN_MONTH = ENV.PAYPAL_PLAN_ID_MONTHLY || "";
  const PLAN_YEAR  = ENV.PAYPAL_PLAN_ID_ANNUAL  || "";
  const CID = ENV.PAYPAL_CLIENT_ID || "";
  console.log("[subscription] ENV", ENV);

  function mount(id, planId){
    const el = document.getElementById(id);
    if(!el) return;
    if(!window.paypal_subs || !paypal_subs.Buttons){ el.disabled = true; return; }
    if(!CID || !planId){ el.disabled = true; return; }

    paypal_subs.Buttons({
      style:{layout:'horizontal',color:'gold',shape:'pill',label:'subscribe'},
      createSubscription: function(data, actions){
        return actions.subscription.create({ plan_id: planId });
      },
      onApprove: function(data){ alert("¡Suscripción activa! ID: "+data.subscriptionID); }
    }).render(el);
  }

  function init(){
    mount("btn-monthly", PLAN_MONTH);
    mount("btn-annual",  PLAN_YEAR);
    // lifetime es compra única -> ya lo maneja premium-thumbs si quieres uno general, monta un botón buy aquí similar
  }

  if(document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();

(function(){
  const ENV = window.__ENV || {};
  const PLAN_MONTH = ENV.PAYPAL_PLAN_ID_MONTHLY || "";
  const PLAN_YEAR  = ENV.PAYPAL_PLAN_ID_ANNUAL  || "";
  const CID = (ENV.PAYPAL_CLIENT_ID||"").trim();
  console.log("[subscription] ENV", ENV);

  function mountBtn(selector, planId){
    const el = document.querySelector(selector);
    if(!el) return;
    if(!CID || !planId || !(window.paypal_subs && paypal_subs.Buttons)){
      el.addEventListener('click', ()=>alert("Activa el pago (PAYPAL_CLIENT_ID/plan) para suscribirte."), {once:true});
      return;
    }
    paypal_subs.Buttons({
      style:{layout:'horizontal',color:'gold',shape:'pill',label:'subscribe'},
      createSubscription: (data, actions)=>actions.subscription.create({ plan_id: planId }),
      onApprove: (data)=>alert("¡Suscripción activa! ID: "+data.subscriptionID)
    }).render(el);
  }

  function init(){
    mountBtn("#btn-monthly", PLAN_MONTH);
    mountBtn("#btn-annual",  PLAN_YEAR);
  }

  if(document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();

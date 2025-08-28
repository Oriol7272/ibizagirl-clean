(function (){
  const ENV = (window.__ENV || {});
  console.log("[subscription] ENV", ENV);

  function mountSubscriptions(){
    if(!(window.paypal && paypal.Buttons)){ return; }
    const monthlyPlan = ENV.PAYPAL_PLAN_ID_MONTHLY || "";
    const annualPlan  = ENV.PAYPAL_PLAN_ID_ANNUAL  || "";
    const conf = (planId) => ({
      style:{layout:'horizontal',color:'gold',shape:'pill',tagline:true,height:45},
      createSubscription: (data, actions) => actions.subscription.create({ plan_id: planId }),
      onApprove: (data) => alert('¡Suscripción activa! ID: ' + (data.subscriptionID || ''))
    });
    const m = document.getElementById('plan-monthly');
    const a = document.getElementById('plan-annual');
    if(m && monthlyPlan){ paypal.Buttons(conf(monthlyPlan)).render('#plan-monthly'); }
    if(a && annualPlan){  paypal.Buttons(conf(annualPlan)).render('#plan-annual'); }
  }

  window.IBG = window.IBG || {};
  window.IBG.payImage = ({src,priceEUR}) => { console.log("[oneshot]", src, priceEUR); alert("Pago individual pronto disponible (€"+priceEUR.toFixed(2)+")."); };

  const t = setInterval(() => { if(window.paypal && paypal.Buttons){ clearInterval(t); mountSubscriptions(); } }, 250);
})();

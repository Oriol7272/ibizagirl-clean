(function(){
  function loadSdk(params){
    return new Promise((resolve,reject)=>{
      const q = new URLSearchParams(params).toString();
      const id = "pp-sdk-"+q;
      if(document.getElementById(id)) return resolve();
      const s=document.createElement('script');
      s.id=id;
      s.src="https://www.paypal.com/sdk/js?"+q;
      s.async=true;
      s.onload=()=>resolve();
      s.onerror=()=>reject(new Error("PayPal SDK load error"));
      document.head.appendChild(s);
    });
  }

  async function mountOneShot(btnContainer, amountEUR){
    const E = window.ENV||{};
    if(!E.PAYPAL_CLIENT_ID || !btnContainer) return;
    await loadSdk({
      "client-id": E.PAYPAL_CLIENT_ID,
      currency: "EUR",
      intent: "capture",
      components: "buttons"
    });
    if(!window.paypal) return;
    window.paypal.Buttons({
      style:{ layout:"horizontal", tagline:false },
      createOrder: (_, actions) => actions.order.create({
        purchase_units:[{ amount:{ currency_code:"EUR", value: String(amountEUR||"0.10") } }]
      }),
      onApprove: (_, actions) => actions.order.capture().then(() => {
        btnContainer.setAttribute('data-paid','1');
      })
    }).render(btnContainer);
  }

  async function mountSubscription(btnContainer, planId){
    const E = window.ENV||{};
    if(!E.PAYPAL_CLIENT_ID || !planId || !btnContainer) return;
    await loadSdk({
      "client-id": E.PAYPAL_CLIENT_ID,
      vault: "true",
      intent: "subscription",
      components: "buttons"
    });
    if(!window.paypal) return;
    window.paypal.Buttons({
      style:{ layout:"horizontal", tagline:false },
      createSubscription: (_, actions) => actions.subscription.create({ plan_id: planId }),
      onApprove: () => { btnContainer.setAttribute('data-subscribed','1'); }
    }).render(btnContainer);
  }

  window.PayPalLive = { mountOneShot, mountSubscription };
})();

(() => {
  const ENV = (window.__ENV||{});
  const CID = ENV.PAYPAL_CLIENT_ID || "";
  if (!CID) { console.warn("[subscription] PAYPAL_CLIENT_ID vacío"); return; }

  const SDK_URL = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(CID)}&currency=EUR&components=buttons&vault=true`;

  function loadSDK(){
    if (window.paypal) return Promise.resolve(window.paypal);
    let tag = document.querySelector('script[data-ibg-paypal-sdk]');
    if (tag) {
      return new Promise((res, rej) => {
        let t = setInterval(() => { if (window.paypal){clearInterval(t); res(window.paypal);} }, 50);
        setTimeout(() => { clearInterval(t); rej(new Error("paypal sdk timeout")); }, 12000);
      });
    }
    return new Promise((resolve, reject) => {
      tag = document.createElement('script');
      tag.src = SDK_URL;
      tag.dataset.ibgPaypalSdk = "1";
      tag.onload = () => resolve(window.paypal);
      tag.onerror = reject;
      document.head.appendChild(tag);
    });
  }

  function renderSubscription(container){
    const paypalPlan = container.dataset.planId || "";
    if (!paypalPlan) { console.warn("[subscription] sin planId"); return; }
    loadSDK().then((paypal) => {
      container.innerHTML = "";
      paypal.Buttons({
        style: { layout:'horizontal', height:45, shape:'pill' },
        createSubscription: (_, actions) => actions.subscription.create({ plan_id: paypalPlan }),
        onApprove: (data) => console.log("[subscription] OK", data),
        onError: (err) => console.error("[subscription] error", err),
      }).render(container);
    }).catch((e) => console.error("[subscription] SDK error", e));
  }

  function renderOneshot(container){
    const amount = container.dataset.amount || "";
    if (!amount) { console.warn("[oneshot] sin amount"); return; }
    loadSDK().then((paypal) => {
      container.innerHTML = "";
      paypal.Buttons({
        style: { layout:'horizontal', height:45, shape:'pill' },
        createOrder: (_, actions) => actions.order.create({
          purchase_units: [{ amount: { value: amount } }]
        }),
        onApprove: (data, actions) => actions.order.capture().then((details) => {
          console.log("[oneshot] OK", data, details);
        }),
        onError: (err) => console.error("[oneshot] error", err),
      }).render(container);
    }).catch((e) => console.error("[oneshot] SDK error", e));
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-paypal="subscription"]').forEach(renderSubscription);
    document.querySelectorAll('[data-paypal="oneshot"]').forEach(renderOneshot);
  });
})();

(() => {
  const ENV = (window.__ENV || {});
  console.log("[subscription] ENV", ENV);
  const CID = ENV.PAYPAL_CLIENT_ID || "";
  if (!CID) { console.error("[subscription] PAYPAL_CLIENT_ID vacío"); return; }

  let sdkLoading = null;
  const loadSDK = (params) => {
    if (sdkLoading) return sdkLoading;
    sdkLoading = new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = "https://www.paypal.com/sdk/js?" + new URLSearchParams(params).toString();
      s.onload = () => res(window.paypal);
      s.onerror = rej;
      document.head.appendChild(s);
    });
    return sdkLoading;
  };

  const ensureDiv = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    if (el.tagName.toLowerCase() !== "div") {
      const d = document.createElement("div");
      d.className = el.className; d.id = el.id; el.replaceWith(d);
      return d;
    }
    return el;
  };

  // SUBSCRIPTIONS
  (async () => {
    try {
      await loadSDK({ "client-id": CID, currency:"EUR", components:"buttons", vault:"true" });
      const m = ensureDiv("#pp-sub-monthly");
      const a = ensureDiv("#pp-sub-annual");
      if (m && ENV.PAYPAL_PLAN_ID_MONTHLY && window.paypal) {
        window.paypal.Buttons({
          style:{ layout:"horizontal" },
          createSubscription: (_, actions) => actions.subscription.create({ plan_id: ENV.PAYPAL_PLAN_ID_MONTHLY }),
          onApprove: () => location.reload()
        }).render(m);
      }
      if (a && ENV.PAYPAL_PLAN_ID_ANNUAL && window.paypal) {
        window.paypal.Buttons({
          style:{ layout:"horizontal" },
          createSubscription: (_, actions) => actions.subscription.create({ plan_id: ENV.PAYPAL_PLAN_ID_ANNUAL }),
          onApprove: () => location.reload()
        }).render(a);
      }
    } catch(e){ console.error(e); }
  })();

  // ONE-SHOT
  (async () => {
    try {
      await loadSDK({ "client-id": CID, currency:"EUR", components:"buttons" });
      const one = ensureDiv("#pp-oneshot");
      if (one && window.paypal) {
        window.paypal.Buttons({
          style:{ layout:"horizontal" },
          createOrder: (_, actions) => {
            const value = ENV.PAYPAL_ONESHOT_PRICE_EUR_LIFETIME || ENV.PAYPAL_ONESHOT_PRICE_EUR_IMAGE || "1.00";
            return actions.order.create({ purchase_units:[{ amount:{ currency_code:"EUR", value } }]});
          },
          onApprove: (_, actions) => actions.order.capture().then(() => location.reload())
        }).render(one);
      }
    } catch(e){ console.error(e); }
  })();
})();

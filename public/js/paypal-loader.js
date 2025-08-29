(function () {
  const ENV = (window.__ENV||{});
  const CID = ENV.PAYPAL_CLIENT_ID || "";
  if (!CID) { console.warn("[paypal] PAYPAL_CLIENT_ID vacío — no se cargan SDKs"); return; }

  function injectOnce(id, src) {
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.id = id;
    s.src = src;
    s.async = true;
    s.defer = true;
    s.crossOrigin = "anonymous";
    document.head.appendChild(s);
  }

  // 1) Compras individuales (intent=capture)
  injectOnce(
    "sdk-paypal-buy",
    "https://www.paypal.com/sdk/js?client-id="
      + encodeURIComponent(CID)
      + "&components=buttons&currency=EUR&intent=capture&disable-funding=venmo"
      + "&data-namespace=paypal_buy"
  );

  // 2) Suscripciones (intent=subscription)
  const MONTH = ENV.PAYPAL_PLAN_MONTHLY_1499 || "";
  const YEAR  = ENV.PAYPAL_PLAN_ANNUAL_4999  || "";
  if (MONTH || YEAR) {
    injectOnce(
      "sdk-paypal-subs",
      "https://www.paypal.com/sdk/js?client-id="
        + encodeURIComponent(CID)
        + "&components=buttons&currency=EUR&intent=subscription&vault=true"
        + "&data-namespace=paypal_subs"
    );
  }

  console.info("[paypal-loader] SDKs solicitados (buy/subs)");
})();

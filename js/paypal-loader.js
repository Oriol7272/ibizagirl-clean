(function () {
  var ENV = (window.__ENV || {});
  var CID = ENV.PAYPAL_CLIENT_ID || "";
  if (!CID) { console.warn("[paypal-loader] PAYPAL_CLIENT_ID vacío — no se cargan SDKs"); return; }

  function injectOnce(id, src) {
    if (document.getElementById(id)) return;
    var s = document.createElement("script");
    s.id = id; s.src = src; s.async = true; s.defer = true; s.crossOrigin = "anonymous";
    document.head.appendChild(s);
  }

  // Oneshot (intent=capture)
  injectOnce(
    "sdk-paypal-buy",
    "https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)
      +"&components=buttons&currency=EUR&intent=capture&data-namespace=paypal_buy"
  );

  // Suscripciones (intent=subscription + vault)
  var MONTH = ENV.PAYPAL_PLAN_ID_MONTHLY || "";
  var YEAR  = ENV.PAYPAL_PLAN_ID_ANNUAL  || "";
  if (MONTH || YEAR) {
    injectOnce(
      "sdk-paypal-subs",
      "https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)
        +"&components=buttons&currency=EUR&intent=subscription&vault=true&data-namespace=paypal_subs"
    );
  }

  console.info("[paypal-loader] SDKs solicitados (buy/subs)");
})();

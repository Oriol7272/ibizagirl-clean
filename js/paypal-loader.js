(function () {
  if (window.__IBG_PAYPAL_LOADER__) return;
  window.__IBG_PAYPAL_LOADER__ = true;

  var ENV = window.__ENV || {};
  var CID = ENV.PAYPAL_CLIENT_ID || "";
  if (!CID) { console.error("[paypal] sin PAYPAL_CLIENT_ID, no cargo SDKs"); return; }

  function inject(id, url){
    if (document.getElementById(id)) return Promise.resolve();
    return new Promise(function(res, rej){
      var s = document.createElement("script");
      s.id = id; s.src = url; s.async = true; s.defer = true; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  var base = "https://www.paypal.com/sdk/js?client-id=" + encodeURIComponent(CID) +
             "&components=buttons&currency=EUR";

  // SDK para compras "capture"
  var p1 = inject("pp-sdk-buy",  base + "&intent=capture&data-namespace=paypal_buy");

  // SDK para suscripciones (solo si hay algún plan)
  var hasSubs = !!(ENV.PAYPAL_PLAN_ID_MONTHLY || ENV.PAYPAL_PLAN_ID_ANNUAL);
  var p2 = hasSubs
    ? inject("pp-sdk-subs", base + "&intent=subscription&vault=true&data-namespace=paypal_subs")
    : Promise.resolve();

  window.__ppReady = Promise.all([p1, p2]).then(function(){
    console.info("[paypal-loader] SDKs: buy(capture) " + (hasSubs ? "+ subs(vault)" : "(solo buy)"));
  });
})();

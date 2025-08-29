(function () {
  if (window.__IBG_PAYPAL_LOADER__) return;
  window.__IBG_PAYPAL_LOADER__ = true;

  var ENV  = (window.__ENV || {});
  var CID  = (ENV.PAYPAL_CLIENT_ID || "").trim();
  var PIDM = (ENV.PAYPAL_PLAN_ID_MONTHLY || "").trim();
  var PIDA = (ENV.PAYPAL_PLAN_ID_ANNUAL  || "").trim();

  if (!CID) {
    console.warn("[paypal] sin PAYPAL_CLIENT_ID, no cargo SDK");
    return;
  }

  function inject(id, url, onload){
    if (document.getElementById(id)) return;
    var s = document.createElement("script");
    s.id = id;
    s.src = url;
    s.async = true;
    s.defer = true;
    s.crossOrigin = "anonymous";
    if (onload) s.onload = onload;
    document.head.appendChild(s);
  }

  // 1) Compras individuales / packs
  var urlBuy =
    "https://www.paypal.com/sdk/js?client-id=" + encodeURIComponent(CID) +
    "&components=buttons&currency=EUR&intent=capture";

  inject("pp-buy", urlBuy, function(){
    window.pp_buy = window.paypal;
    console.info("[paypal-loader] SDK listo (orders/capture)");
  });

  // 2) Suscripciones
  if (PIDM || PIDA) {
    var urlSubs =
      "https://www.paypal.com/sdk/js?client-id=" + encodeURIComponent(CID) +
      "&components=buttons&currency=EUR&intent=subscription&vault=true";

    inject("pp-subs", urlSubs, function(){
      window.pp_subs = window.paypal;
      console.info("[paypal-loader] SDK listo (vault=true)");
    });
  }
})();

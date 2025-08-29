(function () {
  if (window.__IBG_PAYPAL_LOADER__) return;
  window.__IBG_PAYPAL_LOADER__ = true;

  var ENV = window.__ENV || {};
  var CID = ENV.PAYPAL_CLIENT_ID || "";
  if (!CID) {
    console.error("[paypal-loader] CID vacío. __ENV=", ENV, "script:", (document.currentScript && document.currentScript.src));
    return;
  }

  function injectOnce(id, src) {
    if (document.getElementById(id)) return;
    var s = document.createElement("script");
    s.id = id; s.src = src; s.async = true; s.defer = true; s.crossOrigin = "anonymous";
    document.head.appendChild(s);
  }

  var wantSubs = !!(ENV.PAYPAL_PLAN_ID_MONTHLY || ENV.PAYPAL_PLAN_ID_ANNUAL);
  var base = "https://www.paypal.com/sdk/js?client-id=" + encodeURIComponent(CID) + "&components=buttons&currency=EUR";
  var url  = wantSubs ? base + "&intent=subscription&vault=true"
                      : base + "&intent=capture";

  injectOnce("sdk-paypal", url);
  console.info("[paypal-loader] cargado:", url);
})();

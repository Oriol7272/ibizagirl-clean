(function () {
  if (window.__IBG_PAYPAL_LOADER__) return;
  window.__IBG_PAYPAL_LOADER__ = true;

  var E = window.__ENV || {};
  var CID = E.PAYPAL_CLIENT_ID || "";
  if (!CID) { console.warn("[paypal-loader] PAYPAL_CLIENT_ID vacío — no se carga SDK"); return; }

  var qs = [
    "client-id="+encodeURIComponent(CID),
    "components=buttons",
    "currency=EUR",
    "intent=subscription",
    "vault=true",
    "data-namespace=pp"
  ].join("&");

  var url = "https://www.paypal.com/sdk/js?" + qs;

  var s = document.createElement("script");
  s.id = "sdk-paypal";
  s.src = url; s.async = true; s.defer = true; s.crossOrigin = "anonymous";
  s.onload = function(){ console.info("[paypal-loader] listo:", url); };
  document.head.appendChild(s);
})();

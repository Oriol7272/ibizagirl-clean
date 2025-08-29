(function () {
  var ENV = (window.__ENV || {});
  var CID = ENV.PAYPAL_CLIENT_ID || "";
  if (!CID) { console.warn("[paypal] PAYPAL_CLIENT_ID vacío — no se carga SDK"); return; }

  function injectOnce(id, src) {
    if (document.getElementById(id)) return;
    var s = document.createElement("script");
    s.id = id; s.src = src; s.async = true; s.defer = true; s.crossOrigin = "anonymous";
    document.head.appendChild(s);
  }

  // Carga simple: buttons + intent=capture (compras sueltas)
  injectOnce(
    "sdk-paypal",
    "https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)+"&components=buttons&currency=EUR&intent=capture"
  );

  console.info("[paypal-loader] SDK solicitado (buttons/capture)");
})();

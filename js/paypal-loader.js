(function () {
  if (window.__IBG_PAYPAL_LOADER__) return; window.__IBG_PAYPAL_LOADER__ = true;
  var E = window.__ENV || {}; var CID = (E.PAYPAL_CLIENT_ID || "").trim();
  if (!CID){ console.warn("[paypal] sin PAYPAL_CLIENT_ID, no cargo SDK"); return; }

  function injectOnce(id, url){
    if (document.getElementById(id)) return;
    var s=document.createElement("script");
    s.id=id; s.src=url; s.async=true; s.defer=true; s.crossOrigin="anonymous";
    document.head.appendChild(s);
  }

  // Buttons compra única (capture)
  injectOnce("pp-buy-sdk",
    "https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)
    +"&components=buttons&currency=EUR&intent=capture&disable-funding=venmo&data-namespace=pp_buy"
  );

  // Suscripciones (si hay algún plan)
  if (E.PAYPAL_PLAN_ID_MONTHLY || E.PAYPAL_PLAN_ID_ANNUAL){
    injectOnce("pp-subs-sdk",
      "https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)
      +"&components=buttons&currency=EUR&intent=subscription&vault=true&disable-funding=venmo&data-namespace=pp_subs"
    );
  }
  console.info("[paypal-loader] SDKs: buy(capture) + subs(vault)");
})();

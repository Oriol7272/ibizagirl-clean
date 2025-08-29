(function () {
  var E = window.__ENV || {};
  var CID = E.PAYPAL_CLIENT_ID || "";
  if (!CID) { console.warn("[paypal] PAYPAL_CLIENT_ID vacío — no se cargan SDKs"); return; }

  function inject(id, src){
    if (document.getElementById(id)) return;
    var s = document.createElement("script");
    s.id = id; s.src = src; s.async = true; s.defer = true; s.crossOrigin="anonymous";
    document.head.appendChild(s);
  }

  inject("sdk-paypal-buy",
    "https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)
    +"&components=buttons&currency=EUR&intent=capture&data-namespace=paypal_buy"
  );

  if (E.PAYPAL_PLAN_ID_MONTHLY || E.PAYPAL_PLAN_ID_ANNUAL){
    inject("sdk-paypal-subs",
      "https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)
      +"&components=buttons&currency=EUR&intent=subscription&vault=true&data-namespace=paypal_subs"
    );
  }
  console.info("[paypal-loader] SDKs solicitados (buy/subs)");
})();

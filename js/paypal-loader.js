(function(){
  if (window.__IBG_PAYPAL_LOADER__) return;
  window.__IBG_PAYPAL_LOADER__ = true;

  var ENV = (window.__ENV||{});
  var CID = ENV.PAYPAL_CLIENT_ID||"";
  if (!CID) { console.error("[paypal] sin PAYPAL_CLIENT_ID, no cargo SDKs"); return; }

  function inject(id, url){
    if (document.getElementById(id)) return;
    var s = document.createElement("script");
    s.id = id; s.src = url; s.async = true; s.defer = true;
    s.crossOrigin = "anonymous";
    document.head.appendChild(s);
  }

  // BUY (intent=capture)
  var urlBuy = "https://www.paypal.com/sdk/js"
    + "?client-id=" + encodeURIComponent(CID)
    + "&components=buttons"
    + "&currency=EUR"
    + "&intent=capture"
    + "&data-namespace=pp_buy";
  inject("sdk-paypal-buy", urlBuy);

  // SUBS (intent=subscription, vault=true)
  var wantSubs = !!(ENV.PAYPAL_PLAN_ID_MONTHLY || ENV.PAYPAL_PLAN_ID_ANNUAL);
  if (wantSubs){
    var urlSubs = "https://www.paypal.com/sdk/js"
      + "?client-id=" + encodeURIComponent(CID)
      + "&components=buttons"
      + "&currency=EUR"
      + "&intent=subscription"
      + "&vault=true"
      + "&data-namespace=pp_subs";
    inject("sdk-paypal-subs", urlSubs);
  }

  console.info("[paypal-loader] SDKs: buy(capture) " + (wantSubs? "+ subs(vault)":""));
})();

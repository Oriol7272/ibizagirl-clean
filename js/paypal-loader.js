(function(){
  if (window.__IBG_PP_LOADER__) return; window.__IBG_PP_LOADER__=true;
  var ENV = window.__ENV||{}; var CID = ENV.PAYPAL_CLIENT_ID||"";
  if (!CID){ console.warn("[paypal] sin PAYPAL_CLIENT_ID, no cargo SDKs"); return; }
  function inject(id, url, ns){
    if (document.getElementById(id)) return;
    var s = document.createElement("script");
    s.id=id; s.src=url; s.async=true; s.defer=true;
    s.setAttribute("data-namespace", ns);
    document.head.appendChild(s);
  }
  inject("sdk-pp-buy", "https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)+"&components=buttons&currency=EUR&intent=capture", "pp_buy");
  var needSubs = (ENV.PAYPAL_PLAN_ID_MONTHLY || ENV.PAYPAL_PLAN_ID_ANNUAL);
  if (needSubs){
    inject("sdk-pp-subs", "https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)+"&components=buttons&currency=EUR&intent=subscription&vault=true", "pp_subs");
  }
  console.info("[paypal-loader] SDKs: buy(capture)"+(needSubs?" + subs(vault)":""));
})();

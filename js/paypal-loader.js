(function(){
  if (window.__IBG_PAYPAL_LOADER__) return;
  window.__IBG_PAYPAL_LOADER__ = true;

  var ENV = window.__ENV||{};
  var CID = ENV.PAYPAL_CLIENT_ID||"";
  if (!CID){ console.error("[paypal] Falta PAYPAL_CLIENT_ID"); return; }

  function inject(id, url, ns){
    if (document.getElementById(id)) return;
    var s=document.createElement("script");
    s.id=id; s.src=url+"&data-namespace="+ns;
    s.async=true; s.defer=true; s.crossOrigin="anonymous";
    document.head.appendChild(s);
  }

  var base="https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)+"&components=buttons&currency=EUR";

  inject("sdk-buy",  base+"&intent=capture",                   "pp_buy");
  inject("sdk-subs", base+"&intent=subscription&vault=true",   "pp_subs");

  console.info("[paypal-loader] SDKs listos: buy + subs");
})();

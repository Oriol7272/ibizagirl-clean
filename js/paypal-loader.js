(function(){
  if (window.__PP_SDK_LOADED__) return; window.__PP_SDK_LOADED__=true;
  var E = window.__ENV || {};
  var CID = ((E.PAYPAL_CLIENT_ID||"")+"").replace(/\s+/g,'').trim();
  if (!CID) { console.warn("[paypal] sin PAYPAL_CLIENT_ID, no cargo SDKs"); return; }

  function inject(id, url){
    if (document.getElementById(id)) return;
    var s=document.createElement('script');
    s.id=id; s.src=url; s.async=true; s.defer=true; s.crossOrigin="anonymous";
    document.head.appendChild(s);
  }

  var base="https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)
           +"&components=buttons&currency=EUR";

  // Compra suelta
  inject("pp-buy",  base+"&intent=capture&data-namespace=pp_buy");

  // Suscripciones si hay planes
  var hasSubs = !!(E.PAYPAL_PLAN_ID_MONTHLY || E.PAYPAL_PLAN_ID_ANNUAL);
  if (hasSubs) {
    inject("pp-subs", base+"&intent=subscription&vault=true&data-namespace=pp_subs");
  }
  console.info("[paypal-loader] SDKs: buy(capture)"+(hasSubs?" + subs(vault)":""));
})();

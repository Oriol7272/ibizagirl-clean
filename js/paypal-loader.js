(function () {
  if (window.__IBG_PAYPAL_LOADER__) return; window.__IBG_PAYPAL_LOADER__=true;
  var ENV=(window.__ENV||{}), CID=ENV.PAYPAL_CLIENT_ID||"";
  if (!CID){ console.warn("[paypal] sin PAYPAL_CLIENT_ID, no cargo SDKs"); return; }

  function inject(id, src, ns, cb){
    if (document.getElementById(id)) return cb&&cb();
    var s=document.createElement("script");
    s.id=id; s.src=src; s.async=true; s.defer=true; s.setAttribute("data-namespace", ns);
    s.onload=cb||null; document.head.appendChild(s);
  }
  var base="https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)+"&components=buttons&currency=EUR";
  inject("sdk-paypal-buy",  base+"&intent=capture",        "pp_buy",  function(){ console.info("[paypal] SDK buy listo");  });
  inject("sdk-paypal-subs", base+"&intent=subscription&vault=true", "pp_subs", function(){ console.info("[paypal] SDK subs listo (vault=true)"); });
})();

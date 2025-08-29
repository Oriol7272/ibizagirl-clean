(function(){
  if (window.__IBG_PP__) return; window.__IBG_PP__=true;
  var ENV=(window.__ENV||{}), CID=ENV.PAYPAL_CLIENT_ID||"";
  if (!CID){ console.warn("[paypal] sin PAYPAL_CLIENT_ID, no cargo SDKs"); return; }

  function inject(id,url,ns,cb){ if(document.getElementById(id)) return cb&&cb();
    var s=document.createElement("script"); s.id=id; s.src=url; s.defer=true; s.async=true; s.setAttribute("data-namespace",ns);
    s.onload=cb||null; document.head.appendChild(s); }

  var base="https://www.paypal.com/sdk/js?client-id="+encodeURIComponent(CID)+"&components=buttons&currency=EUR";
  inject("sdk-buy",  base+"&intent=capture",                 "pp_buy",  function(){ console.info("[paypal] buy listo"); });
  inject("sdk-subs", base+"&intent=subscription&vault=true", "pp_subs", function(){ console.info("[paypal] subs listo"); });

  window.IBG_PP_READY = true;
})();
